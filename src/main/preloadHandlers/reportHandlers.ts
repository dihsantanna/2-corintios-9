import { ipcMain } from 'electron';
import { entriesReportGenerate } from '../reports/entriesReport';
import { outputReportGenerate } from '../reports/outputReport';

export const reportHandlers = () => {
  ipcMain.handle('report:entries', (_event, referenceMonth, referenceYear) => {
    return entriesReportGenerate(referenceMonth, referenceYear);
  });

  ipcMain.handle('report:output', (_event, referenceMonth, referenceYear) => {
    return outputReportGenerate(referenceMonth, referenceYear);
  });
};
