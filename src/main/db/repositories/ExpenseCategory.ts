import { DatabaseConnection } from '../DatabaseConnection';
import {
  createQuery,
  deleteQuery,
  findAllQuery,
  updateQuery,
} from './queries/expenseCategory';
import { idGenerator } from '../../helpers/idGenerator';
import {
  IExpenseCategory,
  IExpenseCategoryState,
} from '../../@types/ExpenseCategory';

export class ExpenseCategory {
  private id = idGenerator;

  constructor(private db = new DatabaseConnection()) {}

  create = async ({ name }: IExpenseCategory) => {
    return new Promise<void>((resolve, reject) => {
      const id = this.id();
      this.db.run(createQuery, [id, name], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).finally(() => this.db.close());
  };

  findAll = async () => {
    return new Promise<IExpenseCategory[]>((resolve, reject) => {
      this.db.all(findAllQuery, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            rows.sort((a, b) =>
              a.name.localeCompare(b.name)
            ) as IExpenseCategory[]
          );
        }
      });
    }).finally(() => this.db.close());
  };

  update = async ({ id, name }: IExpenseCategoryState) => {
    return new Promise<void>((resolve, reject) => {
      this.db.run(updateQuery, [name, id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).finally(() => this.db.close());
  };

  delete = async (id: string) => {
    return new Promise<void>((resolve, reject) => {
      this.db.run(deleteQuery, [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).finally(() => this.db.close());
  };
}
