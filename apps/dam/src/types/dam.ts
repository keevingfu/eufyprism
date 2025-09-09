export interface Asset {
  id: string;
  name: string;
  filename: string;
  type: AssetType;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  metadata: AssetMetadata;
  tags: Tag[];
  aiTags: AITag[];
  permissions: AssetPermission[];
  versions: AssetVersion[];
  analytics: AssetAnalytics;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  AUDIO = 'AUDIO',
  ARCHIVE = 'ARCHIVE',
  OTHER = 'OTHER',
}

export interface AssetMetadata {
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  colorSpace?: string;
  fps?: number;
  bitrate?: number;
  channels?: number;
  sampleRate?: number;
  pages?: number;
  [key: string]: string | number | undefined;
}

export interface Tag {
  id: string;
  name: string;
  category?: string;
  color?: string;
}

export interface AITag {
  label: string;
  confidence: number;
  category: string;
  boundingBox?: BoundingBox;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AssetPermission {
  userId?: string;
  groupId?: string;
  level: PermissionLevel;
}

export enum PermissionLevel {
  VIEW = 'VIEW',
  USE = 'USE',
  EDIT = 'EDIT',
  MANAGE = 'MANAGE',
}

export interface AssetVersion {
  id: string;
  version: number;
  url: string;
  size: number;
  createdAt: Date;
  createdBy: string;
  comment?: string;
}

export interface AssetAnalytics {
  views: number;
  downloads: number;
  uses: number;
  lastViewedAt?: Date;
  lastDownloadedAt?: Date;
  lastUsedAt?: Date;
  performanceScore: number;
  conversionRate: number;
}

export interface AssetFilter {
  search?: string;
  type?: AssetType[];
  tags?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
  permissions?: PermissionLevel[];
}

export interface AssetUpload {
  file: File;
  tags?: string[];
  permissions?: AssetPermission[];
  metadata?: Record<string, string | number | boolean>;
}

export interface AssetBulkOperation {
  assetIds: string[];
  operation: 'DELETE' | 'TAG' | 'PERMISSION' | 'MOVE';
  data?: Record<string, unknown> | string[] | AssetPermission[];
}

export interface StorageConfig {
  endpoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
  region?: string;
}