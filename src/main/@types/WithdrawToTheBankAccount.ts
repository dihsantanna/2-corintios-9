export interface IWithdrawToTheBankAccount {
  value: number;
  referenceMonth: number;
  referenceYear: number;
}

export interface IWithdrawToTheBankAccountState
  extends IWithdrawToTheBankAccount {
  id: string;
}
