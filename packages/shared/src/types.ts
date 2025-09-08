// Common types used across the Eufy PRISM system

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ANALYST = 'ANALYST',
  VIEWER = 'VIEWER',
}

export interface Campaign {
  id: string
  name: string
  description: string
  status: CampaignStatus
  startDate: Date
  endDate: Date
  budget: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export interface Asset {
  id: string
  name: string
  type: AssetType
  url: string
  metadata: Record<string, unknown>
  tags: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  AUDIO = 'AUDIO',
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  timestamp: number
}

export interface ApiError {
  code: string
  message: string
  details?: unknown
}

export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}