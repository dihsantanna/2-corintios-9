import { ipcMain } from 'electron';
import { IPartialBalance } from '../@types/Report';
import { Report } from '../db/repositories/Report';
import { Expense } from '../db/repositories/Expense';
import { entriesReportGenerate } from '../reports/entriesReport';
import { outputReportGenerate } from '../reports/outputReport';
import { generalReportGenerate } from '../reports/generalReport';

export const reportHandlers = () => {
  ipcMain.handle('report:entries', (_event, referenceMonth, referenceYear) => {
    return entriesReportGenerate(referenceMonth, referenceYear);
  });

  ipcMain.handle('report:output', (_event, referenceMonth, referenceYear) => {
    return outputReportGenerate(referenceMonth, referenceYear);
  });

  ipcMain.handle('report:general', (_event, referenceMonth, referenceYear) => {
    return generalReportGenerate(referenceMonth, referenceYear);
  });

  ipcMain.handle(
    'report:partial',
    async (_event, referenceMonth, referenceYear) => {
      const model = new Report();
      const {
        totalEntries,
        totalLooseOffers,
        totalSpecialOffers,
        totalTithes,
        totalWithdrawalsBankAccount,
      } = await model.getTotalEntries(referenceMonth, referenceYear);

      const { previousBalance } = await model.getPreviousBalance(
        referenceMonth,
        referenceYear
      );

      const expenseModel = new Expense();
      const expenses = await expenseModel.findAllByReferencesWithCategoryName(
        referenceMonth,
        referenceYear
      );

      model.close();

      const totalExpenses = expenses.reduce(
        (total, { value }) => total + value,
        0
      );

      const totalBalance = previousBalance + totalEntries - totalExpenses;

      return {
        totalTithes,
        totalSpecialOffers,
        totalLooseOffers,
        totalWithdraws: totalWithdrawalsBankAccount,
        totalEntries,
        totalExpenses,
        totalBalance,
        previousBalance,
      } as IPartialBalance;
    }
  );
};
