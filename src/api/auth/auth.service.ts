import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';
import { LoginDto } from './dto/login.dto';

const query = 'SELECT * FROM users ORDER BY id ASC';

@Injectable()
export class AuthService {
  constructor(private db: DatabaseService<any>) {}

  login(): Observable<LoginDto[] | Record<null, null>> {
    return this.db.rawQuery(query, [], LoginDto);
  }
}
