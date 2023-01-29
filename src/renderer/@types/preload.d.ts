import {
  ExpenseCategoryHandler,
  ExpenseHandler,
  InitialBalanceHandler,
  MemberHandler,
  OfferHandler,
  ReportHandler,
  TitheHandler,
} from 'main/preload';

declare global {
  interface Window {
    member: MemberHandler;
    tithe: TitheHandler;
    offer: OfferHandler;
    expenseCategory: ExpenseCategoryHandler;
    expense: ExpenseHandler;
    report: ReportHandler;
    initialBalance: InitialBalanceHandler;
  }
}

export {};
