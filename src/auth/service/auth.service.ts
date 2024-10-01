import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { UsersService } from '../../users/service/users.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async register({ email, password }: RegisterDto, res: Response) {
        const hashedPassword = await hash(password);
        const createdUser = await this.usersService.create({
            email,
            hashedPassword,
        });
        return await this.generateToken(createdUser.id, res);
    }

    async validateUser(email: string, password: string) {
        const existingUserByEmail = await this.usersService.findOne({ email });

        if (!existingUserByEmail) {
            return null;
        }

        if (!existingUserByEmail.hashedPassword) {
            throw new BadRequestException(
                'Probably you already have an account via google.',
            );
        }

        const isValidPassword = await verify(
            existingUserByEmail.hashedPassword,
            password,
        );

        if (!isValidPassword) {
            return null;
        }

        return existingUserByEmail;
    }

    async googleAuth(email: string, res: Response) {
        const existingUserByEmail = await this.usersService.findOne({ email });

        if (existingUserByEmail) {
            return await this.generateToken(existingUserByEmail.id, res);
        }

        const createdUser = await this.usersService.create({ email });

        return await this.generateToken(createdUser.id, res);
    }

    async generateToken(userId: number, res: Response) {
        const accessToken = await this.jwtService.signAsync(
            { userId },
            {
                secret: this.configService.getOrThrow('JWT_SECRET'),
                expiresIn: this.configService.getOrThrow('JWT_EXPIRES'),
            },
        );

        const refreshToken = await this.jwtService.signAsync(
            { userId },
            {
                secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES'),
            },
        );

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true,
        });

        return accessToken;
    }
}
