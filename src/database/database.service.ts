import { Inject, Injectable, Logger, Type } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Pool } from 'pg';
import { from, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { POSTGRES_CONNECTION } from './database.constants';
import {
  DatabaseInterface,
  QueryParams,
  TransactionQuery,
} from './interfaces/database.interface';
import { DbExceptionError } from '../errors/db-exception.error';

@Injectable()
export class DatabaseService<T> implements DatabaseInterface<T> {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@Inject(POSTGRES_CONNECTION) private pool: Pool) {}

  private static isArray(a: Array<any>): boolean {
    return !!a && a.constructor === Array;
  }

  private static isObject(a: Record<string, any>): boolean {
    return !!a && a.constructor === Object;
  }

  private runQuery(
    query: string,
    params: any[],
    type: Type<T>,
    camelCase = true,
  ): Observable<T[]> {
    const start = Date.now();
    return from(this.pool.query(query, params)).pipe(
      tap((qRes: any) => {
        this.logger.debug({
          query,
          time: Date.now() - start,
          rows: qRes.rowCount,
        });
      }),
      map((qRes: any) =>
        qRes.rows
          .map((row: any) =>
            camelCase ? this.underScoreToCamelCase(row) : row,
          )
          .map((row: any) => plainToClass(type, row)),
      ),
      catchError((err) => {
        this.logger.debug({
          query,
          time: Date.now() - start,
        });
        this.logger.error(err);
        throw new DbExceptionError(err, err.message);
      }),
    );
  }

  private underScoreToCamelCase(
    record: Record<string, any>,
  ): Record<string, any> {
    const newObj = {};
    Object.keys(record).forEach((key) => {
      const origKey = key;
      while (key.indexOf('_') > -1) {
        const _index = key.indexOf('_');
        const nextChar = key.charAt(_index + 1);
        key = key.replace(`_${nextChar}`, nextChar.toUpperCase());
      }
      if (
        DatabaseService.isArray(record[origKey]) &&
        !record[origKey].every((i) => typeof i === 'string')
      ) {
        record[origKey] = record[origKey].map((obj: Record<string, any>) => {
          return this.underScoreToCamelCase(obj);
        });
      }

      if (DatabaseService.isObject(record[origKey])) {
        record[origKey] = this.underScoreToCamelCase(record[origKey]);
      }

      newObj[key] = record[origKey];
    });
    return newObj;
  }

  query(params: QueryParams, type: Type<T>): Observable<T[]> {
    if (!params.query) {
      params.query = '* ';
    }

    let dbQuery = `SELECT ${params.query}
                   FROM ${params.table}`;

    if (params.join) {
      dbQuery = `${dbQuery} ${params.join}`;
    }

    if (params.where) {
      dbQuery = `${dbQuery} WHERE ${params.where}`;
    }

    if (params.order) {
      dbQuery = `${dbQuery} ORDER BY ${params.limit}`;
    }

    if (params.limit) {
      dbQuery = `${dbQuery} LIMIT ${params.limit}`;
    }

    if (params.offset) {
      dbQuery = `${dbQuery} OFFSET ${params.offset}`;
    }

    return this.runQuery(dbQuery, params.variables, type);
  }

  insert(params: QueryParams, type: Type<T>): Observable<T[]> {
    const query =
      'INSERT INTO ' +
      params.table +
      ' (' +
      params.query +
      ') VALUES (' +
      params.where +
      ') RETURNING *;';
    return this.runQuery(query, params.variables, type);
  }

  update(params: QueryParams, type: Type<T>): Observable<T[]> {
    const query =
      'UPDATE ' +
      params.table +
      ' SET ' +
      params.query +
      ' WHERE ' +
      params.where +
      ' RETURNING *;';
    return this.runQuery(query, params.variables, type);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(params: QueryParams): Observable<T[]> {
    const query =
      'DELETE FROM ' + params.table + ' WHERE ' + params.where + ';';
    return this.runQuery(query, params.variables, null);
  }

  rawQuery(
    query: string,
    params: Array<any>,
    type: Type<T>,
    camelCase?: boolean,
  ): Observable<T[]> {
    return this.runQuery(query, params, type, camelCase);
  }

  async transactionQuery(
    transactionQueries: TransactionQuery[],
  ): Promise<void> {
    const start = Date.now();
    try {
      const obs = transactionQueries.map((singleQuery) =>
        this.pool.query(singleQuery.query, singleQuery.params),
      );

      await this.pool.query('BEGIN');
      await Promise.all(obs);
      await this.pool.query('COMMIT');
      return;
    } catch (e) {
      this.logger.debug({
        message: JSON.stringify(transactionQueries),
        time: Date.now() - start,
      });
      this.logger.error(e);
      await this.pool.query('ROLLBACK');
      throw new DbExceptionError(e, e.message);
    }
  }
}
