import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
    imports: [UsersModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtRefreshStrategy,
        GoogleStrategy,
        JwtAccessStrategy,
    ],
})
export class AuthModule {}
