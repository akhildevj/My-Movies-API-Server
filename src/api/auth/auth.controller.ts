import { Body, Controller, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto): Observable<UserDto | Record<null, null>> {
    return this.authService.login(body);
  }

  @Post('signup')
  signup(@Body() body: SignupDto): Observable<UserDto | Record<null, null>> {
    return this.authService.signup(body);
  }
}
