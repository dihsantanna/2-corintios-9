import { toFloat, toInteger } from '../../helpers/ValueTransform';
import {
  IWithdrawToTheBankAccount,
  IWithdrawToTheBankAccountState,
} from '../../@types/WithdrawToTheBankAccount';
import { idGenerator } from '../../helpers/idGenerator';
import { DatabaseConnection } from '../DatabaseConnection';
import {
  createQuery,
  deleteQuery,
  findAllByReferenceDateQuery,
  updateQuery,
} from './queries/withdrawToTheBankAccount';

export class WithdrawToTheBankAccount {
  private id = idGenerator;

  constructor(private db = new DatabaseConnection()) {}

  create = async ({
    value,
    referenceMonth,
    referenceYear,
  }: IWithdrawToTheBankAccount) => {
    return new Promise<void>((resolve, reject) => {
      const id = this.id();
      this.db.run(
        createQuery,
        {
          $id: id,
          $value: toInteger(value),
          $referenceMonth: referenceMonth,
          $referenceYear: referenceYear,
        },
        (err) => {
          if (err) reject(err);
          resolve();
        },
      );
    });
  };

  findAllByReferenceDate = async (
    referenceMonth: number,
    referenceYear: number,
  ) => {
    return new Promise<IWithdrawToTheBankAccountState[]>((resolve, reject) => {
      this.db.all(
        findAllByReferenceDateQuery,
        {
          $referenceMonth: referenceMonth,
          $referenceYear: referenceYear,
        },
        (err, rows: IWithdrawToTheBankAccountState[]) => {
          if (err) reject(err);
          resolve(rows.map((row) => ({ ...row, value: toFloat(row.value) })));
        },
      );
    });
  };

  update = async ({
    id,
    value,
    referenceMonth,
    referenceYear,
  }: IWithdrawToTheBankAccountState) => {
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        updateQuery,
        {
          $id: id,
          $value: toInteger(value),
          $referenceMonth: referenceMonth,
          $referenceYear: referenceYear,
        },
        (err) => {
          if (err) reject(err);
          resolve();
        },
      );
    });
  };

  delete = async (id: string) => {
    return new Promise<void>((resolve, reject) => {
      this.db.run(deleteQuery, [id], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  };
}
