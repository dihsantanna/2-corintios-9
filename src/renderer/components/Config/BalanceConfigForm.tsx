import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { months } from 'renderer/utils/months';
import { getYears } from 'renderer/utils/years';
import { SubmitButton } from '../SubmitButton';
import { ResetButton } from '../ResetButton';
import { useGlobalContext } from '../../context/GlobalContext/GlobalContextProvider';

interface BalanceConfigProps {
  setShow: (bool: boolean) => void;
  isInitialConfig?: boolean;
}

export function BalanceConfigForm({
  setShow,
  isInitialConfig,
}: BalanceConfigProps) {
  const [referenceMonth, setReferenceMonth] = useState(
    new Date().getMonth() + 1
  );
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [defaultBalance, setDefaultBalance] = useState({
    value: '0.0',
    referenceMonth: new Date().getMonth() + 1,
    referenceYear: new Date().getFullYear(),
  });
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const { setRefreshPartialBalance, setShowInitialConfig } = useGlobalContext();

  useEffect(() => {
    const getInitialBalance = async () => {
      try {
        const initialBalance = await window.initialBalance.get();
        if (initialBalance) {
          setDefaultBalance({
            ...initialBalance,
            value: initialBalance.value.toFixed(2),
          });
          setBalance(initialBalance.value.toFixed(2));
          setReferenceMonth(initialBalance.referenceMonth);
          setReferenceYear(initialBalance.referenceYear);
        }
      } catch (err) {
        toast.error((err as Error).message);
      }
    };
    if (!isInitialConfig) getInitialBalance();
  }, [isInitialConfig]);

  const handleBalanceInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(value) || value === '';
    if (!validateValue) return;

    const valueEdit = value.match(/\d|\.|,/g) || '';
    const newValue = valueEdit.length ? [...valueEdit].join('') : '';

    setBalance(newValue.replace(',', '.'));
  };

  const handleBalanceInputBlur = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => {
    const newValue = value ? parseFloat(value).toFixed(2) : '';

    setBalance(newValue);
  };

  const validate = (value: number, month: number, year: number) => {
    if (value < 0) {
      toast.error('Informe o saldo inicial!', {
        progress: undefined,
      });
      return false;
    }

    if (!month) {
      toast.error('Por favor selecione o mês', {
        progress: undefined,
      });
      return false;
    }

    if (!year) {
      toast.error('Por favor selecione o ano', {
        progress: undefined,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const floatValue = parseFloat(balance);

    if (!validate(floatValue, referenceMonth, referenceYear)) return;

    setLoading(true);
    try {
      await window.initialBalance.createOrUpdate({
        value: floatValue,
        referenceMonth,
        referenceYear,
      });

      toast.success('Saldo inicial configurado com sucesso!', {
        progress: undefined,
      });
      setRefreshPartialBalance(true);
    } catch (err) {
      toast.error(
        `Erro ao configurar saldo inicial: ${(err as Error).message}`,
        {
          progress: undefined,
        }
      );
    } finally {
      setDefaultBalance({
        value: floatValue.toString(),
        referenceMonth,
        referenceYear,
      });
      setLoading(false);
      setShow(false);
      if (isInitialConfig) {
        setShowInitialConfig(false);
      }
    }
  };

  const handleReset = (
    event: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    event.preventDefault();
    setBalance(defaultBalance.value);
    setReferenceMonth(defaultBalance.referenceMonth);
    setReferenceYear(defaultBalance.referenceYear);
    if (!isInitialConfig) {
      (setShow as (bool: boolean) => void)(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      className="text-sm text-zinc-600 flex flex-col items-center justify-center"
    >
      <div>
        Selecione o mês e ano de referência:
        <div className="flex items-center justify-center gap-2 py-2">
          <select
            title="Escolha um mês"
            name="filterByMonth"
            onChange={({ target: { value } }) => setReferenceMonth(+value)}
            value={referenceMonth}
            className="cursor-pointer text-center text-zinc-200 bg-zinc-900 p-2 font-light block w-full leading-normal rounded-sm"
          >
            <option disabled value={0}>
              Selecione o mês
            </option>
            {Object.entries(months).map(([key, value]) => (
              <option title={value} key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <select
            title="Escolha um ano"
            name="filterByYear"
            onChange={({ target: { value } }) => setReferenceYear(+value)}
            value={referenceYear}
            className="cursor-pointer text-center text-zinc-200 bg-zinc-900 p-2 font-light block w-full leading-normal rounded-sm"
          >
            <option disabled value={0}>
              Selecione o ano
            </option>
            {getYears().map((year) => (
              <option title={year.toString()} key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <label className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-full text-zinc-200 text-sm">
        R$
        <input
          className="bg-zinc-900 placeholder:text-zinc-200 focus:outline-none block w-full appearance-none leading-normal pl-2"
          title="Valor do Saldo Inicial"
          name="balance"
          placeholder="Digite o saldo inicial"
          onChange={handleBalanceInputChange}
          onBlur={handleBalanceInputBlur}
          value={balance}
        />
      </label>
      <div className="bg-gray-50 pt-6 gap-2 flex w-full text-zinc-200">
        <SubmitButton
          className="w-1/2 h-8"
          text="SALVAR"
          isLoading={loading}
          title="Salvar saldo inicial"
        />
        <ResetButton
          title="Cancelar configuração de saldo inicial"
          className="w-1/2 h-8"
          text="CANCELAR"
        />
      </div>
    </form>
  );
}
