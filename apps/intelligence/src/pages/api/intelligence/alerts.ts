import type { NextApiRequest, NextApiResponse } from 'next';
import { analyzerService } from '@/services/analyzer';
import { Alert, AlertLevel } from '@/types/intelligence';
import { subDays } from 'date-fns';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        const { days = 7, level } = req.query;
        const dateRange = {
          start: subDays(new Date(), Number(days)),
          end: new Date()
        };

        // For demo purposes, return mock data
        // In production, this would fetch from Elasticsearch
        const mockAlerts: Alert[] = [
          {
            id: '1',
            level: AlertLevel.RED,
            title: 'Competitor Price Drop Alert',
            description: 'Ring has dropped prices by 25% on their flagship doorbell camera',
            source: 'amazon' as any,
            timestamp: new Date(),
            actionRequired: 'Consider matching the price or launching a bundle promotion',
            metadata: {
              competitor: 'Ring',
              product: 'Video Doorbell Pro',
              previousPrice: 249.99,
              currentPrice: 187.49,
              priceDropPercent: 25
            }
          },
          {
            id: '2',
            level: AlertLevel.ORANGE,
            title: 'Social Media Sentiment Decline',
            description: 'Negative sentiment detected on Twitter regarding app connectivity issues',
            source: 'twitter' as any,
            timestamp: new Date(),
            actionRequired: 'Address customer concerns and release app update announcement',
            metadata: {
              sentimentScore: -0.3,
              mentionCount: 156,
              topComplaints: ['app crashes', 'connection timeout', 'slow response']
            }
          },
          {
            id: '3',
            level: AlertLevel.YELLOW,
            title: 'Emerging Competitor Activity',
            description: 'Wyze launching new AI-powered camera line next month',
            source: 'google' as any,
            timestamp: new Date(),
            metadata: {
              competitor: 'Wyze',
              launchDate: '2024-02-15',
              estimatedImpact: 'medium'
            }
          }
        ];

        const filteredAlerts = level 
          ? mockAlerts.filter(alert => alert.level === level)
          : mockAlerts;

        res.status(200).json({
          alerts: filteredAlerts,
          total: filteredAlerts.length,
          dateRange
        });
        break;

      case 'POST':
        // Create new alert
        const newAlert = req.body;
        // In production, save to Elasticsearch
        res.status(201).json({ success: true, alert: newAlert });
        break;

      case 'DELETE':
        // Dismiss alert
        const { id } = req.query;
        // In production, update alert status in Elasticsearch
        res.status(200).json({ success: true, dismissed: id });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in alerts API:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}