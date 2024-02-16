import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './strategy';
import { ConfigService } from '@nestjs/config';
import { ENV_KEYS } from '../config/appConstants.json';
import { users } from '../model/users.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        signOptions: { expiresIn: '30d' },
        secret: configService.get(ENV_KEYS.JWT_SECRET_KEY),
      }),
      inject: [ConfigService],
    }),SequelizeModule.forFeature([users])
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtModule],
})

export class AuthModule {}
