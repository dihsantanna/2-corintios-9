import { ipcMain } from 'electron';
import { WithdrawalToTheBankAccount } from '../db/repositories/WithdrawalToTheBankAccount';

export const withdrawalsToTheBankAccountHandlers = () => {
  ipcMain.handle(
    'withdrawalToTheBankAccount:create',
    async (_event, withdrawalToTheBankAccount) => {
      const model = new WithdrawalToTheBankAccount();
      return model.create(withdrawalToTheBankAccount);
    }
  );
  ipcMain.handle(
    'withdrawalToTheBankAccount:findAllByReferenceDate',
    async (_event, referenceMonth, referenceYear) => {
      const model = new WithdrawalToTheBankAccount();
      return model.findAllByReferenceDate(referenceMonth, referenceYear);
    }
  );

  ipcMain.handle(
    'withdrawalToTheBankAccount:update',
    async (_event, withdrawalToTheBankAccount) => {
      const model = new WithdrawalToTheBankAccount();
      return model.update(withdrawalToTheBankAccount);
    }
  );

  ipcMain.handle(
    'withdrawalToTheBankAccount:delete',
    async (_event, withdrawalToTheBankAccountId) => {
      const model = new WithdrawalToTheBankAccount();
      return model.delete(withdrawalToTheBankAccountId);
    }
  );
};
