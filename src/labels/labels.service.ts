import { Injectable } from '@nestjs/common';

@Injectable()
export class LabelsService {
    constructor() {}

    async getAllLabels() {
     return { msg: 'All the labels.' };
    }
}
