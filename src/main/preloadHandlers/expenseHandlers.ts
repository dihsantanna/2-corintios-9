import { ipcMain } from 'electron';
import { Expense } from '../db/repositories/Expense';
import { IExpense } from '../@types/Expense';

export const expenseHandlers = () => {
  ipcMain.handle('expense:create', (_event, expense) => {
    const model = new Expense();
    model.create(expense as IExpense);
  });
};
