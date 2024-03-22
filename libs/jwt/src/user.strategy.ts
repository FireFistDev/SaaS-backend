// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class userStrategy extends PassportStrategy(Strategy, 'user') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        userStrategy.extractFromAuthHeader,
        userStrategy.extractFromQueryParam,
      ]),
      secretOrKey: process.env.JWT_SECRET_STRING,
    });
  }
  private static extractFromAuthHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return null;
  }
  private static extractFromQueryParam(req: Request): string | null {
    const token = req.query.token;
    return token?.toString() || null;
  }


  async validate(payload: User) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    
    return payload;
  }
}