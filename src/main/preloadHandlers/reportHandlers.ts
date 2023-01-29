import { ipcMain } from 'electron';
import { entriesReportGenerate } from '../reports/entriesReport';
import { outputReportGenerate } from '../reports/outputReport';
import { generalReportGenerate } from '../reports/generalReport';

export const reportHandlers = () => {
  ipcMain.handle('report:entries', (_event, referenceMonth, referenceYear) => {
    return entriesReportGenerate(referenceMonth, referenceYear);
  });

  ipcMain.handle('report:output', (_event, referenceMonth, referenceYear) => {
    return outputReportGenerate(referenceMonth, referenceYear);
  });

  ipcMain.handle('report:general', (_event, referenceMonth, referenceYear) => {
    return generalReportGenerate(referenceMonth, referenceYear);
  });
};
