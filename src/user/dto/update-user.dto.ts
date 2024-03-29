import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsEmail } from 'class-validator';
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    name?: string;
  
    @IsOptional()
    @IsEmail()
    email?: string;
    @IsOptional()
    passwordHash? : string
}
