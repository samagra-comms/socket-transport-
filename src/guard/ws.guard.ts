import { CanActivate, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwksClient = require('jwks-rsa');

const getKey = (header, callback) => {
  let client = jwksClient({
      jwksUri: process.env.TRANSPORT_SOCKET_JWT_AUTH_URL,
      requestHeaders: {}, // Optional
      timeout: 30000, // Defaults to 30s
  });
  client.getSigningKey(header.kid, function (err, key) {
    if (err || !key || !(key.publicKey || key.rsaPublicKey)) {
      console.error('User could not be resolved!');
      callback(err, null);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

@Injectable()
export class WsGuard implements CanActivate {
  private logger: Logger = new Logger('WSGuard');

  constructor() {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    this.logger.log(`Trying to authenticate user`);
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    return new Promise(function (resolve, reject) {
      jwt.verify(bearerToken, getKey, function (err, decoded) {
        if (err || !decoded || !decoded['sub'] || !decoded['preferred_username']) {
          console.error('User could not be resolved!');
          resolve('User could not be resolved!');
          return;
        }
        console.log(decoded);
        context.args[0].handshake.headers.userId = decoded.sub;
        context.args[0].handshake.headers.userPhone =
          decoded['preferred_username'];
        resolve(true);
      });
    })
    .catch(err => {
      this.logger.error(err);
    });
  }
}
