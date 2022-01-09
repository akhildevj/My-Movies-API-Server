import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  login(): Observable<LoginDto[] | Record<null, null>> {
    return this.authService.login();
  }
}
