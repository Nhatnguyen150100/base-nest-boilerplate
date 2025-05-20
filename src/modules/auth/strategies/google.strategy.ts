import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AppConfig } from '@/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(appConfig: AppConfig) {
    super({
      clientID: appConfig.oAuth2Config.clientId,
      clientSecret: appConfig.oAuth2Config.clientSecret,
      callbackURL: appConfig.oAuth2Config.redirectUrl,
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName: name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name,
      avatar: photos[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
