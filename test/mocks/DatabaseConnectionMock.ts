/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */

interface IResponse {
  err: Error | null;
  row: any;
  rows?: any[];
}

export class DatabaseConnectionMock {
  constructor(private response: IResponse) {}

  get = (
    _params: any,
    callback?: ((err: Error | null, row: any) => void) | undefined
  ): this => {
    if (callback) callback(this.response.err, this.response.row);
    return this;
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

  close = () => {};
}
