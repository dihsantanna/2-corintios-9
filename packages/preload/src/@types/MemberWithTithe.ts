import type {Member, Tithe} from '@prisma/client';

export interface MemberWithTithe extends Member {
  Tithe: Tithe[];
}
