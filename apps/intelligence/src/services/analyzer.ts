import { 
  CompetitorData, 
  MarketOpportunity, 
  Alert, 
  AlertLevel,
  Product,
  PricePoint,
  SocialMetrics,
  DataSource
} from '@/types/intelligence';
import { elasticsearchClient } from '@/lib/elasticsearch';
import { format, subDays, subHours, differenceInDays } from 'date-fns';

export class AnalyzerService {
  private alertThresholds = {
    priceDropPercent: 15,      // Alert if competitor drops price by 15%
    sentimentDrop: 0.2,        // Alert if sentiment drops by 0.2 points
    inventoryLow: 10,          // Alert if competitor inventory is low
    engagementSpike: 200,      // Alert if engagement increases by 200%
    reviewThreshold: 4.0,      // Alert if competitor product rating drops below 4.0
  };

  // Analyze competitor pricing strategies
  async analyzePricing(competitorId: string): Promise<Alert[]> {
    const alerts: Alert[] = [];
    
    try {
      // Get price history from Elasticsearch
      const result = await elasticsearchClient.search({
        index: 'eufy-products',
        body: {
          query: {
            match: { competitorId }
          },
          sort: [{ timestamp: { order: 'desc' } }],
          size: 100
        }
      });

      const priceHistory = result.hits.hits.map((hit: any) => hit._source);
      
      // Analyze price trends
      if (priceHistory.length >= 2) {
        const currentPrice = priceHistory[0].currentPrice;
        const previousPrice = priceHistory[1].currentPrice;
        const priceDropPercent = ((previousPrice - currentPrice) / previousPrice) * 100;

        if (priceDropPercent >= this.alertThresholds.priceDropPercent) {
          alerts.push({
            id: `price-alert-${Date.now()}`,
            level: AlertLevel.ORANGE,
            title: 'Significant Competitor Price Drop',
            description: `Competitor has dropped price by ${priceDropPercent.toFixed(1)}% from $${previousPrice} to $${currentPrice}`,
            source: DataSource.AMAZON,
            timestamp: new Date(),
            actionRequired: 'Consider adjusting pricing strategy or launching promotion',
            metadata: {
              competitorId,
              previousPrice,
              currentPrice,
              dropPercent: priceDropPercent
            }
          });
        }
      }

      // Detect pricing patterns (e.g., weekly promotions)
      const pricingPattern = this.detectPricingPattern(priceHistory);
      if (pricingPattern) {
        alerts.push({
          id: `pattern-alert-${Date.now()}`,
          level: AlertLevel.YELLOW,
          title: 'Competitor Pricing Pattern Detected',
          description: pricingPattern.description,
          source: DataSource.AMAZON,
          timestamp: new Date(),
          metadata: pricingPattern
        });
      }

    } catch (error) {
      console.error('Error analyzing pricing:', error);
    }

    return alerts;
  }

  // Identify market opportunities
  async identifyOpportunities(): Promise<MarketOpportunity[]> {
    const opportunities: MarketOpportunity[] = [];

    try {
      // 1. Content Gap Analysis
      const contentGaps = await this.findContentGaps();
      opportunities.push(...contentGaps);

      // 2. Seasonal Trend Analysis
      const seasonalTrends = await this.analyzeSeasonalTrends();
      opportunities.push(...seasonalTrends);

      // 3. Emerging Keywords
      const emergingKeywords = await this.findEmergingKeywords();
      opportunities.push(...emergingKeywords);

      // 4. Competitor Weakness Analysis
      const weaknesses = await this.analyzeCompetitorWeaknesses();
      opportunities.push(...weaknesses);

      // 5. Demand Spike Detection
      const demandSpikes = await this.detectDemandSpikes();
      opportunities.push(...demandSpikes);

    } catch (error) {
      console.error('Error identifying opportunities:', error);
    }

    return opportunities;
  }

