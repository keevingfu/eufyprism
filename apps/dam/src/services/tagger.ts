import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { AITag } from '../types/dam';

export class AITaggerService {
  private mobilenetModel: mobilenet.MobileNet | null = null;
  private cocoModel: cocoSsd.ObjectDetection | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load models
      this.mobilenetModel = await mobilenet.load();
      this.cocoModel = await cocoSsd.load();
      this.isInitialized = true;
      // eslint-disable-next-line no-console
      console.log('AI models loaded successfully');
    } catch (error) {
      console.error('Error loading AI models:', error);
      throw error;
    }
  }

  async analyzeImage(imageUrl: string): Promise<AITag[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const tags: AITag[] = [];

    try {
      // Create image element
      const img = await this.loadImage(imageUrl);

      // Image classification with MobileNet
      if (this.mobilenetModel) {
        const predictions = await this.mobilenetModel.classify(img);
        predictions.forEach((prediction) => {
          tags.push({
            label: prediction.className,
            confidence: prediction.probability,
            category: 'classification',
          });
        });
      }

      // Object detection with COCO-SSD
      if (this.cocoModel) {
        const detections = await this.cocoModel.detect(img);
        detections.forEach((detection) => {
          const [x, y, width, height] = detection.bbox;
          tags.push({
            label: detection.class,
            confidence: detection.score,
            category: 'object',
            boundingBox: { x, y, width, height },
          });
        });
      }

      // Additional custom tags based on image properties
      const customTags = await this.extractCustomTags(img);
      tags.push(...customTags);

      // Sort by confidence
      return tags.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Error analyzing image:', error);
      return [];
    }
  }

  private async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  private async extractCustomTags(img: HTMLImageElement): Promise<AITag[]> {
    const tags: AITag[] = [];

    // Analyze image dimensions
    const aspectRatio = img.width / img.height;
    if (aspectRatio > 1.5) {
      tags.push({
        label: 'landscape',
        confidence: 0.9,
        category: 'orientation',
      });
    } else if (aspectRatio < 0.67) {
      tags.push({
        label: 'portrait',
        confidence: 0.9,
        category: 'orientation',
      });
    } else {
      tags.push({
        label: 'square',
        confidence: 0.9,
        category: 'orientation',
      });
    }

    // Analyze dominant colors
    const colors = await this.analyzeDominantColors(img);
    tags.push(...colors);

    return tags;
  }

  private async analyzeDominantColors(img: HTMLImageElement): Promise<AITag[]> {
    // Create canvas for pixel analysis
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Simple color analysis (can be enhanced with clustering algorithms)
    let totalR = 0, totalG = 0, totalB = 0;
    const pixelCount = pixels.length / 4;

    for (let i = 0; i < pixels.length; i += 4) {
      totalR += pixels[i];
      totalG += pixels[i + 1];
      totalB += pixels[i + 2];
    }

    const avgR = totalR / pixelCount;
    const avgG = totalG / pixelCount;
    const avgB = totalB / pixelCount;

    // Determine dominant color category
    const colorTags: AITag[] = [];
    
    if (avgR > avgG && avgR > avgB) {
      colorTags.push({
        label: 'warm colors',
        confidence: 0.8,
        category: 'color',
      });
    } else if (avgB > avgR && avgB > avgG) {
      colorTags.push({
        label: 'cool colors',
        confidence: 0.8,
        category: 'color',
      });
    }

    // Check for grayscale
    const colorVariance = Math.abs(avgR - avgG) + Math.abs(avgG - avgB) + Math.abs(avgB - avgR);
    if (colorVariance < 30) {
      colorTags.push({
        label: 'monochrome',
        confidence: 0.85,
        category: 'color',
      });
    }

    return colorTags;
  }

  async analyzeVideo(_videoUrl: string): Promise<AITag[]> {
    // Simplified video analysis - extract key frames and analyze them
    // In a real implementation, this would use video processing libraries
    const tags: AITag[] = [
      {
        label: 'video content',
        confidence: 0.9,
        category: 'media-type',
      },
    ];

    return tags;
  }

  async analyzeDocument(documentUrl: string, mimeType: string): Promise<AITag[]> {
    const tags: AITag[] = [];

    // Basic document type detection
    if (mimeType.includes('pdf')) {
      tags.push({
        label: 'PDF document',
        confidence: 1.0,
        category: 'document-type',
      });
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      tags.push({
        label: 'Word document',
        confidence: 1.0,
        category: 'document-type',
      });
    } else if (mimeType.includes('sheet') || mimeType.includes('excel')) {
      tags.push({
        label: 'Spreadsheet',
        confidence: 1.0,
        category: 'document-type',
      });
    }

    return tags;
  }
}

// Singleton instance
let taggerInstance: AITaggerService | null = null;

export function getAITaggerService(): AITaggerService {
  if (!taggerInstance) {
    taggerInstance = new AITaggerService();
  }
  return taggerInstance;
}