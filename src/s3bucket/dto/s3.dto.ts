export interface S3UploadDto {
    file: any, 
    bucket: string, 
    name: string, 
    mimetype: string, 
    userId: number
}

export interface S3UploadFileDto {
    file: Express.Multer.File,
    user: any
}