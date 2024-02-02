import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LabelsService {
    constructor(private prisma: PrismaService) {}

    async getAllLabels() {
     return { msg: 'All the labels.' };
    }
}
