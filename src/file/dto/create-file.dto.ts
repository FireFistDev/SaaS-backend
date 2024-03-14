import { Visibility } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  filename: string;

  @IsNotEmpty()
  filePath: string;

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
