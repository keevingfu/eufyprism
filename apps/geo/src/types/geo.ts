// Content types
export interface Content {
  id: string;
  title: string;
  slug: string;
  type: ContentType;
  status: ContentStatus;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  scheduledAt?: Date;
  
  // Content fields
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  
  // SEO fields
  seoScore?: number;
  aioScore?: number;
  readabilityScore?: number;
  
  // Schema markup
  schemaMarkup?: any;
  
  // Channels
  channels: PublishChannel[];
  
  // Analytics
  views?: number;
  engagement?: number;
  conversions?: number;
}

export type ContentType = 'review' | 'guide' | 'faq' | 'comparison' | 'story' | 'announcement';
export type ContentStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';

export interface PublishChannel {
  id: string;
  name: string;
  type: 'website' | 'amazon' | 'social' | 'email';
  status: 'pending' | 'published' | 'failed';
  publishedAt?: Date;
  url?: string;
}

// Keyword types
export interface Keyword {
  id: string;
  term: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  trend: 'up' | 'down' | 'stable';
  intent: SearchIntent;
  priority: 'high' | 'medium' | 'low';
  topicCluster?: string;
}

export type SearchIntent = 'informational' | 'navigational' | 'commercial' | 'transactional';

// SEO Analysis types
export interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  suggestions: SEOSuggestion[];
  keywordDensity: Record<string, number>;
  readability: ReadabilityScore;
  technicalSEO: TechnicalSEO;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  impact: 'high' | 'medium' | 'low';
}

export interface SEOSuggestion {
  category: string;
  suggestion: string;
  impact: number;
  effort: 'low' | 'medium' | 'high';
}

export interface ReadabilityScore {
  score: number;
  grade: string;
  metrics: {
    sentenceLength: number;
    wordComplexity: number;
    paragraphLength: number;
    passiveVoice: number;
  };
}

export interface TechnicalSEO {
  titleLength: number;
  descriptionLength: number;
  h1Count: number;
  imageAltTags: number;
  internalLinks: number;
  externalLinks: number;
}

// AIO (AI Optimization) types
export interface AIOAnalysis {
  score: number;
  featuredSnippetPotential: number;
  summaryQuality: number;
  structureScore: number;
  entityRecognition: Entity[];
  dataTableSuggestions: DataTable[];
}

export interface Entity {
  name: string;
  type: string;
  relevance: number;
  wikidata?: string;
}

export interface DataTable {
  title: string;
  headers: string[];
  rows: string[][];
  relevance: number;
}

// Content Calendar types
export interface CalendarEvent {
  id: string;
  contentId?: string;
  title: string;
  type: 'content' | 'campaign' | 'deadline' | 'review';
  date: Date;
  assignee?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  description?: string;
  tags?: string[];
}