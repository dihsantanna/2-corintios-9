import { createContext, Dispatch, SetStateAction } from 'react';
import { IPartialBalance } from 'main/@types/Report';
import { ChurchData } from '../../@types/ChurchData.type';

export interface GlobalContextType {
  churchData: ChurchData;
  setChurchData: Dispatch<SetStateAction<ChurchData>>;
  partialBalance: IPartialBalance;
  setPartialBalance: Dispatch<SetStateAction<IPartialBalance>>;
  refreshPartialBalance: boolean;
  setRefreshPartialBalance: Dispatch<SetStateAction<boolean>>;
  logoSrc: string;
  showInitialConfig: boolean;
  setShowInitialConfig: Dispatch<SetStateAction<boolean>>;
}

export const GlobalContext = createContext<GlobalContextType>(
  {} as GlobalContextType
);
