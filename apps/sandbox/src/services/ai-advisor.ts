import { 
  SimulationParameters, 
  SimulationResults, 
  TimelineData,
  Recommendation,
  Impact,
  WhatIfScenario
} from '@/types/sandbox';

interface StrategyPattern {
  condition: (data: AnalysisData) => boolean;
  recommendation: (data: AnalysisData) => Recommendation;
}

interface AnalysisData {
  parameters: SimulationParameters;
  results: SimulationResults;
  currentPerformance: PerformanceMetrics;
  marketConditions: MarketConditions;
}

interface PerformanceMetrics {
  growthRate: number;
  profitMargin: number;
  marketShareTrend: number;
  customerSatisfaction: number;
  competitivePosition: number;
}

interface MarketConditions {
  competitionIntensity: number;
  marketMaturity: number;
  customerPreferences: string[];
  emergingTrends: string[];
}

export class AIAdvisor {
  private strategyPatterns: StrategyPattern[];
  
  constructor() {
    this.strategyPatterns = this.initializeStrategyPatterns();
  }

  private initializeStrategyPatterns(): StrategyPattern[] {
    return [
      // Market Share Growth Strategies
      {
        condition: (data) => data.currentPerformance.marketShareTrend < 0,
        recommendation: (data) => ({
          id: `rec-${Date.now()}-1`,
          type: 'strategic',
          priority: 'high',
          title: 'Market Share Recovery Plan',
          description: this.generateMarketShareRecoveryPlan(data),
          impact: this.calculateMarketShareImpact(data),
          implementation: this.getMarketShareImplementation(data),
        }),
      },
      
      // Profitability Optimization
      {
        condition: (data) => data.currentPerformance.profitMargin < 0.15,
        recommendation: (data) => ({
          id: `rec-${Date.now()}-2`,
          type: 'pricing',
          priority: 'high',
          title: 'Profit Margin Optimization',
          description: this.generateProfitOptimizationPlan(data),
          impact: this.calculateProfitImpact(data),
          implementation: this.getProfitImplementation(data),
        }),
      },
      
      // Customer Retention
      {
        condition: (data) => data.currentPerformance.customerSatisfaction < 70,
        recommendation: (data) => ({
          id: `rec-${Date.now()}-3`,
          type: 'product',
          priority: 'medium',
          title: 'Customer Experience Enhancement',
          description: this.generateCustomerRetentionPlan(data),
          impact: this.calculateRetentionImpact(data),
          implementation: this.getRetentionImplementation(data),
        }),
      },
      
      // Competitive Response
      {
        condition: (data) => data.currentPerformance.competitivePosition < 0.3,
        recommendation: (data) => ({
          id: `rec-${Date.now()}-4`,
          type: 'strategic',
          priority: 'high',
          title: 'Competitive Differentiation Strategy',
          description: this.generateCompetitiveStrategy(data),
          impact: this.calculateCompetitiveImpact(data),
          implementation: this.getCompetitiveImplementation(data),
        }),
      },
    ];
  }

  analyzeSimulation(parameters: SimulationParameters, results: SimulationResults): {
    insights: string[];
    recommendations: Recommendation[];
    riskAssessment: RiskAssessment;
    strategicOptions: StrategicOption[];
  } {
    const analysisData = this.prepareAnalysisData(parameters, results);
    const insights = this.generateInsights(analysisData);
    const recommendations = this.generateRecommendations(analysisData);
    const riskAssessment = this.assessRisks(analysisData);
    const strategicOptions = this.identifyStrategicOptions(analysisData);

    return {
      insights,
      recommendations,
      riskAssessment,
      strategicOptions,
    };
  }

  private prepareAnalysisData(
    parameters: SimulationParameters, 
    results: SimulationResults
  ): AnalysisData {
    const currentPerformance = this.calculatePerformanceMetrics(results);
    const marketConditions = this.analyzeMarketConditions(parameters, results);

    return {
      parameters,
      results,
      currentPerformance,
      marketConditions,
    };
  }

