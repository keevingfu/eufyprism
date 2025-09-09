import type { NextApiRequest, NextApiResponse } from 'next';
import { format, eachDayOfInterval, subDays } from 'date-fns';
import { generateMockAssets } from '../assets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { from, to } = req.query;
    const startDate = from ? new Date(from as string) : subDays(new Date(), 30);
    const endDate = to ? new Date(to as string) : new Date();

    // Generate mock analytics data
    const analyticsData = generateAnalytics(startDate, endDate);

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

function generateAnalytics(startDate: Date, endDate: Date) {
  const assets = generateMockAssets();
  
  // Generate time series data
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const timeSeriesData = days.map(day => ({
    date: format(day, 'yyyy-MM-dd'),
    views: Math.floor(Math.random() * 1000) + 100,
    downloads: Math.floor(Math.random() * 200) + 10,
    uses: Math.floor(Math.random() * 100) + 5,
  }));

  // Calculate overview
  const totalViews = timeSeriesData.reduce((sum, day) => sum + day.views, 0);
  const totalDownloads = timeSeriesData.reduce((sum, day) => sum + day.downloads, 0);
  const totalUses = timeSeriesData.reduce((sum, day) => sum + day.uses, 0);
  
  // Calculate trends (comparing last 7 days to previous 7 days)
  const last7Days = timeSeriesData.slice(-7);
  const previous7Days = timeSeriesData.slice(-14, -7);
  
  const last7Views = last7Days.reduce((sum, day) => sum + day.views, 0);
  const prev7Views = previous7Days.reduce((sum, day) => sum + day.views, 0) || 1;
  const viewsTrend = ((last7Views - prev7Views) / prev7Views) * 100;
  
  const last7Downloads = last7Days.reduce((sum, day) => sum + day.downloads, 0);
  const prev7Downloads = previous7Days.reduce((sum, day) => sum + day.downloads, 0) || 1;
  const downloadsTrend = ((last7Downloads - prev7Downloads) / prev7Downloads) * 100;

  // Asset type distribution
  const typeCount = {
    IMAGE: 0,
    VIDEO: 0,
    DOCUMENT: 0,
    AUDIO: 0,
    ARCHIVE: 0,
    OTHER: 0,
  };

  assets.forEach(asset => {
    typeCount[asset.type]++;
  });

  const assetTypeDistribution = Object.entries(typeCount)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / assets.length) * 100),
    }));

  // Top performing assets
  const topPerformingAssets = assets
    .sort((a, b) => b.analytics.performanceScore - a.analytics.performanceScore)
    .slice(0, 10)
    .map(asset => ({
      id: asset.id,
      name: asset.name,
      type: asset.type,
      views: asset.analytics.views,
      downloads: asset.analytics.downloads,
      performanceScore: asset.analytics.performanceScore,
      conversionRate: asset.analytics.conversionRate,
    }));

  // Tag analytics
  const tagStats: Record<string, { assetCount: number; totalViews: number; scores: number[] }> = {};
  
  assets.forEach(asset => {
    asset.tags.forEach(tag => {
      if (!tagStats[tag.name]) {
        tagStats[tag.name] = { assetCount: 0, totalViews: 0, scores: [] };
      }
      tagStats[tag.name].assetCount++;
      tagStats[tag.name].totalViews += asset.analytics.views;
      tagStats[tag.name].scores.push(asset.analytics.performanceScore);
    });
  });

  const tagAnalytics = Object.entries(tagStats).map(([tag, stats]) => ({
    tag,
    assetCount: stats.assetCount,
    totalViews: stats.totalViews,
    avgPerformance: Math.round(stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length),
  }));

  // Storage analytics
  const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);
  
  const storageByType: Record<string, number> = {};
  assets.forEach(asset => {
    if (!storageByType[asset.type]) {
      storageByType[asset.type] = 0;
    }
    storageByType[asset.type] += asset.size;
  });

  const storageAnalytics = {
    totalSize,
    byType: Object.entries(storageByType).map(([type, size]) => ({
      type,
      size,
      percentage: Math.round((size / totalSize) * 100),
    })),
    growth: days.map((day, index) => ({
      date: format(day, 'yyyy-MM-dd'),
      size: Math.floor(totalSize * (index + 1) / days.length),
    })),
  };

  return {
    overview: {
      totalViews,
      totalDownloads,
      totalUses,
      averagePerformance: Math.round(assets.reduce((sum, asset) => sum + asset.analytics.performanceScore, 0) / assets.length),
      viewsTrend: Math.round(viewsTrend),
      downloadsTrend: Math.round(downloadsTrend),
    },
    timeSeriesData,
    assetTypeDistribution,
    topPerformingAssets,
    tagAnalytics,
    storageAnalytics,
  };
}