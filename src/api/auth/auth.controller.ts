import { Body, Controller, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/shared/dto/success.dto';
import { LoginBodyDto, SignupBodyDto, SignupResponseDto } from './dto/auth.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginBodyDto })
  @ApiResponse({ type: SuccessResponseDto })
  login(
    @Body() body: LoginBodyDto,
  ): Observable<SuccessResponseDto | Record<null, null>> {
    return this.authService.login(body);
  }

  @Post('signup')
  @ApiBody({ type: SignupBodyDto })
  @ApiResponse({ type: SignupResponseDto })
  signup(
    @Body() body: SignupBodyDto,
  ): Observable<SignupResponseDto | Record<null, null>> {
    return this.authService.signup(body);
  }
}
