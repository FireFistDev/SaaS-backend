import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { Industry } from '@prisma/client';
import { IsOptional, IsString, IsEmail, IsNumber, IsEnum } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @IsOptional()
    isActive?: boolean

    @IsOptional()
    passwordHash?: string;
  
    @IsOptional()
    @IsString()
    country?: string;
  
    @IsOptional()
    @IsNumber()
    billing?: number;
  
    @IsOptional()
    @IsEnum(Industry)
    industry?: Industry;
}
