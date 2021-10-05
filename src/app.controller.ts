import { Controller, Logger, Post, Request } from '@nestjs/common';
import { SocketGateway } from './socket/socket.gateway';

@Controller('botMsg')
export class AppController {
  private logger: Logger = new Logger('AppController');

  constructor(private readonly wsg: SocketGateway) {}

  @Post('/adapterOutbound')
  adapterOutbound(@Request() req) {
    try {
      this.logger.log('Received Response from Adapter');
      const { botResponse, job } = req.body;
      this.wsg.server
        .to(job.to)
        .emit('botResponse', { content: botResponse, from: job.to });
      return { status: 'OK' };
    } catch (error) {
      this.logger.error('Error while emitting bot response', error);
    }
  }
}
