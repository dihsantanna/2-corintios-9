import { IBalance } from 'main/@types/Balance';
import { toFloat, toInteger } from '../../helpers/ValueTransform';
import { DatabaseConnection } from '../DatabaseConnection';
import { createOrUpdateQuery, getQuery } from './queries/balance';

export class InitialBalance {
  constructor(private db = new DatabaseConnection()) {
    //
  }

  get = async () => {
    return new Promise<IBalance>((resolve, reject) => {
      this.db.get(getQuery, (err, row: any) => {
        if (err) reject(err);
        resolve({
          ...row,
          value: toFloat(row.value),
        });
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
          $value: toInteger(value),
          $referenceMonth: referenceMonth,
          $referenceYear: referenceYear,
        },
        (err) => {
          if (err) reject(err);
          resolve();
        },
      );
    }).finally(() => this.db.close());
  };
}
