import { Module } from '@nestjs/common';
import { s3Bucket } from './s3bucket.controller';
import { s3Service } from './s3bucket.service';

@Module({
    controllers: [s3Bucket],
    providers: [s3Service]
})
export class S3bucketModule {}
