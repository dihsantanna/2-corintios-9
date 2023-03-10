export interface IExpense {
  expenseCategoryId: string;
  title: string;
  value: number;
  referenceMonth: number;
  referenceYear: number;
}

export interface IExpenseState extends IExpense {
  id: string;
}

export interface IExpenseStateWithCategoryName extends IExpenseState {
  expenseCategoryName: string;
}
