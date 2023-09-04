import { User } from 'auth0';
import {
  JwtHeader,
  JwtPayload,
  SigningKeyCallback,
  verify,
} from 'jsonwebtoken';
import { JwksClient, SigningKey } from 'jwks-rsa';
import { environment } from '../environment';
import { managementClient } from '../auth0';
import { Document } from 'mongoose';
import { Request, Response } from 'express';
import { UserService } from './userService';
import { IUser } from '@soundstorm/soundstorm-lib';

export class JwtService {
  private client: JwksClient;

  constructor() {
    this.client = new JwksClient({
      jwksUri: `https://${environment.auth0.domain}/.well-known/jwks.json`,
    });
  }

  private getKey(header: JwtHeader, callback: SigningKeyCallback): void {
    if (!header.kid) throw new Error('No KID found in JWT');

    this.client.getSigningKey(
      header.kid,
      (err: Error | null, key?: SigningKey) => {
        if (err) {
          callback(err);
        } else {
          const signingKey = key?.getPublicKey();
          callback(null, signingKey);
        }
      },
    );
  }

  async validateAccessTokenAndFetchAuth0User(
    frontEndAccessToken: string,
  ): Promise<User> {
    const decoded = await new Promise<JwtPayload | null>((resolve, reject) => {
      verify(
        frontEndAccessToken,
        this.getKey.bind(this),
        { algorithms: ['RS256'] },
        (err, decoded) => {
          if (err) {
            reject(new Error(`Token Verification Failed: ${err.message}`));
          } else {
            resolve(decoded as JwtPayload);
          }
        },
      );
    });

    if (!decoded || !decoded.sub) {
      throw new Error('Invalid token');
    }

    const user = await managementClient.getUser({ id: decoded.sub });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  public async authenticateUser(
    req: Request,
    res: Response,
    next: (dualityUser: Document & IUser, auth0User: User) => void,
  ) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({ message: 'Access token not found' });
    }

    const auth0User =
      await this.validateAccessTokenAndFetchAuth0User(accessToken);
    if (!auth0User.user_id) {
      return res.status(401).json({ message: 'Unable to determine user id' });
    }

    const user = await UserService.getUserByAuth0Id(auth0User.user_id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next(user, auth0User);
  }
}
