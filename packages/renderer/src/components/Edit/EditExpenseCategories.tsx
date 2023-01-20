import { useEffect, useRef, useState } from 'react';
import { EditForm } from './EditForm';
import type { Screens } from '/@/@types/Screens.type';
import type { ExpenseCategory } from '#preload';
import { updateExpenseCategory } from '#preload';
import { findAllExpenseCategories } from '#preload';
import { toast } from 'react-toastify';

interface EditExpenseCategoriesProps {
  screenSelected: Screens;
}

export function EditExpenseCategories({ screenSelected }: EditExpenseCategoriesProps) {
  const [defaultExpenseCategories, setDefaultExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [editing, setEditing] = useState('');
  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (screenSelected !== 'editExpenseCategories' && mounted.current) {
      setEditing('');
      setExpenseCategories([]);
      setDefaultExpenseCategories([]);
      mounted.current = false;
    }

    if (screenSelected === 'editExpenseCategories') {
      findAllExpenseCategories().then((expenseCategories) => {
        setExpenseCategories(expenseCategories);
        setDefaultExpenseCategories(expenseCategories);
      });
      mounted.current = true;
    }
  }, [screenSelected]);

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setExpenseCategories(defaultExpenseCategories);
    setEditing('');
  };

  const handleChange = (
    { target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
  ) => {
    const key = name as keyof ExpenseCategory;
    const newExpenseCategory = {
      ...expenseCategories[index],
      [key]: value,
    } as ExpenseCategory;

    const newExpenseCategories = [...expenseCategories];
    newExpenseCategories.splice(index, 1, newExpenseCategory);

    setExpenseCategories(newExpenseCategories);
  };

  const handleSetEditing = (id: string) => {
    setEditing(id);
    setExpenseCategories(defaultExpenseCategories);
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>, index: number) => {
    event.preventDefault();
    const editedExpenseCategory = expenseCategories[index];
    if (editedExpenseCategory === defaultExpenseCategories[index]) {
      toast.warn('Faça alguma modificação ou clique em fechar para cancelar', {
        progress: undefined,
      });
      return;
    }

    if (editedExpenseCategory.name.length < 4) {
      toast.warn('Nome da categoria deve possuir pelo menos 4 caracteres', {
        progress: undefined,
      });
      return;
    }

    setLoading(true);
    updateExpenseCategory(editedExpenseCategory).then(() => {
      toast.success('Categoria de despesa alterada com sucesso!', {
        progress: undefined,
      });
      setDefaultExpenseCategories(expenseCategories);
    }).catch((err) => {
      toast.error(`Erro ao editar categoria de despesa: ${err.message}`, {
        progress: undefined,
      });
    }).finally(() => {
      setLoading(false);
      setEditing('');
    }) ;
  };

  return (
    <div
      style={{
      display: screenSelected === 'editExpenseCategories' ? 'flex' : 'none',
      }}
      className="flex-col items-center w-full h-full"
    >
      <h1
        className="flex items-center font-semibold text-2xl text-zinc-900 h-20"
      >
        Editar Categorias de Despesa
      </h1>
      <div
        className="flex w-full h-10 items-center justify-between border-y border-zinc-300 text-zinc-900"
      >
        <span className="w-1/6 flex items-center justify-center">Id</span>
        <span className="w-5/12 flex items-center justify-center">Nome</span>
        <span className="w-2/6 flex items-center justify-center">Editar</span>
      </div>
      {expenseCategories.map(({id, name}, index) => (
        <EditForm
          key={id}
          handleSubmit={(event) => handleEdit(event, index)}
          handleReset={handleReset}
          isLoading={loading}
          editingId={id}
          isEditing={editing === id}
          setIsEditing={handleSetEditing}
          className={(index % 2 === 0 ? 'bg-zinc-100' : '')}
        >
          <label className="w-1/6 flex items-center justify-center text-zinc-900">{id}</label>
          <label className="w-5/12 flex items-center justify-center text-zinc-900">
            <input
              name="name"
              value={name}
              onChange={(event) => handleChange(event, index)}
              className="text-center text-zinc-200 bg-zinc-900 p-2 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal focus:outline-none block w-full h-full appearance-none leading-normal rounded-sm"
              disabled={editing !== id}
            />
          </label>
        </EditForm>
      ))}
    </div>
  );
}
