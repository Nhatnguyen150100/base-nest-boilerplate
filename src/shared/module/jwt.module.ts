import { Module, DynamicModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
          useFactory: (configService: ConfigService) => ({
            privateKey:
              configService.get<string>('PRIVATE_KEY') || 'privateKey',
            publicKey: configService.get<string>('PUBLIC_KEY') || 'publicKey',
            signOptions: { expiresIn: '1d', algorithm: 'RS256' },
          }),
          inject: [ConfigService],
        }),
      ],
      exports: [JwtModule],
    };
  }
}
