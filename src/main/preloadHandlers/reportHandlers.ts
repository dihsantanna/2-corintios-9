import { ipcMain } from 'electron';
import { entriesReportGenerate } from '../reports/entriesReport';

export const reportHandlers = () => {
  ipcMain.handle('report:entries', (_event, referenceMonth, referenceYear) => {
    return entriesReportGenerate(referenceMonth, referenceYear);
  });
};
