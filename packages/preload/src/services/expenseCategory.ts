import { idGenerator } from '../helpers/IdGenerator';
import { prisma } from '../database';
import type { ExpenseCategory } from '@prisma/client';

interface AddExpenseCategoryRequest {
  name: string;
}

export const addExpenseCategory = async (expenseCategory: AddExpenseCategoryRequest) => {
  try {
    const newExpenseCategory = await prisma.expenseCategory.create({
      data: {
        id: idGenerator(),
        ...expenseCategory,
      },
    });
    return newExpenseCategory;
  } finally {
    await prisma.$disconnect();
  }
};

export const findAllExpenseCategories = async () => {
  try {
    const expenseCategories = await prisma.expenseCategory.findMany();
    return expenseCategories.sort((a, b) => a.name.localeCompare(b.name));
  } finally {
    await prisma.$disconnect();
  }
};

export const updateExpenseCategory = async (expenseCategory: ExpenseCategory) => {
  try {
    const updatedExpenseCategory = await prisma.expenseCategory.update({
      where: {
        id: expenseCategory.id,
      },
      data: {
        ...expenseCategory,
      },
    });
    return updatedExpenseCategory;
  } finally {
    await prisma.$disconnect();
  }
};
