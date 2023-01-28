import { expenseCategoryHandlers } from './expenseCategoryHandlers';
import { expenseHandlers } from './expenseHandlers';
import { memberHandlers } from './memberHandlers';
import { offerHandlers } from './offerHandlers';
import { titheHandlers } from './titheHandlers';

export const createPreloadHandlers = () => {
  memberHandlers();
  titheHandlers();
  offerHandlers();
  expenseCategoryHandlers();
  expenseHandlers();
};
