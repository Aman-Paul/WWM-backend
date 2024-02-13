import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PaymentsModule } from './payments/payments.module';
import { ChatModule } from './chat/chat.module';
import { S3bucketModule } from './s3bucket/s3bucket.module';
import { LabelsModule } from './labels/labels.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), AuthModule, PrismaModule, UserModule, PaymentsModule, ChatModule, S3bucketModule, LabelsModule]
})
export class AppModule {}

// LabelsModule