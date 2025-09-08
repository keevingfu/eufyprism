import axios from 'axios'

export interface BudgetAllocation {
  channel: string
  currentBudget: number
  recommendedBudget: number
  expectedROI: number
  confidence: number
}

export interface BidOptimization {
  campaignId: string
  platform: string
  currentBid: number
  recommendedBid: number
  expectedCPC: number
  expectedConversions: number
}

export interface AudienceOptimization {
  segmentId: string
  name: string
  currentPerformance: {
    ctr: number
    conversionRate: number
    cost: number
  }
  recommendations: {
    action: 'expand' | 'narrow' | 'exclude' | 'maintain'
    reason: string
    expectedImpact: number
  }
}

export interface CreativeOptimization {
  creativeId: string
  type: 'headline' | 'image' | 'video' | 'copy'
  currentPerformance: {
    ctr: number
    conversionRate: number
    engagementRate: number
  }
  recommendations: string[]
  predictedUplift: number
}

export interface OptimizationRule {
  id: string
  name: string
  type: 'budget' | 'bid' | 'audience' | 'creative' | 'schedule'
  condition: {
    metric: string
    operator: '>' | '<' | '=' | '>=' | '<='
    value: number
  }
  action: {
    type: string
    parameters: Record<string, any>
  }
  isActive: boolean
}

class BudgetOptimizationService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api'

  // Budget Allocation Optimization
  async optimizeBudgetAllocation(
    totalBudget: number,
    constraints?: {
      minPerChannel?: number
      maxPerChannel?: number
      requiredChannels?: string[]
    }
  ): Promise<BudgetAllocation[]> {
    const response = await axios.post(`${this.apiUrl}/optimizer/budget/allocate`, {
      totalBudget,
      constraints,
    })
    return response.data
  }

  async predictBudgetROI(allocations: BudgetAllocation[]): Promise<{
    totalROI: number
    breakdown: Array<{
      channel: string
      roi: number
      revenue: number
      cost: number
    }>
  }> {
    const response = await axios.post(`${this.apiUrl}/optimizer/budget/predict`, { allocations })
    return response.data
  }

  // Bid Optimization
  async optimizeBids(campaignIds: string[]): Promise<BidOptimization[]> {
    const response = await axios.post(`${this.apiUrl}/optimizer/bids/optimize`, { campaignIds })
    return response.data
  }

  async getSmartBiddingRecommendations(
    platform: string,
    objective: 'conversions' | 'clicks' | 'impressions' | 'value'
  ): Promise<{
    strategy: string
    targetValue: number
    expectedResults: Record<string, number>
  }> {
    const response = await axios.get(`${this.apiUrl}/optimizer/bids/recommendations`, {
      params: { platform, objective },
    })
    return response.data
  }

  // Audience Optimization
  async optimizeAudiences(campaignId: string): Promise<AudienceOptimization[]> {
    const response = await axios.get(`${this.apiUrl}/optimizer/audiences/${campaignId}`)
    return response.data
  }

  async discoveryLookalikeAudiences(
    sourceAudienceId: string,
    expansionLevel: 1 | 2 | 3 | 4 | 5
  ): Promise<Array<{
    id: string
    name: string
    size: number
    similarity: number
    predictedPerformance: Record<string, number>
  }>> {
    const response = await axios.post(`${this.apiUrl}/optimizer/audiences/lookalike`, {
      sourceAudienceId,
      expansionLevel,
    })
    return response.data
  }

  // Creative Optimization
  async optimizeCreatives(campaignId: string): Promise<CreativeOptimization[]> {
    const response = await axios.get(`${this.apiUrl}/optimizer/creatives/${campaignId}`)
    return response.data
  }

  async generateCreativeVariants(
    baseCreative: {
      type: string
      content: Record<string, any>
    },
    numberOfVariants: number
  ): Promise<Array<{
    id: string
    variant: Record<string, any>
    predictedPerformance: Record<string, number>
  }>> {
    const response = await axios.post(`${this.apiUrl}/optimizer/creatives/generate`, {
      baseCreative,
      numberOfVariants,
    })
    return response.data
  }

  // Schedule Optimization
  async optimizeSchedule(campaignId: string): Promise<{
    currentSchedule: Array<{ day: string; hours: number[] }>
    recommendedSchedule: Array<{ day: string; hours: number[] }>
    expectedImprovement: number
  }> {
    const response = await axios.get(`${this.apiUrl}/optimizer/schedule/${campaignId}`)
    return response.data
  }

  // Automated Rules
  async createOptimizationRule(rule: Omit<OptimizationRule, 'id'>): Promise<OptimizationRule> {
    const response = await axios.post(`${this.apiUrl}/optimizer/rules`, rule)
    return response.data
  }

  async getActiveRules(): Promise<OptimizationRule[]> {
    const response = await axios.get(`${this.apiUrl}/optimizer/rules/active`)
    return response.data
  }

  async toggleRule(ruleId: string, isActive: boolean): Promise<void> {
    await axios.patch(`${this.apiUrl}/optimizer/rules/${ruleId}`, { isActive })
  }

  // Performance Predictions
  async predictCampaignPerformance(
    campaignConfig: Record<string, any>,
    timeframe: number
  ): Promise<{
    impressions: number
    clicks: number
    conversions: number
    cost: number
    roi: number
    confidenceInterval: {
      lower: Record<string, number>
      upper: Record<string, number>
    }
  }> {
    const response = await axios.post(`${this.apiUrl}/optimizer/predict`, {
      campaignConfig,
      timeframe,
    })
    return response.data
  }

  // Multi-Touch Attribution
  async calculateAttribution(
    conversionId: string,
    model: 'lastClick' | 'firstClick' | 'linear' | 'timeDecay' | 'dataDriver'
  ): Promise<Array<{
    touchpoint: string
    channel: string
    timestamp: Date
    attributionValue: number
  }>> {
    const response = await axios.get(`${this.apiUrl}/optimizer/attribution/${conversionId}`, {
      params: { model },
    })
    return response.data
  }

  // Real-time Optimization
  async enableRealTimeOptimization(campaignId: string, settings: {
    budgetFlexibility: number // 0-100%
    bidFlexibility: number // 0-100%
    pauseThreshold?: number
    alertThreshold?: number
  }): Promise<void> {
    await axios.post(`${this.apiUrl}/optimizer/realtime/${campaignId}/enable`, settings)
  }

  async getOptimizationHistory(
    campaignId: string,
    days: number = 30
  ): Promise<Array<{
    timestamp: Date
    type: string
    previousValue: any
    newValue: any
    impact: number
    reason: string
  }>> {
    const response = await axios.get(`${this.apiUrl}/optimizer/history/${campaignId}`, {
      params: { days },
    })
    return response.data
  }
}

export const optimizerService = new BudgetOptimizationService()