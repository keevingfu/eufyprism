// Intelligence System Type Definitions

export enum DataSource {
  AMAZON = 'amazon',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  REDDIT = 'reddit',
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok'
}

export enum AlertLevel {
  GREEN = 'green',    // Normal - No action required
  YELLOW = 'yellow',  // Low - Monitor situation
  ORANGE = 'orange',  // Medium - Action recommended
  RED = 'red'         // High - Immediate action required
}

export interface Alert {
  id: string;
  level: AlertLevel;
  title: string;
  description: string;
  source: DataSource;
  timestamp: Date;
  metadata?: Record<string, any>;
  actionRequired?: string;
}

export interface CompetitorData {
  id: string;
  name: string;
  products: Product[];
  marketingActivities: MarketingActivity[];
  priceHistory: PricePoint[];
  socialMetrics: SocialMetrics;
  lastUpdated: Date;
}

export interface Product {
  id: string;
  name: string;
  asin?: string;  // Amazon Standard Identification Number
  sku?: string;
  currentPrice: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  imageUrl?: string;
  productUrl: string;
}

export interface MarketingActivity {
  id: string;
  type: 'sale' | 'campaign' | 'launch' | 'promotion' | 'content';
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  platform: DataSource;
  engagement?: EngagementMetrics;
}

export interface PricePoint {
  timestamp: Date;
  price: number;
  currency: string;
  isPromotion: boolean;
}

export interface SocialMetrics {
  followers: { [key in DataSource]?: number };
  engagement: { [key in DataSource]?: EngagementMetrics };
  sentiment: number; // -1 to 1
  mentions: number;
}

export interface EngagementMetrics {
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number;
  clicks?: number;
  conversionRate?: number;
}

export interface MarketOpportunity {
  id: string;
  type: 'content_gap' | 'demand_spike' | 'seasonal_trend' | 'emerging_keyword' | 'competitor_weakness';
  title: string;
  description: string;
  potentialImpact: 'low' | 'medium' | 'high';
  confidence: number; // 0-100
  recommendations: string[];
  relatedKeywords?: string[];
  estimatedVolume?: number;
  competitionLevel?: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface CrawlerJob {
  id: string;
  source: DataSource;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  itemsProcessed?: number;
  errors?: string[];
  nextRunTime?: Date;
}

export interface SearchQuery {
  keyword: string;
  sources?: DataSource[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  competitors?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}