import { Controller, Get, UseGuards } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('labels')
export class LabelsController {
    constructor(private labelsService: LabelsService){}

    @Get('all')
    getAllLabels() {
        return this.labelsService.getAllLabels();
    }
}
