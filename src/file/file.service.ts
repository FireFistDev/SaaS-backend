import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { PrismaService } from '@app/prisma';
import { SubscriptionPlans } from 'src/subscription/entities/subscription.entity';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class FileService {

  constructor(private prismaService: PrismaService ,  private companyService : CompanyService) { }


  async create(createFileDto: CreateFileDto) {
    try {
      createFileDto.visibleForWorkers = [Number(createFileDto.visibleForWorkers)];
      const { companyId } = createFileDto;

      const company = await this.prismaService.company.findUnique({
        where: { id: companyId },
        include: { companyFiles : true }
        });
  
      if (!company || !company.subscription) {
        throw new HttpException('Company subscription not found', HttpStatus.BAD_REQUEST);
      }
      
      const { maxFile } = SubscriptionPlans[company.subscription];
      const currentFilesCount = company.companyFiles.length;
  
      const isPremiumTier = company.subscription === 'PremiumTier';

      // If maximum file count is reached and the user is not on premium tier, throw exception
      if (currentFilesCount >= maxFile && !isPremiumTier) {
          throw new HttpException('Maximum File limit reached for the current subscription plan', HttpStatus.BAD_REQUEST);
      }
  
      // If maximum file count is reached and the user is on premium tier, update billing and continue to create new file
      if (currentFilesCount >= maxFile && isPremiumTier) {
          await this.companyService.updateBilling(companyId, -0.5);
      }

      return await this.prismaService.uploadedFile.create({
        data: {
          ...createFileDto,
          visibleForWorkers: {
            connect:  createFileDto.visibility  !== "Public" ? createFileDto.visibleForWorkers.map(id => ({ id : +id }))  :  []
          }
        }
      })
    } catch (error) {
      throw new HttpException({
        error: 'Failed to Upload File',
        message: error.message.split('\n').reverse()[0], 
      }, HttpStatus.BAD_REQUEST);
    }
  }


   async findAll(companyId: number) {
    try {
      return await  this.prismaService.uploadedFile.findMany({ where: { companyId  }, include: { visibleForWorkers: { select: { id: true, name: true } } } })
    } catch (error) {
      throw new HttpException({
        error: 'Failed to Find Files',
        message: error.message.split('\n').reverse()[0], 
      }, HttpStatus.BAD_REQUEST);
    }
  }

    async findUserFiles(companyId: number , userId : number) {
    try {
      const PublicFiles =  await this.prismaService.uploadedFile.findMany({ where: { companyId , visibility : "Public" }, include: { visibleForWorkers: { select: { id: true, name: true } } } })
      const visibleForWorkers = await  this.prismaService.user.findUnique({where: { id : userId , }, include : { visibleFiles : true}})
      const allVisibleFiles = [
        ...PublicFiles,
        ...visibleForWorkers.visibleFiles
      ];
      return allVisibleFiles
    } catch (error) {
      throw new HttpException({
        error: 'Failed to Find Files',
        message: error.message.split('\n').reverse()[0], 
      }, HttpStatus.BAD_REQUEST);
    }
  }


  update(id: string, updateFileDto: UpdateFileDto) {
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


  
  findOne(id: string) {
    try {
      return this.prismaService.uploadedFile.findUnique({ where: { id } })
    } catch (error) {
      throw new HttpException({
        error: 'Failed to remove Files',
        message: error.message.split('\n').reverse()[0], // You can customize the error message here
      }, HttpStatus.BAD_REQUEST);
    }
  }


  remove(id: string) {
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
