import { DatabaseConnection } from '../DatabaseConnection';
import { createQuery, findAllQuery } from './queries/expenseCategory';
import { idGenerator } from '../../helpers/idGenerator';
import { IExpenseCategory } from '../../@types/ExpenseCategory';

export class ExpenseCategory {
  private id = idGenerator;

  constructor(private db = new DatabaseConnection()) {}

  create = ({ name }: IExpenseCategory) => {
    const id = this.id();
    this.db.run(createQuery, [id, name]);
    this.db.close();
  };

  findAll = async () => {
    return new Promise<IExpenseCategory[]>((resolve, reject) => {
      this.db.all(findAllQuery, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as IExpenseCategory[]);
        }
      });
    }).finally(() => this.db.close());
  };
}
