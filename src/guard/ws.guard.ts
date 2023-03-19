import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwksClient = require('jwks-rsa');

const getKey = (header, callback) => {
  const client = jwksClient({
    jwksUri: 'http://103.154.251.109:9011/.well-known/jwks.json',
    requestHeaders: {}, // Optional
    timeout: 30000, // Defaults to 30s
  });
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

@Injectable()
export class WsGuard implements CanActivate {
  constructor() {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    return new Promise(function (resolve, reject) {
      jwt.verify(bearerToken, getKey, function (err, decoded) {
        console.log({ decoded });
        context.switchToHttp().getRequest().userId = decoded.sub;
        context.switchToHttp().getRequest().userPhone =
          decoded['preferred_username'];
        if (err) resolve(false);
        resolve(true);
      });
    });
  }
}
