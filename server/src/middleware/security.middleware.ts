import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly MAX_REQUESTS_PER_MINUTE = 100;
  private readonly WINDOW_MS = 60 * 1000; // 1 minute

  use(req: Request, res: Response, next: NextFunction) {
    // XSS protection
    this.sanitizeInput(req);
    
    // Request throttling
    this.throttleRequests(req, res);
    
    // Request timing
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const method = req.method;
      const url = req.url;
      const statusCode = res.statusCode;
      
      // Log slow requests (>2 seconds)
      if (duration > 2000) {
        console.warn(`Slow request: ${method} ${url} took ${duration}ms (${statusCode})`);
      }
      
      // Log all requests
      console.log(`${method} ${url} - ${statusCode} - ${duration}ms`);
    });
    
    next();
  }

  private sanitizeInput(req: Request): void {
    // Clean body from potentially dangerous content
    if (req.body) {
      this.sanitizeObject(req.body);
    }
    
    // Clean query parameters
    if (req.query) {
      this.sanitizeObject(req.query);
    }
    
    // Clean params
    if (req.params) {
      this.sanitizeObject(req.params);
    }
  }

  private sanitizeObject(obj: any): void {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string') {
          // Remove HTML tags and potentially dangerous content
          obj[key] = obj[key]
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/data:/gi, '')
            .replace(/vbscript:/gi, '');
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          this.sanitizeObject(obj[key]);
        }
      }
    }
  }

  private throttleRequests(req: Request, res: Response): void {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    // Get or create counter for IP
    let clientData = this.requestCounts.get(clientIp);
    
    if (!clientData || now - clientData.resetTime > this.WINDOW_MS) {
      clientData = { count: 0, resetTime: now };
    }
    
    // Check limit
    if (clientData.count >= this.MAX_REQUESTS_PER_MINUTE) {
      throw new HttpException(
        'Too many requests. Rate limit exceeded.',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
    
    // Increment counter
    clientData.count++;
    this.requestCounts.set(clientIp, clientData);
    
    // Add headers with limit information
    res.setHeader('X-RateLimit-Limit', this.MAX_REQUESTS_PER_MINUTE);
    res.setHeader('X-RateLimit-Remaining', this.MAX_REQUESTS_PER_MINUTE - clientData.count);
    res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime + this.WINDOW_MS).toISOString());
  }
}

// Rate limiting middleware
export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // maximum 100 requests from one IP
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil(15 * 60), // 15 minutes in seconds
    });
  },
});

// XSS protection middleware
export const xssProtectionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Базовая защита от XSS через наш SecurityMiddleware
  next();
};

// Header security middleware
export const helmetMiddleware = helmet({
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
    maxAge: 31536000, // 1 год
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});
