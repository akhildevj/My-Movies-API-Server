import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsString,
} from 'class-validator';
import { SuccessResponseDto } from 'src/shared/dto/success.dto';

export class MovieBodyDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  overview: string;

  @ApiProperty()
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  releaseDate: Date;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotIn([0])
  voteAverage: number;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  posterPath: string;
}

export class MovieDto extends MovieBodyDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}

export class MovieResponseDto extends SuccessResponseDto {
  @ApiProperty({ type: [MovieDto] })
  data: MovieDto[];
}

export class MovieCountResponseDto extends MovieResponseDto {
  @ApiProperty()
  @IsNumber()
  totalCount: number;
}

export class MovieEsSourceDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  overview: string;

  @ApiProperty()
  release_date: Date;

  @ApiProperty()
  vote_average: number;

  @ApiProperty()
  poster_path: string;
}

export class MovieEsResponseDto {
  @ApiProperty({ type: MovieEsSourceDto })
  _source: MovieEsSourceDto;
}
