import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CompanyService } from 'src/company/company.service';
import * as bcrypt from 'bcrypt'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/auth.dto';
import { SubscriptionPlans } from 'src/subscription/entities/subscription.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { PrismaService } from '@app/prisma';

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService, private companyService: CompanyService, private userService: UserService, private prismaService: PrismaService) { }



    // კომპანიის რეგისტრაციისს სერვისი და პაროლის დაჰაშვა

    async registerCompany(payload: any): Promise<string> {
        try {
            let passwordHash = await bcrypt.hash(payload.passwordHash, 10)
            const Company = await this.companyService.create({ ...payload, passwordHash })
            const token = this.jwtService.sign(Company);
            return this.sentActivationEmail(`localhost:3000/auth/activate/company?token=${token}`)
        } catch (error) {
            throw new HttpException({
                error: 'Failed to register company',
                message: error.message.split('\n').reverse()[0], // You can customize the error message here
            }, HttpStatus.BAD_REQUEST);
        }
    }

    //  კომპანიის აქტივაცი 
    async activateCompany(Company) {
        try {
            return this.companyService.update(Company.id, { isActive: true })
        } catch (error) {
            throw new HttpException({
                error: 'Failed to activate company',
                message: error.message.split('\n').reverse()[0], // You can customize the error message here
            }, HttpStatus.BAD_REQUEST);
        }
    }

    //  შესვლა პროფილზე კომპანიის
    async loginCompany(LoginDto) {
        try {
            const company = await this.companyService.FindOne(LoginDto.email)
            if (!company.isActive) throw new Error('active your account');
            const comparePassword = await bcrypt.compare(LoginDto.password, company.passwordHash)
            if (!comparePassword) throw new Error('wrong Password');
            const token = this.jwtService.sign(company)
            return token
        } catch (error) {
            throw new HttpException({
                error: 'Failed to activate User',
                message: error.message.split('\n').reverse()[0], // You can customize the error message here
            }, HttpStatus.BAD_REQUEST);

        }
    }


    //  კომპანიის თანამშრომლის შექმნა 
    async registerUser(createUserDto: CreateUserDto) {
        const { companyId } = createUserDto;

        const company = await this.prismaService.company.findUnique({
            where: { id: companyId },
            include: { workers: true, }
        });
        if (!company || !company.subscription) {
            throw new HttpException('Company subscription not found', HttpStatus.BAD_REQUEST);
        }
        const { maxUsers } = SubscriptionPlans[company.subscription];
        const currentUserCount = company.workers.length;

        if (currentUserCount >= maxUsers) {
            throw new HttpException('Maximum user limit reached for the current subscription plan', HttpStatus.BAD_REQUEST);
        }
        if (company.subscription === 'BasicTier') {
            this.companyService.updateBilling(companyId, -5)
        }
        const user = await this.userService.create(createUserDto)
        const token = this.jwtService.sign(user, { secret: process.env.JWT_SECRET_STRING });

        return  this.sentActivationEmail(`localhost:3000/auth/activate/user?token=${token}`);
    }


    // თანამშრომლის აქტივაცია
    async activateUser(user, updateUserDto) {
        try {

            let passwordHash = await bcrypt.hash(updateUserDto.password, 10)
            return this.userService.update(user.id, { passwordHash })

        } catch (error) {
            throw new HttpException({
                error: 'Failed to activate User',
                message: error.message.split('\n').reverse()[0], // You can customize the error message here
            }, HttpStatus.BAD_REQUEST);
        }
    }


    //  თანამშრომლის პროფილზე შესვლა 
    async loginUser(LoginDto: LoginDto) {
        try {
            const user = await this.userService.findOne(LoginDto.email)
            const comparePassword = await bcrypt.compare(LoginDto.password, user.passwordHash)
            if (!comparePassword) throw new Error('wrong Password');
            const token = this.jwtService.sign(user)
            return token

        } catch (error) {
            throw new HttpException({
                error: 'Failed to activate User',
                message: error.message.split('\n').reverse()[0], // You can customize the error message here
            }, HttpStatus.BAD_REQUEST);

        }
    }


    sentActivationEmail(token: any): string {
        return token
    }

}
