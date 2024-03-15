import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { FileService } from 'src/file/file.service';
import { Request } from 'express';
import { userGuard } from '@app/guard/guard';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private fileService : FileService) {}

  @Post("uploadfile")
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(userGuard)
  uploadFile(@UploadedFile() file: Express.Multer.File,@Req()  req : Request){
    const user  = req.user as User;
    const fileInfo = req.body 
    console.log(file , fileInfo)
    const createFile  = { ...fileInfo , id : file.filename, filename : file.originalname, filePath : file.path ,ownerId: user.id , companyId : user.companyId}
    return this.fileService.create(createFile)
  }

  @UseGuards(userGuard)
  @Post("updatefile/:id")
  updateFile(@Req()  req : Request){
    const fileId = req.params.id
    const fileData = req.body
    return this.fileService.update(fileId, fileData)
  }
  @UseGuards(userGuard)
  @Get("getallfiles")
  GetAllFile(@Req()  req : Request){
    const user  = req.user as User;
    return this.fileService.findUserFiles(user.companyId,user.id)
  }

  @UseGuards(userGuard)
  @Delete("deletefile/:id")
  deleteFile(@Req() req : Request){
    return this.fileService.remove(req.params.id)
  }


}
