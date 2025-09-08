# Security Best Practices Guide

## 🔐 Overview

This document outlines security best practices for the Eufy PRISM E28 platform. Following these guidelines ensures protection against common vulnerabilities and maintains compliance with security standards.

## 🛡️ Application Security

### 1. Authentication & Authorization

#### Password Security
```typescript
// Use bcrypt for password hashing
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// Hash password
const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

// Verify password
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

#### JWT Implementation
```typescript
// Secure JWT configuration
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!; // Never hardcode
const JWT_EXPIRY = '24h';

// Generate token
const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId, iat: Date.now() },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

// Verify token
const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
```

### 2. Input Validation & Sanitization

#### API Input Validation
```typescript
// Use Zod for schema validation
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(255)
});

// Validate input
const validateUser = (data: unknown) => {
  return userSchema.parse(data);
};
```

#### SQL Injection Prevention
```typescript
// Always use parameterized queries
import { Pool } from 'pg';

const pool = new Pool();

// Safe query
const getUser = async (userId: string) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

// Never do this
// const unsafe = `SELECT * FROM users WHERE id = '${userId}'`; // SQL Injection risk!
```

### 3. Security Headers

#### Express Security Headers
```typescript
import helmet from 'helmet';
import express from 'express';

const app = express();

// Apply security headers
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
```

### 4. CORS Configuration

#### Restrictive CORS Policy
```typescript
import cors from 'cors';

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://app.eufyprism.com',
      process.env.FRONTEND_URL
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

## 🔒 Infrastructure Security

### 1. Docker Security

#### Secure Dockerfile
```dockerfile
# Use specific version
FROM node:20.11.0-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY --chown=nodejs:nodejs package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Run application
CMD ["node", "dist/index.js"]
```

### 2. Environment Variables

#### Secure Environment Management
```bash
# .env.example (commit this)
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
NODE_ENV=development

# .env (never commit this)
DATABASE_URL=postgresql://prod_user:$ecureP@ss@prod.db.com:5432/eufy_prism
REDIS_URL=redis://:auth_token@prod.redis.com:6379
JWT_SECRET=32_character_random_string_here
NODE_ENV=production
```

### 3. Database Security

#### Connection Security
```typescript
// Secure database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('./certs/server-ca.pem')
  },
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};
```

#### Query Security
```sql
-- Create read-only user for reporting
CREATE USER reporting_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE eufy_prism TO reporting_user;
GRANT USAGE ON SCHEMA public TO reporting_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO reporting_user;

-- Enable row-level security
ALTER TABLE sensitive_data ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY user_isolation ON sensitive_data
  FOR ALL
  USING (user_id = current_user_id());
```

## 🚨 Vulnerability Management

### 1. Dependency Scanning

#### Automated Scanning
```json
// package.json scripts
{
  "scripts": {
    "security:audit": "npm audit",
    "security:fix": "npm audit fix",
    "security:check": "npm audit --json | node scripts/parse-audit.js",
    "security:snyk": "snyk test",
    "precommit": "npm run security:check"
  }
}
```

### 2. Code Scanning

#### ESLint Security Rules
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:security/recommended'
  ],
  plugins: ['security'],
  rules: {
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error'
  }
};
```

## 📋 Security Checklist

### Development Phase
- [ ] Never commit secrets or credentials
- [ ] Use environment variables for configuration
- [ ] Implement input validation on all endpoints
- [ ] Use parameterized queries for database access
- [ ] Hash passwords with bcrypt or argon2
- [ ] Implement rate limiting on APIs
- [ ] Enable HTTPS in production
- [ ] Set secure HTTP headers
- [ ] Configure CORS properly
- [ ] Implement proper error handling

### Deployment Phase
- [ ] Run security audit before deployment
- [ ] Update all dependencies
- [ ] Use specific versions in Dockerfile
- [ ] Run containers as non-root user
- [ ] Enable database SSL
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting
- [ ] Implement log aggregation
- [ ] Create incident response plan
- [ ] Schedule regular security reviews

### Monitoring Phase
- [ ] Monitor for suspicious activities
- [ ] Track failed login attempts
- [ ] Alert on unusual API usage
- [ ] Review logs regularly
- [ ] Update dependencies monthly
- [ ] Conduct quarterly security audits
- [ ] Test backup and recovery procedures
- [ ] Review user permissions
- [ ] Update security documentation
- [ ] Train team on security practices

## 🔧 Security Tools

### Recommended Tools
1. **npm audit** - Built-in vulnerability scanner
2. **Snyk** - Comprehensive security platform
3. **OWASP ZAP** - Web application security scanner
4. **Burp Suite** - Security testing toolkit
5. **SQLMap** - SQL injection testing
6. **Metasploit** - Penetration testing framework

### CI/CD Integration
```yaml
# GitHub Actions security workflow
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      
      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      
      - name: Run SAST scan
        uses: securego/gosec@master
        with:
          args: ./...
```

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---
*Last updated: 2025-09-08*