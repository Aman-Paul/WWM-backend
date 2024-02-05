import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { LabelsModule } from './labels/labels.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), AuthModule, PrismaModule, UserModule, PaymentsModule]
})
export class AppModule {}

// LabelsModule