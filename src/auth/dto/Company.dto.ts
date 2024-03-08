// create-company.dto.ts
import { IsString, IsEmail, IsNotEmpty, IsOptional, IsAlpha } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

// update-company.dto.ts


export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
