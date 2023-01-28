import { ipcMain } from 'electron';
import { Offer } from '../db/repositories/Offer';
import { IOffer } from '../@types/Offer';

export const offerHandlers = () => {
  ipcMain.handle('offer:create', (_event, offer) => {
    const model = new Offer();
    model.create(offer as IOffer);
  });
};
