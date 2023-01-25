import {idGenerator} from '../helpers/IdGenerator';
import {prisma} from '../database';
import type {Expense} from '@prisma/client';

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

export const findExpensesWithCategoryNameByReferences = async (
  referenceMonth: number,
  referenceYear: number,
) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        referenceMonth,
        referenceYear,
      },
      select: {
        id: true,
        expenseCategoryId: true,
        title: true,
        value: true,
        referenceMonth: true,
        referenceYear: true,
        expenseCategory: {
          select: {
            id: false,
            name: true,
          },
        },
      },
    });
    return expenses;
  } finally {
    await prisma.$disconnect();
  }
};

export const updateExpense = async (expense: Expense) => {
  try {
    const updatedExpense = await prisma.expense.update({
      where: {
        id: expense.id,
      },
      data: {
        ...expense,
      },
    });
    return updatedExpense;
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteExpense = async (id: string) => {
  try {
    await prisma.expense.delete({
      where: {
        id,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const findAllExpensesByReferences = async (
  referenceMonth: number,
  referenceYear: number,
) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        referenceMonth,
        referenceYear,
      },
    });
    return expenses;
  } finally {
    await prisma.$disconnect();
  }
};
