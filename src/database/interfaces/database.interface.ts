import { Type } from '@nestjs/common';
import { Observable } from 'rxjs';

export interface DatabaseFeatureOptions {
  tableName: string;
}

export interface QueryParams {
  /**
   * The table name
   */
  table: string;
  /**
   * The query string using ? or $1 to mark parameters for a parameterized query
   */
  query: string;
  /**
   * Filtering condition on what to query for
   */
  where?: string;
  /**
   * The values to inject into the query at runtime. Helps guard against SQL Injection
   */
  variables?: any[];

  /**
   * Join operation for queries
   */
  join?: string;

  /**
   * Join operation for queries
   */
  order?: string;

  /**
   * response count limit
   */
  limit?: string;

  /**
   * response offset. from where to start?
   */
  offset?: string;
}

export interface DatabaseInterface<T> {
  /**
   * method specifically for running queries
   * @param params object of string and any array for what query should be run and with what parameters for SQL injection protection
   */
  query(params: QueryParams, type: Type<T>): Observable<T[]>;

  /**
   * Method specifically for running inserts
   * @param params object of string and any array for what query should be run and with what parameters for SQL injection protection
   */
  insert(params: QueryParams, type: Type<T>): Observable<T[]>;

  /**
   * Method specifically for running updates
   * @param params object of string and any array for what query should be run and with what parameters for SQL injection protection
   */
  update(params: QueryParams, type: Type<T>): Observable<T[]>;

  /**
   * Method specifically for running deletes
   * @param params object of string and any array for what query should be run and with what parameters for SQL injection protection
   */
  delete(params: QueryParams): Observable<T[]>;
}

export interface TransactionQuery {
  query: string;
  params: any[];
}
