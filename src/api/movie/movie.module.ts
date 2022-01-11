import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { SharedModule } from 'src/shared/shared.module';
import { ElasticSearchModule } from 'src/elastic/elastic.search.module';

@Module({
  imports: [SharedModule, ElasticSearchModule],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
