import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PaymentsModule } from './payments/payments.module';
import configuration from '../config/env/configuration';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    expandVariables: true, // enable expand variables in ".env" file
    load: [configuration],
  }), AuthModule, PrismaModule, UserModule, PaymentsModule]
})
export class AppModule {}

// LabelsModule