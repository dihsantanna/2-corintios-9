import { ipcMain } from 'electron';
import { Member } from '../db/repositories/Member';
import { IMember } from '../@types/Member';

export const memberEvents = () => {
  ipcMain.handle('member:create', (_event, member) => {
    const model = new Member();
    model.create(member as IMember);
  });
};
