import {
  ExpenseCategoryHandler,
  ExpenseHandler,
  InitialBalanceHandler,
  MemberHandler,
  OfferHandler,
  ReportHandler,
  TitheHandler,
  WithdrawalToTheBankAccountHandler,
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
    withdrawalToTheBankAccount: WithdrawalToTheBankAccountHandler;
  }
}

export {};
