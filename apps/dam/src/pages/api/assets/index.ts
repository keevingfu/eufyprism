import type { NextApiRequest, NextApiResponse } from 'next';
import { getStorageService } from '../../../services/storage';
import { Asset, AssetFilter, AssetType } from '../../../types/dam';

// Mock database (in production, use a real database)
let mockAssets: Asset[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const storageService = getStorageService();

  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const filters = req.query as unknown as AssetFilter;
    
    // Apply filters to assets
    let filteredAssets = [...mockAssets];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredAssets = filteredAssets.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchLower) ||
          asset.tags.some((tag) => tag.name.toLowerCase().includes(searchLower))
      );
    }

    if (filters.type && filters.type.length > 0) {
      filteredAssets = filteredAssets.filter((asset) =>
        filters.type!.includes(asset.type)
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredAssets = filteredAssets.filter((asset) =>
        asset.tags.some((tag) => filters.tags!.includes(tag.name))
      );
    }

    if (filters.dateRange) {
      const { from, to } = filters.dateRange;
      filteredAssets = filteredAssets.filter((asset) => {
        const assetDate = new Date(asset.createdAt);
        return assetDate >= new Date(from) && assetDate <= new Date(to);
      });
    }

    // Calculate stats
    const stats = {
      totalAssets: filteredAssets.length,
      totalSize: filteredAssets.reduce((sum, asset) => sum + asset.size, 0),
      recentUploads: filteredAssets.filter((asset) => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(asset.createdAt) >= sevenDaysAgo;
      }).length,
    };

    res.status(200).json({ assets: filteredAssets, stats });
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    // This is a placeholder - in production, use proper multipart form parsing
    res.status(501).json({ error: 'Upload endpoint not implemented' });
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
}

// Helper function to generate mock data
export function generateMockAssets(): Asset[] {
  const types = [AssetType.IMAGE, AssetType.VIDEO, AssetType.DOCUMENT];
  const tags = [
    { id: '1', name: 'Product', color: 'blue' },
    { id: '2', name: 'Marketing', color: 'green' },
    { id: '3', name: 'Campaign', color: 'orange' },
    { id: '4', name: '2024', color: 'purple' },
  ];

  const assets: Asset[] = [];

  for (let i = 0; i < 50; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const asset: Asset = {
      id: `asset-${i + 1}`,
      name: `Sample ${type.toLowerCase()} ${i + 1}`,
      filename: `file-${i + 1}.${type === AssetType.IMAGE ? 'jpg' : type === AssetType.VIDEO ? 'mp4' : 'pdf'}`,
      type,
      mimeType: type === AssetType.IMAGE ? 'image/jpeg' : type === AssetType.VIDEO ? 'video/mp4' : 'application/pdf',
      size: Math.floor(Math.random() * 10000000) + 100000, // 100KB to 10MB
      url: `https://example.com/assets/file-${i + 1}`,
      thumbnailUrl: type === AssetType.IMAGE ? `https://example.com/thumbnails/file-${i + 1}.jpg` : undefined,
      metadata: type === AssetType.IMAGE ? {
        width: 1920,
        height: 1080,
        format: 'JPEG',
      } : {},
      tags: tags.filter(() => Math.random() > 0.5).slice(0, 2),
      aiTags: type === AssetType.IMAGE ? [
        { label: 'product', confidence: 0.92, category: 'classification' },
        { label: 'technology', confidence: 0.85, category: 'classification' },
      ] : [],
      permissions: [],
      versions: [
        {
          id: `v1-${i + 1}`,
          version: 1,
          url: `https://example.com/assets/file-${i + 1}`,
          size: Math.floor(Math.random() * 10000000) + 100000,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          createdBy: 'system',
        },
      ],
      analytics: {
        views: Math.floor(Math.random() * 1000),
        downloads: Math.floor(Math.random() * 100),
        uses: Math.floor(Math.random() * 50),
        lastViewedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        lastDownloadedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        performanceScore: Math.floor(Math.random() * 100),
        conversionRate: Math.random(),
      },
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      createdBy: 'user-1',
      lastModifiedBy: 'user-1',
    };
    assets.push(asset);
  }

  return assets;
}

// Initialize mock data
if (mockAssets.length === 0) {
  mockAssets = generateMockAssets();
}