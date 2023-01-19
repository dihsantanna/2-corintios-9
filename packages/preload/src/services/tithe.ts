import { idGenerator } from '../helpers/IdGenerator';
import { prisma } from '../database';
import type { Tithe } from '@prisma/client';

interface AddTitheRequest {
  memberId: string;
  value: number;
  referenceMonth: number;
  referenceYear: number;
}

export const addTithe = async (tithe: AddTitheRequest) => {
  try {
    const newTithe = await prisma.tithe.create({
      data: {
        id: idGenerator(),
        ...tithe,
      },
    });
    return newTithe;
  } finally {
    await prisma.$disconnect();
  }
};

export const findAllTithesWithMemberName = async (referenceMonth: number, referenceYear: number) => {
  try {
    const tithes = await prisma.tithe.findMany({
      where: {
        referenceMonth,
        referenceYear,
      },
      select: {
        id: true,
        memberId: true,
        value: true,
        referenceMonth: true,
        referenceYear: true,
        member: {
          select: {
            id: false,
            name: true,
            congregated: false,
          },
        },
      },
    });
    return tithes;
  } finally {
    await prisma.$disconnect();
  }
};

export const updateTithe = async (tithe: Tithe) => {
  try {
    const updatedTithe = await prisma.tithe.update({
      where: {
        id: tithe.id,
      },
      data: {
        ...tithe,
      },
    });
    return updatedTithe;
  } finally {
    await prisma.$disconnect();
  }
};
