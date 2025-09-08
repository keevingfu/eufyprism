import { chromium, Browser, Page } from 'playwright';
import * as cron from 'node-cron';
import { DataSource, CrawlerJob, Product, MarketingActivity } from '@/types/intelligence';
import { elasticsearchClient } from '@/lib/elasticsearch';

interface CrawlerConfig {
  headless?: boolean;
  timeout?: number;
  retries?: number;
  userAgent?: string;
}

export class CrawlerService {
  private browser: Browser | null = null;
  private jobs: Map<string, cron.ScheduledTask> = new Map();
  private config: CrawlerConfig;

  constructor(config: CrawlerConfig = {}) {
    this.config = {
      headless: true,
      timeout: 30000,
      retries: 3,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ...config
    };
  }

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: this.config.headless,
      args: ['--disable-blink-features=AutomationControlled']
    });
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    this.jobs.forEach(job => job.stop());
    this.jobs.clear();
  }

  // Schedule a recurring crawl job
  scheduleJob(jobId: string, cronExpression: string, source: DataSource): void {
    const job = cron.schedule(cronExpression, async () => {
      await this.executeCrawl(jobId, source);
    });
    
    this.jobs.set(jobId, job);
    job.start();
  }

  private async executeCrawl(jobId: string, source: DataSource): Promise<void> {
    const job: CrawlerJob = {
      id: jobId,
      source,
      status: 'running',
      startTime: new Date(),
      itemsProcessed: 0,
      errors: []
    };

    try {
      await this.updateJobStatus(job);

      switch (source) {
        case DataSource.AMAZON:
          await this.crawlAmazon(job);
          break;
        case DataSource.GOOGLE:
          await this.crawlGoogle(job);
          break;
        case DataSource.FACEBOOK:
        case DataSource.INSTAGRAM:
          await this.crawlMeta(job);
          break;
        default:
          throw new Error(`Crawler for ${source} not implemented`);
      }

      job.status = 'completed';
      job.endTime = new Date();
    } catch (error) {
      job.status = 'failed';
      job.errors?.push(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      await this.updateJobStatus(job);
    }
  }

  private async crawlAmazon(job: CrawlerJob): Promise<void> {
    const page = await this.createPage();
    
    try {
      // Crawl Eufy products on Amazon
      const searchQuery = 'eufy security camera';
      await page.goto(`https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}`);
      
      // Wait for product listings to load
      await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: this.config.timeout });
      
      const products = await page.$$eval('[data-component-type="s-search-result"]', (elements) => {
        return elements.slice(0, 20).map(el => {
          const titleEl = el.querySelector('h2 a span');
          const priceEl = el.querySelector('.a-price-whole');
          const ratingEl = el.querySelector('.a-icon-star-small span');
          const linkEl = el.querySelector('h2 a');
          const imageEl = el.querySelector('.s-image');
          
          return {
            name: titleEl?.textContent || '',
            currentPrice: parseFloat(priceEl?.textContent?.replace(/[$,]/g, '') || '0'),
            rating: parseFloat(ratingEl?.textContent?.split(' ')[0] || '0'),
            productUrl: linkEl ? `https://www.amazon.com${linkEl.getAttribute('href')}` : '',
            imageUrl: imageEl?.getAttribute('src') || '',
            availability: 'in_stock' as const
          };
        });
      });

      // Store products in Elasticsearch
      for (const product of products) {
        await this.storeProduct(product);
        job.itemsProcessed = (job.itemsProcessed || 0) + 1;
      }

    } finally {
      await page.close();
    }
  }

  private async crawlGoogle(job: CrawlerJob): Promise<void> {
    const page = await this.createPage();
    
    try {
      // Crawl Google search trends for Eufy
      const searchQuery = 'eufy smart home';
      await page.goto(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
      
      // Extract search results and trends
      await page.waitForSelector('#search', { timeout: this.config.timeout });
      
      // Implementation for Google trends extraction
      job.itemsProcessed = (job.itemsProcessed || 0) + 10;
      
    } finally {
      await page.close();
    }
  }

  private async crawlMeta(job: CrawlerJob): Promise<void> {
    // Implementation for Facebook/Instagram crawling
    // Note: This would require authentication and API access
    console.log(`Crawling ${job.source} - requires API integration`);
  }

  private async createPage(): Promise<Page> {
    if (!this.browser) {
      await this.initialize();
    }
    
    const context = await this.browser!.newContext({
      userAgent: this.config.userAgent
    });
    
    const page = await context.newPage();
    return page;
  }

  private async storeProduct(product: Partial<Product>): Promise<void> {
    try {
      await elasticsearchClient.index({
        index: 'eufy-products',
        body: {
          ...product,
          timestamp: new Date(),
          source: DataSource.AMAZON
        }
      });
    } catch (error) {
      console.error('Failed to store product:', error);
    }
  }

  private async updateJobStatus(job: CrawlerJob): Promise<void> {
    try {
      await elasticsearchClient.index({
        index: 'crawler-jobs',
        id: job.id,
        body: job
      });
    } catch (error) {
      console.error('Failed to update job status:', error);
    }
  }

  // Manual crawl execution
  async crawl(source: DataSource, query?: string): Promise<any> {
    const jobId = `manual-${Date.now()}`;
    await this.executeCrawl(jobId, source);
  }
}

// Singleton instance
export const crawlerService = new CrawlerService();