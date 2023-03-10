import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IExpenseCategoryState } from 'main/@types/ExpenseCategory';
import { EditForm } from './EditForm';
import { FilterByMonthAndYear } from '../FilterByMonthAndYear';
import { LogoChurch } from '../LogoChurch';

interface ExpensesWithExpenseCategory {
  id: string;
  expenseCategoryId: string;
  expenseCategoryName: string;
  title: string;
  value: string;
  referenceMonth: number;
  referenceYear: number;
}

export function EditExpenses() {
  const [defaultExpenses, setDefaultExpenses] = useState<
    ExpensesWithExpenseCategory[]
  >([]);
  const [expenses, setExpenses] = useState<ExpensesWithExpenseCategory[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<
    IExpenseCategoryState[]
  >([]);
  const [categorySelected, setCategorySelected] = useState('all');
  const [editing, setEditing] = useState('');
  const [loading, setLoading] = useState(false);
  const [referenceMonth, setReferenceMonth] = useState(
    new Date().getMonth() + 1
  );
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const getExpenseCategories = async () => {
      try {
        const newExpenseCategories = await window.expenseCategory.findAll();
        setExpenseCategories(newExpenseCategories);
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

  useEffect(() => {
    const getExpenses = async () => {
      setLoading(true);
      try {
        const newExpenses =
          await window.expense.findAllByReferencesWithCategoryName(
            referenceMonth,
            referenceYear
          );
        const toFixedExpenses = newExpenses.map((expense) => ({
          ...expense,
          value: (expense.value as number).toFixed(2),
        }));
        setExpenses(toFixedExpenses);
        setDefaultExpenses(toFixedExpenses);
      } catch (err) {
        toast.error(`Erro ao carregar despesas: ${(err as Error).message}`, {
          progress: undefined,
        });
      } finally {
        setLoading(false);
      }
    };

    if (referenceMonth !== 0 && referenceYear !== 0) getExpenses();
  }, [referenceMonth, referenceYear]);

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setExpenses(defaultExpenses);
    setEditing('');
  };

  const valueChangeReplace = (
    value: string,
    expense: ExpensesWithExpenseCategory
  ) => {
    const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(value) || value === '';
    if (!validateValue) return `${expense.value}`;

    return value.replace(',', '.');
  };

  const handleChange = (
    {
      target: { name, value },
    }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    expense: ExpensesWithExpenseCategory
  ) => {
    const key = name as keyof ExpensesWithExpenseCategory;
    const newExpense = {
      ...expense,
      [key]: name === 'value' ? valueChangeReplace(value, expense) : value,
    } as ExpensesWithExpenseCategory;

    const newExpenses = expenses.map((item) =>
      item.id === expense.id ? newExpense : item
    );

    setExpenses(newExpenses);
  };

  const handleValueInputBlur = (
    { target: { value } }: React.FocusEvent<HTMLInputElement>,
    expense: ExpensesWithExpenseCategory
  ) => {
    const newValue = value ? parseFloat(value).toFixed(2) : '';
    const newExpense = {
      ...expense,
      value: newValue,
    };

    const newExpenses = expenses.map((item) =>
      item.id === expense.id ? newExpense : item
    );

    setExpenses(newExpenses);
  };

  const handleSetEditing = (id: string) => {
    setEditing(id);
    setExpenses(defaultExpenses);
  };

  const handleEdit = async (
    event: React.FormEvent<HTMLFormElement>,
    id: string
  ) => {
    event.preventDefault();
    const editedExpense = expenses.find(
      (expense) => expense.id === id
    ) as ExpensesWithExpenseCategory;
    if (
      editedExpense === defaultExpenses.find((expense) => expense.id === id)
    ) {
      toast.warn('Fa??a alguma modifica????o ou clique em fechar para cancelar', {
        progress: undefined,
      });
      return;
    }

    const floatValue = parseFloat(editedExpense.value as string);

    if (floatValue <= 0) {
      toast.warn('Valor deve ser maior que zero', {
        progress: undefined,
      });
      return;
    }

    if (editedExpense.title.length < 4) {
      toast.warn('O T??tulo da despesa deve possuir pelo menos 4 caracteres', {
        progress: undefined,
      });
      return;
    }

    setLoading(true);
    try {
      await window.expense.update({
        id: editedExpense.id,
        expenseCategoryId: editedExpense.expenseCategoryId,
        title: editedExpense.title,
        value: floatValue,
        referenceMonth: editedExpense.referenceMonth,
        referenceYear: editedExpense.referenceYear,
      });
      toast.success('Despesa alterada com sucesso!', {
        progress: undefined,
      });
      setDefaultExpenses(expenses);
    } catch (err) {
      toast.error(`Erro ao editar despesa: ${(err as Error).message}`, {
        progress: undefined,
      });
    } finally {
      setLoading(false);
      setEditing('');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await window.expense.delete(id);

      const newExpenses = expenses.filter((expense) => expense.id !== id);
      setExpenses(newExpenses);
      setDefaultExpenses(newExpenses);

      toast.success('Despesa exclu??da com sucesso!', {
        progress: undefined,
      });
    } catch (err) {
      toast.error(`Erro ao excluir despesa: ${(err as Error).message}`, {
        progress: undefined,
      });
    }
  };

  const handleFilter = () =>
    categorySelected === 'all'
      ? expenses
      : expenses.filter(
          (expense) => expense.expenseCategoryId === categorySelected
        );

  const filteredExpenses = handleFilter();

  return (
    <>
      <div className="flex flex-col items-center w-full h-full">
        <h1 className="flex items-center font-semibold text-2xl text-zinc-900 h-20">
          Editar Despesas
        </h1>
        <div>
          <FilterByMonthAndYear
            monthValue={referenceMonth}
            yearValue={referenceYear}
            setReferenceMonth={setReferenceMonth}
            setReferenceYear={setReferenceYear}
          />
          <div className="flex items-center justify-center gap-2 py-2">
            <select
              title="Selecione uma categoria de despesa"
              className="cursor-pointer text-center text-zinc-200 bg-zinc-900 p-2 font-light block w-full leading-normal rounded-sm"
              value={categorySelected}
              onChange={({ target: { value } }) => setCategorySelected(value)}
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              <option title="Todas" value="all">
                Todas as Despesas
              </option>
              {expenseCategories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(({ id, name }) => (
                  <option title={name} key={id} value={id}>
                    {name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="flex w-full h-10 items-center justify-between border-y border-zinc-300 text-zinc-900">
          <span className="w-4/12 flex items-center justify-center">
            Categoria
          </span>
          <span className="w-3/12 flex items-center justify-center">
            T??tulo
          </span>
          <span className="w-1/12 flex items-center justify-center">
            Valor (R$)
          </span>
          <span className="w-2/6 flex items-center justify-center">Editar</span>
        </div>
        <div className="w-full h-full flex flex-col overflow-auto scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-zinc-300">
          {!filteredExpenses.length ? (
            <span className="m-auto text-zinc-500">
              N??o h?? Despesas cadastradas para o m??s e ano selecionados!
            </span>
          ) : (
            filteredExpenses.map(
              (
                {
                  id,
                  expenseCategoryId,
                  title,
                  value,
                  expenseCategoryName,
                  referenceMonth: month,
                  referenceYear: year,
                },
                index
              ) => (
                <EditForm
                  key={id}
                  handleSubmit={(event) => handleEdit(event, id)}
                  handleReset={handleReset}
                  isLoading={loading}
                  editingId={id}
                  isEditing={editing === id}
                  setIsEditing={handleSetEditing}
                  className={index % 2 === 0 ? 'bg-zinc-100' : ''}
                  onDelete={() => handleDelete(id)}
                  deleteMessage={`Tem certeza que deseja excluir esta despesa, no valor de "R$ ${value}"? Esta a????o n??o poder?? ser desfeita. Clique em "SIM" para confirmar.`}
                  deleteTitle="Excluir Despesa"
                  editType="despesa"
                >
                  <label className="w-4/12 flex items-center justify-center text-zinc-900">
                    <select
                      title="Selecione uma categoria de despesa"
                      value={expenseCategoryId}
                      name="expenseCategoryId"
                      onChange={(event) =>
                        handleChange(event, {
                          id,
                          expenseCategoryId,
                          title,
                          value,
                          expenseCategoryName,
                          referenceMonth: month,
                          referenceYear: year,
                        })
                      }
                      className="text-center text-zinc-200 bg-zinc-900 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal block w-11/12 h-full disabled:appearance-none leading-normal rounded-sm"
                      disabled={editing !== id}
                    >
                      <option value="" disabled>
                        Selecione uma categoria
                      </option>
                      {expenseCategories.map(
                        ({ id: categoryId, name: categoryName }) => (
                          <option
                            title={categoryName}
                            key={categoryId}
                            value={categoryId}
                          >
                            {categoryName}
                          </option>
                        )
                      )}
                    </select>
                  </label>
                  <label className="w-3/12 flex items-center justify-center text-zinc-900">
                    <input
                      required
                      title="T??tulo da Despesa"
                      name="title"
                      value={title}
                      onChange={(event) =>
                        handleChange(event, {
                          id,
                          expenseCategoryId,
                          title,
                          value,
                          expenseCategoryName,
                          referenceMonth: month,
                          referenceYear: year,
                        })
                      }
                      className="text-center text-zinc-200 bg-zinc-900 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal block w-11/12 h-full disabled:appearance-none leading-normal rounded-sm"
                      disabled={editing !== id}
                    />
                  </label>
                  <label className="w-1/12 flex items-center justify-center text-zinc-900">
                    <input
                      required
                      title="Valor da Despesa"
                      name="value"
                      value={value}
                      onChange={(event) =>
                        handleChange(event, {
                          id,
                          expenseCategoryId,
                          title,
                          value,
                          expenseCategoryName,
                          referenceMonth: month,
                          referenceYear: year,
                        })
                      }
                      onBlur={(event) =>
                        handleValueInputBlur(event, {
                          id,
                          expenseCategoryId,
                          title,
                          value,
                          expenseCategoryName,
                          referenceMonth: month,
                          referenceYear: year,
                        })
                      }
                      className="text-center text-zinc-200 bg-zinc-900 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal block w-11/12 h-full disabled:appearance-none leading-normal rounded-sm"
                      disabled={editing !== id}
                    />
                  </label>
                </EditForm>
              )
            )
          )}
        </div>
      </div>
      <LogoChurch />
    </>
  );
}
