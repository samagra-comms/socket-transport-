import { CanActivate, Injectable, Logger, Scope } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwksClient = require('jwks-rsa');

@Injectable({ scope: Scope.DEFAULT })
export class WsGuard implements CanActivate {
  private logger: Logger = new Logger('WSGuard');
  private client: any;
  private getKey: any;
  

  constructor() {
    this.client = jwksClient({
      jwksUri: process.env.JWKS_URI,
      requestHeaders: {}, // Optional
      timeout: 30000, // Defaults to 30s
    });
  
    this.getKey = (header, callback) => {
      console.log('JWT header:', header);
      this.client.getSigningKey(header.kid, function (err, key) {
        if (err) {
          console.error('Error fetching signing key:', err);
        } else {
          const signingKey = key.publicKey || key.rsaPublicKey;
          callback(null, signingKey);
        }
      });
    };
  }

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    this.logger.error(`Trying to authenticate user`, context.args[0].handshake);
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    console.log({bearerToken});
    return new Promise((resolve, reject) => { 
      jwt.verify(bearerToken, this.getKey, (err, decoded) => {
        if (err) {
          console.error('JWT verification error:', err);
          resolve(false);
        }else{
          console.log({ decoded });
          context.args[0].handshake.headers.userId = decoded.sub;
          context.args[0].handshake.headers.userPhone =
            decoded['preferred_username'];
          resolve(true);
        }
       
      });
    });
  }
}
