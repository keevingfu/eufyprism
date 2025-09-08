import type { NextApiRequest, NextApiResponse } from 'next';
import { Tag } from '../../../types/dam';

// Mock tags data
const mockTags: Tag[] = [
  { id: '1', name: 'Product', color: 'blue' },
  { id: '2', name: 'Marketing', color: 'green' },
  { id: '3', name: 'Campaign', color: 'orange' },
  { id: '4', name: '2024', color: 'purple' },
  { id: '5', name: 'Banner', color: 'red' },
  { id: '6', name: 'Social Media', color: 'cyan' },
  { id: '7', name: 'Video', color: 'magenta' },
  { id: '8', name: 'Promotional', color: 'gold' },
  { id: '9', name: 'E-commerce', color: 'lime' },
  { id: '10', name: 'Tutorial', color: 'geekblue' },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json(mockTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name,
      color: color || 'default',
    };

    mockTags.push(newTag);
    res.status(201).json(newTag);
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ error: 'Failed to create tag' });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { name, color } = req.body;

    const tagIndex = mockTags.findIndex((tag) => tag.id === id);
    if (tagIndex === -1) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    mockTags[tagIndex] = {
      ...mockTags[tagIndex],
      name: name || mockTags[tagIndex].name,
      color: color || mockTags[tagIndex].color,
    };

    res.status(200).json(mockTags[tagIndex]);
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({ error: 'Failed to update tag' });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    const tagIndex = mockTags.findIndex((tag) => tag.id === id);
    if (tagIndex === -1) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    mockTags.splice(tagIndex, 1);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
}