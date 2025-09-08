import type { NextApiRequest, NextApiResponse } from 'next';
import { analyzerService } from '@/services/analyzer';
import { MarketOpportunity } from '@/types/intelligence';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        // For demo purposes, return mock data
        // In production, this would fetch from analyzer service
        const mockOpportunities: MarketOpportunity[] = [
          {
            id: 'opp-1',
            type: 'content_gap',
            title: 'Content Gap: "Eufy vs Ring comparison"',
            description: 'High search volume (2,500/month) but no comprehensive comparison guide exists',
            potentialImpact: 'high',
            confidence: 85,
            recommendations: [
              'Create detailed comparison guide with feature matrix',
              'Include video demonstrations of key differences',
              'Optimize for "eufy vs ring" keyword cluster'
            ],
            relatedKeywords: ['eufy vs ring', 'ring doorbell alternative', 'best video doorbell 2024'],
            estimatedVolume: 2500,
            competitionLevel: 'low',
            createdAt: new Date()
          },
          {
            id: 'opp-2',
            type: 'seasonal_trend',
            title: 'Black Friday Preparation Window',
            description: 'Historical data shows 300% sales increase during Black Friday week',
            potentialImpact: 'high',
            confidence: 92,
            recommendations: [
              'Prepare bundle deals by early November',
              'Create early-bird email campaign',
              'Stock up on best-selling SKUs'
            ],
            createdAt: new Date()
          },
          {
            id: 'opp-3',
            type: 'emerging_keyword',
            title: 'Trending: "AI home security"',
            description: 'Search volume increased 180% in last 30 days',
            potentialImpact: 'medium',
            confidence: 75,
            recommendations: [
              'Create content highlighting AI features',
              'Update product descriptions with AI terminology',
              'Launch AI-focused ad campaign'
            ],
            relatedKeywords: ['AI security camera', 'smart AI detection', 'AI person detection'],
            estimatedVolume: 850,
            competitionLevel: 'medium',
            createdAt: new Date()
          },
          {
            id: 'opp-4',
            type: 'competitor_weakness',
            title: 'Ring App Rating Dropped to 3.2 Stars',
            description: 'Competitor experiencing widespread app issues, users looking for alternatives',
            potentialImpact: 'high',
            confidence: 88,
            recommendations: [
              'Highlight Eufy app reliability in marketing',
              'Create "switching from Ring" guide',
              'Target Ring users with comparison ads'
            ],
            createdAt: new Date()
          },
          {
            id: 'opp-5',
            type: 'demand_spike',
            title: 'Package Theft Concerns Trending',
            description: 'News coverage driving 250% increase in security camera searches',
            potentialImpact: 'medium',
            confidence: 80,
            recommendations: [
              'Create package protection content',
              'Highlight motion detection features',
              'Partner with delivery services'
            ],
            estimatedVolume: 5000,
            createdAt: new Date()
          }
        ];

        const { type, impact } = req.query;
        
        let filtered = mockOpportunities;
        if (type) {
          filtered = filtered.filter(opp => opp.type === type);
        }
        if (impact) {
          filtered = filtered.filter(opp => opp.potentialImpact === impact);
        }

        res.status(200).json({
          opportunities: filtered,
          total: filtered.length,
          timestamp: new Date()
        });
        break;

      case 'POST':
        // Mark opportunity as acted upon
        const { opportunityId, action } = req.body;
        // In production, save to tracking system
        res.status(200).json({ 
          success: true, 
          opportunityId,
          action,
          timestamp: new Date()
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in opportunities API:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}