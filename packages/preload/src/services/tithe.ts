import { idGenerator } from '../helpers/IdGenerator';
import { prisma } from '../database';

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
