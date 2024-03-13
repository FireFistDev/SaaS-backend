import { PartialType } from '@nestjs/mapped-types';
import { CreateFileDto } from './create-file.dto';
import { Visibility } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateIf } from 'class-validator';


export class UpdateFileDto extends PartialType(CreateFileDto) {

    @IsOptional()
    @IsNotEmpty()
    filename?: string;
  
    @IsOptional()
    @IsEnum(Visibility)
    @IsNotEmpty()
    visibility?: Visibility;
  
  
    @IsOptional()
    @IsNumber({}, { each: true })
    @ValidateIf(o => o?.visibility === Visibility.Private)
    visibleForWorkers?: number[];
}
