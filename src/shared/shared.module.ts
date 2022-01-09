import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UtilsService } from 'src/utils/utils.service';
import { SbLoggerModule } from './sb-logger/sb-logger.module';

@Module({
  imports: [DatabaseModule, SbLoggerModule],
  providers: [UtilsService],
  exports: [DatabaseModule, SbLoggerModule, UtilsService],
})
export class SharedModule {}
