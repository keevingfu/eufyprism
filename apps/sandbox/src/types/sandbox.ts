export interface MarketSimulation {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  parameters: SimulationParameters;
  results?: SimulationResults;
  status: 'draft' | 'running' | 'completed' | 'failed';
}

export interface SimulationParameters {
  marketSize: number;
  initialMarketShare: number;
  competitorCount: number;
  simulationDuration: number; // in months
  pricingStrategy: PricingStrategy;
  promotionStrategy: PromotionStrategy;
  productStrategy: ProductStrategy;
  budget: Budget;
}

export interface PricingStrategy {
  model: 'competitive' | 'penetration' | 'premium' | 'dynamic';
  basePrice: number;
  priceElasticity: number;
  competitorPriceResponse: number;
}

export interface PromotionStrategy {
  channels: PromotionChannel[];
  totalBudget: number;
  seasonality: SeasonalityFactor[];
}

export interface PromotionChannel {
  type: 'social' | 'search' | 'display' | 'email' | 'influencer' | 'offline';
  budgetAllocation: number; // percentage
  effectiveness: number; // 0-1
  targetAudience: string[];
}

export interface ProductStrategy {
  features: ProductFeature[];
  qualityLevel: number; // 1-10
  innovationRate: number; // new features per quarter
}

export interface ProductFeature {
  id: string;
  name: string;
  cost: number;
  marketAppeal: number; // 0-1
  developmentTime: number; // in days
}

export interface Budget {
  total: number;
  marketing: number;
  product: number;
  operations: number;
  reserve: number;
}

export interface SimulationResults {
  timeline: TimelineData[];
  finalMetrics: FinalMetrics;
  recommendations: Recommendation[];
  scenarios: WhatIfScenario[];
}

export interface TimelineData {
  month: number;
  marketShare: number;
  revenue: number;
  costs: number;
  profit: number;
  customerBase: number;
  competitorShares: { [key: string]: number };
  kpis: KPIMetrics;
}

export interface KPIMetrics {
  cac: number; // Customer Acquisition Cost
  ltv: number; // Lifetime Value
  roi: number; // Return on Investment
  nps: number; // Net Promoter Score
  churnRate: number;
  growthRate: number;
}

export interface FinalMetrics {
  totalRevenue: number;
  totalProfit: number;
  finalMarketShare: number;
  customerGrowth: number;
  brandValue: number;
}

export interface Recommendation {
  id: string;
  type: 'pricing' | 'promotion' | 'product' | 'strategic';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: Impact;
  implementation: string;
}

export interface Impact {
  revenue: number;
  marketShare: number;
  timeToImpact: number; // in days
  confidence: number; // 0-1
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  parameterChanges: Partial<SimulationParameters>;
  projectedResults: ProjectedResults;
}

export interface ProjectedResults {
  marketShareChange: number;
  revenueChange: number;
  riskLevel: 'low' | 'medium' | 'high';
  probability: number;
}

export interface SeasonalityFactor {
  month: number;
  factor: number; // multiplier
}

export interface CollaborationSession {
  id: string;
  simulationId: string;
  participants: Participant[];
  messages: Message[];
  decisions: Decision[];
  createdAt: Date;
}

export interface Participant {
  id: string;
  name: string;
  role: 'owner' | 'contributor' | 'viewer';
  avatar?: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  participantId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'decision' | 'annotation';
}

export interface Decision {
  id: string;
  participantId: string;
  type: string;
  value: any;
  timestamp: Date;
  rationale?: string;
}