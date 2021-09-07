import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { AppModule } from './app.module';
import { config } from './config/config';

async function bootstrap() {
  const appConfig = config().app;
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  await app.listen(appConfig.port).then(() => console.log(`App is running on ${appConfig.port}`));
}
bootstrap();
