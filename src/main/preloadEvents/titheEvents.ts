import { ipcMain } from 'electron';
import { Tithe } from '../db/repositories/Tithe';
import { ITithe } from '../@types/Tithe';

export const titheEvents = () => {
  ipcMain.handle('tithe:create', (_event, tithe) => {
    const model = new Tithe();
    model.create(tithe as ITithe);
  });
};
