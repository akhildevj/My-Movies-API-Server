import { Module } from '@nestjs/common';
import { pgConnectionFactory } from './database.provider';
import { DatabaseService } from './database.service';

@Module({
  providers: [pgConnectionFactory, DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
