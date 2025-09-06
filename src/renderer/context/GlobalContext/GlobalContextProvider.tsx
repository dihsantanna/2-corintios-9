import { useCallback, useEffect, useRef, useState } from 'react';
import { IPartialBalance } from 'main/@types/Report';
import { Outlet, useOutletContext } from 'react-router-dom';
import moment from 'moment';
import { ChurchData } from '../../@types/ChurchData.type';

export interface ReferenceDate {
  month: number;
  year: number;
}

export type GlobalContextType = {
  churchData: ChurchData;
  setChurchData: React.Dispatch<React.SetStateAction<ChurchData>>;
  partialBalance: IPartialBalance;
  setPartialBalance: React.Dispatch<React.SetStateAction<IPartialBalance>>;
  refreshPartialBalance: boolean;
  setRefreshPartialBalance: React.Dispatch<React.SetStateAction<boolean>>;
  logoSrc: string;
  showInitialConfig: boolean;
  setShowInitialConfig: React.Dispatch<React.SetStateAction<boolean>>;
  referenceDate: ReferenceDate;
  setReferenceDate: React.Dispatch<React.SetStateAction<ReferenceDate>>;
  initialDate: React.MutableRefObject<ReferenceDate>;
};

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

const now = moment();

export function GlobalContextProvider() {
  const [churchData, setChurchData] = useState<ChurchData>({
    ...CHURCH_DATA,
  } as ChurchData);

  const [refreshPartialBalance, setRefreshPartialBalance] = useState(false);

  const [partialBalance, setPartialBalance] = useState<IPartialBalance>({
    ...PARTIAL_BALANCE,
  });

  const [showInitialConfig, setShowInitialConfig] = useState(false);
  const [referenceDate, setReferenceDate] = useState<ReferenceDate>({
    month: now.month() + 1,
    year: now.year(),
  });

  const initialDate = useRef({
    month: now.month() + 1,
    year: now.year(),
  });

  useEffect(() => {
    const getInitialBalance = async () => {
      const initialBalance = await window.initialBalance?.get();
      if (initialBalance) {
        initialDate.current = {
          month: initialBalance.referenceMonth,
          year: initialBalance.referenceYear,
        };
      }
    };
    getInitialBalance();
  }, []);

  const setInitialConfig = useCallback(async () => {
    const dataOfChurch = await window.dataOfChurch?.get();

    if (!dataOfChurch) {
      setShowInitialConfig(true);
      return;
    }

    const balance = await window.report.partial(
      referenceDate.month,
      referenceDate.year,
    );

    setPartialBalance(balance);
    setChurchData({
      ...dataOfChurch,
      foundationDate: new Intl.DateTimeFormat('pt-BR').format(
        dataOfChurch.foundationDate,
      ),
    });
  }, [referenceDate]);

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
    <Outlet
      context={{
        churchData,
        setChurchData,
        partialBalance,
        setPartialBalance,
        refreshPartialBalance,
        setRefreshPartialBalance,
        logoSrc: churchData.logoSrc,
        showInitialConfig,
        setShowInitialConfig,
        referenceDate,
        setReferenceDate,
        initialDate,
      }}
    />
  );
}

export function useGlobalContext() {
  return useOutletContext<GlobalContextType>();
}
