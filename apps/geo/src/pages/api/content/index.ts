import type { NextApiRequest, NextApiResponse } from 'next';
import { Content } from '@/types/geo';

// Mock database for now
const mockContents: Content[] = [
  {
    id: '1',
    title: 'Eufy Security Camera S40 Review',
    slug: 'eufy-security-camera-s40-review',
    type: 'review',
    status: 'published',
    author: 'John Doe',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    publishedAt: new Date('2024-01-16'),
    content: '<h1>Eufy Security Camera S40 Review</h1><p>Content here...</p>',
    excerpt: 'A comprehensive review of the Eufy Security Camera S40',
    metaTitle: 'Eufy S40 Review - Best Budget Security Camera 2024',
    metaDescription: 'In-depth review of the Eufy Security Camera S40...',
    keywords: ['eufy s40', 'security camera', 'review'],
    seoScore: 85,
    aioScore: 78,
    readabilityScore: 72,
    channels: [
      {
        id: '1',
        name: 'Website',
        type: 'website',
        status: 'published',
        publishedAt: new Date('2024-01-16'),
        url: 'https://eufy.com/blog/eufy-security-camera-s40-review'
      }
    ],
    views: 12500,
    engagement: 4.2,
    conversions: 125
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      // Get all contents with optional filters
      const { status, type, search } = req.query;
      
      let filtered = [...mockContents];
      
      if (status) {
        filtered = filtered.filter(c => c.status === status);
      }
      
      if (type) {
        filtered = filtered.filter(c => c.type === type);
      }
      
      if (search) {
        const searchTerm = search.toString().toLowerCase();
        filtered = filtered.filter(c => 
          c.title.toLowerCase().includes(searchTerm) ||
          c.content.toLowerCase().includes(searchTerm)
        );
      }
      
      res.status(200).json({ 
        contents: filtered,
        total: filtered.length 
      });
      break;
      
    case 'POST':
      // Create new content
      const newContent: Content = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        engagement: 0,
        conversions: 0,
        channels: []
      };
      
      mockContents.push(newContent);
      res.status(201).json(newContent);
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}