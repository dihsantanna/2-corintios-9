import { ipcMain } from 'electron';
import { Expense } from '../db/repositories/Expense';
import { IExpense, IExpenseState } from '../@types/Expense';

export const expenseHandlers = () => {
  ipcMain.handle('expense:create', (_event, expense) => {
    const model = new Expense();
    model.create(expense as IExpense);
  });

  ipcMain.handle(
    'expense:findAllByReferencesWithMemberName',
    (_event, referenceMonth, referenceYear) => {
      const model = new Expense();
      return model.findAllByReferencesWithMemberName(
        referenceMonth as number,
        referenceYear as number
      );
    }
  );

  ipcMain.handle('expense:update', (_event, expense) => {
    const model = new Expense();
    model.update(expense as IExpenseState);
  });

  ipcMain.handle('expense:delete', (_event, id) => {
    const model = new Expense();
    model.delete(id);
  });
};
