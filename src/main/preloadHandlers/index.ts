import { expenseCategoryHandlers } from './expenseCategoryHandlers';
import { memberHandlers } from './memberHandlers';
import { offerHandlers } from './offerHandlers';
import { titheHandlers } from './titheHandlers';

export const createPreloadHandlers = () => {
  memberHandlers();
  titheHandlers();
  offerHandlers();
  expenseCategoryHandlers();
};