  private async findContentGaps(): Promise<MarketOpportunity[]> {
    const gaps: MarketOpportunity[] = [];

    // Query for popular search terms without sufficient content
    const searchTerms = await elasticsearchClient.search({
      index: 'search-analytics',
      body: {
        query: {
          range: {
            timestamp: {
              gte: 'now-30d'
            }
          }
        },
        aggs: {
          popular_terms: {
            terms: {
              field: 'search_term.keyword',
              size: 50
            }
          }
        }
      }
    });

    // Analyze which terms lack content
    const popularTerms = searchTerms.aggregations?.popular_terms.buckets || [];
    
    for (const term of popularTerms) {
      // Check if we have content for this term
      const contentCheck = await elasticsearchClient.count({
        index: 'content-index',
        body: {
          query: {
            match: { content: term.key }
          }
        }
      });

      if (contentCheck.count < 5) { // Less than 5 pieces of content
        gaps.push({
          id: `gap-${Date.now()}-${term.key}`,
          type: 'content_gap',
          title: `Content Gap: "${term.key}"`,
          description: `High search volume (${term.doc_count} searches) but low content coverage`,
          potentialImpact: 'high',
          confidence: 85,
          recommendations: [
            `Create comprehensive guide about ${term.key}`,
            'Develop video content for this topic',
            'Add FAQ section addressing common questions'
          ],
          relatedKeywords: [term.key],
          estimatedVolume: term.doc_count,
          competitionLevel: 'low',
          createdAt: new Date()
        });
      }
    }

    return gaps;
  }

  private async analyzeSeasonalTrends(): Promise<MarketOpportunity[]> {
    const trends: MarketOpportunity[] = [];
    
    // Analyze historical data for seasonal patterns
    const currentMonth = new Date().getMonth();
    const historicalData = await elasticsearchClient.search({
      index: 'sales-history',
      body: {
        query: {
          range: {
            timestamp: {
              gte: 'now-2y' // Look at 2 years of data
            }
          }
        },
        aggs: {
          monthly_sales: {
            date_histogram: {
              field: 'timestamp',
              calendar_interval: 'month'
            },
            aggs: {
              total_sales: {
                sum: { field: 'sales_volume' }
              }
            }
          }
        }
      }
    });

    // Identify upcoming seasonal peaks
    const monthlyData = historicalData.aggregations?.monthly_sales.buckets || [];
    const upcomingMonths = [currentMonth + 1, currentMonth + 2].map(m => m % 12);
    
    upcomingMonths.forEach(month => {
      const monthData = monthlyData.filter((d: any) => 
        new Date(d.key_as_string).getMonth() === month
      );
      
      if (monthData.length > 0) {
        const avgSales = monthData.reduce((sum: number, d: any) => 
          sum + d.total_sales.value, 0) / monthData.length;
        
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        if (avgSales > 10000) { // Significant sales volume
          trends.push({
            id: `seasonal-${Date.now()}-${month}`,
            type: 'seasonal_trend',
            title: `Upcoming Seasonal Peak in ${monthNames[month]}`,
            description: `Historical data shows ${Math.round(avgSales)} average sales in ${monthNames[month]}`,
            potentialImpact: 'high',
            confidence: 75,
            recommendations: [
              'Prepare inventory for seasonal demand',
              'Plan marketing campaign 2-3 weeks in advance',
              'Create seasonal bundles or promotions'
            ],
            createdAt: new Date()
          });
        }
      }
    });

    return trends;
  }

