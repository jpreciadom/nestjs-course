import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/http-adapters/axios.adapter';

@Module({
  providers: [AxiosAdapter],
  exports: [AxiosAdapter],
})
export class CommonModule {}
