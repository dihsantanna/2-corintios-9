import { DatabaseConnection } from '../DatabaseConnection';
import {
  createQuery,
  findAllByReferencesWithCategoryNameQuery,
  updateQuery,
  deleteQuery,
} from './queries/expense';
import { idGenerator } from '../../helpers/idGenerator';
import {
  IExpense,
  IExpenseState,
  IExpenseStateWithCategoryName,
} from '../../@types/Expense';

export class Expense {
  private id = idGenerator;

  constructor(private db = new DatabaseConnection()) {}

  create = async ({
    expenseCategoryId,
    title,
    value,
    referenceMonth,
    referenceYear,
  }: IExpense) => {
    return new Promise<void>((resolve, reject) => {
      const id = this.id();
      this.db.run(
        createQuery,
        [id, expenseCategoryId, title, value, referenceMonth, referenceYear],
        (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        }
      );
    }).finally(() => this.db.close());
  };

  findAllByReferencesWithCategoryName = async (
    referenceMonth: number,
    referenceYear: number
  ) => {
    return new Promise<IExpenseStateWithCategoryName[]>((resolve, reject) => {
      this.db.all(
        findAllByReferencesWithCategoryNameQuery,
        [referenceMonth, referenceYear],
        (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows as IExpenseStateWithCategoryName[]);
        }
      );
    }).finally(() => this.db.close());
  };

  update = async ({ id, expenseCategoryId, title, value }: IExpenseState) => {
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        updateQuery,
        {
          $id: id,
          $expenseCategoryId: expenseCategoryId,
          $title: title,
          $value: value,
        },
        (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        }
      );
    }).finally(() => this.db.close());
  };

  delete = async (id: string) => {
    return new Promise<void>((resolve, reject) => {
      this.db.run(deleteQuery, [id], (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    }).finally(() => this.db.close());
  };
}
