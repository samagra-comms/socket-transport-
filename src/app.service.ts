import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { jsonData } from './chatResponses';
@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    private logger: Logger = new Logger('AppService');

    constructor(private httpService: HttpService, private configService: ConfigService) { }

    async requestToAdapter(req, socket) {
        if(this.configService.get('ADAPTER_URL')) {
            this.sendRequestToAdapter(req)
        } else {
            this.getResponseFromLocal(req, socket)
        }
    }

    sendRequestToAdapter(req) {
        const adapterEndpoint = this.configService.get('ADAPTER_URL')
        try {
            const params = JSON.stringify(req);
            this.httpService.post(adapterEndpoint, params, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).subscribe((res) => {
                    console.log("RESPNSE FROM ADAPTER: ", res.data);
                }, (err) => {
                    console.log("RESPNSE FROM ADAPTER: ", err);
                });
            
        } catch (error) {
            if (error) {
                this.logger.log({ msg: `Sending request to adapter failed => ${error.message}` });
            }
        }
    }

    getResponseFromLocal(req, socket) {
        const content = req.content;
        let reply = jsonData['default'];
        if(jsonData[content.body]) {
            reply = jsonData[content.body]
        }
        const resData = {
            job: req,
            botResponse: reply
        } 
        socket.to(resData.job.to).emit('botResponse', {content: resData.botResponse, from: resData.job.to})
    }

    randomId() {
        return uuid()
    }
}
