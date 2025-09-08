import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { promisify } from 'util';
import { getStorageService } from '../../../services/storage';
import { getAITaggerService } from '../../../services/tagger';
import { Asset, AssetUpload, PermissionLevel } from '../../../types/dam';
import { v4 as uuidv4 } from 'uuid';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Add file type validation here if needed
    cb(null, true);
  },
});

// Promisify multer
const uploadMiddleware = promisify(upload.array('files'));

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Process multipart form data
    await uploadMiddleware(req as any, res as any);

    const files = (req as any).files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const storageService = getStorageService();
    const aiTagger = getAITaggerService();
    const uploadedAssets: Asset[] = [];

    // Process each file
    for (const file of files) {
      try {
        // Create upload object
        const assetUpload: AssetUpload = {
          file: {
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            arrayBuffer: async () => file.buffer,
          } as File,
          tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        };

        // Upload to storage
        const uploadResult = await storageService.uploadAsset(assetUpload);

        // Create full asset object
        const asset: Asset = {
          id: uploadResult.id!,
          name: uploadResult.name!,
          filename: uploadResult.filename!,
          type: uploadResult.type!,
          mimeType: uploadResult.mimeType!,
          size: uploadResult.size!,
          url: uploadResult.url!,
          thumbnailUrl: uploadResult.thumbnailUrl,
          metadata: {},
          tags: [],
          aiTags: [],
          permissions: [
            {
              userId: 'current-user', // In production, get from auth
              level: PermissionLevel.MANAGE,
            },
          ],
          versions: [
            {
              id: uuidv4(),
              version: 1,
              url: uploadResult.url!,
              size: uploadResult.size!,
              createdAt: new Date(),
              createdBy: 'current-user',
            },
          ],
          analytics: {
            views: 0,
            downloads: 0,
            uses: 0,
            performanceScore: 50,
            conversionRate: 0,
          },
          createdAt: uploadResult.createdAt!,
          updatedAt: uploadResult.updatedAt!,
          createdBy: 'current-user',
          lastModifiedBy: 'current-user',
        };

        // Run AI tagging for images
        if (asset.type === 'IMAGE' && asset.url) {
          try {
            const aiTags = await aiTagger.analyzeImage(asset.url);
            asset.aiTags = aiTags;
          } catch (error) {
            console.error('AI tagging failed:', error);
          }
        }

        uploadedAssets.push(asset);
      } catch (error) {
        console.error('Error processing file:', file.originalname, error);
      }
    }

    res.status(200).json({
      success: true,
      assets: uploadedAssets,
      message: `Successfully uploaded ${uploadedAssets.length} assets`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
}