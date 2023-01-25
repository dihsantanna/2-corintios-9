import {idGenerator} from './IdGenerator';
import {prisma} from '../database';
import type {Member} from '@prisma/client';

interface AddMemberRequest {
  name: string;
  congregated: boolean;
}

export const addMember = async (member: AddMemberRequest) => {
  try {
    const newMember = await prisma.member.create({
      data: {
        id: idGenerator(),
        ...member,
      },
    });
    return newMember;
  } finally {
    await prisma.$disconnect();
  }
};

export const findAllMembers = async () => {
  try {
    const members = await prisma.member.findMany();
    return members.sort((a, b) => a.name.localeCompare(b.name));
  } finally {
    await prisma.$disconnect();
  }
};

export const updateMember = async ({id, name, congregated}: Member) => {
  try {
    const member = await prisma.member.update({
      where: {id},
      data: {name, congregated},
    });
    return member;
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteMember = async (id: string) => {
  try {
    const member = await prisma.member.delete({
      where: {id},
    });
    return member;
  } finally {
    await prisma.$disconnect();
  }
};

export const findAllMembersWithTithesByReferences = async (
  referenceMonth: number,
  referenceYear: number,
) => {
  try {
    const members = await prisma.member.findMany({
      include: {
        Tithe: {
          where: {
            referenceMonth,
            referenceYear,
          },
        },
      },
    });
    return members.sort((a, b) => a.name.localeCompare(b.name));
  } finally {
    await prisma.$disconnect();
  }
};

export const findAllMembersWithOffersByReferences = async (
  referenceMonth: number,
  referenceYear: number,
) => {
  try {
    const members = await prisma.member.findMany({
      include: {
        Offer: {
          where: {
            referenceMonth,
            referenceYear,
          },
        },
      },
    });
    return members.sort((a, b) => a.name.localeCompare(b.name));
  } finally {
    await prisma.$disconnect();
  }
};
