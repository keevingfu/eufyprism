const axios = require('axios');
const { performance } = require('perf_hooks');

// Configuration
const services = [
  { name: 'Intelligence', port: 3010, endpoints: ['/api/intelligence/opportunities', '/api/intelligence/competitors', '/api/intelligence/alerts'] },
  { name: 'GEO', port: 3003, endpoints: ['/'] },
  { name: 'GEM', port: 3002, endpoints: ['/'] },
  { name: 'Sandbox', port: 3004, endpoints: ['/'] }
];

const CONCURRENT_REQUESTS = 10;
const TOTAL_REQUESTS_PER_ENDPOINT = 100;

// Performance thresholds (ms)
const THRESHOLDS = {
  p50: 50,
  p95: 200,
  p99: 500
};

async function testEndpoint(baseUrl, endpoint, requestCount) {
  const responseTimes = [];
  const errors = [];
  
  const start = performance.now();
  
  // Send concurrent requests
  for (let i = 0; i < requestCount; i += CONCURRENT_REQUESTS) {
    const batch = [];
    for (let j = 0; j < CONCURRENT_REQUESTS && i + j < requestCount; j++) {
      batch.push(
        axios.get(`${baseUrl}${endpoint}`)
          .then(response => {
            const requestStart = performance.now();
            return { success: true, time: performance.now() - requestStart, status: response.status };
          })
          .catch(error => {
            errors.push(error.message);
            return { success: false, error: error.message };
          })
      );
    }
    
    const results = await Promise.all(batch);
    results.forEach(result => {
      if (result.success) {
        responseTimes.push(result.time);
      }
    });
  }
  
  const end = performance.now();
  const totalTime = end - start;
  
  // Calculate percentiles
  responseTimes.sort((a, b) => a - b);
  const p50 = responseTimes[Math.floor(responseTimes.length * 0.5)];
  const p95 = responseTimes[Math.floor(responseTimes.length * 0.95)];
  const p99 = responseTimes[Math.floor(responseTimes.length * 0.99)];
  const avg = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  
  return {
    endpoint,
    totalRequests: requestCount,
    successfulRequests: responseTimes.length,
    failedRequests: errors.length,
    totalTime: totalTime.toFixed(2),
    requestsPerSecond: (requestCount / (totalTime / 1000)).toFixed(2),
    responseTimes: {
      average: avg.toFixed(2),
      p50: p50?.toFixed(2) || 'N/A',
      p95: p95?.toFixed(2) || 'N/A',
      p99: p99?.toFixed(2) || 'N/A',
      min: responseTimes[0]?.toFixed(2) || 'N/A',
      max: responseTimes[responseTimes.length - 1]?.toFixed(2) || 'N/A'
    },
    errors: errors.slice(0, 5) // First 5 errors
  };
}

async function runPerformanceTests() {
  console.log('🚀 Eufy PRISM E28 Performance Test');
  console.log('==================================\n');
  
  const results = [];
  
  for (const service of services) {
    console.log(`\n📊 Testing ${service.name} Service (port ${service.port})`);
    console.log('----------------------------------------');
    
    const serviceResults = [];
    
    for (const endpoint of service.endpoints) {
      process.stdout.write(`Testing ${endpoint}... `);
      
      try {
        const result = await testEndpoint(
          `http://localhost:${service.port}`,
          endpoint,
          TOTAL_REQUESTS_PER_ENDPOINT
        );
        
        serviceResults.push(result);
        
        // Check against thresholds
        const p95Value = parseFloat(result.responseTimes.p95);
        if (p95Value > THRESHOLDS.p95) {
          console.log(`⚠️  SLOW (p95: ${result.responseTimes.p95}ms)`);
        } else {
          console.log(`✅ OK (p95: ${result.responseTimes.p95}ms)`);
        }
        
        // Display results
        console.log(`   Requests: ${result.successfulRequests}/${result.totalRequests} successful`);
        console.log(`   RPS: ${result.requestsPerSecond} req/s`);
        console.log(`   Response Times: avg=${result.responseTimes.average}ms, p50=${result.responseTimes.p50}ms, p95=${result.responseTimes.p95}ms, p99=${result.responseTimes.p99}ms`);
        
        if (result.errors.length > 0) {
          console.log(`   ❌ Errors: ${result.errors.join(', ')}`);
        }
      } catch (error) {
        console.log(`❌ FAILED: ${error.message}`);
      }
    }
    
    results.push({
      service: service.name,
      results: serviceResults
    });
  }
  
  // Summary
  console.log('\n\n📈 Performance Summary');
  console.log('======================');
  
  let totalEndpoints = 0;
  let passedEndpoints = 0;
  
  results.forEach(service => {
    service.results.forEach(result => {
      totalEndpoints++;
      const p95Value = parseFloat(result.responseTimes.p95);
      if (p95Value <= THRESHOLDS.p95 && result.successfulRequests > 0) {
        passedEndpoints++;
      }
    });
  });
  
  console.log(`Total Endpoints Tested: ${totalEndpoints}`);
  console.log(`Performance Pass Rate: ${((passedEndpoints / totalEndpoints) * 100).toFixed(1)}%`);
  console.log(`\nThresholds: p50=${THRESHOLDS.p50}ms, p95=${THRESHOLDS.p95}ms, p99=${THRESHOLDS.p99}ms`);
  
  if (passedEndpoints === totalEndpoints) {
    console.log('\n✅ All endpoints meet performance requirements!');
  } else {
    console.log(`\n⚠️  ${totalEndpoints - passedEndpoints} endpoints need optimization`);
  }
}

// Run tests
runPerformanceTests().catch(console.error);