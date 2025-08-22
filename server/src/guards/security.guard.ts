import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

@Injectable()
export class SecurityGuard implements CanActivate {
  private readonly MAX_QUERY_COMPLEXITY = 1000; // Maximum GraphQL query complexity
  private readonly MAX_QUERY_DEPTH = 10; // Maximum GraphQL query depth
  private readonly MAX_QUERY_LENGTH = 10000; // Maximum GraphQL query length

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as Request;
    
    // Check security headers
    this.checkSecurityHeaders(request);
    
    // Validate GraphQL query
    this.validateGraphQLQuery(request);
    
    // Check IP address
    this.checkIPAddress(request);
    
    return true;
  }

  private checkSecurityHeaders(request: Request): void {
    const userAgent = request.headers['user-agent'];
    const origin = request.headers.origin;
    
    // Block suspicious User-Agent
    if (userAgent && this.isSuspiciousUserAgent(userAgent)) {
      throw new HttpException(
        'Suspicious request detected',
        HttpStatus.FORBIDDEN
      );
    }
    
    // Check Origin for CORS
    if (origin && !this.isAllowedOrigin(origin)) {
      throw new HttpException(
        'Origin not allowed',
        HttpStatus.FORBIDDEN
      );
    }
  }

  private validateGraphQLQuery(request: Request): void {
    const body = request.body;
    
    if (!body || !body.query) {
      return; // Not a GraphQL query
    }
    
    const query = body.query as string;
    
    // Check query length
    if (query.length > this.MAX_QUERY_LENGTH) {
      throw new HttpException(
        'Query too long',
        HttpStatus.BAD_REQUEST
      );
    }
    
    // Check query depth (number of nested fields)
    const depth = this.calculateQueryDepth(query);
    if (depth > this.MAX_QUERY_DEPTH) {
      throw new HttpException(
        'Query too deep',
        HttpStatus.BAD_REQUEST
      );
    }
    
    // Check query complexity
    const complexity = this.calculateQueryComplexity(query);
    if (complexity > this.MAX_QUERY_COMPLEXITY) {
      throw new HttpException(
        'Query too complex',
        HttpStatus.BAD_REQUEST
      );
    }
    
    // Check for suspicious patterns
    if (this.containsSuspiciousPatterns(query)) {
      throw new HttpException(
        'Suspicious query pattern detected',
        HttpStatus.FORBIDDEN
      );
    }
  }

  private checkIPAddress(request: Request): void {
    const ip = request.ip || request.connection.remoteAddress || 'unknown';
    
    // Block local IP addresses (if needed)
    if (this.isBlockedIP(ip)) {
      throw new HttpException(
        'IP address blocked',
        HttpStatus.FORBIDDEN
      );
    }
  }

  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /perl/i,
      /ruby/i,
      /php/i,
      /go-http-client/i,
      /httpclient/i,
      /okhttp/i,
      /axios/i,
      /fetch/i,
      /xmlhttprequest/i,
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  private isAllowedOrigin(origin: string): boolean {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ];
    
    return allowedOrigins.includes(origin);
  }

  private calculateQueryDepth(query: string): number {
    let maxDepth = 0;
    let currentDepth = 0;
    
    for (const char of query) {
      if (char === '{') {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      } else if (char === '}') {
        currentDepth--;
      }
    }
    
    return maxDepth;
  }

  private calculateQueryComplexity(query: string): number {
    // Simple complexity calculation based on field count
    const fieldMatches = query.match(/\w+\s*{/g);
    return fieldMatches ? fieldMatches.length : 0;
  }

  private containsSuspiciousPatterns(query: string): boolean {
    const suspiciousPatterns = [
      /__schema/i,
      /__type/i,
      /__typename/i,
      /introspection/i,
      /fragment\s+on\s+\w+\s*{/i,
      /\.\.\./g, // Fragment spreads
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(query));
  }

  private isBlockedIP(ip: string): boolean {
    const blockedIPs = [
      '127.0.0.1',
      '::1',
      '0.0.0.0',
    ];
    
    return blockedIPs.includes(ip);
  }
}
