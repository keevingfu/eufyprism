import { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

export interface SecurityConfig {
  corsOrigins?: string[];
  rateLimitWindowMs?: number;
  rateLimitMax?: number;
  enableHelmet?: boolean;
  enableCors?: boolean;
  enableRateLimit?: boolean;
}

const defaultConfig: SecurityConfig = {
  corsOrigins: ['http://localhost:3000'],
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100,
  enableHelmet: true,
  enableCors: true,
  enableRateLimit: true
};

export function applySecurityMiddleware(app: Express, config: SecurityConfig = {}) {
  const finalConfig = { ...defaultConfig, ...config };

  // Apply Helmet for security headers
  if (finalConfig.enableHelmet) {
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
  }

  // Apply CORS
  if (finalConfig.enableCors) {
    const corsOptions: cors.CorsOptions = {
      origin: (origin, callback) => {
        if (!origin || finalConfig.corsOrigins!.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    };
    app.use(cors(corsOptions));
  }

  // Apply rate limiting
  if (finalConfig.enableRateLimit) {
    const limiter = rateLimit({
      windowMs: finalConfig.rateLimitWindowMs!,
      max: finalConfig.rateLimitMax!,
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use('/api/', limiter);
  }

  // Additional security middleware
  app.disable('x-powered-by');
  
  // Request validation middleware
  app.use((req, res, next) => {
    // Validate Content-Type for POST/PUT requests
    if (['POST', 'PUT'].includes(req.method) && !req.is('application/json')) {
      return res.status(400).json({ error: 'Content-Type must be application/json' });
    }
    next();
  });
}

// JWT utilities
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthUtils {
  private static readonly SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(payload: any, secret: string, expiresIn = '24h'): string {
    return jwt.sign(payload, secret, { expiresIn });
  }

  static verifyToken(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }
}

// Input validation utilities
export class ValidationUtils {
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential XSS characters
      .slice(0, 1000); // Limit length
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  static escapeSQL(input: string): string {
    return input.replace(/['";\\]/g, '\\$&');
  }
}