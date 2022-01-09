import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { concatMap, map, Observable } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';
import { createUserQuery, findUserQuery } from './db-queries/auth-query';
import { SuccessResponseDto } from 'src/shared/dto/success.dto';
import {
  LoginBodyDto,
  SignupBodyDto,
  SignupResponseDto,
  UserDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private db: DatabaseService<any>) {}

  login(
    body: LoginBodyDto,
  ): Observable<SuccessResponseDto | Record<null, null>> {
    const { email } = body;

    // Find user by email
    return this.db.rawQuery(findUserQuery, [email], UserDto).pipe(
      map(([row]) => {
        if (!row) throw new UnauthorizedException('Email not registered');
        return { success: true, message: `Welcome ${row.name}` };
      }),
    );
  }

  signup(
    body: SignupBodyDto,
  ): Observable<SignupResponseDto | Record<null, null>> {
    const { name, email } = body;

    // Checks user already exists
    return this.db.rawQuery(findUserQuery, [email], UserDto).pipe(
      concatMap(([row]) => {
        if (row) throw new BadRequestException('Email already registered');

        // Creates new user
        return this.db.rawQuery(createUserQuery, [name, email], UserDto).pipe(
          map(([data]) => {
            return { success: true, message: 'Succesfully created user', data };
          }),
        );
      }),
    );
  }
}