  private async findEmergingKeywords(): Promise<MarketOpportunity[]> {
    const keywords: MarketOpportunity[] = [];

    // Compare keyword trends over time
    const recentKeywords = await elasticsearchClient.search({
      index: 'search-analytics',
      body: {
        query: {
          range: {
            timestamp: {
              gte: 'now-7d'
            }
          }
        },
        aggs: {
          keywords: {
            terms: {
              field: 'search_term.keyword',
              size: 100
            }
          }
        }
      }
    });

    const historicalKeywords = await elasticsearchClient.search({
      index: 'search-analytics',
      body: {
        query: {
          range: {
            timestamp: {
              gte: 'now-30d',
              lte: 'now-7d'
            }
          }
        },
        aggs: {
          keywords: {
            terms: {
              field: 'search_term.keyword',
              size: 100
            }
          }
        }
      }
    });

    const recent = new Map(recentKeywords.aggregations?.keywords.buckets.map((b: any) => 
      [b.key, b.doc_count]
    ));
    const historical = new Map(historicalKeywords.aggregations?.keywords.buckets.map((b: any) => 
      [b.key, b.doc_count]
    ));

    // Find keywords with significant growth
    recent.forEach((recentCount, keyword) => {
      const historicalCount = historical.get(keyword) || 0;
      const growth = historicalCount > 0 ? 
        ((recentCount - historicalCount) / historicalCount) * 100 : 100;

      if (growth > 50 && recentCount > 100) { // 50% growth and meaningful volume
        keywords.push({
          id: `emerging-${Date.now()}-${keyword}`,
          type: 'emerging_keyword',
          title: `Emerging Keyword: "${keyword}"`,
          description: `Search volume increased by ${growth.toFixed(0)}% in the last week`,
          potentialImpact: growth > 100 ? 'high' : 'medium',
          confidence: 70,
          recommendations: [
            `Optimize content for "${keyword}"`,
            'Monitor competitor activity for this keyword',
            'Consider PPC campaign targeting this keyword'
          ],
          relatedKeywords: [keyword],
          estimatedVolume: recentCount,
          competitionLevel: 'low', // Emerging = typically low competition
          createdAt: new Date()
        });
      }
    });

    return keywords;
  }

  private async analyzeCompetitorWeaknesses(): Promise<MarketOpportunity[]> {
    const weaknesses: MarketOpportunity[] = [];

    // Analyze competitor reviews and ratings
    const competitorReviews = await elasticsearchClient.search({
      index: 'competitor-reviews',
      body: {
        query: {
          range: {
            timestamp: {
              gte: 'now-30d'
            }
          }
        },
        aggs: {
          by_competitor: {
            terms: {
              field: 'competitor_id.keyword'
            },
            aggs: {
              avg_rating: {
                avg: { field: 'rating' }
              },
              negative_reviews: {
                filter: {
                  range: {
                    rating: { lt: 3 }
                  }
                }
              },
              common_complaints: {
                significant_terms: {
                  field: 'review_text'
                }
              }
            }
          }
        }
      }
    });

    const competitors = competitorReviews.aggregations?.by_competitor.buckets || [];
    
    for (const comp of competitors) {
      if (comp.avg_rating.value < this.alertThresholds.reviewThreshold) {
        weaknesses.push({
          id: `weakness-${Date.now()}-${comp.key}`,
          type: 'competitor_weakness',
          title: `Competitor Vulnerability: Low Customer Satisfaction`,
          description: `Competitor ${comp.key} has average rating of ${comp.avg_rating.value.toFixed(1)}`,
          potentialImpact: 'high',
          confidence: 90,
          recommendations: [
            'Highlight superior product quality in marketing',
            'Target dissatisfied competitor customers',
            'Emphasize customer service excellence'
          ],
          createdAt: new Date()
        });
      }
    }

    return weaknesses;
  }

  private async detectDemandSpikes(): Promise<MarketOpportunity[]> {
    const spikes: MarketOpportunity[] = [];

    // Detect unusual increases in search volume or sales
    const recentActivity = await elasticsearchClient.search({
      index: 'market-activity',
      body: {
        query: {
          range: {
            timestamp: {
              gte: 'now-24h'
            }
          }
        },
        aggs: {
          activity_over_time: {
            date_histogram: {
              field: 'timestamp',
              fixed_interval: '1h'
            },
            aggs: {
              search_volume: {
                sum: { field: 'search_count' }
              }
            }
          }
        }
      }
    });

    // Calculate moving average and detect spikes
    const hourlyData = recentActivity.aggregations?.activity_over_time.buckets || [];
    const volumes = hourlyData.map((d: any) => d.search_volume.value);
    const avgVolume = volumes.reduce((a: number, b: number) => a + b, 0) / volumes.length;
    
    hourlyData.forEach((hour: any, index: number) => {
      if (hour.search_volume.value > avgVolume * 2) { // 2x average = spike
        spikes.push({
          id: `spike-${Date.now()}-${index}`,
          type: 'demand_spike',
          title: 'Sudden Demand Increase Detected',
          description: `Search volume is ${(hour.search_volume.value / avgVolume).toFixed(1)}x normal levels`,
          potentialImpact: 'high',
          confidence: 80,
          recommendations: [
            'Increase ad spend immediately',
            'Ensure inventory availability',
            'Monitor competitor response'
          ],
          createdAt: new Date()
        });
      }
    });

    return spikes;
  }

