import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { PrismaService } from '@app/prisma';
import { Visibility } from '@prisma/client';

@Injectable()
export class FileService {

  constructor(private prismaService: PrismaService) { }


  async create(createFileDto: CreateFileDto) {
    try {
      return await this.prismaService.uploadedFile.create({
        data: {
          ...createFileDto,
          visibleForWorkers: {
            connect:  createFileDto.visibility  === "Public" ? createFileDto.visibleForWorkers.map(id => ({ id }))  :  []
          }
        }
      })
    } catch (error) {
      throw new HttpException({
        error: 'Failed to Upload File',
        message: error.message.split('\n').reverse()[0], // You can customize the error message here
      }, HttpStatus.BAD_REQUEST);
    }
  }


  findAll(companyId: number) {
    try {
      return this.prismaService.uploadedFile.findMany({ where: { companyId }, include: { visibleForWorkers: { select: { id: true, name: true } } } })
    } catch (error) {
      throw new HttpException({
        error: 'Failed to Find Files',
        message: error.message.split('\n').reverse()[0], // You can customize the error message here
      }, HttpStatus.BAD_REQUEST);
    }
  }




  update(id: number, updateFileDto: UpdateFileDto) {
    try {
      return this.prismaService.uploadedFile.update({
        where: { id }, data: {
          ...updateFileDto,
          visibleForWorkers: {
            [updateFileDto.visibility !== "Public" ? 'connect' : 'set']: 
              updateFileDto.visibleForWorkers?.map(id => ({ id })) ?? []
          }
        }
      })
    } catch (error) {
      throw new HttpException({
        error: 'Failed to update Files',
        message: error.message.split('\n').reverse()[0], // You can customize the error message here
      }, HttpStatus.BAD_REQUEST);
    }
  }

  
  
  findOne(id: number) {
    try {
      return this.prismaService.uploadedFile.findUnique({ where: { id } })
    } catch (error) {
      throw new HttpException({
        error: 'Failed to remove Files',
        message: error.message.split('\n').reverse()[0], // You can customize the error message here
      }, HttpStatus.BAD_REQUEST);
    }
  }


  remove(id: number) {
    try {
      return this.prismaService.uploadedFile.delete({ where: { id } })
    } catch (error) {
      throw new HttpException({
        error: 'Failed to remove Files',
        message: error.message.split('\n').reverse()[0], // You can customize the error message here
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
