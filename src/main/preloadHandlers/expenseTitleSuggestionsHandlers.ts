import { ipcMain } from 'electron';
import { ExpenseTitleSuggestions } from '../db/ExpenseTitleSuggestions';

export const expenseTitleSuggestionsHandlers = () => {
  ipcMain.handle('expenseTitleSuggestions:get', async () => {
    const model = ExpenseTitleSuggestions.init();
    return model.get();
  });

  ipcMain.handle('expenseTitleSuggestions:create', async (_event, title) => {
    const model = ExpenseTitleSuggestions.init();
    await model.create(title);
  });
};
