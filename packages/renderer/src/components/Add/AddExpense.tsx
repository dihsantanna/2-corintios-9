import { useEffect, useRef, useState } from 'react';
import { AddForm } from './AddForm';
import type { Screens } from '/@/@types/Screens.type';
import type { ExpenseCategory} from '#preload';
import { addExpense} from '#preload';
import { findAllExpenseCategories } from '#preload';
import { months } from '/@/utils/months';
import { getYears } from '/@/utils/years';
import { toast } from 'react-toastify';

interface Expense {
  expenseCategoryId: string;
  title: string;
  value: string;
  referenceMonth: number;
  referenceYear: number;
}

interface AddExpenseProps {
  screenSelected: Screens;
}

const INITIAL_STATE: Expense = {
  expenseCategoryId: '',
  title: '',
  value: '',
  referenceMonth: 0,
  referenceYear: 0,
  };

export function AddExpense({ screenSelected }: AddExpenseProps) {
  const [expense, setExpense] = useState<Expense>({...INITIAL_STATE });

  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (screenSelected === 'addExpense') {
      findAllExpenseCategories().then((expenseCategories) => {
        setExpenseCategories(expenseCategories);
      });
      mounted.current = true;
    }

    if (screenSelected !== 'addExpense' && mounted.current) {
      setExpense({...INITIAL_STATE });
      mounted.current = false;
    }
  }, [screenSelected]);



  const formValidate = (floatValue: number, title: string, referenceMonth: number, referenceYear: number, expenseCategoryId: string) => {
    if (floatValue <= 0) {
      toast.warn('Valor da despesa deve ser maior que 0', {
        progress: undefined,
      });
      return false;
    } else if (referenceMonth === 0) {
      toast.warn('Por favor selecione o mês', {
        progress: undefined,
      });
      return false;
    } else if (referenceYear === 0) {
      toast.warn('Por favor selecione o ano', {
        progress: undefined,
      });
      return false;
    } else if (expenseCategoryId === '') {
      toast.warn('Por favor selecione a categoria da despesa', {
        progress: undefined,
      });
      return false;
    } else if (title.length < 4) {
      toast.warn('O Título da despesa deve possuir pelo menos 4 caracteres', {
        progress: undefined,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { expenseCategoryId, title, value, referenceMonth, referenceYear } = expense;
    const floatValue = parseFloat(value);

    if (!formValidate(floatValue, title,  referenceMonth, referenceYear, expenseCategoryId)) return;

    setLoading(true);
    addExpense({ expenseCategoryId, title, value: floatValue, referenceMonth, referenceYear })
      .then(() => {
        toast.success('Despesa cadastrada com sucesso!', {
          progress: undefined,
        });
      }).catch((err) => {
        toast.error(`Erro ao cadastrar despesa: ${err.message}`, {
          progress: undefined,
        });
      }).finally(() => {
        setLoading(false);
        setExpense({...INITIAL_STATE });
      });
  };

  const handleSelectChange = ({ target: { value, name } }: React.ChangeEvent<HTMLSelectElement>) => {
    setExpense({
      ...expense,
      [name]: name === 'expenseCategoryId' ? value : +value,
    });
  };

  const handleValueInputChange = ({ target: { value, name } }: React.ChangeEvent<HTMLInputElement>) => {
    const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(value) || value === '';
    if (!validateValue) return;

    const valueEdit = value.match(/\d|\.|,/g) || '';
    const newValue = valueEdit.length ? [...valueEdit].join('') : '';

    setExpense({
      ...expense,
      [name]: newValue.replace(',', '.'),
    });
  };

  const handleValueInputBlur = ({ target: { value, name } }: React.FocusEvent<HTMLInputElement>) => {
    const newValue = value ? parseFloat(value).toFixed(2) : '';

    setExpense({
      ...expense,
      [name]: newValue,
    });
  };

  const handleChange = ({ target: { value, name } }: React.ChangeEvent<HTMLInputElement>) => {
    setExpense({
      ...expense,
      [name]: value,
    });
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setExpense({...INITIAL_STATE });
  };

  return (
    <AddForm
      handleSubmit={handleSubmit}
      handleReset={handleReset}
      screenName="addExpense"
      screenSelected={screenSelected}
      isLoading={loading}
      title="Cadastrar Despesa"
    >
      <label
        className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-8/12"
      >
        <select
          required
          name="expenseCategoryId"
          value={expense.expenseCategoryId}
          onChange={handleSelectChange}
          className="cursor-pointer bg-zinc-900 font-light focus:outline-none block w-full appearance-none leading-normal"
        >
          <option disabled selected value="">Selecione uma categoria para a despesa</option>
          {expenseCategories.map(({id, name}) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </label>
      <label
        className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-8/12"
      >
        <input
          required
          name="title"
          placeholder="Dê um título para a despesa"
          onChange={handleChange}
          value={expense.title}
          className="bg-zinc-900 placeholder:text-zinc-200 font-light focus:outline-none block w-full appearance-none leading-normal"
          />
      </label>
      <label className="flex gap-2 items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-4/12">
        <span>R$</span>
        <input
          required
          className="bg-zinc-900 placeholder:text-zinc-200 font-light focus:outline-none block w-full appearance-none leading-normal"
          name="value"
          onChange={handleValueInputChange}
          onBlur={handleValueInputBlur}
          value={expense.value}
          placeholder="Valor da Despesa"
        />
      </label>
      <label
        className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-4/12"
      >
        <select
          required
          name="referenceMonth"
          value={expense.referenceMonth}
          onChange={handleSelectChange}
          className="cursor-pointer bg-zinc-900 font-light focus:outline-none block w-full appearance-none leading-normal"
        >
          <option disabled selected value={0}>Selecione o mês</option>
          {Object.entries(months).map(([monthIndex, month]) => (
            <option key={`${monthIndex}-${month}`} value={monthIndex}>{month}</option>
          ))}
        </select>
      </label>
      <label
        className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-4/12"
      >
        <select
          required
          name="referenceYear"
          value={expense.referenceYear}
          onChange={handleSelectChange}
          className="cursor-pointer bg-zinc-900 font-light focus:outline-none block w-full appearance-none leading-normal"
        >
          <option disabled selected value={0}>Selecione o ano</option>
          {getYears().map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </label>
    </AddForm>
  );
}
