import { dataOfChurchHandler } from './dataOfChurchHandler';
import { expenseCategoryHandlers } from './expenseCategoryHandlers';
import { expenseHandlers } from './expenseHandlers';
import { initialBalanceHandler } from './initialBalanceHandler';
import { memberHandlers } from './memberHandlers';
import { offerHandlers } from './offerHandlers';
import { reportHandlers } from './reportHandlers';
import { titheHandlers } from './titheHandlers';
import { withdrawsToTheBankAccountHandlers } from './withdrawToTheBankAccountHandlers';

export const createPreloadHandlers = () => {
  memberHandlers();
  titheHandlers();
  offerHandlers();
  expenseCategoryHandlers();
  expenseHandlers();
  reportHandlers();
  initialBalanceHandler();
  withdrawsToTheBankAccountHandlers();
  dataOfChurchHandler();
};
