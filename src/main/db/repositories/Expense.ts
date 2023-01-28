import { DatabaseConnection } from '../DatabaseConnection';
import { createQuery } from './queries/expense';
import { idGenerator } from '../../helpers/idGenerator';
import { IExpense } from '../../@types/Expense';

export class Expense {
  private id = idGenerator;

  constructor(private db = new DatabaseConnection()) {}

  create = ({
    expenseCategoryId,
    title,
    value,
    referenceMonth,
    referenceYear,
  }: IExpense) => {
    const id = this.id();
    this.db.run(createQuery, [
      id,
      expenseCategoryId,
      title,
      value,
      referenceMonth,
      referenceYear,
    ]);
    this.db.close();
  };
}
