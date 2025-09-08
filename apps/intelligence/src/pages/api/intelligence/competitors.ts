import type { NextApiRequest, NextApiResponse } from 'next';
import { CompetitorData } from '@/types/intelligence';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        // Mock competitor data
        const mockCompetitors: CompetitorData[] = [
          {
            id: '1',
            name: 'Ring',
            products: [],
            marketingActivities: [],
            priceHistory: [],
            socialMetrics: {
              followers: {},
              engagement: {},
              sentiment: 0.65,
              mentions: 2340
            },
            lastUpdated: new Date()
          },
          {
            id: '2',
            name: 'Arlo',
            products: [],
            marketingActivities: [],
            priceHistory: [],
            socialMetrics: {
              followers: {},
              engagement: {},
              sentiment: 0.72,
              mentions: 1560
            },
            lastUpdated: new Date()
          },
          {
            id: '3',
            name: 'Wyze',
            products: [],
            marketingActivities: [],
            priceHistory: [],
            socialMetrics: {
              followers: {},
              engagement: {},
              sentiment: 0.78,
              mentions: 890
            },
            lastUpdated: new Date()
          }
        ];

        res.status(200).json({
          competitors: mockCompetitors,
          total: mockCompetitors.length,
          timestamp: new Date()
        });
        break;

      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in competitors API:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}