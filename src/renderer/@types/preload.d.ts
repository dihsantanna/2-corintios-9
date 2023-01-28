import { MemberHandler } from 'main/preload';

declare global {
  interface Window {
    memberModel: MemberHandler;
  }
}

export {};
