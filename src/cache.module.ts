import { CacheModule, CACHE_MANAGER, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [CacheModule.register()],
  providers: [
    {
      provide: 'CustomCacheToken',
      useExisting: CACHE_MANAGER,
    },
  ],
  exports: ['CustomCacheToken'],
})
export class CustomCacheModule {}
