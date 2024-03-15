import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Company } from '@prisma/client';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class CompanyStrategy extends PassportStrategy(Strategy, 'company')  {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        CompanyStrategy.extractFromAuthHeader,
        CompanyStrategy.extractFromQueryParam,
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

  async validate(payload: Company): Promise<Company> {
    if (!payload || payload.isActive == true || !payload.industry) {
      throw new UnauthorizedException('use Valid compnay token');
    }
    return payload;
  }
}
