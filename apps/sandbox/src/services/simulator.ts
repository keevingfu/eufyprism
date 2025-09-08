import { 
  SimulationParameters, 
  SimulationResults, 
  TimelineData, 
  KPIMetrics,
  FinalMetrics,
  Recommendation,
  WhatIfScenario
} from '@/types/sandbox';

export class MarketSimulator {
  private parameters: SimulationParameters;
  private marketDynamics: MarketDynamics;

  constructor(parameters: SimulationParameters) {
    this.parameters = parameters;
    this.marketDynamics = this.initializeMarketDynamics();
  }

  private initializeMarketDynamics(): MarketDynamics {
    return {
      competitorStrength: this.calculateCompetitorStrength(),
      marketGrowthRate: 0.05, // 5% annual growth
      priceElasticity: this.parameters.pricingStrategy.priceElasticity,
      seasonalityFactors: this.generateSeasonalityFactors(),
      innovationImpact: 0.15, // 15% max market share gain from innovation
    };
  }

  private calculateCompetitorStrength(): number {
    return Math.min(0.9, 0.3 + (this.parameters.competitorCount * 0.1));
  }

  private generateSeasonalityFactors(): number[] {
    // Generate monthly seasonality factors
    const factors = [];
    for (let i = 0; i < 12; i++) {
      const baseFactor = 1 + 0.2 * Math.sin((i / 12) * 2 * Math.PI);
      factors.push(baseFactor);
    }
    return factors;
  }

  async runSimulation(): Promise<SimulationResults> {
    const timeline = this.simulateTimeline();
    const finalMetrics = this.calculateFinalMetrics(timeline);
    const recommendations = this.generateRecommendations(timeline, finalMetrics);
    const scenarios = this.generateWhatIfScenarios(timeline);

    return {
      timeline,
      finalMetrics,
      recommendations,
      scenarios,
    };
  }

  private simulateTimeline(): TimelineData[] {
    const timeline: TimelineData[] = [];
    let currentMarketShare = this.parameters.initialMarketShare;
    let customerBase = this.calculateInitialCustomerBase();

    for (let month = 1; month <= this.parameters.simulationDuration; month++) {
      const monthData = this.simulateMonth(month, currentMarketShare, customerBase);
      timeline.push(monthData);
      currentMarketShare = monthData.marketShare;
      customerBase = monthData.customerBase;
    }

    return timeline;
  }

  private calculateInitialCustomerBase(): number {
    return Math.floor(
      this.parameters.marketSize * 
      this.parameters.initialMarketShare * 
      0.01 * // Convert percentage to decimal
      0.1 // Assume 10% of market is active customers
    );
  }

  private simulateMonth(
    month: number, 
    previousMarketShare: number,
    previousCustomerBase: number
  ): TimelineData {
    // Calculate marketing effectiveness
    const marketingImpact = this.calculateMarketingImpact(month);
    
    // Calculate price impact
    const priceImpact = this.calculatePriceImpact();
    
    // Calculate product quality impact
    const qualityImpact = this.parameters.productStrategy.qualityLevel / 10;
    
    // Calculate competitor actions
    const competitorImpact = this.calculateCompetitorImpact();
    
    // Calculate seasonality
    const seasonalityFactor = this.marketDynamics.seasonalityFactors[month % 12];
    
    // Calculate new market share
    const shareChange = (marketingImpact + priceImpact + qualityImpact - competitorImpact) * seasonalityFactor;
    const newMarketShare = Math.max(0, Math.min(100, previousMarketShare + shareChange));
    
    // Calculate customer metrics
    const churnRate = this.calculateChurnRate(qualityImpact);
    const acquisitionRate = shareChange > 0 ? shareChange * 0.1 : 0;
    const newCustomers = Math.floor(this.parameters.marketSize * acquisitionRate * 0.01);
    const churnedCustomers = Math.floor(previousCustomerBase * churnRate);
    const customerBase = previousCustomerBase + newCustomers - churnedCustomers;
    
    // Calculate financial metrics
    const revenue = this.calculateRevenue(customerBase, month);
    const costs = this.calculateCosts(month);
    const profit = revenue - costs;
    
    // Calculate KPIs
    const kpis = this.calculateKPIs(newCustomers, customerBase, revenue, costs, churnRate);
    
    // Calculate competitor shares
    const competitorShares = this.distributeCompetitorShares(newMarketShare);

    return {
      month,
      marketShare: newMarketShare,
      revenue,
      costs,
      profit,
      customerBase,
      competitorShares,
      kpis,
    };
  }

