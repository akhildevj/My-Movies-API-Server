import { Module } from '@nestjs/common';
import { SbLogger } from './sb-logger.service';

@Module({
  imports: [],
  providers: [SbLogger],
  exports: [SbLogger],
})
export class SbLoggerModule {}
