import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../utils/types/jwt-payload';
import { UsersService } from '../../users/service/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: (req: Request) => req.cookies['refreshToken'],
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow('JWT_REFRESH_SECRET'),
        });
    }

    async validate({ userId }: JwtPayload) {
        const user = await this.usersService.findOne({ id: userId });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
