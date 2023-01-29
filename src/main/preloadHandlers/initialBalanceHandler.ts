import { ipcMain } from 'electron';
import { InitialBalance } from '../db/repositories/InitialBalance';

export const initialBalanceHandler = () => {
  ipcMain.handle('initialBalance:get', async () => {
    const initialBalance = new InitialBalance();
    return initialBalance.get();
  });

  ipcMain.handle(
    'initialBalance:createOrUpdate',
    async (_event, initialBalance) => {
      const initialBalanceRepo = new InitialBalance();
      return initialBalanceRepo.createOrUpdate(initialBalance);
    }
  );
};
