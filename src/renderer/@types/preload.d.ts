import { MemberHandler, TitheHandler } from 'main/preload';

declare global {
  interface Window {
    memberModel: MemberHandler;
    titheModel: TitheHandler;
  }
}

export {};
