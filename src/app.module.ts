import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PaymentsModule } from './payments/payments.module';
import configuration from '../config/env/configuration';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatModule } from './chat/chat.module';
import { DATABASE_CONFIG } from "./config/appConstants.json";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    expandVariables: true, // enable expand variables in ".env" file
    load: [configuration],
  }), 
  
  SequelizeModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      dialect: 'mysql',
      host: configService.get(DATABASE_CONFIG).host, 
      port: configService.get(DATABASE_CONFIG).port,
      username: configService.get(DATABASE_CONFIG).username,
      password: configService.get(DATABASE_CONFIG).password,
      database: configService.get(DATABASE_CONFIG).database,
      autoLoadModels: true,
      query: { raw: true },
    }),
    inject: [ConfigService], // Inject ConfigService
  }), AuthModule, UserModule, PaymentsModule, ChatModule]
})
export class AppModule {}

// LabelsModule