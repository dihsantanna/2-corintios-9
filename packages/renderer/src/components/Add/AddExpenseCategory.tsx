import { useState } from 'react';
import { toast } from 'react-toastify';
import { addExpenseCategory } from '#preload';
import { AddForm } from './AddForm';

interface ExpenseCategory {
  name: string;
}

export function AddExpenseCategory() {
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>({
    name: '',
  });
  const [loading, setLoading] = useState(false);

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
      isLoading={loading}
      title="Cadastrar Categoria de Despesa"
    >
      <label
        className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-8/12"
      >
        <input
          required
          title="Nome da Categoria de Despesa"
          name="name"
          placeholder="Escreva o nome da categoria aqui"
          onChange={handleChange}
          value={expenseCategory.name}
          className="focus:outline-2 focus:outline-teal-500 bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none leading-normal"
          />
      </label>
    </AddForm>
  );
}
