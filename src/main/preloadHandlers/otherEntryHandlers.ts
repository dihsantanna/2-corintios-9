import { ipcMain } from 'electron';
import { OtherEntry } from '../db/repositories/OtherEntry';
import { IOtherEntry, IOtherEntryState } from '../@types/OtherEntry';

export const otherEntryHandlers = () => {
  ipcMain.handle('otherEntry:create', (_event, otherEntry) => {
    const model = new OtherEntry();
    model.create(otherEntry as IOtherEntry);
  });

  ipcMain.handle(
    'otherEntry:findAllByReferences',
    (_event, referenceMonth, referenceYear) => {
      const model = new OtherEntry();
      return model.findAllByReferences(referenceMonth, referenceYear);
    },
  );

  ipcMain.handle('otherEntry:update', (_event, otherEntry) => {
    const model = new OtherEntry();
    model.update(otherEntry as IOtherEntryState);
  });

  ipcMain.handle('otherEntry:delete', (_event, otherEntryId) => {
    const model = new OtherEntry();
    model.delete(otherEntryId);
  });
};
