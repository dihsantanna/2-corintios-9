import { ipcMain } from 'electron';
import { DataOfChurch } from '../db/repositories/DataOfChurch';

export const dataOfChurchHandler = () => {
  ipcMain.handle(
    'dataOfChurch:createOrUpdate',
    async (_event, dataOfChurch) => {
      const model = new DataOfChurch();
      await model.createOrUpdate(dataOfChurch);
    }
  );

  ipcMain.handle('dataOfChurch:get', async () => {
    const model = new DataOfChurch();
    return model.get();
  });
};