  private calculateMarketingImpact(month: number): number {
    const channels = this.parameters.promotionStrategy.channels;
    let totalImpact = 0;

    channels.forEach(channel => {
      const budget = this.parameters.budget.marketing * (channel.budgetAllocation / 100);
      const effectiveness = channel.effectiveness;
      const diminishingReturns = Math.log10(1 + budget / 100000); // Logarithmic returns
      totalImpact += effectiveness * diminishingReturns;
    });

    return Math.min(totalImpact * 2, 5); // Cap at 5% market share gain per month
  }

  private calculatePriceImpact(): number {
    const { model, basePrice, priceElasticity } = this.parameters.pricingStrategy;
    let priceMultiplier = 1;

    switch (model) {
      case 'penetration':
        priceMultiplier = 0.8;
        break;
      case 'premium':
        priceMultiplier = 1.3;
        break;
      case 'competitive':
        priceMultiplier = 1;
        break;
      case 'dynamic':
        priceMultiplier = 0.9 + Math.random() * 0.3;
        break;
    }

    const priceDeviation = (priceMultiplier - 1) * basePrice;
    return -priceDeviation * priceElasticity * 0.1; // Negative for higher prices
  }

  private calculateCompetitorImpact(): number {
    const baseImpact = this.marketDynamics.competitorStrength;
    const randomFactor = 0.8 + Math.random() * 0.4; // 80-120% variation
    return baseImpact * randomFactor * 2; // Scale to percentage points
  }

  private calculateChurnRate(qualityImpact: number): number {
    const baseChurn = 0.05; // 5% monthly base churn
    const qualityReduction = qualityImpact * 0.03; // Quality reduces churn
    return Math.max(0.01, baseChurn - qualityReduction);
  }

  private calculateRevenue(customerBase: number, month: number): number {
    const { basePrice } = this.parameters.pricingStrategy;
    const seasonalityFactor = this.marketDynamics.seasonalityFactors[month % 12];
    const monthlyRevenue = customerBase * basePrice * seasonalityFactor;
    return Math.floor(monthlyRevenue);
  }

  private calculateCosts(month: number): number {
    const { marketing, product, operations } = this.parameters.budget;
    const monthlyCosts = (marketing + product + operations) / 12;
    return Math.floor(monthlyCosts);
  }

  private calculateKPIs(
    newCustomers: number,
    customerBase: number,
    revenue: number,
    costs: number,
    churnRate: number
  ): KPIMetrics {
    const cac = newCustomers > 0 ? costs * 0.7 / newCustomers : 0; // 70% of costs are acquisition
    const avgCustomerValue = customerBase > 0 ? revenue / customerBase : 0;
    const ltv = avgCustomerValue * 12 / churnRate; // Simplified LTV calculation
    const roi = costs > 0 ? (revenue - costs) / costs : 0;
    const nps = 30 + (this.parameters.productStrategy.qualityLevel * 5); // Simplified NPS
    const growthRate = newCustomers / Math.max(1, customerBase) * 100;

    return {
      cac: Math.round(cac),
      ltv: Math.round(ltv),
      roi: Math.round(roi * 100) / 100,
      nps: Math.round(nps),
      churnRate: Math.round(churnRate * 1000) / 10,
      growthRate: Math.round(growthRate * 10) / 10,
    };
  }

  private distributeCompetitorShares(ourShare: number): { [key: string]: number } {
    const remainingShare = 100 - ourShare;
    const competitors: { [key: string]: number } = {};
    
    for (let i = 0; i < this.parameters.competitorCount; i++) {
      const share = remainingShare / this.parameters.competitorCount;
      const variation = share * (0.8 + Math.random() * 0.4);
      competitors[`Competitor ${i + 1}`] = Math.round(variation * 10) / 10;
    }

    return competitors;
  }

  private calculateFinalMetrics(timeline: TimelineData[]): FinalMetrics {
    const totalRevenue = timeline.reduce((sum, month) => sum + month.revenue, 0);
    const totalProfit = timeline.reduce((sum, month) => sum + month.profit, 0);
    const finalMarketShare = timeline[timeline.length - 1]?.marketShare || 0;
    const initialCustomers = timeline[0]?.customerBase || 0;
    const finalCustomers = timeline[timeline.length - 1]?.customerBase || 0;
    const customerGrowth = ((finalCustomers - initialCustomers) / Math.max(1, initialCustomers)) * 100;
    
    // Simplified brand value calculation
    const brandValue = totalRevenue * 0.2 + finalMarketShare * 100000;

    return {
      totalRevenue: Math.round(totalRevenue),
      totalProfit: Math.round(totalProfit),
      finalMarketShare: Math.round(finalMarketShare * 10) / 10,
      customerGrowth: Math.round(customerGrowth),
      brandValue: Math.round(brandValue),
    };
  }

