import { BadGatewayException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@app/prisma';

@Injectable()
export class UserService {
  constructor(private prismaService :PrismaService){}


  async create(createUserDto: CreateUserDto) {
  try {
    const user = await this.prismaService.user.create({data: createUserDto})
    return user
  } catch (error) {
    throw new HttpException({
      error: 'Failed to Create User',
      message: error.message // You can customize the error message here
    }, HttpStatus.BAD_REQUEST);
  }
  
  }

  async findAll(id:number) {
    try {
      const user = await this.prismaService.user.findMany({where: {companyId:id}})
      return user
    } catch (error) {
      throw new BadGatewayException(error.message)
    }
      
  }

  async findOne(email: string) {
    try {
      return  await this.prismaService.user.findUnique({where:{email }})
    } catch (error) {
      throw new BadGatewayException(error.message)
    }
  }

  async update(userId : number, updateUserDto : UpdateUserDto) {
    try {
      const User = await this.prismaService.user.update({where:{id: userId}, data: {...updateUserDto}})
      return User
    } catch (error) {
      throw new BadGatewayException(error.message)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
