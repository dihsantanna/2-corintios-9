export interface IWithdrawalToTheBankAccount {
  value: number;
  referenceMonth: number;
  referenceYear: number;
}

export interface IWithdrawalToTheBankAccountState
  extends IWithdrawalToTheBankAccount {
  id: string;
}
