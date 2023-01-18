import { idGenerator } from '../helpers/IdGenerator';
import { prisma } from '../database';

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
