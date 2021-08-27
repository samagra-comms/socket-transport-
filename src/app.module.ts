import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketGateway } from './socket/socket.gateway';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}
