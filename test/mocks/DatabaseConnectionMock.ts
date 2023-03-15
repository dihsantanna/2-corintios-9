/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */

interface IResponse {
  err: Error | null;
  row: any;
  rows?: any[];
  closeErr?: Error | null;
}

export class DatabaseConnectionMock {
  constructor(private response: IResponse) {}

  get = (sql: string, ...rest: any): this => {
    return rest.length === 2
      ? ((
          _sql: any,
          _params: any,
          callback?: (err: Error | null, row: any) => void
        ) => {
          if (callback) callback(this.response.err, this.response.row);
          return this;
        })(sql, rest[0], rest[1])
      : ((_sql: any, callback?: (err: Error | null, row: any) => void) => {
          if (callback) callback(this.response.err, this.response.row);
          return this;
        })(sql, rest[0]);
  };

  run = (
    _sql: string,
    _params: any,
    callback?: ((err: Error | null) => void) | undefined
  ): this => {
    if (callback) callback(this.response.err);
    return this;
  };

  all = (
    _sql: string,
    _params: any,
    callback?: ((err: Error | null, rows: any[]) => void) | undefined
  ): this => {
    if (callback) callback(this.response.err, this.response.rows!);
    return this;
  };

  close = (callback?: (err: Error | null) => void) => {
    if (callback) callback(this.response.closeErr! || null);
  };
}
