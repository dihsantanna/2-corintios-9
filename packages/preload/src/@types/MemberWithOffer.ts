import type {Member, Offer} from '@prisma/client';

export interface MemberWithOffer extends Member {
  Offer: Offer[];
}
