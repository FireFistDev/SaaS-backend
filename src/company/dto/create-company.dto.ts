import { IsString, IsEmail, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Industry } from '@prisma/client';
export class CreateCompanyDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  passwordHash: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsEnum(Industry)
  industry: Industry;

}