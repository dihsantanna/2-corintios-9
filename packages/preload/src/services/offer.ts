import { idGenerator } from '../helpers/IdGenerator';
import { prisma } from '../database';

interface AddOfferRequest {
  memberId: string | null;
  value: number;
  referenceMonth: number;
  referenceYear: number;
}

export const addOffer = async (offer: AddOfferRequest) => {
  try {
    const newOffer = await prisma.offer.create({
      data: {
        id: idGenerator(),
        ...offer,
      },
    });
    return newOffer;
  } finally {
    await prisma.$disconnect();
  }
};
