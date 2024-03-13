import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { FileService } from 'src/file/file.service';
import { Request } from 'express';
import { JwtGuard } from '@app/guard/guard';
import { User } from '@prisma/client';
import { CreateFileDto } from 'src/file/dto/create-file.dto';



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private fileService : FileService) {}


  @UseGuards(JwtGuard)
  @Post("uploadfile")
  uploadFile(@Req()  req : Request){
    const user  = req.user as User;
    const file = req.body 
    const createFile  = { ...file,ownerId: user.id, companyId : user.companyId} as CreateFileDto; 
    return this.fileService.create(createFile)
  }

  @UseGuards(JwtGuard)
  @Post("updatefile/:id")
  updateFile(@Req()  req : Request){
    const fileId = +req.params.id
    const fileData = req.body
    return this.fileService.update(fileId, fileData)
  }
  @Delete("deletefile/:id")
  deleteFile(@Req() req : Request){
    return this.fileService.remove(+req.params.id)
  }


}
