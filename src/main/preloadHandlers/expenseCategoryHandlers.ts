import { ipcMain } from 'electron';
import { ExpenseCategory } from '../db/repositories/ExpenseCategory';
import { IExpenseCategory } from '../@types/ExpenseCategory';

export const expenseCategoryHandlers = () => {
  ipcMain.handle('expenseCategory:create', (_event, expenseCategory) => {
    const model = new ExpenseCategory();
    model.create(expenseCategory as IExpenseCategory);
  });

  ipcMain.handle('expenseCategory:findAll', async () => {
    const model = new ExpenseCategory();
    return model.findAll();
  });
};
