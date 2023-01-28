import { contextBridge, ipcRenderer } from 'electron';
import { IMember, IMemberState } from './@types/Member';
import { ITithe } from './@types/Tithe';
import { IOffer } from './@types/Offer';
import {
  IExpenseCategory,
  IExpenseCategoryState,
} from './@types/ExpenseCategory';
import { IExpense } from './@types/Expense';

const memberHandler = {
  create: async (member: IMember) => {
    return ipcRenderer.invoke('member:create', member) as Promise<void>;
  },
  findAll: async () => {
    return ipcRenderer.invoke('member:findAll') as Promise<IMemberState[]>;
  },
  update: async (member: IMember) => {
    return ipcRenderer.invoke('member:update', member) as Promise<void>;
  },
  delete: async (memberId: string) => {
    return ipcRenderer.invoke('member:delete', memberId) as Promise<void>;
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
  findAll: async () => {
    return ipcRenderer.invoke('expenseCategory:findAll') as Promise<
      IExpenseCategoryState[]
    >;
  },
};

const expenseHandler = {
  create: async (expense: IExpense) => {
    return ipcRenderer.invoke('expense:create', expense) as Promise<void>;
  },
};

contextBridge.exposeInMainWorld('member', memberHandler);
contextBridge.exposeInMainWorld('tithe', titheHandler);
contextBridge.exposeInMainWorld('offer', offerHandler);
contextBridge.exposeInMainWorld('expenseCategory', expenseCategoryHandler);
contextBridge.exposeInMainWorld('expense', expenseHandler);

export type MemberHandler = typeof memberHandler;
export type TitheHandler = typeof titheHandler;
export type OfferHandler = typeof offerHandler;
export type ExpenseCategoryHandler = typeof expenseCategoryHandler;
export type ExpenseHandler = typeof expenseHandler;
