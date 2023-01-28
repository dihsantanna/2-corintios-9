import { contextBridge, ipcRenderer } from 'electron';
import { IMember, IMemberState } from './@types/Member';
import { ITithe } from './@types/Tithe';
import { IOffer } from './@types/Offer';
import { IExpenseCategory } from './@types/ExpenseCategory';

const memberHandler = {
  create: async (member: IMember) => {
    return ipcRenderer.invoke('member:create', member) as Promise<void>;
  },
  findAll: async () => {
    return ipcRenderer.invoke('member:findAll') as Promise<IMemberState[]>;
  },
};

const titheHandler = {
  create: async (tithe: ITithe) => {
    return ipcRenderer.invoke('tithe:create', tithe) as Promise<void>;
  },
};

const offerHandler = {
  create: async (offer: IOffer) => {
    return ipcRenderer.invoke('offer:create', offer) as Promise<void>;
  },
};

const expenseCategoryHandler = {
  create: async (expenseCategory: IExpenseCategory) => {
    return ipcRenderer.invoke(
      'expenseCategory:create',
      expenseCategory
    ) as Promise<void>;
  },
};

contextBridge.exposeInMainWorld('memberModel', memberHandler);
contextBridge.exposeInMainWorld('titheModel', titheHandler);
contextBridge.exposeInMainWorld('offerModel', offerHandler);
contextBridge.exposeInMainWorld('expenseCategoryModel', expenseCategoryHandler);

export type MemberHandler = typeof memberHandler;
export type TitheHandler = typeof titheHandler;
export type OfferHandler = typeof offerHandler;
export type ExpenseCategoryHandler = typeof expenseCategoryHandler;
