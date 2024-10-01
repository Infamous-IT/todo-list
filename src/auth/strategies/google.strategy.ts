import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
            clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.getOrThrow('GOOGLE_CALLBACK'),
            scope: ['email'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: any,
    ) {
        console.log(profile);
        done(null, profile);
    }
}