  private calculatePerformanceMetrics(results: SimulationResults): PerformanceMetrics {
    const timeline = results.timeline;
    const firstQuarter = timeline.slice(0, Math.floor(timeline.length / 4));
    const lastQuarter = timeline.slice(-Math.floor(timeline.length / 4));

    const initialShare = firstQuarter.reduce((sum, m) => sum + m.marketShare, 0) / firstQuarter.length;
    const finalShare = lastQuarter.reduce((sum, m) => sum + m.marketShare, 0) / lastQuarter.length;
    const marketShareTrend = finalShare - initialShare;

    const totalRevenue = results.finalMetrics.totalRevenue;
    const totalProfit = results.finalMetrics.totalProfit;
    const profitMargin = totalRevenue > 0 ? totalProfit / totalRevenue : 0;

    const avgNPS = timeline.reduce((sum, m) => sum + m.kpis.nps, 0) / timeline.length;
    const customerSatisfaction = avgNPS;

    const competitivePosition = finalShare / 100; // Simplified

    return {
      growthRate: results.finalMetrics.customerGrowth,
      profitMargin,
      marketShareTrend,
      customerSatisfaction,
      competitivePosition,
    };
  }

  private analyzeMarketConditions(
    parameters: SimulationParameters,
    results: SimulationResults
  ): MarketConditions {
    const competitionIntensity = parameters.competitorCount / 10;
    const marketMaturity = 0.5; // Placeholder - would be calculated from market data

    const customerPreferences = this.identifyCustomerPreferences(parameters);
    const emergingTrends = this.identifyTrends(results);

    return {
      competitionIntensity,
      marketMaturity,
      customerPreferences,
      emergingTrends,
    };
  }

  private identifyCustomerPreferences(parameters: SimulationParameters): string[] {
    const preferences = [];
    
    if (parameters.pricingStrategy.model === 'penetration') {
      preferences.push('price-sensitive');
    } else if (parameters.pricingStrategy.model === 'premium') {
      preferences.push('quality-focused');
    }

    if (parameters.productStrategy.qualityLevel > 7) {
      preferences.push('innovation-seeking');
    }

    const digitalChannels = parameters.promotionStrategy.channels
      .filter(c => ['social', 'search', 'email'].includes(c.type))
      .reduce((sum, c) => sum + c.budgetAllocation, 0);

    if (digitalChannels > 60) {
      preferences.push('digital-native');
    }

    return preferences;
  }

  private identifyTrends(results: SimulationResults): string[] {
    const trends = [];
    const timeline = results.timeline;

    // Analyze growth patterns
    const recentGrowth = timeline.slice(-3).map(m => m.kpis.growthRate);
    if (recentGrowth.every(g => g > 5)) {
      trends.push('rapid-market-expansion');
    }

    // Analyze channel effectiveness
    const roiTrend = timeline.slice(-6).map(m => m.kpis.roi);
    const roiImproving = roiTrend.every((roi, i) => i === 0 || roi >= roiTrend[i - 1]);
    if (roiImproving) {
      trends.push('improving-efficiency');
    }

    return trends;
  }

  private generateInsights(data: AnalysisData): string[] {
    const insights: string[] = [];

    // Performance insights
    if (data.currentPerformance.marketShareTrend > 2) {
      insights.push('Strong market share growth indicates effective strategy execution');
    } else if (data.currentPerformance.marketShareTrend < -2) {
      insights.push('Declining market share suggests need for strategic adjustment');
    }

    // Profitability insights
    if (data.currentPerformance.profitMargin > 0.25) {
      insights.push('Excellent profit margins provide room for strategic investments');
    } else if (data.currentPerformance.profitMargin < 0.1) {
      insights.push('Low profitability limits strategic flexibility');
    }

    // Competitive insights
    if (data.marketConditions.competitionIntensity > 0.7) {
      insights.push('High competition requires differentiation strategy');
    }

    // Customer insights
    if (data.currentPerformance.customerSatisfaction > 80) {
      insights.push('High customer satisfaction creates strong foundation for growth');
    }

    return insights;
  }

