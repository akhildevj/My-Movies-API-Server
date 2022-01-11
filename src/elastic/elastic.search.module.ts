import { Module } from '@nestjs/common';
import { ElasticSearchService } from './elastic.search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigType } from '@nestjs/config';
import configuration from '../config/configuration';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigType<typeof configuration>) => ({
        node: config.elastic.host,
        // auth: {
        //   username: config.elastic.username,
        //   password: config.elastic.password,
        // },
      }),
      inject: [configuration.KEY],
    }),
  ],

  providers: [ElasticSearchService],
  exports: [ElasticSearchService],
})
export class ElasticSearchModule {}
