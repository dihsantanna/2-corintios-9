import { idGenerator } from '../helpers/IdGenerator';
import { prisma } from '../database';
import type { Offer } from '@prisma/client';

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

export const findAllOffersWithMemberName = async (referenceMonth: number, referenceYear: number) => {
  try {
    const offers = await prisma.offer.findMany({
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
    return offers;
  } finally {
    await prisma.$disconnect();
  }
};

export const updateOffer = async (offer: Offer) => {
  try {
    const updatedOffer = await prisma.offer.update({
      where: {
        id: offer.id,
      },
      data: {
        ...offer,
      },
    });
    return updatedOffer;
  } finally {
    await prisma.$disconnect();
  }
};
