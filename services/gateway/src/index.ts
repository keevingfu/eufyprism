import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3030;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration - restrict to specific origins
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3010',
    'http://localhost:3011'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Disable X-Powered-By header
app.disable('x-powered-by');

// Logging middleware
app.use(morgan('combined'));
app.use(express.json());

// Service endpoints
const services = {
  intelligence: 'http://localhost:3010',
  dam: 'http://localhost:3011',
  geo: 'http://localhost:3003',
  gem: 'http://localhost:3002',
  sandbox: 'http://localhost:3004'
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Service status check
app.get('/services/status', async (req, res) => {
  const statuses: Record<string, any> = {};
  
  for (const [name, url] of Object.entries(services)) {
    try {
      const response = await fetch(`${url}/api/health`).catch(() => null);
      statuses[name] = {
        url,
        status: response?.ok ? 'online' : 'offline',
        statusCode: response?.status || null
      };
    } catch (error) {
      statuses[name] = {
        url,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  res.json({
    gateway: 'online',
    services: statuses,
    timestamp: new Date().toISOString()
  });
});

// Proxy routes to services
Object.entries(services).forEach(([name, target]) => {
  app.use(`/api/${name}`, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^/api/${name}`]: '/api'
    },
    on: {
      error: (err: any, req: any, res: any) => {
        console.error(`[Gateway] Error proxying to ${name}:`, err.message);
        if (res && !res.headersSent) {
          res.status(502).json({
            error: 'Bad Gateway',
            service: name,
            message: `Unable to connect to ${name} service`
          });
        }
      }
    }
  }));
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Gateway] Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚪 Gateway service running on http://localhost:${PORT}`);
  console.log('📍 Proxying requests to:', services);
});

export default app;