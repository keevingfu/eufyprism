import { Client } from '@elastic/elasticsearch';

export const elasticsearchClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
  },
  tls: {
    rejectUnauthorized: false // For development only
  }
});

// Index configurations
export const indexConfigs = {
  'eufy-products': {
    mappings: {
      properties: {
        id: { type: 'keyword' },
        name: { type: 'text' },
        asin: { type: 'keyword' },
        sku: { type: 'keyword' },
        currentPrice: { type: 'float' },
        originalPrice: { type: 'float' },
        discount: { type: 'float' },
        rating: { type: 'float' },
        reviewCount: { type: 'integer' },
        availability: { type: 'keyword' },
        imageUrl: { type: 'keyword' },
        productUrl: { type: 'keyword' },
        competitorId: { type: 'keyword' },
        timestamp: { type: 'date' },
        source: { type: 'keyword' }
      }
    }
  },
  'competitor-data': {
    mappings: {
      properties: {
        id: { type: 'keyword' },
        name: { type: 'text' },
        lastUpdated: { type: 'date' }
      }
    }
  },
  'intelligence-alerts': {
    mappings: {
      properties: {
        id: { type: 'keyword' },
        level: { type: 'keyword' },
        title: { type: 'text' },
        description: { type: 'text' },
        source: { type: 'keyword' },
        timestamp: { type: 'date' },
        actionRequired: { type: 'text' },
        metadata: { type: 'object', enabled: false }
      }
    }
  },
  'market-opportunities': {
    mappings: {
      properties: {
        id: { type: 'keyword' },
        type: { type: 'keyword' },
        title: { type: 'text' },
        description: { type: 'text' },
        potentialImpact: { type: 'keyword' },
        confidence: { type: 'float' },
        recommendations: { type: 'text' },
        relatedKeywords: { type: 'keyword' },
        estimatedVolume: { type: 'integer' },
        competitionLevel: { type: 'keyword' },
        createdAt: { type: 'date' }
      }
    }
  },
  'crawler-jobs': {
    mappings: {
      properties: {
        id: { type: 'keyword' },
        source: { type: 'keyword' },
        status: { type: 'keyword' },
        startTime: { type: 'date' },
        endTime: { type: 'date' },
        itemsProcessed: { type: 'integer' },
        errors: { type: 'text' },
        nextRunTime: { type: 'date' }
      }
    }
  },
  'search-analytics': {
    mappings: {
      properties: {
        search_term: { 
          type: 'text',
          fields: {
            keyword: { type: 'keyword' }
          }
        },
        timestamp: { type: 'date' },
        volume: { type: 'integer' },
        source: { type: 'keyword' }
      }
    }
  }
};

// Initialize Elasticsearch indices
export async function initializeElasticsearch() {
  try {
    const { body: ping } = await elasticsearchClient.ping();
    console.log('Elasticsearch connection successful');

    // Create indices if they don't exist
    for (const [indexName, config] of Object.entries(indexConfigs)) {
      const { body: exists } = await elasticsearchClient.indices.exists({ index: indexName });
      
      if (!exists) {
        await elasticsearchClient.indices.create({
          index: indexName,
          body: config
        });
        console.log(`Created index: ${indexName}`);
      }
    }
  } catch (error) {
    console.error('Elasticsearch initialization failed:', error);
    throw error;
  }
}