  private detectPricingPattern(priceHistory: any[]): any | null {
    if (priceHistory.length < 14) return null; // Need at least 2 weeks of data

    // Simple pattern detection - look for weekly cycles
    const dayPrices = new Map<number, number[]>();
    
    priceHistory.forEach(point => {
      const day = new Date(point.timestamp).getDay();
      if (!dayPrices.has(day)) {
        dayPrices.set(day, []);
      }
      dayPrices.get(day)!.push(point.currentPrice);
    });

    // Check if certain days consistently have lower prices
    let lowestAvgDay = -1;
    let lowestAvg = Infinity;
    
    dayPrices.forEach((prices, day) => {
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
      if (avg < lowestAvg) {
        lowestAvg = avg;
        lowestAvgDay = day;
      }
    });

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    if (lowestAvgDay !== -1) {
      return {
        pattern: 'weekly_promotion',
        description: `Competitor typically offers lowest prices on ${dayNames[lowestAvgDay]}s`,
        avgDiscount: 10, // Calculate actual discount
        dayOfWeek: lowestAvgDay
      };
    }

    return null;
  }

  // Generate comprehensive intelligence report
  async generateReport(dateRange?: { start: Date; end: Date }): Promise<any> {
    const range = dateRange || {
      start: subDays(new Date(), 7),
      end: new Date()
    };

    const [alerts, opportunities, competitorData] = await Promise.all([
      this.getRecentAlerts(range),
      this.identifyOpportunities(),
      this.getCompetitorSummary(range)
    ]);

    return {
      generatedAt: new Date(),
      period: range,
      summary: {
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter(a => a.level === AlertLevel.RED).length,
        opportunities: opportunities.length,
        competitorsTracked: competitorData.length
      },
      alerts,
      opportunities,
      competitorData,
      recommendations: this.generateRecommendations(alerts, opportunities)
    };
  }

  private async getRecentAlerts(range: { start: Date; end: Date }): Promise<Alert[]> {
    const result = await elasticsearchClient.search({
      index: 'intelligence-alerts',
      body: {
        query: {
          range: {
            timestamp: {
              gte: range.start,
              lte: range.end
            }
          }
        },
        sort: [{ timestamp: { order: 'desc' } }]
      }
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }

  private async getCompetitorSummary(range: { start: Date; end: Date }): Promise<CompetitorData[]> {
    const result = await elasticsearchClient.search({
      index: 'competitor-data',
      body: {
        query: {
          range: {
            lastUpdated: {
              gte: range.start,
              lte: range.end
            }
          }
        }
      }
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }

  private generateRecommendations(alerts: Alert[], opportunities: MarketOpportunity[]): string[] {
    const recommendations: string[] = [];

    // High-priority alerts
    const criticalAlerts = alerts.filter(a => a.level === AlertLevel.RED);
    if (criticalAlerts.length > 0) {
      recommendations.push('URGENT: Address critical alerts immediately to prevent market share loss');
    }

    // High-impact opportunities
    const highImpact = opportunities.filter(o => o.potentialImpact === 'high');
    if (highImpact.length > 0) {
      recommendations.push(`Focus on ${highImpact.length} high-impact opportunities for quick wins`);
    }

    // Seasonal preparation
    const seasonal = opportunities.filter(o => o.type === 'seasonal_trend');
    if (seasonal.length > 0) {
      recommendations.push('Prepare inventory and marketing for upcoming seasonal demand');
    }

    return recommendations;
  }
}

// Singleton instance
export const analyzerService = new AnalyzerService();