import { idGenerator } from '../helpers/IdGenerator';
import { prisma } from '../database';

interface CreateMemberRequest {
  name: string;
  congregated: boolean;
}

export const createMember = async (member: CreateMemberRequest) => {
  console.log(member);
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
