import { Logger, Provider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Pool } from 'pg';
import { from, lastValueFrom } from 'rxjs';
import { delay, retryWhen, scan, tap } from 'rxjs/operators';
import configuration from '../config/configuration';
import { POSTGRES_CONNECTION } from './database.constants';

export const pgConnectionFactory: Provider = {
  provide: POSTGRES_CONNECTION,
  useFactory: async (config: ConfigType<typeof configuration>) => {
    const logger = new Logger('pgConnectionFactory');
    const pool = new Pool({
      host: config.pg.host,
      database: config.pg.database,
      port: parseInt(config.pg.port, 10),
      user: config.pg.username,
      password: config.pg.password,
    });
    return lastValueFrom(
      from(pool.connect()).pipe(
        retryWhen((e) =>
          e.pipe(
            scan((errorCount: number, error: Error) => {
              logger.warn(
                `Unable to connect to database. ${error.message}. Retrying ${
                  errorCount + 1
                }...`,
              );
              if (errorCount + 1 > 9) {
                throw error;
              }
              return errorCount + 1;
            }, 0),
            delay(1 * 1000),
          ),
        ),
        tap(() => {
          logger.log('Connected to Postgres Database successfully!');
        }),
      ),
    );
  },
  inject: [configuration.KEY],
};
