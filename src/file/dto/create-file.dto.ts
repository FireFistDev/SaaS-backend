import { Visibility } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty()
  filename: string;

  @IsEnum(Visibility)
  @IsNotEmpty()
  visibility: Visibility;

  @IsNumber()
  @IsNotEmpty()
  ownerId: number;

  @IsNumber()
  @IsNotEmpty()
  companyId: number;
  
  @IsOptional()
  @IsNumber({}, { each: true })
  @ValidateIf(o => o.visibility === Visibility.Private) // Validate only if visibility is private
  visibleForWorkers?: number[] 

}
