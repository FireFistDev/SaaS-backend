import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CompanyService } from 'src/company/company.service';
import * as bcrypt from 'bcrypt'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService, private companyService: CompanyService, private userService: UserService) { }




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