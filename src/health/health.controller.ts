import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, DiskHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const asaasUrl = this.configService.get<string>('ASAAS_API_URL');
    
    return this.health.check([

      
      // Basic memory check
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      
      // Disk storage check
      () => this.disk.checkStorage('disk_health', {
        thresholdPercent: 0.9,
        path: 'C:\\',
      }),

      // API checks - only if URLs are configured
     // ...(asaasUrl ? [() => this.http.pingCheck('asaas-api', `${asaasUrl}/status`)] : []),
    ]);
  }
}