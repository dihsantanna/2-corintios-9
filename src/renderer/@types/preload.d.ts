import {
  DataOfChurchHandler,
  ExpenseCategoryHandler,
  ExpenseHandler,
  InitialBalanceHandler,
  MemberHandler,
  OfferHandler,
  ReportHandler,
  TitheHandler,
  WithdrawToTheBankAccountHandler,
  ExpenseTitleSuggestions,
  OtherEntryHandler,
} from 'main/preload';

declare global {
  interface Window {
    member: MemberHandler;
    tithe: TitheHandler;
    otherEntry: OtherEntryHandler;
    offer: OfferHandler;
    expenseCategory: ExpenseCategoryHandler;
    expense: ExpenseHandler;
    report: ReportHandler;
    initialBalance: InitialBalanceHandler;
    withdrawToTheBankAccount: WithdrawToTheBankAccountHandler;
    dataOfChurch: DataOfChurchHandler;
    expenseTitleSuggestions: ExpenseTitleSuggestions;
  }
}

export {};
