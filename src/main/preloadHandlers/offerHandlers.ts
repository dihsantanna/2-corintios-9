import { ipcMain } from 'electron';
import { Offer } from '../db/repositories/Offer';
import { IOffer, IOfferState } from '../@types/Offer';

export const offerHandlers = () => {
  ipcMain.handle('offer:create', (_event, offer) => {
    const model = new Offer();
    model.create(offer as IOffer);
  });
  ipcMain.handle(
    'offer:findAllByReferencesWithMemberName',
    (_event, referenceMonth, referenceYear) => {
      const model = new Offer();
      return model.findAllByReferencesWithMemberName(
        referenceMonth,
        referenceYear
      );
    }
  );

  ipcMain.handle('offer:update', (_event, offer) => {
    const model = new Offer();
    model.update(offer as IOfferState);
  });

  ipcMain.handle('offer:delete', (_event, offerId) => {
    const model = new Offer();
    model.delete(offerId);
  });
};
