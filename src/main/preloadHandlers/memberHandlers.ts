import { ipcMain } from 'electron';
import { Member } from '../db/repositories/Member';
import { IMember, IMemberState } from '../@types/Member';

export const memberHandlers = () => {
  ipcMain.handle('member:create', (_event, member) => {
    const model = new Member();
    model.create(member as IMember);
  });

  ipcMain.handle('member:findAll', async () => {
    const model = new Member();
    return (await model.findAll()).sort((a, b) => a.name.localeCompare(b.name));
  });

  ipcMain.handle('member:update', (_event, member) => {
    const model = new Member();
    model.update(member as IMemberState);
  });

  ipcMain.handle('member:delete', (_event, id) => {
    const model = new Member();
    model.delete(id);
  });
};
