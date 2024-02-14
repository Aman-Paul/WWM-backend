import { Module } from '@nestjs/common';
import { Policies } from './policies';

@Module({
  providers: [Policies]
})
export class PoliciesModule {}
