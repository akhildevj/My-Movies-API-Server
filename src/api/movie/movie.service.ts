import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { ElasticSearchService } from 'src/elastic/elastic.search.service';
import {
  ELASTIC_MOVIE_COLUMNS,
  ELASTIC_MOVIE_FIELDS,
  ORDER_DESCENDING,
} from 'src/shared/constants';
import { addMovieQuery } from './db-queries/movie-query';
import {
  MovieBodyDto,
  MovieCountResponseDto,
  MovieDto,
  MovieEsResponseDto,
  MovieResponseDto,
} from './dto/movie.dto';

const FETCH_SUCCESS = 'Succesfully fetched movies';
const MOVIE_EXISTS = 'Movie already exists';
const ADD_SUCCESS = 'Succesfully added movie';

@Injectable()
export class MovieService {
  constructor(
    private db: DatabaseService<any>,
    private es: ElasticSearchService,
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
  ) {}

  async findAll(): Promise<MovieCountResponseDto | Record<null, null>> {
    // Gets index from env variable
    const index = this.config.elastic.movieIndex;

    // Gets base query with fields specified
    const baseQuery = this.es.esBaseQuery(ELASTIC_MOVIE_FIELDS);

    // Sort data in descending order
    const sort = { [ELASTIC_MOVIE_COLUMNS.ID]: { order: ORDER_DESCENDING } };
    this.es.sortResultBy(baseQuery, sort);

    // Adds pagination to query
    const esQuery = { ...baseQuery, from: 0, size: 10 };

    // Fetch data and total document count from elasticsearch server
    const esResponse = await this.es.executeElasticSearch(index, esQuery);
    const totalCount: number = this.getTotalDocumentCount(esResponse);

    // Maps the response to required format
    const data: MovieDto[] = this.mapEsResponseToMovieResponse(esResponse);

    // Returns movies
    return { success: true, message: FETCH_SUCCESS, totalCount, data };
  }

  addMovie(
    body: MovieBodyDto,
  ): Observable<MovieResponseDto | Record<null, null>> {
    const { title, overview, releaseDate, voteAverage, posterPath } = body;

    // Adds movie if not exists
    return this.db
      .rawQuery(
        addMovieQuery,
        [title, overview, releaseDate, voteAverage, posterPath],
        MovieDto,
      )
      .pipe(
        map(([data]) => {
          if (!data) throw new ForbiddenException(MOVIE_EXISTS);
          return { success: true, message: ADD_SUCCESS, data };
        }),
      );
  }

  private mapEsResponseToMovieResponse = (esResponse: any) =>
    esResponse.body.hits.hits.map(({ _source: source }: MovieEsResponseDto) => {
      return {
        id: source.id,
        title: source.title,
        overview: source.overview,
        releaseDate: source.release_date,
        voteAverage: source.vote_average,
        posterPath: source.poster_path,
      };
    });

  private getTotalDocumentCount = (esResponse: any) =>
    esResponse.body.hits.total.value;
}
