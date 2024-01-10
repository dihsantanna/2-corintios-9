import { toFloat, toInteger } from '../../helpers/ValueTransform';
import { DatabaseConnection } from '../DatabaseConnection';
import {
  createQuery,
  findAllByReferencesWithCategoryNameQuery,
  updateQuery,
  deleteQuery,
} from './queries/expense';
import { idGenerator } from '../../helpers/idGenerator';
import { IExpense, IExpenseStateWithCategoryName } from '../../@types/Expense';

interface UpdateExpenseParams {
  id: string;
  expenseCategoryId: string;
  title: string;
  value: number;
}

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
      const parsedValue = toInteger(value);
      this.db.run(
        createQuery,
        [
          id,
          expenseCategoryId,
          title,
          parsedValue,
          referenceMonth,
          referenceYear,
        ],
        (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        },
      );
    }).finally(() => this.db.close());
  };

  findAllByReferencesWithCategoryName = async (
    referenceMonth: number,
    referenceYear: number,
  ) => {
    return new Promise<IExpenseStateWithCategoryName[]>((resolve, reject) => {
      this.db.all(
        findAllByReferencesWithCategoryNameQuery,
        [referenceMonth, referenceYear],
        (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(
            rows
              .map((row: any) => ({ ...row, value: toFloat(row.value) }))
              .sort((a, b) => {
                if (a.expenseCategoryName !== b.expenseCategoryName) {
                  return a.expenseCategoryName.localeCompare(
                    b.expenseCategoryName,
                  );
                }
                if (a.title !== b.title) {
                  return a.title.localeCompare(b.title);
                }
                return a.value - b.value;
              }) as IExpenseStateWithCategoryName[],
          );
        },
      );
    }).finally(() => this.db.close());
  };

  update = async ({
    id,
    expenseCategoryId,
    title,
    value,
  }: UpdateExpenseParams) => {
    return new Promise<void>((resolve, reject) => {
      const parsedValue = toInteger(value);
      this.db.run(
        updateQuery,
        {
          $id: id,
          $expenseCategoryId: expenseCategoryId,
          $title: title,
          $value: parsedValue,
        },
        (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        },
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
