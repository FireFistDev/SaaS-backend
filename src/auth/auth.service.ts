import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CompanyService } from 'src/company/company.service';
import * as bcrypt from 'bcrypt'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/auth.dto';
import { SubscriptionPlans } from 'src/subscription/entities/subscription.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { PrismaService } from '@app/prisma';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import * as nodemailer from 'nodemailer'
import { Company, User } from '@prisma/client';
import { UpdateCompanyDto } from 'src/company/dto/update-company.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
@Injectable()
export class AuthService {
    private transporter: nodemailer.Transporter;
    constructor(private jwtService: JwtService, private companyService: CompanyService, private userService: UserService, private prismaService: PrismaService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true,
            auth : {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            }
          })
    }

    // კომპანიის რეგისტრაციისს სერვისი და პაროლის დაჰაშვა
    async registerCompany(createCompanyDto: CreateCompanyDto): Promise<any> {
        try {

            let passwordHash = await bcrypt.hash(createCompanyDto.passwordHash, 10)

            const Company = await this.companyService.create({ ...createCompanyDto, passwordHash })

            const token = this.jwtService.sign(Company);

            const link  = `auth/activate/company?token=${token}`

             this.sendActivationEmail(link ,Company.email)
             return  {company : Company , link,}
        } catch (error) {
            throw new HttpException({
                error: 'Failed to register company',
                message: error.message.split('\n').reverse()[0],
            }, HttpStatus.BAD_REQUEST);
        }
    }


    //  კომპანიის აქტივაცი 
    async activateCompany(Company :  Company) {
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
    async loginCompany(LoginDto : LoginDto) {
        try {
            const company = await this.companyService.FindOne(LoginDto.email)
            if (!company.isActive) throw new Error('active your account');
            const comparePassword = await bcrypt.compare(LoginDto.password, company.passwordHash)
            if (!comparePassword) throw new Error('wrong Password');
            return  this.jwtService.sign(company)
        } catch (error) {
            throw new HttpException({
                error: 'Failed to  Login in Company profile',
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
        
        const { maxUsers ,UserPrice  } = SubscriptionPlans[company.subscription];
        const currentUserCount = company.workers.length;

        if (currentUserCount >= maxUsers) {
            throw new HttpException('Maximum user limit reached for the current subscription plan', HttpStatus.BAD_REQUEST);
        }
        if (company.subscription === 'BasicTier') {
            this.companyService.updateBilling(companyId, -UserPrice)
        }
        const user = await this.userService.create(createUserDto)
        const token = this.jwtService.sign(user, { secret: process.env.JWT_SECRET_STRING });

        const link  = `auth/activate/user?token=${token}`
        this.sendActivationEmail(link ,user.email)
        return token
    }


    // თანამშრომლის აქტივაცია
    async activateUser(user: User, updateUserDto: UpdateUserDto) {
        try {
            let passwordHash = await bcrypt.hash(updateUserDto.passwordHash, 10);

            return this.userService.update(user.id, { passwordHash });
        } catch (error) {
            throw new HttpException({
                error: 'Failed to activate User',
                message: error.message.split('\n').reverse()[0], 
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


    async sendActivationEmail(link : string , email : string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_FROM, // sender address
            to: email, // list of receivers
            subject: 'Activate your account', // Subject line
            html: `<p>Please click <a href="${process.env.BASE_URL}/${link}">here</a> to activate your account.</p>`
        };
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return 'Error sending email:'
            } else {
                return 'Activation email sent:'
            }
        });
    }
    

}
