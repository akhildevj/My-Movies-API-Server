import { ForbiddenException, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';
import { addMovieQuery, findAllMoviesQuery } from './db-queries/movie-query';
import { MovieBodyDto, MovieDto, MovieResponseDto } from './dto/movie.dto';

const FETCH_SUCCESS = 'Succesfully fetched movies';
const MOVIE_EXISTS = 'Movie already exists';
const ADD_SUCCESS = 'Succesfully added movie';

@Injectable()
export class MovieService {
  constructor(private db: DatabaseService<any>) {}

  findAll(): Observable<MovieResponseDto | Record<null, null>> {
    // Returns all movies
    return this.db.rawQuery(findAllMoviesQuery, [], MovieDto).pipe(
      map((data) => {
        return { success: true, message: FETCH_SUCCESS, data };
      }),
    );
  }

  addMovie(
    body: MovieBodyDto,
  ): Observable<MovieResponseDto | Record<null, null>> {
    const { name, year, rating } = body;

    // Adds movie if not exists
    return this.db.rawQuery(addMovieQuery, [name, year, rating], MovieDto).pipe(
      map(([data]) => {
        if (!data) throw new ForbiddenException(MOVIE_EXISTS);
        return { success: true, message: ADD_SUCCESS, data };
      }),
    );
  }
}
