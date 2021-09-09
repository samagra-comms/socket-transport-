import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    private logger: Logger = new Logger('AppService');

    constructor(private httpService: HttpService, private configService: ConfigService) { }

    async requestToAdapter(req) {
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

    randomId() {
        return uuid()
    }
}
