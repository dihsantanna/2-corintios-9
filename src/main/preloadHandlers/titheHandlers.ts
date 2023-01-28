import { ipcMain } from 'electron';
import { Tithe } from '../db/repositories/Tithe';
import { ITithe, ITitheState } from '../@types/Tithe';

export const titheHandlers = () => {
  ipcMain.handle('tithe:create', (_event, tithe) => {
    const model = new Tithe();
    model.create(tithe as ITithe);
  });

  ipcMain.handle(
    'tithe:findAllByReferencesWithMemberName',
    (_event, referenceMonth, referenceYear) => {
      const model = new Tithe();
      return model.findAllByReferencesWithMemberName(
        referenceMonth,
        referenceYear
      );
    }
  );

  ipcMain.handle('tithe:update', (_event, tithe) => {
    const model = new Tithe();
    model.update(tithe as ITitheState);
  });

  ipcMain.handle('tithe:delete', (_event, titheId) => {
    const model = new Tithe();
    model.delete(titheId);
  });
};
