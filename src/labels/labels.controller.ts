import { Controller, Get, UseGuards } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard)
@Controller('labels')
export class LabelsController {
    constructor(private labelService: LabelsService){}

    @Get('all')
    getAllLabels() {
        return this.labelService.getAllLabels();
    }
}
