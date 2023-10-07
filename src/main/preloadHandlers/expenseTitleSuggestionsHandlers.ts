import { ipcMain } from 'electron';
import { ExpenseTitleSuggestions } from '../db/ExpenseTitleSuggestions';

export const expenseTitleSuggestionsHandlers = () => {
  ipcMain.handle('expenseTitleSuggestions:get', async (_event, search) => {
    const model = ExpenseTitleSuggestions.init();
    return model.get(search);
  });

  ipcMain.handle('expenseTitleSuggestions:create', async (_event, title) => {
    const model = ExpenseTitleSuggestions.init();
    await model.create(title);
  });
};
