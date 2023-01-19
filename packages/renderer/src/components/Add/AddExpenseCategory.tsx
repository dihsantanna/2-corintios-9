import { useEffect, useRef, useState } from 'react';
import type { Screens } from '/@/@types/Screens.type';
import { toast } from 'react-toastify';
import { addExpenseCategory } from '#preload';
import { AddForm } from './AddForm';

interface ExpenseCategory {
  name: string;
}

interface AddExpenseCategoryProps {
  screenSelected: Screens;
}

export function AddExpenseCategory({ screenSelected }: AddExpenseCategoryProps) {
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>({
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (screenSelected === 'addExpenseCategory') {
      mounted.current = true;
    }

    if (screenSelected !== 'addExpenseCategory' && mounted.current) {
      setExpenseCategory({
        name: '',
      });
      mounted.current = false;
    }
  }, [screenSelected]);

  const handleChange = ({target: {value, name}}: React.ChangeEvent<HTMLInputElement>) => {
    setExpenseCategory({
      ...expenseCategory,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (expenseCategory.name.length < 4) {
      toast.warn('Nome deve possuir pelo menos 4 caracteres', {
        progress: undefined,
      });
      return;
    }

    setLoading(true);

    addExpenseCategory(expenseCategory).then(() => {
      toast.success('Categoria de despesa cadastrada com sucesso!', {
        progress: undefined,
      });
      setExpenseCategory({
        name: '',
      });
    }).catch((err) => {
      toast.error(`Erro ao cadastrar categoria de despesa: ${err.message}`, {
        progress: undefined,
      });
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setExpenseCategory({
      name: '',
    });
  };

  return (
    <AddForm
      handleSubmit={handleSubmit}
      handleReset={handleReset}
      screenSelected={screenSelected}
      screenName="addExpenseCategory"
      isLoading={loading}
      title="Cadastrar Categoria de Despesa"
    >
      <label
        className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-8/12"
      >
        <input
          required
          name="name"
          placeholder="Escreva o nome da categoria aqui"
          onChange={handleChange}
          value={expenseCategory.name}
          className="bg-zinc-900 placeholder:text-zinc-200 font-light focus:outline-none block w-full appearance-none leading-normal"
          />
      </label>
    </AddForm>
  );
}
