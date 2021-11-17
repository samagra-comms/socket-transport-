import { IoAdapter } from '@nestjs/platform-socket.io';
import { config } from '../config/config';
import { RedisClient } from 'redis';
import { ServerOptions } from 'socket.io';
import { createAdapter } from 'socket.io-redis';
const appConfig = config().app;
const pubClient = new RedisClient({ host: appConfig.redishost, port: appConfig.redisport });
const subClient = pubClient.duplicate();
const redisAdapter = createAdapter({ pubClient, subClient });

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(redisAdapter);
    return server;
  }
}
