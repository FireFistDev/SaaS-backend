import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class CompanyGuard extends AuthGuard('company') {}


@Injectable()
export class userGuard extends AuthGuard('user') {}