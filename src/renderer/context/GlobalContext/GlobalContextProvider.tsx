import { ReactNode, useCallback, useEffect, useState } from 'react';
import { IPartialBalance } from 'main/@types/Report';
import { GlobalContext } from '.';
import { ChurchData } from '../../@types/ChurchData.type';

interface GlobalContextProviderProps {
  children?: ReactNode;
}

const PARTIAL_BALANCE: IPartialBalance = {
  previousBalance: 0.0,
  totalTithes: 0.0,
  totalSpecialOffers: 0.0,
  totalLooseOffers: 0.0,
  totalWithdraws: 0.0,
  totalEntries: 0.0,
  totalExpenses: 0.0,
  totalBalance: 0.0,
};

const CHURCH_DATA: ChurchData = {
  name: '',
  logoSrc: '',
  foundationDate: '',
  cnpj: '',
  street: '',
  number: '',
  district: '',
  city: '',
  state: '',
  cep: '',
};

export function GlobalContextProvider({
  children,
}: GlobalContextProviderProps) {
  const [churchData, setChurchData] = useState<ChurchData>({
    ...CHURCH_DATA,
  } as ChurchData);

  const [refreshPartialBalance, setRefreshPartialBalance] = useState(false);

  const [partialBalance, setPartialBalance] = useState<IPartialBalance>({
    ...PARTIAL_BALANCE,
  });

  const [showInitialConfig, setShowInitialConfig] = useState(false);

  const setInitialConfig = useCallback(async () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const dataOfChurch = await window.dataOfChurch.get();

    if (!dataOfChurch) {
      setShowInitialConfig(true);
      return;
    }

    const balance = await window.report.partial(month, year);

    setPartialBalance(balance);
    setChurchData({
      ...dataOfChurch,
      foundationDate: new Intl.DateTimeFormat('pt-BR').format(
        dataOfChurch.foundationDate
      ),
    });
  }, []);

  useEffect(() => {
    setInitialConfig();
  }, [setInitialConfig]);

  useEffect(() => {
    if (refreshPartialBalance) {
      setInitialConfig();
      setRefreshPartialBalance(false);
    }
  }, [refreshPartialBalance, setInitialConfig, setRefreshPartialBalance]);

  return (
    <GlobalContext.Provider
      value={{
        churchData,
        setChurchData,
        partialBalance,
        setPartialBalance,
        refreshPartialBalance,
        setRefreshPartialBalance,
        logoSrc: churchData.logoSrc,
        showInitialConfig,
        setShowInitialConfig,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
