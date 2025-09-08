import type { NextApiRequest, NextApiResponse } from 'next';
import { Content } from '@/types/geo';

// Mock database
let mockContents: Content[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  
  switch (req.method) {
    case 'GET':
      // Get single content by ID
      const content = mockContents.find(c => c.id === id);
      
      if (!content) {
        res.status(404).json({ error: 'Content not found' });
        return;
      }
      
      res.status(200).json(content);
      break;
      
    case 'PUT':
      // Update content
      const contentIndex = mockContents.findIndex(c => c.id === id);
      
      if (contentIndex === -1) {
        res.status(404).json({ error: 'Content not found' });
        return;
      }
      
      mockContents[contentIndex] = {
        ...mockContents[contentIndex],
        ...req.body,
        updatedAt: new Date()
      };
      
      res.status(200).json(mockContents[contentIndex]);
      break;
      
    case 'DELETE':
      // Delete content
      const deleteIndex = mockContents.findIndex(c => c.id === id);
      
      if (deleteIndex === -1) {
        res.status(404).json({ error: 'Content not found' });
        return;
      }
      
      mockContents.splice(deleteIndex, 1);
      res.status(204).end();
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}