import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { Asset, AssetType, AssetUpload, StorageConfig } from '../types/dam';

export class StorageService {
  private client: Minio.Client;
  private bucket: string;
  private thumbnailBucket: string;

  constructor(config: StorageConfig) {
    this.client = new Minio.Client({
      endPoint: config.endpoint,
      port: config.port,
      useSSL: config.useSSL,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
    });
    this.bucket = config.bucket;
    this.thumbnailBucket = `${config.bucket}-thumbnails`;
    this.initializeBuckets();
  }

  private async initializeBuckets() {
    try {
      const buckets = [this.bucket, this.thumbnailBucket];
      for (const bucket of buckets) {
        const exists = await this.client.bucketExists(bucket);
        if (!exists) {
          await this.client.makeBucket(bucket, 'us-east-1');
          console.log(`Bucket ${bucket} created`);
        }
      }
    } catch (error) {
      console.error('Error initializing buckets:', error);
    }
  }

  async uploadAsset(upload: AssetUpload): Promise<Partial<Asset>> {
    const fileId = uuidv4();
    const fileExtension = upload.file.name.split('.').pop();
    const objectName = `${fileId}.${fileExtension}`;
    
    try {
      // Upload main file
      const buffer = Buffer.from(await upload.file.arrayBuffer());
      await this.client.putObject(this.bucket, objectName, buffer, buffer.length, {
        'Content-Type': upload.file.type,
      });

      // Generate thumbnail for images
      let thumbnailUrl;
      if (this.isImage(upload.file.type)) {
        thumbnailUrl = await this.generateThumbnail(buffer, objectName);
      }

      // Get file URL
      const url = await this.getPresignedUrl(objectName);

      return {
        id: fileId,
        name: upload.file.name,
        filename: objectName,
        type: this.getAssetType(upload.file.type),
        mimeType: upload.file.type,
        size: upload.file.size,
        url,
        thumbnailUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error uploading asset:', error);
      throw error;
    }
  }

  async deleteAsset(filename: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucket, filename);
      // Also delete thumbnail if exists
      const thumbnailName = `thumb_${filename}`;
      await this.client.removeObject(this.thumbnailBucket, thumbnailName).catch(() => {});
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  }

  async getPresignedUrl(filename: string, expiry: number = 7 * 24 * 60 * 60): Promise<string> {
    return await this.client.presignedGetObject(this.bucket, filename, expiry);
  }

  async createAssetVersion(originalFilename: string, newFile: Buffer, version: number): Promise<string> {
    const fileExtension = originalFilename.split('.').pop();
    const baseName = originalFilename.replace(`.${fileExtension}`, '');
    const versionedName = `${baseName}_v${version}.${fileExtension}`;

    await this.client.putObject(this.bucket, versionedName, newFile, newFile.length);
    return await this.getPresignedUrl(versionedName);
  }

  private async generateThumbnail(buffer: Buffer, filename: string): Promise<string> {
    try {
      const thumbnailBuffer = await sharp(buffer)
        .resize(300, 300, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      const thumbnailName = `thumb_${filename.replace(/\.[^/.]+$/, '.jpg')}`;
      await this.client.putObject(
        this.thumbnailBucket,
        thumbnailName,
        thumbnailBuffer,
        thumbnailBuffer.length,
        {
          'Content-Type': 'image/jpeg',
        }
      );

      return await this.client.presignedGetObject(this.thumbnailBucket, thumbnailName);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return '';
    }
  }

  private isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  private getAssetType(mimeType: string): AssetType {
    if (mimeType.startsWith('image/')) return AssetType.IMAGE;
    if (mimeType.startsWith('video/')) return AssetType.VIDEO;
    if (mimeType.startsWith('audio/')) return AssetType.AUDIO;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return AssetType.DOCUMENT;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return AssetType.ARCHIVE;
    return AssetType.OTHER;
  }

  async getStorageStats(): Promise<{
    totalSize: number;
    assetCount: number;
    bucketInfo: any;
  }> {
    let totalSize = 0;
    let assetCount = 0;

    const stream = this.client.listObjects(this.bucket, '', true);
    
    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => {
        totalSize += obj.size || 0;
        assetCount++;
      });
      
      stream.on('error', reject);
      
      stream.on('end', async () => {
        const bucketInfo = await this.client.statObject(this.bucket, '').catch(() => null);
        resolve({ totalSize, assetCount, bucketInfo });
      });
    });
  }
}

// Singleton instance
let storageInstance: StorageService | null = null;

export function getStorageService(): StorageService {
  if (!storageInstance) {
    const config: StorageConfig = {
      endpoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
      bucket: process.env.MINIO_BUCKET || 'eufy-dam-assets',
    };
    storageInstance = new StorageService(config);
  }
  return storageInstance;
}