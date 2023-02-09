import { ipcMain } from 'electron';
import { IPartialBalance } from '../@types/Report';
import { Report } from '../db/repositories/Report';
import { Expense } from '../db/repositories/Expense';
import { generalReportGenerate } from '../reports/generalReport';

export const reportHandlers = () => {
  ipcMain.handle(
    'report:entries',
    async (_event, referenceMonth, referenceYear) => {
      const report = new Report();
      const totalEntries = await report.getTotalEntries(
        referenceMonth,
        referenceYear
      );

      const tithesAndSpecialOffers = await report.getOffersAndTithesFromMembers(
        referenceMonth,
        referenceYear
      );

      await report.close();
      return {
        tithesAndSpecialOffers,
        totalEntries,
      };
    }
  );

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
