import { IBalance } from 'main/@types/Balance';
import { DatabaseConnection } from '../DatabaseConnection';
import { createOrUpdateQuery, getQuery } from './queries/balance';

export class InitialBalance {
  constructor(private db = new DatabaseConnection()) {}

  get = async () => {
    return new Promise<IBalance>((resolve, reject) => {
      this.db.get(getQuery, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    }).finally(() => this.db.close());
  };

  createOrUpdate = async ({
    value,
    referenceMonth,
    referenceYear,
  }: IBalance) => {
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        createOrUpdateQuery,
        {
          $value: value,
          $referenceMonth: referenceMonth,
          $referenceYear: referenceYear,
        },
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    }).finally(() => this.db.close());
  };
}
