import { Injectable, Req, Res, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_KEYS, AWS_BUCKET_NAME } from '../../config/appConstants.json';

import * as AWS from 'aws-sdk';
import { S3UploadDto } from './dto';

@Injectable()
export class s3Service {

    constructor(private config: ConfigService) {}

  AWS_S3_BUCKET = AWS_BUCKET_NAME;
  s3 = new AWS.S3({
    accessKeyId: this.config.get(ENV_KEYS.AWS_ACCESS_ID),
    secretAccessKey: this.config.get(ENV_KEYS.AWS_SECRET_ID)
  });

  async uploadFile(file, user: any) {
    const { originalname } = file;
    const uplodingData: S3UploadDto =  {
        file: file.buffer,
        bucket: this.AWS_S3_BUCKET,
        name: originalname,
        mimetype: file.mimetype,
        userId: user.id
      }
    return await this.s3_upload(uplodingData);
  }

  async s3_upload(dto: S3UploadDto) {
    const params = {
      Bucket: `${dto.bucket}/${dto.userId}`,
      Key: String(dto.name),
      Body: dto.file,
      ACL: 'public-read',
      ContentType: dto.mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      let s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}