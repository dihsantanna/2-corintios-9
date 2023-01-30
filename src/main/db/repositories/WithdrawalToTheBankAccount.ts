import {
  IWithdrawalToTheBankAccount,
  IWithdrawalToTheBankAccountState,
} from '../../@types/WithdrawalToTheBankAccount';
import { idGenerator } from '../../helpers/idGenerator';
import { DatabaseConnection } from '../DatabaseConnection';
import {
  createQuery,
  deleteQuery,
  findAllByReferenceDateQuery,
  updateQuery,
} from './queries/withdrawalsToTheBankAccount';

export class WithdrawalToTheBankAccount {
  private id = idGenerator;

  constructor(private db = new DatabaseConnection()) {}

  create = async ({
    value,
    referenceMonth,
    referenceYear,
  }: IWithdrawalToTheBankAccount) => {
    return new Promise<void>((resolve, reject) => {
      const id = this.id();
      this.db.run(
        createQuery,
        {
          $id: id,
          $value: value,
          $referenceMonth: referenceMonth,
          $referenceYear: referenceYear,
        },
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  };

  findAllByReferenceDate = async (
    referenceMonth: number,
    referenceYear: number
  ) => {
    return new Promise<IWithdrawalToTheBankAccountState[]>(
      (resolve, reject) => {
        this.db.all(
          findAllByReferenceDateQuery,
          {
            $referenceMonth: referenceMonth,
            $referenceYear: referenceYear,
          },
          (err, rows) => {
            if (err) reject(err);
            resolve(rows);
          }
        );
      }
    );
  };

  update = async ({
    id,
    value,
    referenceMonth,
    referenceYear,
  }: IWithdrawalToTheBankAccountState) => {
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        updateQuery,
        {
          $id: id,
          $value: value,
          $referenceMonth: referenceMonth,
          $referenceYear: referenceYear,
        },
        (err) => {
          if (err) reject(err);
          resolve();
        }
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
