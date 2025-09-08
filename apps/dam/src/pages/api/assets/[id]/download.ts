import type { NextApiRequest, NextApiResponse } from 'next';
import { getStorageService } from '../../../../services/storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    // In production, fetch asset details from database
    // For now, we'll generate a presigned URL
    const storageService = getStorageService();
    
    // Mock filename - in production, get from database
    const filename = `asset-${id}.jpg`;
    
    const url = await storageService.getPresignedUrl(filename);
    
    res.status(200).json({ url });
  } catch (error) {
    console.error('Error generating download URL:', error);
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
}