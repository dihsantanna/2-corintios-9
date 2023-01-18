import { idGenerator } from '../helpers/IdGenerator';
import { prisma } from '../database';

interface AddExpenseRequest {
  expenseCategoryId: string;
  title: string;
  value: number;
  referenceMonth: number;
  referenceYear: number;
}

export const addExpense = async (expense: AddExpenseRequest) => {
  try {
    const newExpense = await prisma.expense.create({
      data: {
        id: idGenerator(),
        ...expense,
      },
    });
    return newExpense;
  } finally {
    await prisma.$disconnect();
  }
};
