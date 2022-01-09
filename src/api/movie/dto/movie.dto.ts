import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNotIn, IsNumber, IsString } from 'class-validator';
import { SuccessResponseDto } from 'src/shared/dto/success.dto';

export class MovieBodyDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotIn([0])
  year: number;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  rating: string;
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
