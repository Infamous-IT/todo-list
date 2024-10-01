import {
    Controller,
    Post,
    Body,
    Res,
    UseGuards,
    ParseIntPipe,
    Get,
    Req,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../utils/decorators/current-user.decorator';
import { GoogleGuard } from '../guards/google.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(
        @Body() registerDto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.register(registerDto, res);
    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(
        @CurrentUser('id', ParseIntPipe) userId: number,
        @Res({ passthrough: true }) res: Response,
    ) {
        return await this.authService.generateToken(userId, res);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh-token')
    async refresh(
        @CurrentUser('id', ParseIntPipe) userId: number,
        @Res({ passthrough: true }) res: Response,
    ) {
        return await this.authService.generateToken(userId, res);
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.cookie('refreshToken', '');
    }

    @UseGuards(GoogleGuard)
    @Get('google')
    google() {}

    @UseGuards(GoogleGuard)
    @Get('google/callback')
    async googleCallback(
        @Req() req: Request & { user: { _json: { email: string } } },
        @Res({ passthrough: true }) res: Response,
    ) {
        return await this.authService.googleAuth(req.user._json.email, res);
    }
}
