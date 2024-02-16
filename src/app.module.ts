import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PaymentsModule } from './payments/payments.module';
import configuration from '../config/env/configuration';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    expandVariables: true, // enable expand variables in ".env" file
    load: [configuration],
  }), SequelizeModule.forRoot({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'we_want_more',
    autoLoadModels: true,
    query: {raw: true},
  }), AuthModule, UserModule, PaymentsModule]
})
export class AppModule {}

// LabelsModule