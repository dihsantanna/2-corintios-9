import { contextBridge, ipcRenderer } from 'electron';
import { IMember, IMemberState } from './@types/Member';
import { ITithe, ITitheState, ITitheStateWithMemberName } from './@types/Tithe';
import { IOffer, IOfferState, IOfferStateWithMemberName } from './@types/Offer';
import {
  IExpenseCategory,
  IExpenseCategoryState,
} from './@types/ExpenseCategory';
import {
  IExpense,
  IExpenseState,
  IExpenseStateWithCategoryName,
} from './@types/Expense';

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
  findAllByReferencesWithMemberName: async (
    referenceMonth: number,
    referenceYear: number
  ) => {
    return ipcRenderer.invoke(
      'tithe:findAllByReferencesWithMemberName',
      referenceMonth,
      referenceYear
    ) as Promise<ITitheStateWithMemberName[]>;
  },
  update: async (tithe: ITitheState) => {
    return ipcRenderer.invoke('tithe:update', tithe) as Promise<void>;
  },
  delete: async (titheId: string) => {
    return ipcRenderer.invoke('tithe:delete', titheId) as Promise<void>;
  },
};

const offerHandler = {
  create: async (offer: IOffer) => {
    return ipcRenderer.invoke('offer:create', offer) as Promise<void>;
  },
  findAllByReferencesWithMemberName: async (
    referenceMonth: number,
    referenceYear: number
  ) => {
    return ipcRenderer.invoke(
      'offer:findAllByReferencesWithMemberName',
      referenceMonth,
      referenceYear
    ) as Promise<IOfferStateWithMemberName[]>;
  },
  update: async (offer: IOfferState) => {
    return ipcRenderer.invoke('offer:update', offer) as Promise<void>;
  },
  delete: async (offerId: string) => {
    return ipcRenderer.invoke('offer:delete', offerId) as Promise<void>;
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
  update: async (expenseCategory: IExpenseCategoryState) => {
    return ipcRenderer.invoke(
      'expenseCategory:update',
      expenseCategory
    ) as Promise<void>;
  },
  delete: async (expenseCategoryId: string) => {
    return ipcRenderer.invoke(
      'expenseCategory:delete',
      expenseCategoryId
    ) as Promise<void>;
  },
};

const expenseHandler = {
  create: async (expense: IExpense) => {
    return ipcRenderer.invoke('expense:create', expense) as Promise<void>;
  },
  findAllByReferencesWithMemberName: async (
    referenceMonth: number,
    referenceYear: number
  ) => {
    return ipcRenderer.invoke(
      'expense:findAllByReferencesWithMemberName',
      referenceMonth,
      referenceYear
    ) as Promise<IExpenseStateWithCategoryName[]>;
  },
  update: async (expense: IExpenseState) => {
    return ipcRenderer.invoke('expense:update', expense) as Promise<void>;
  },
  delete: async (expenseId: string) => {
    return ipcRenderer.invoke('expense:delete', expenseId) as Promise<void>;
  },
};

const reportHandler = {
  entries: async (referenceMonth: number, referenceYear: number) => {
    return ipcRenderer.invoke(
      'report:entries',
      referenceMonth,
      referenceYear
    ) as Promise<Buffer>;
  },
};

contextBridge.exposeInMainWorld('member', memberHandler);
contextBridge.exposeInMainWorld('tithe', titheHandler);
contextBridge.exposeInMainWorld('offer', offerHandler);
contextBridge.exposeInMainWorld('expenseCategory', expenseCategoryHandler);
contextBridge.exposeInMainWorld('expense', expenseHandler);
contextBridge.exposeInMainWorld('report', reportHandler);

export type MemberHandler = typeof memberHandler;
export type TitheHandler = typeof titheHandler;
export type OfferHandler = typeof offerHandler;
export type ExpenseCategoryHandler = typeof expenseCategoryHandler;
export type ExpenseHandler = typeof expenseHandler;
export type ReportHandler = typeof reportHandler;
