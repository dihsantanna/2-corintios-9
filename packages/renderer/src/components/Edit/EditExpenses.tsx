import { useEffect, useState } from 'react';
import { EditForm } from './EditForm';
import type { ExpenseCategory } from '#preload';
import { findAllExpenseCategories, findExpensesWithCategoryNameByReferences, updateExpense, deleteExpense } from '#preload';
import { toast } from 'react-toastify';
import { FilterByMonthAndYear } from '../FilterByMonthAndYear';
import { ImSpinner2 } from 'react-icons/im';

interface ExpensesWithExpenseCategory {
  id: string;
  expenseCategoryId: string;
  title: string;
  value: string | number;
  referenceMonth: number;
  referenceYear: number;
  expenseCategory: {
    name: string;
  };
}

export function EditExpenses() {
  const [defaultExpenses, setDefaultExpenses] = useState<ExpensesWithExpenseCategory[]>([]);
  const [expenses, setExpenses] = useState<ExpensesWithExpenseCategory[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [categorySelected, setCategorySelected] = useState('all');
  const [editing, setEditing] = useState('');
  const [loading, setLoading] = useState(false);
  const [referenceMonth, setReferenceMonth] = useState(new Date().getMonth() + 1);
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());

  useEffect(() => {
    findAllExpenseCategories().then((expenseCategories) => {
      setExpenseCategories(expenseCategories);
    });
  }, []);

  useEffect(() => {
    if (referenceMonth !== 0 && referenceYear !== 0) {
      setLoading(true);
      findExpensesWithCategoryNameByReferences(referenceMonth, referenceYear).then((expenses) => {
        const toFixedExpenses = expenses.map((expense) => ({
          ...expense,
          value: (expense.value as number).toFixed(2),
        }));
        setExpenses(toFixedExpenses);
        setDefaultExpenses(toFixedExpenses);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [referenceMonth, referenceYear]);

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setExpenses(defaultExpenses);
    setEditing('');
  };

  const valueChangeReplace = (value: string, index: number) => {
    const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(value) || value === '';
    if (!validateValue) return `${expenses[index].value}`;

    return value.replace(',', '.');
  };

  const handleChange = (
    { target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
  ) => {
    const key = name as keyof ExpensesWithExpenseCategory;
    const newExpense = {
      ...expenses[index],
      [key]: name === 'value' ? valueChangeReplace(value, index) : value,
    } as ExpensesWithExpenseCategory;

    const newExpenses = [...expenses];
    newExpenses.splice(index, 1, newExpense);

    setExpenses(newExpenses);
  };

  const handleValueInputBlur = (
    { target: { value } }: React.FocusEvent<HTMLInputElement>, index: number,
  ) => {
    const newValue = (value ? parseFloat(value).toFixed(2) : '');
    const newExpense = {
      ...expenses[index],
      value: newValue,
    };

    const newExpenses = [...expenses];
    newExpenses.splice(index, 1, newExpense);

    setExpenses(newExpenses);
  };

  const handleSetEditing = (id: string) => {
    setEditing(id);
    setExpenses(defaultExpenses);
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>, index: number) => {
    event.preventDefault();
    const editedExpense = expenses[index];
    if (editedExpense === defaultExpenses[index]) {
      toast.warn('Faça alguma modificação ou clique em fechar para cancelar', {
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
      toast.warn('O Título da despesa deve possuir pelo menos 4 caracteres', {
        progress: undefined,
      });
      return;
    }

    setLoading(true);
    updateExpense({
      id: editedExpense.id,
      expenseCategoryId: editedExpense.expenseCategoryId,
      title: editedExpense.title,
      value: floatValue,
      referenceMonth: editedExpense.referenceMonth,
      referenceYear: editedExpense.referenceYear,
    }).then(() => {
      toast.success('Despesa alterada com sucesso!', {
        progress: undefined,
      });
      setDefaultExpenses(expenses);
    }).catch((err) => {
      toast.error(`Erro ao editar despesa: ${err.message}`, {
        progress: undefined,
      });
    }).finally(() => {
      setLoading(false);
      setEditing('');
    }) ;
  };

    const handleDelete = (id: string, index: number) => {
      deleteExpense(id).then(() => {
        const newExpenses = [...expenses];
        newExpenses.splice(index, 1);
        setExpenses(newExpenses);
        setDefaultExpenses(newExpenses);

        toast.success('Despesa excluída com sucesso!', {
          progress: undefined,
        });
      })
        .catch((err) => {
          toast.error(`Erro ao excluir despesa: ${err.message}`, {
            progress: undefined,
          });
        });
    };

  const handleFilter = () => {
    if (categorySelected === 'all') {
      return expenses.sort((a, b) => (
          a.expenseCategory.name.localeCompare(b.expenseCategory.name)
        ),
      );
    } else {
      return expenses.filter((expense) => (
        expense.expenseCategoryId === categorySelected
      ));
    }
  };

  const filteredExpenses = handleFilter();

  const orderedExpenses = filteredExpenses.sort((a, b) => {
    if (a.expenseCategory.name.toLocaleLowerCase() > b.expenseCategory.name.toLocaleLowerCase()) return 1;
    if (a.title.localeCompare(b.title) < 0) return -1;
    return 0;
  });

  return (
    <div
      className="flex flex-col items-center w-full h-full"
    >
      <h1
        className="flex items-center font-semibold text-2xl text-zinc-900 h-20"
      >Editar Despesas
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
            className="focus:outline-2 focus:outline-teal-500 cursor-pointer text-center text-zinc-200 bg-zinc-900 p-2 font-light block w-full leading-normal rounded-sm"
            value={categorySelected}
            onChange={({ target: { value } }) => setCategorySelected(value)}
          >
            <option value="" disabled>Selecione uma categoria</option>
            <option title="Todas" value="all">Todas as Despesas</option>
            {expenseCategories.map((category) => (
              <option title={category.name} key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div
        className="flex w-full h-10 items-center justify-between border-y border-zinc-300 text-zinc-900"
      >
        <span className="w-4/12 flex items-center justify-center">Categoria</span>
        <span className="w-3/12 flex items-center justify-center">Título</span>
        <span className="w-1/12 flex items-center justify-center">Valor (R$)</span>
        <span className="w-2/6 flex items-center justify-center">Editar</span>
      </div>
      <div className="w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-zinc-300">
        {loading && editing === ''
          ? <ImSpinner2 className="w-5 h-5 m-auto animate-spin" />
          : !orderedExpenses.length
          ? <span className="m-auto text-zinc-500">Não há Despesas cadastradas para o mês e ano selecionados!</span>
          : orderedExpenses.map(({ id, expenseCategoryId, title, value }, index) => (
          <EditForm
            key={id}
            handleSubmit={(event) => handleEdit(event, index)}
            handleReset={handleReset}
            isLoading={loading}
            editingId={id}
            isEditing={editing === id}
            setIsEditing={handleSetEditing}
            className={(index % 2 === 0 ? 'bg-zinc-100' : '')}
            onDelete={() => handleDelete(id, index)}
            deleteMessage={`Tem certeza que deseja excluir esta despesa, no valor de "R$ ${value}"? Esta ação não poderá ser desfeita. Clique em "SIM" para confirmar.`}
            deleteTitle="Excluir Despesa"
            editType="despesa"
          >
            <label className="w-4/12 flex items-center justify-center text-zinc-900">
                <select
                  title="Selecione uma categoria de despesa"
                  value={expenseCategoryId}
                  name="expenseCategoryId"
                  onChange={(event) => handleChange(event, index)}
                  className="focus:outline-2 focus:outline-teal-500 text-center text-zinc-200 bg-zinc-900 p-2 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal block w-11/12 h-full disabled:appearance-none leading-normal rounded-sm"
                  disabled={editing !== id}
                >
                  <option value="" disabled>Selecione uma categoria</option>
                  {expenseCategories.map(({id, name}) => (
                    <option title={name} key={id} value={id}>{name}</option>
                  ))}
              </select>
              </label>
              <label className="w-3/12 flex items-center justify-center text-zinc-900">
                <input
                  required
                  title="Título da Despesa"
                  name="title"
                  value={title}
                  onChange={(event) => handleChange(event, index)}
                  className="focus:outline-2 focus:outline-teal-500 text-center text-zinc-200 bg-zinc-900 p-2 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal block w-11/12 h-full disabled:appearance-none leading-normal rounded-sm"
                  disabled={editing !== id}
              />
            </label>
            <label className="w-1/12 flex items-center justify-center text-zinc-900">
                <input
                  required
                  title="Valor da Despesa"
                  name="value"
                  value={value}
                  onChange={(event) => handleChange(event, index)}
                  onBlur={(event) => handleValueInputBlur(event, index)}
                  className="focus:outline-2 focus:outline-teal-500 text-center text-zinc-200 bg-zinc-900 p-2 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal block w-11/12 h-full disabled:appearance-none leading-normal rounded-sm"
                  disabled={editing !== id}
              />
            </label>
          </EditForm>
        ))}
      </div>
    </div>
  );
}
