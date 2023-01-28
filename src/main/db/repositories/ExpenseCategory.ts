import { DatabaseConnection } from '../DatabaseConnection';
import { createQuery } from './queries/expenseCategory';
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
}
