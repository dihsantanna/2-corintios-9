import {
  ExpenseCategoryHandler,
  MemberHandler,
  OfferHandler,
  TitheHandler,
} from 'main/preload';

declare global {
  interface Window {
    memberModel: MemberHandler;
    titheModel: TitheHandler;
    offerModel: OfferHandler;
    expenseCategoryModel: ExpenseCategoryHandler;
  }
}

export {};
