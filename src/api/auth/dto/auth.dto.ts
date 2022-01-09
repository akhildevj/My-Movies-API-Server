import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SuccessResponseDto } from 'src/shared/dto/success.dto';

export class LoginBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class SignupBodyDto extends LoginBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UserDto extends SignupBodyDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class SignupResponseDto extends SuccessResponseDto {
  @ApiProperty({ type: [UserDto] })
  data: UserDto[];
}
