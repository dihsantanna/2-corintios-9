import { useEffect, useState } from 'react';
import { IPartialBalance } from 'main/@types/Report';
import { months } from '../utils/months';

interface PartialBalanceProps {
  refresh: boolean;
  refreshed: () => void;
}

const INITIAL_STATE: IPartialBalance = {
  previousBalance: 0.0,
  totalTithes: 0.0,
  totalSpecialOffers: 0.0,
  totalLooseOffers: 0.0,
  totalWithdraws: 0.0,
  totalEntries: 0.0,
  totalExpenses: 0.0,
  totalBalance: 0.0,
};

export function PartialBalance({ refresh, refreshed }: PartialBalanceProps) {
  const [partialBalance, setPartialBalance] = useState<IPartialBalance>({
    ...INITIAL_STATE,
  });

  const getPartialBalance = async () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const response = await window.report.partial(month, year);

    setPartialBalance(response);
  };

  useEffect(() => {
    getPartialBalance();
  }, []);

  useEffect(() => {
    if (refresh) {
      getPartialBalance();
      refreshed();
    }
  }, [refresh, refreshed]);

  const {
    previousBalance,
    totalTithes,
    totalSpecialOffers,
    totalLooseOffers,
    totalWithdraws,
    totalEntries,
    totalExpenses,
    totalBalance,
  } = partialBalance;
  return (
    <div className="fixed flex flex-col justify-between bottom-3 right-3 w-[420px] h-60 gap-2 p-2 text-zinc-900 border rounded-md">
      <h1 className="w-full text-center text-lg font-bold">
        Balanço parcial do mês de{' '}
        {` ${months[(new Date().getMonth() + 1) as keyof typeof months]} `} de
        {` ${new Date().getFullYear()}`}
      </h1>
      <div className="flex-1 flex flex-col justify-end gap-4 text-sm">
        <div className="w-full">
          <div className="flex justify-between bg-zinc-100">
            <span>Saldo Anterior:</span>
            <span className="font-bold">
              {(previousBalance || 0.0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
          <div className="flex justify-between bg-zinc-100">
            <span>Total de Dízimos:</span>
            <span className="font-bold">
              {(totalTithes || 0.0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total de Ofertas Especiais:</span>
            <span className="font-bold">
              {(totalSpecialOffers || 0.0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
          <div className="flex justify-between bg-zinc-100">
            <span>Total de Ofertas de Gazofilácio:</span>
            <span className="font-bold">
              {(totalLooseOffers || 0.0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Saques em Conta Bancária:</span>
            <span className="font-bold">
              {(totalWithdraws || 0.0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        </div>
        <div>
          <div className="flex justify-between bg-zinc-100">
            <span>Total de Entradas:</span>
            <span className="font-bold">
              {(totalEntries || 0.0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total de Saídas:</span>
            <span className="font-bold">
              {(totalExpenses || 0.0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
          <div className="flex justify-between bg-zinc-100">
            <span>Saldo Parcial:</span>
            <span className="font-bold">
              {(totalBalance || 0.0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
