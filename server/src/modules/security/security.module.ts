import { Module, Global } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { SecurityGuard } from '../../guards/security.guard';
import { LoggingInterceptor } from '../../interceptors/logging.interceptor';
import { PerformanceInterceptor } from '../../interceptors/logging.interceptor';
import { SecurityMiddleware } from '../../middleware/security.middleware';

@Global()
@Module({
  providers: [
    SecurityMiddleware,
    {
      provide: APP_GUARD,
      useClass: SecurityGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
  exports: [SecurityMiddleware],
})
export class SecurityModule {}
