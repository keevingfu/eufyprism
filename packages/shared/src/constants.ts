// System-wide constants

export const API_VERSION = 'v1'

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 500 * 1024 * 1024, // 500MB
  DOCUMENT: 50 * 1024 * 1024, // 50MB
  AUDIO: 100 * 1024 * 1024, // 100MB
} as const

export const ALLOWED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
} as const

export const ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'AUTH001',
  AUTH_TOKEN_EXPIRED: 'AUTH002',
  AUTH_TOKEN_INVALID: 'AUTH003',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH004',
  
  // Validation errors
  VALIDATION_FAILED: 'VAL001',
  VALIDATION_REQUIRED_FIELD: 'VAL002',
  VALIDATION_INVALID_FORMAT: 'VAL003',
  
  // Resource errors
  RESOURCE_NOT_FOUND: 'RES001',
  RESOURCE_ALREADY_EXISTS: 'RES002',
  RESOURCE_CONFLICT: 'RES003',
  
  // System errors
  SYSTEM_ERROR: 'SYS001',
  DATABASE_ERROR: 'SYS002',
  EXTERNAL_SERVICE_ERROR: 'SYS003',
} as const

export const CACHE_KEYS = {
  USER_PROFILE: 'user:profile',
  CAMPAIGN_LIST: 'campaign:list',
  ASSET_LIST: 'asset:list',
  ANALYTICS_DASHBOARD: 'analytics:dashboard',
} as const

export const CACHE_TTL = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 60 * 60, // 1 hour
  VERY_LONG: 24 * 60 * 60, // 24 hours
} as const