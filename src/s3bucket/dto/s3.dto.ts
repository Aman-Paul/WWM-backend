export interface S3UploadDto {
    file: string, 
    bucket: string, 
    name: string, 
    mimetype: string, 
    userId: number
}