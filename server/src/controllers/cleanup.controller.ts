import { Controller, Get, Post, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CleanupService } from '../services/cleanup.service';

@Controller('cleanup')
export class CleanupController {
  constructor(private readonly cleanupService: CleanupService) {}

  // Получить статистику очистки
  @Get('stats')
  async getStats() {
    return this.cleanupService.getCleanupStats();
  }

  // Проверить здоровье сервиса
  @Get('health')
  async getHealth() {
    return this.cleanupService.healthCheck();
  }

  // Запустить очистку вручную
  @Post('manual')
  @HttpCode(HttpStatus.OK)
  async manualCleanup() {
    await this.cleanupService.manualCleanup();
    return { 
      message: 'Manual cleanup triggered successfully',
      timestamp: new Date().toISOString()
    };
  }

  // Сбросить статистику
  @Delete('stats')
  @HttpCode(HttpStatus.OK)
  async resetStats() {
    this.cleanupService.resetStats();
    return { 
      message: 'Stats reset successfully',
      timestamp: new Date().toISOString()
    };
  }

  // Получить информацию о системе
  @Get('system')
  async getSystemInfo() {
    return {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      timestamp: new Date().toISOString(),
    };
  }
}
