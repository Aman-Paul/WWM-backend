import {
    Controller,
    Post,
    Get,
    Req,
    UploadedFile,
    UseInterceptors,
    UseGuards,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { s3Service } from './s3bucket.service';
import { JwtGuard } from 'src/auth/guard';
import { Request } from 'express';
  
  @UseGuards(JwtGuard)
  @Controller('file')
  export class s3Bucket{
    constructor(private readonly appService: s3Service) {}
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      return this.appService.uploadFile(file, req.user);
    }

    
}
  