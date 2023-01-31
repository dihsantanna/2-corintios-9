import { ipcMain } from 'electron';
import { WithdrawToTheBankAccount } from '../db/repositories/WithdrawToTheBankAccount';

export const withdrawsToTheBankAccountHandlers = () => {
  ipcMain.handle(
    'withdrawToTheBankAccount:create',
    async (_event, withdrawToTheBankAccount) => {
      const model = new WithdrawToTheBankAccount();
      return model.create(withdrawToTheBankAccount);
    }
  );
  ipcMain.handle(
    'withdrawToTheBankAccount:findAllByReferenceDate',
    async (_event, referenceMonth, referenceYear) => {
      const model = new WithdrawToTheBankAccount();
      return model.findAllByReferenceDate(referenceMonth, referenceYear);
    }
  );

  ipcMain.handle(
    'withdrawToTheBankAccount:update',
    async (_event, withdrawToTheBankAccount) => {
      const model = new WithdrawToTheBankAccount();
      return model.update(withdrawToTheBankAccount);
    }
  );

  ipcMain.handle(
    'withdrawToTheBankAccount:delete',
    async (_event, withdrawToTheBankAccountId) => {
      const model = new WithdrawToTheBankAccount();
      return model.delete(withdrawToTheBankAccountId);
    }
  );
};