  private generateRecommendations(data: AnalysisData): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Apply strategy patterns
    this.strategyPatterns.forEach(pattern => {
      if (pattern.condition(data)) {
        recommendations.push(pattern.recommendation(data));
      }
    });

    // Sort by priority and impact
    recommendations.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityWeight[a.priority];
      const bPriority = priorityWeight[b.priority];
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      return b.impact.revenue - a.impact.revenue;
    });

    return recommendations.slice(0, 5); // Return top 5 recommendations
  }

  private assessRisks(data: AnalysisData): RiskAssessment {
    const risks: Risk[] = [];

    // Market share risk
    if (data.currentPerformance.marketShareTrend < -1) {
      risks.push({
        type: 'market',
        severity: 'high',
        description: 'Continued market share loss could lead to marginalization',
        mitigation: 'Immediate strategic intervention required',
        probability: 0.7,
      });
    }

    // Financial risk
    if (data.currentPerformance.profitMargin < 0.05) {
      risks.push({
        type: 'financial',
        severity: 'critical',
        description: 'Unsustainable profit margins threaten business viability',
        mitigation: 'Cost optimization and pricing review needed',
        probability: 0.8,
      });
    }

    // Competitive risk
    if (data.marketConditions.competitionIntensity > 0.8) {
      risks.push({
        type: 'competitive',
        severity: 'medium',
        description: 'Intense competition may erode market position',
        mitigation: 'Develop unique value proposition',
        probability: 0.6,
      });
    }

    const overallRiskLevel = this.calculateOverallRiskLevel(risks);

    return {
      risks,
      overallRiskLevel,
      mitigationPriorities: this.prioritizeMitigation(risks),
    };
  }

  private calculateOverallRiskLevel(risks: Risk[]): 'low' | 'medium' | 'high' | 'critical' {
    if (risks.some(r => r.severity === 'critical')) return 'critical';
    if (risks.filter(r => r.severity === 'high').length >= 2) return 'high';
    if (risks.some(r => r.severity === 'high')) return 'medium';
    return 'low';
  }

  private prioritizeMitigation(risks: Risk[]): string[] {
    return risks
      .sort((a, b) => {
        const severityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityWeight[b.severity] - severityWeight[a.severity];
      })
      .map(r => r.mitigation);
  }

  private identifyStrategicOptions(data: AnalysisData): StrategicOption[] {
    const options: StrategicOption[] = [];

    // Growth strategy
    if (data.currentPerformance.marketShareTrend > 0) {
      options.push({
        id: 'growth-acceleration',
        name: 'Growth Acceleration',
        description: 'Double down on successful strategies to capture more market share',
        requirements: ['Increased marketing budget', 'Expanded sales team', 'Product enhancement'],
        expectedOutcome: {
          marketShareGain: 5,
          timeframe: 12,
          investment: data.parameters.budget.total * 0.3,
        },
      });
    }

    // Efficiency strategy
    if (data.currentPerformance.profitMargin < 0.2) {
      options.push({
        id: 'operational-excellence',
        name: 'Operational Excellence',
        description: 'Focus on cost optimization and operational efficiency',
        requirements: ['Process automation', 'Supply chain optimization', 'Overhead reduction'],
        expectedOutcome: {
          marginImprovement: 0.08,
          timeframe: 6,
          investment: data.parameters.budget.total * 0.1,
        },
      });
    }

    // Innovation strategy
    if (data.marketConditions.emergingTrends.includes('innovation-seeking')) {
      options.push({
        id: 'innovation-leadership',
        name: 'Innovation Leadership',
        description: 'Become the market leader through product innovation',
        requirements: ['R&D investment', 'Talent acquisition', 'Partnership development'],
        expectedOutcome: {
          competitiveAdvantage: 0.3,
          timeframe: 18,
          investment: data.parameters.budget.total * 0.4,
        },
      });
    }

    return options;
  }

  // Helper methods for generating recommendation content
  private generateMarketShareRecoveryPlan(data: AnalysisData): string {
    const channels = data.parameters.promotionStrategy.channels;
    const underperforming = channels.filter(c => c.effectiveness < 0.5);
    
    return `Market analysis indicates declining share. Focus on optimizing ${underperforming.length} underperforming channels and increasing brand visibility through targeted campaigns.`;
  }

  private calculateMarketShareImpact(data: AnalysisData): Impact {
    const potential = data.parameters.marketSize * 0.01 * 2.5; // 2.5% share gain
    const revenue = potential * data.parameters.pricingStrategy.basePrice * 12;
    
    return {
      revenue: revenue * 0.7, // Conservative estimate
      marketShare: 2.5,
      timeToImpact: 90,
      confidence: 0.75,
    };
  }

  private getMarketShareImplementation(data: AnalysisData): string {
    return `1. Reallocate 30% of budget to high-performing channels
2. Launch targeted acquisition campaign
3. Implement referral program
4. Enhance product differentiation`;
  }

  private generateProfitOptimizationPlan(data: AnalysisData): string {
    const margin = data.currentPerformance.profitMargin;
    const gap = 0.2 - margin;
    
    return `Current margins at ${(margin * 100).toFixed(1)}% are below target. Implement pricing optimization and cost reduction to achieve ${(gap * 100).toFixed(1)}% improvement.`;
  }

  private calculateProfitImpact(data: AnalysisData): Impact {
    const revenueIncrease = data.results.finalMetrics.totalRevenue * 0.05;
    const marginImprovement = 0.05;
    
    return {
      revenue: revenueIncrease,
      marketShare: -0.3, // Slight share loss from price increase
      timeToImpact: 30,
      confidence: 0.85,
    };
  }

  private getProfitImplementation(data: AnalysisData): string {
    return `1. Implement tiered pricing model
2. Reduce operational costs by 10%
3. Automate low-value processes
4. Negotiate supplier contracts`;
  }

  private generateCustomerRetentionPlan(data: AnalysisData): string {
    const nps = data.currentPerformance.customerSatisfaction;
    
    return `Customer satisfaction at ${nps.toFixed(0)} requires immediate attention. Launch comprehensive retention program focusing on service quality and product improvements.`;
  }

  private calculateRetentionImpact(data: AnalysisData): Impact {
    const churnReduction = 0.02; // 2% reduction
    const ltv = data.results.timeline[0]?.kpis.ltv || 1000;
    const customerBase = data.results.finalMetrics.totalRevenue / data.parameters.pricingStrategy.basePrice / 12;
    
    return {
      revenue: customerBase * churnReduction * ltv,
      marketShare: 1.0,
      timeToImpact: 120,
      confidence: 0.8,
    };
  }

  private getRetentionImplementation(data: AnalysisData): string {
    return `1. Launch customer success program
2. Implement feedback loop system
3. Enhance product quality metrics
4. Create loyalty rewards program`;
  }

  private generateCompetitiveStrategy(data: AnalysisData): string {
    const position = data.currentPerformance.competitivePosition;
    
    return `Competitive position at ${(position * 100).toFixed(1)}% requires differentiation. Develop unique value proposition and strengthen brand positioning.`;
  }

  private calculateCompetitiveImpact(data: AnalysisData): Impact {
    return {
      revenue: data.results.finalMetrics.totalRevenue * 0.15,
      marketShare: 3.0,
      timeToImpact: 180,
      confidence: 0.7,
    };
  }

  private getCompetitiveImplementation(data: AnalysisData): string {
    return `1. Develop unique selling proposition
2. Launch brand repositioning campaign
3. Introduce exclusive features
4. Build strategic partnerships`;
  }
}

// Type definitions
interface Risk {
  type: 'market' | 'financial' | 'operational' | 'competitive';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation: string;
  probability: number;
}

interface RiskAssessment {
  risks: Risk[];
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  mitigationPriorities: string[];
}

interface StrategicOption {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  expectedOutcome: {
    marketShareGain?: number;
    marginImprovement?: number;
    competitiveAdvantage?: number;
    timeframe: number;
    investment: number;
  };
}