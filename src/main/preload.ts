import { contextBridge, ipcRenderer } from 'electron';
import { IMember } from './@types/Member';

export type MemberChanel = 'create';

const memberHandler = {
  create: async (member: IMember) => {
    return ipcRenderer.invoke('member:create', member);
  },
};

contextBridge.exposeInMainWorld('memberModel', memberHandler);

export type MemberHandler = typeof memberHandler;
