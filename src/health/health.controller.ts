import { Controller, Get } from '@nestjs/common';
import { Transport, RedisOptions } from '@nestjs/microservices';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { config } from '../config/config';

@Controller('health')
export class HealthController {

    private redisHost;
    private redisPort;
    public appConfig;

    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private microservice: MicroserviceHealthIndicator
      ) {
          this.appConfig = config().app
          this.redisHost = this.appConfig.redishost
          this.redisPort = this.appConfig.redisport
      }
    
      @Get()
      @HealthCheck()
      check() {
        return this.health.check([
          async () =>
          this.microservice.pingCheck<RedisOptions>('redis', {
            transport: Transport.REDIS,
            options: {
              url: `redis://${this.redisHost}:${this.redisPort}`,
            },
          }),
        ]);
      }
}
