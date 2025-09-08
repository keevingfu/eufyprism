// Zod schemas for validation
import { z } from 'zod'
import { UserRole, CampaignStatus, AssetType } from './types'

// User schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.nativeEnum(UserRole),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(8).max(100),
})

export const UpdateUserSchema = CreateUserSchema.partial().omit({
  password: true,
})

// Campaign schemas
export const CampaignSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  status: z.nativeEnum(CampaignStatus),
  startDate: z.date(),
  endDate: z.date(),
  budget: z.number().positive(),
  createdBy: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateCampaignSchema = CampaignSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateCampaignSchema = CreateCampaignSchema.partial()

// Asset schemas
export const AssetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: z.nativeEnum(AssetType),
  url: z.string().url(),
  metadata: z.record(z.unknown()).optional(),
  tags: z.array(z.string()).default([]),
  createdBy: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateAssetSchema = AssetSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateAssetSchema = CreateAssetSchema.partial()

// Common request schemas
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const IdParamSchema = z.object({
  id: z.string().uuid(),
})

export const SearchQuerySchema = z.object({
  q: z.string().min(1).max(200),
})

// Authentication schemas
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
})

// File upload schemas
export const FileUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  mimetype: z.string(),
  size: z.number().int().positive(),
})