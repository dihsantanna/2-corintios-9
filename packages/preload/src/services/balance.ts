import type {Balance} from '@prisma/client';
import {prisma} from '../database';

export const upsertBalance = async (balance: Balance) => {
  try {
    const updatedBalance = await prisma.balance.upsert({
      where: {
        id: balance.id,
      },
      update: {
        value: balance.value,
        referenceMonth: balance.referenceMonth,
        referenceYear: balance.referenceYear,
      },
      create: {
        id: balance.id,
        value: balance.value,
        referenceMonth: balance.referenceMonth,
        referenceYear: balance.referenceYear,
      },
    });
    return updatedBalance;
  } finally {
    await prisma.$disconnect();
  }
};

export const findBalanceById = async (id: string) => {
  try {
    const balance = await prisma.balance.findUnique({
      where: {
        id,
      },
    });
    return balance;
  } finally {
    await prisma.$disconnect();
  }
};
