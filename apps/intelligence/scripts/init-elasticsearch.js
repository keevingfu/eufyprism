#!/usr/bin/env node

const { Client } = require('@elastic/elasticsearch');
const { indexConfigs } = require('../src/lib/elasticsearch');

async function initializeElasticsearch() {
  const client = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
      password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
    }
  });

  try {
    // Test connection
    const { body: ping } = await client.ping();
    console.log('✅ Elasticsearch connection successful');

    // Create indices
    for (const [indexName, config] of Object.entries(indexConfigs)) {
      try {
        const { body: exists } = await client.indices.exists({ index: indexName });
        
        if (exists) {
          console.log(`ℹ️  Index "${indexName}" already exists`);
        } else {
          await client.indices.create({
            index: indexName,
            body: config
          });
          console.log(`✅ Created index: ${indexName}`);
        }
      } catch (error) {
        console.error(`❌ Failed to create index "${indexName}":`, error.message);
      }
    }

    console.log('\n✅ Elasticsearch initialization complete');
  } catch (error) {
    console.error('❌ Elasticsearch initialization failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeElasticsearch();
}

module.exports = { initializeElasticsearch };