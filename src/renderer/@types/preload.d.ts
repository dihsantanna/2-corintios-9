import {
  ExpenseCategoryHandler,
  ExpenseHandler,
  MemberHandler,
  OfferHandler,
  TitheHandler,
} from 'main/preload';

declare global {
  interface Window {
    member: MemberHandler;
    tithe: TitheHandler;
    offer: OfferHandler;
    expenseCategory: ExpenseCategoryHandler;
    expense: ExpenseHandler;
  }
}

export {};
