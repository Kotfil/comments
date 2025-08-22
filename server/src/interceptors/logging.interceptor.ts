import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  private readonly slowQueryThreshold = 1000; // 1 second
  private readonly errorThreshold = 500; // 500ms for errors

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req as Request;
    const response = gqlContext.getContext().res as Response;
    
    // Log request start
    this.logRequestStart(request, gqlContext);
    
    return next.handle().pipe(
      tap((data) => {
        // Log successful response
        this.logRequestSuccess(request, startTime, data);
      }),
      catchError((error) => {
        // Log error
        this.logRequestError(request, startTime, error);
        throw error;
      }),
    );
  }

  private logRequestStart(request: Request, gqlContext: GqlExecutionContext): void {
    const operationName = gqlContext.getInfo().operationName || 'Unknown';
    const operationType = gqlContext.getInfo().operation.operation || 'Unknown';
    const ip = request.ip || request.connection.remoteAddress || 'unknown';
    const userAgent = request.headers['user-agent'] || 'unknown';
    
    this.logger.log(
      `GraphQL ${operationType.toUpperCase()} ${operationName} started from ${ip}`,
      {
        operation: operationName,
        type: operationType,
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
      }
    );
  }

  private logRequestSuccess(request: Request, startTime: number, data: any): void {
    const duration = Date.now() - startTime;
    const ip = request.ip || request.connection.remoteAddress || 'unknown';
    
    // Log slow queries
    if (duration > this.slowQueryThreshold) {
      this.logger.warn(
        `Slow query detected: ${duration}ms from ${ip}`,
        {
          duration,
          ip,
          timestamp: new Date().toISOString(),
        }
      );
    }
    
    // Log all successful requests
    this.logger.log(
      `Query completed in ${duration}ms from ${ip}`,
      {
        duration,
        ip,
        timestamp: new Date().toISOString(),
      }
    );
  }

  private logRequestError(request: Request, startTime: number, error: any): void {
    const duration = Date.now() - startTime;
    const ip = request.ip || request.connection.remoteAddress || 'unknown';
    const errorMessage = error.message || 'Unknown error';
    const errorCode = error.status || error.code || 'UNKNOWN';
    
    // Log errors
    this.logger.error(
      `Query failed after ${duration}ms from ${ip}: ${errorMessage}`,
      {
        duration,
        ip,
        error: errorMessage,
        code: errorCode,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      }
    );
    
    // Alert for critical errors
    if (duration > this.errorThreshold) {
      this.logger.error(
        `CRITICAL: Long-running query failed: ${duration}ms`,
        {
          duration,
          ip,
          error: errorMessage,
          timestamp: new Date().toISOString(),
        }
      );
    }
  }
}

// Performance monitoring interceptor
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);
  private readonly metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    totalDuration: 0,
    slowQueries: 0,
    errors: 0,
  };

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    this.metrics.totalRequests++;
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.metrics.successfulRequests++;
        this.metrics.totalDuration += duration;
        
        if (duration > 1000) {
          this.metrics.slowQueries++;
        }
        
        // Log metrics every 100 requests
        if (this.metrics.totalRequests % 100 === 0) {
          this.logMetrics();
        }
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.metrics.failedRequests++;
        this.metrics.errors++;
        this.metrics.totalDuration += duration;
        
        throw error;
      }),
    );
  }

  private logMetrics(): void {
    const avgDuration = this.metrics.totalDuration / this.metrics.totalRequests;
    const successRate = (this.metrics.successfulRequests / this.metrics.totalRequests) * 100;
    
    this.logger.log(
      `Performance metrics: ${this.metrics.totalRequests} requests, ` +
      `avg: ${avgDuration.toFixed(2)}ms, ` +
      `success: ${successRate.toFixed(2)}%, ` +
      `slow: ${this.metrics.slowQueries}, ` +
      `errors: ${this.metrics.errors}`,
      {
        metrics: { ...this.metrics, avgDuration, successRate },
        timestamp: new Date().toISOString(),
      }
    );
  }

  // Method to get current metrics
  getMetrics() {
    return { ...this.metrics };
  }
}
