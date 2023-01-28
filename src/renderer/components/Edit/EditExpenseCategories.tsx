import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IExpenseCategoryState } from 'main/@types/ExpenseCategory';
import { EditForm } from './EditForm';

export function EditExpenseCategories() {
  const [defaultExpenseCategories, setDefaultExpenseCategories] = useState<
    IExpenseCategoryState[]
  >([]);
  const [expenseCategories, setExpenseCategories] = useState<
    IExpenseCategoryState[]
  >([]);
  const [editing, setEditing] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getExpenseCategories = async () => {
      try {
        const newExpenseCategories = await window.expenseCategory.findAll();
        setExpenseCategories(newExpenseCategories);
        setDefaultExpenseCategories(newExpenseCategories);
      } catch (err) {
        toast.error(
          `Erro ao carregar categorias de despesa: ${(err as Error).message}`,
          {
            progress: undefined,
          }
        );
      }
    };

    getExpenseCategories();
  }, []);

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setExpenseCategories(defaultExpenseCategories);
    setEditing('');
  };

  const handleChange = (
    {
      target: { name, value },
    }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const key = name as keyof IExpenseCategoryState;
    const newExpenseCategory = {
      ...expenseCategories[index],
      [key]: value,
    } as IExpenseCategoryState;

    const newExpenseCategories = [...expenseCategories];
    newExpenseCategories.splice(index, 1, newExpenseCategory);

    setExpenseCategories(newExpenseCategories);
  };

  const handleSetEditing = (id: string) => {
    setEditing(id);
    setExpenseCategories(defaultExpenseCategories);
  };

  const handleEdit = async (
    event: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
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
    try {
      await window.expenseCategory.update(editedExpenseCategory);
      toast.success('Categoria de despesa alterada com sucesso!', {
        progress: undefined,
      });
      setDefaultExpenseCategories(expenseCategories);
    } catch (err) {
      toast.error(
        `Erro ao editar categoria de despesa: ${(err as Error).message}`,
        {
          progress: undefined,
        }
      );
    } finally {
      setLoading(false);
      setEditing('');
    }
  };

  const handleDelete = async (id: string, index: number) => {
    try {
      await window.expenseCategory.delete(id);

      const newExpenseCategories = [...expenseCategories];
      newExpenseCategories.splice(index, 1);
      setExpenseCategories(newExpenseCategories);
      setDefaultExpenseCategories(newExpenseCategories);

      toast.success('Categoria de Despesa excluída com sucesso!', {
        progress: undefined,
      });
    } catch (err) {
      toast.error(
        `Erro ao excluir categoria de despesa: ${(err as Error).message}`,
        {
          progress: undefined,
        }
      );
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <h1 className="flex items-center font-semibold text-2xl text-zinc-900 h-20">
        Editar Categorias de Despesa
      </h1>
      <div className="flex w-full h-10 items-center justify-between border-y border-zinc-300 text-zinc-900">
        <span className="w-7/12 flex items-center justify-center">Nome</span>
        <span className="w-2/6 flex items-center justify-center">Editar</span>
      </div>
      <div className="w-full h-full flex flex-col overflow-auto scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-zinc-300">
        {!expenseCategories.length ? (
          <span className="m-auto text-zinc-500">
            Não há Despesas cadastradas para o mês e ano selecionados!
          </span>
        ) : (
          expenseCategories.map(({ id, name }, index) => (
            <EditForm
              key={id}
              handleSubmit={(event) => handleEdit(event, index)}
              handleReset={handleReset}
              isLoading={loading}
              editingId={id}
              isEditing={editing === id}
              setIsEditing={handleSetEditing}
              className={index % 2 === 0 ? 'bg-zinc-100' : ''}
              onDelete={() => handleDelete(id, index)}
              deleteMessage={`Tem certeza que deseja excluir a categoria "${name}"? Esta ação não poderá ser desfeita. Clique em "SIM" para confirmar.`}
              deleteTitle="Excluir Oferta"
              editType="categoria de despesa"
            >
              <label className="w-7/12 flex items-center justify-center text-zinc-900">
                <input
                  title="Nome da categoria de despesa"
                  name="name"
                  value={name}
                  onChange={(event) => handleChange(event, index)}
                  className="text-center text-zinc-200 bg-zinc-900 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal block w-11/12 h-full appearance-none leading-normal rounded-sm"
                  disabled={editing !== id}
                />
              </label>
            </EditForm>
          ))
        )}
      </div>
    </div>
  );
}
