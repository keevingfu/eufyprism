# Performance Optimization Guide

## 🎯 Performance Goals

### Response Time Targets
- **p50 (median)**: < 50ms
- **p95**: < 200ms
- **p99**: < 500ms
- **Average**: < 100ms

### Throughput Targets
- **Minimum RPS**: 100 requests/second per service
- **Peak Load**: 500 concurrent users
- **Database Queries**: < 50ms per query

## 🚀 Optimization Strategies

### 1. Frontend Optimizations

#### Next.js Optimizations
```javascript
// next.config.js
module.exports = {
  // Enable SWC minification
  swcMinify: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Compression
  compress: true,
  
  // Build optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', '@chakra-ui/react', 'antd'],
  }
};
```

#### Code Splitting
```javascript
// Dynamic imports for heavy components
const HeavyChart = dynamic(() => import('../components/HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false
});

// Route-based code splitting
const DashboardModule = lazy(() => import('./modules/Dashboard'));
```

#### Bundle Size Reduction
- Tree shaking unused imports
- Lazy loading heavy libraries
- Using production builds of libraries
- Removing console logs in production

### 2. Backend Optimizations

#### API Response Caching
```javascript
// Redis caching middleware
const cacheMiddleware = (ttl = 60) => async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;
  const cached = await redis.get(key);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  res.sendResponse = res.json;
  res.json = (body) => {
    redis.setex(key, ttl, JSON.stringify(body));
    res.sendResponse(body);
  };
  
  next();
};
```

#### Database Query Optimization
```javascript
// Connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Query optimization with indexes
CREATE INDEX idx_assets_created_at ON assets(created_at DESC);
CREATE INDEX idx_assets_type_status ON assets(type, status);
CREATE INDEX idx_campaigns_status ON campaigns(status) WHERE status = 'active';
```

#### Request Batching
```javascript
// GraphQL DataLoader pattern
const opportunityLoader = new DataLoader(async (ids) => {
  const opportunities = await db.query(
    'SELECT * FROM opportunities WHERE id = ANY($1)',
    [ids]
  );
  return ids.map(id => opportunities.find(o => o.id === id));
});
```

### 3. Infrastructure Optimizations

#### CDN Configuration
```nginx
# Nginx caching headers
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /api/ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    proxy_pass http://backend;
}
```

#### Container Resource Limits
```yaml
# docker-compose.yml optimizations
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### 4. Monitoring & Observability

#### Performance Monitoring Setup
```javascript
// Prometheus metrics
const responseTime = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

// Track performance
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    responseTime.observe(
      { method: req.method, route: req.route?.path || 'unknown', status: res.statusCode },
      duration
    );
  });
  next();
});
```

#### Grafana Dashboards
- Response time percentiles (p50, p95, p99)
- Requests per second
- Error rates
- Database query times
- Cache hit rates
- Memory and CPU usage

### 5. Load Testing

#### Artillery Configuration
```yaml
config:
  target: 'http://localhost:3010'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up"
    - duration: 300
      arrivalRate: 100
      name: "Sustained load"
  processor: "./loadtest-processor.js"
scenarios:
  - name: "Browse Dashboard"
    flow:
      - get:
          url: "/dashboard"
      - think: 5
      - get:
          url: "/api/intelligence/opportunities"
```

## 📊 Current Performance Baseline

### Service Response Times (p95)
- Intelligence: ~20ms ✅
- GEO: ~35ms ✅
- GEM: ~40ms ✅
- Sandbox: ~45ms ✅
- DAM: TBD (service under repair)

### Optimization Opportunities
1. **Image Optimization**: Implement WebP/AVIF formats
2. **API Caching**: Add Redis caching layer
3. **Database Indexing**: Create missing indexes
4. **Bundle Splitting**: Reduce initial load size
5. **Service Workers**: Offline capability

## 🎯 Implementation Checklist

- [ ] Enable Next.js SWC compiler
- [ ] Implement Redis caching
- [ ] Add database connection pooling
- [ ] Create database indexes
- [ ] Setup CDN for static assets
- [ ] Implement service workers
- [ ] Add performance monitoring
- [ ] Configure auto-scaling rules
- [ ] Run load tests
- [ ] Document performance SLAs

---
*Last updated: 2025-09-08*