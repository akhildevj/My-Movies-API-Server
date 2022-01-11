import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticSearchService {
  private readonly logger = new Logger(ElasticSearchService.name);

  constructor(private readonly esClient: ElasticsearchService) {}

  public async executeElasticSearch(index: string, body: any) {
    try {
      return await this.esClient.search({ index, body });
    } catch (err) {
      throw err;
    }
  }

  public sortResultBy(query: any, sortObject: any) {
    query.sort.push(sortObject);
  }

  public addMustIncludeFields(esQuery: any, mustArray: any[]) {
    mustArray.map((mustObject) => esQuery.query.bool.must.push(mustObject));
  }

  public addShouldIncludeFields(esQuery: any, shouldArray: any) {
    shouldArray.map((shouldObject) =>
      esQuery.query.bool.filter.push(shouldObject),
    );
  }

  public esBaseQuery(fields: Array<string>) {
    return {
      track_total_hits: true,
      sort: [],
      query: {
        bool: {
          must: [],
          should: [],
          filter: [],
        },
      },
      _source: {
        includes: fields,
      },
    };
  }
}
