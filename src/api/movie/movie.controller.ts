import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import {
  MovieBodyDto,
  MovieCountResponseDto,
  MovieResponseDto,
} from './dto/movie.dto';
import { MovieService } from './movie.service';
@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Get()
  @ApiResponse({ type: MovieCountResponseDto })
  async findAll(): Promise<MovieCountResponseDto | Record<null, null>> {
    return await this.movieService.findAll();
  }

  @Post()
  @ApiResponse({ type: MovieResponseDto })
  @ApiBody({ type: MovieBodyDto })
  addMovie(
    @Body() body: MovieBodyDto,
  ): Observable<MovieResponseDto | Record<null, null>> {
    return this.movieService.addMovie(body);
  }
}