  private generateRecommendations(timeline: TimelineData[], finalMetrics: FinalMetrics): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Analyze growth trend
    const growthTrend = this.analyzeGrowthTrend(timeline);
    if (growthTrend < 0) {
      recommendations.push({
        id: '1',
        type: 'strategic',
        priority: 'high',
        title: 'Reverse Declining Market Share',
        description: 'Your market share is declining. Consider increasing marketing spend or adjusting pricing strategy.',
        impact: {
          revenue: finalMetrics.totalRevenue * 0.15,
          marketShare: 2.5,
          timeToImpact: 60,
          confidence: 0.8,
        },
        implementation: 'Increase digital marketing budget by 25% and implement dynamic pricing.',
      });
    }

    // Analyze profitability
    const profitMargin = finalMetrics.totalProfit / finalMetrics.totalRevenue;
    if (profitMargin < 0.15) {
      recommendations.push({
        id: '2',
        type: 'pricing',
        priority: 'high',
        title: 'Improve Profit Margins',
        description: 'Profit margins are below industry standards. Consider optimizing costs or adjusting prices.',
        impact: {
          revenue: finalMetrics.totalRevenue * 0.05,
          marketShare: -0.5,
          timeToImpact: 30,
          confidence: 0.9,
        },
        implementation: 'Implement 5% price increase for premium features and reduce operational costs by 10%.',
      });
    }

    // Analyze customer metrics
    const avgChurnRate = timeline.reduce((sum, month) => sum + month.kpis.churnRate, 0) / timeline.length;
    if (avgChurnRate > 5) {
      recommendations.push({
        id: '3',
        type: 'product',
        priority: 'medium',
        title: 'Reduce Customer Churn',
        description: 'High churn rate is impacting growth. Focus on product quality and customer satisfaction.',
        impact: {
          revenue: finalMetrics.totalRevenue * 0.1,
          marketShare: 1.5,
          timeToImpact: 90,
          confidence: 0.85,
        },
        implementation: 'Launch customer retention program and improve product quality score by 2 points.',
      });
    }

    return recommendations;
  }

  private analyzeGrowthTrend(timeline: TimelineData[]): number {
    if (timeline.length < 3) return 0;
    
    const firstThird = timeline.slice(0, Math.floor(timeline.length / 3));
    const lastThird = timeline.slice(-Math.floor(timeline.length / 3));
    
    const avgFirst = firstThird.reduce((sum, month) => sum + month.marketShare, 0) / firstThird.length;
    const avgLast = lastThird.reduce((sum, month) => sum + month.marketShare, 0) / lastThird.length;
    
    return avgLast - avgFirst;
  }

  private generateWhatIfScenarios(timeline: TimelineData[]): WhatIfScenario[] {
    const scenarios: WhatIfScenario[] = [];

    // Scenario 1: Increased Marketing Budget
    scenarios.push({
      id: '1',
      name: 'Aggressive Marketing',
      description: 'What if we increase marketing budget by 50%?',
      parameterChanges: {
        budget: {
          ...this.parameters.budget,
          marketing: this.parameters.budget.marketing * 1.5,
        },
      },
      projectedResults: {
        marketShareChange: 3.5,
        revenueChange: 25,
        riskLevel: 'medium',
        probability: 0.7,
      },
    });

    // Scenario 2: Premium Pricing
    scenarios.push({
      id: '2',
      name: 'Premium Positioning',
      description: 'What if we switch to premium pricing strategy?',
      parameterChanges: {
        pricingStrategy: {
          ...this.parameters.pricingStrategy,
          model: 'premium',
          basePrice: this.parameters.pricingStrategy.basePrice * 1.3,
        },
      },
      projectedResults: {
        marketShareChange: -1.5,
        revenueChange: 15,
        riskLevel: 'low',
        probability: 0.8,
      },
    });

    // Scenario 3: Product Innovation
    scenarios.push({
      id: '3',
      name: 'Innovation Focus',
      description: 'What if we double our product development efforts?',
      parameterChanges: {
        productStrategy: {
          ...this.parameters.productStrategy,
          innovationRate: this.parameters.productStrategy.innovationRate * 2,
          qualityLevel: Math.min(10, this.parameters.productStrategy.qualityLevel + 2),
        },
      },
      projectedResults: {
        marketShareChange: 5,
        revenueChange: 30,
        riskLevel: 'high',
        probability: 0.6,
      },
    });

    return scenarios;
  }
}

interface MarketDynamics {
  competitorStrength: number;
  marketGrowthRate: number;
  priceElasticity: number;
  seasonalityFactors: number[];
  innovationImpact: number;
}