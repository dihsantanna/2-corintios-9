import { contextBridge, ipcRenderer } from 'electron';
import { IMember } from './@types/Member';
import { ITithe } from './@types/Tithe';

export type MemberChanel = 'create';

const memberHandler = {
  create: async (member: IMember) => {
    return ipcRenderer.invoke('member:create', member);
  },
  findAll: async () => {
    return ipcRenderer.invoke('member:findAll');
  },
};

const titheHandler = {
  create: async (tithe: ITithe) => {
    return ipcRenderer.invoke('tithe:create', tithe);
  },
};

contextBridge.exposeInMainWorld('memberModel', memberHandler);
contextBridge.exposeInMainWorld('titheModel', titheHandler);

export type MemberHandler = typeof memberHandler;
export type TitheHandler = typeof titheHandler;
