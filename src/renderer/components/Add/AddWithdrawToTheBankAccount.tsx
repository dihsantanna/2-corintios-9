import { useState } from 'react';
import { toast } from 'react-toastify';
import { AddForm } from './AddForm';
import { months } from '../../utils/months';
import { getYears } from '../../utils/years';

interface WithdrawToTheBankAccount {
  value: string;
  referenceMonth: number;
  referenceYear: number;
}

const INITIAL_STATE: WithdrawToTheBankAccount = {
  value: '',
  referenceMonth: new Date().getMonth() + 1,
  referenceYear: new Date().getFullYear(),
};

export function AddWithdrawToTheBankAccount() {
  const [withdrawToTheBankAccount, setWithdrawToTheBankAccount] =
    useState<WithdrawToTheBankAccount>({ ...INITIAL_STATE });
  const [loading, setLoading] = useState(false);

  const formValidate = (
    floatValue: number,
    referenceMonth: number,
    referenceYear: number
  ) => {
    if (floatValue <= 0) {
      toast.warn('Valor do saque deve ser maior que 0', {
        progress: undefined,
      });
      return false;
    }
    if (referenceMonth === 0) {
      toast.warn('Por favor selecione o mês', {
        progress: undefined,
      });
      return false;
    }
    if (referenceYear === 0) {
      toast.warn('Por favor selecione o ano', {
        progress: undefined,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { value, referenceMonth, referenceYear } = withdrawToTheBankAccount;
    const floatValue = parseFloat(value);
    if (!formValidate(floatValue, referenceMonth, referenceYear)) return;

    setLoading(true);
    try {
      await window.withdrawToTheBankAccount.create({
        value: floatValue,
        referenceMonth,
        referenceYear,
      });
      toast.success('Saque cadastrado com sucesso!', {
        progress: undefined,
      });
    } catch (err) {
      toast.error(`Erro ao cadastrar saque: ${(err as Error).message}`, {
        progress: undefined,
      });
    } finally {
      setLoading(false);
      setWithdrawToTheBankAccount({ ...INITIAL_STATE });
    }
  };

  const handleSelectChange = ({
    target: { value, name },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    setWithdrawToTheBankAccount({
      ...withdrawToTheBankAccount,
      [name]: +value,
    });
  };

  const handleValueInputChange = ({
    target: { value, name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(value) || value === '';
    if (!validateValue) return;

    const valueEdit = value.match(/\d|\.|,/g) || '';
    const newValue = valueEdit.length ? [...valueEdit].join('') : '';

    setWithdrawToTheBankAccount({
      ...withdrawToTheBankAccount,
      [name]: newValue.replace(',', '.'),
    });
  };

  const handleValueInputBlur = ({
    target: { value, name },
  }: React.FocusEvent<HTMLInputElement>) => {
    const newValue = value ? parseFloat(value).toFixed(2) : '';

    setWithdrawToTheBankAccount({
      ...withdrawToTheBankAccount,
      [name]: newValue,
    });
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWithdrawToTheBankAccount({ ...INITIAL_STATE });
  };

  return (
    <AddForm
      handleSubmit={handleSubmit}
      handleReset={handleReset}
      isLoading={loading}
      title="Cadastrar Saques em Conta Bancária"
    >
      <label className="flex gap-2 items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-4/12">
        <span>R$</span>
        <input
          required
          title="Valor do Saque"
          className="bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none leading-normal"
          name="value"
          onChange={handleValueInputChange}
          onBlur={handleValueInputBlur}
          value={withdrawToTheBankAccount.value}
          placeholder="Valor do Saque"
        />
      </label>
      <label className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-4/12">
        <select
          required
          title="Selecione o mês do saque"
          name="referenceMonth"
          value={withdrawToTheBankAccount.referenceMonth}
          onChange={handleSelectChange}
          className="cursor-pointer bg-zinc-900 font-light block w-full leading-normal"
        >
          <option disabled value={0}>
            Selecione o mês
          </option>
          {Object.entries(months).map(([monthIndex, month]) => (
            <option
              title={month}
              key={`${monthIndex}-${month}`}
              value={monthIndex}
            >
              {month}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-4/12">
        <select
          required
          title="Selecione o ano do saque"
          name="referenceYear"
          value={withdrawToTheBankAccount.referenceYear}
          onChange={handleSelectChange}
          className="cursor-pointer bg-zinc-900 font-light block w-full leading-normal"
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
      </label>
    </AddForm>
  );
}
