import { Module, DynamicModule, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/app.config';

@Module({
  imports: [ConfigModule],
})
export class MyJwtModule {
  static register(): DynamicModule {
    return {
      module: MyJwtModule,
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            const appConfig = new AppConfig(configService);
            return {
              privateKey: appConfig.authConfig.privateKey,
              publicKey: appConfig.authConfig.publicKey,
              signOptions: {
                expiresIn: appConfig.authConfig.jwtExpirationTime,
                algorithm: 'RS256',
              },
            };
          },
          inject: [ConfigService],
        }),
      ],
      exports: [JwtModule],
    };
  }
}
