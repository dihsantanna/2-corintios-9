import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { IExpenseState } from 'main/@types/Expense';
import { IExpenseCategoryState } from 'main/@types/ExpenseCategory';
import { ReportView } from '../ReportView';
import { months } from '../../../utils/months';
import { OutputReportDocument } from '../Document/OutputReportDocument';
import { Table } from '../Table';
import { useGlobalContext } from '../../../context/GlobalContext/GlobalContextProvider';

type MonthKey = keyof typeof months;

export function OutputReport() {
  const { churchData, referenceDate } = useGlobalContext();
  const [monthAndYear, setMonthAndYear] = useState({
    month: referenceDate.month,
    year: referenceDate.year,
  });
  const [expenses, setExpenses] = useState<IExpenseState[]>([]);
  const [categories, setCategories] = useState<IExpenseCategoryState[]>([]);
  const [loading, setLoading] = useState(false);

  const mounted = useRef(false);

  const getCategories = useCallback(async () => {
    try {
      const allCategories = await window.expenseCategory.findAll();
      setCategories(allCategories);
    } catch (err) {
      toast.error(
        `Erro ao buscar categorias de despesa: ${(err as Error).message}`,
      );
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const totalExpenses = expenses.reduce((total, { value }) => total + value, 0);

  const getReport = useCallback(async () => {
    const { month, year } = referenceDate;
    if (month && year) {
      try {
        setLoading(true);
        const allExpenses =
          await window.expense.findAllByReferencesWithCategoryName(month, year);
        setMonthAndYear({ month, year });
        setExpenses(allExpenses);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
  }, [referenceDate]);

  useEffect(() => {
    if (!mounted.current) {
      getReport();
      mounted.current = true;
    }
  }, [getReport]);

  return (
    <ReportView
      fileName={`Relatorio-de-saidas-${months[
        monthAndYear.month as MonthKey
      ].toLowerCase()}-${monthAndYear.year}.pdf`}
      getReport={getReport}
      isLoading={loading}
      document={
        <OutputReportDocument
          dataOfChurch={churchData}
          expenseCategories={categories}
          expenses={expenses}
          totalExpenses={totalExpenses}
          referenceMonth={monthAndYear.month}
          referenceYear={monthAndYear.year}
        />
      }
    >
      <>
        {categories.map(({ id, name }) => {
          const filteredExpenses = expenses.filter(
            (expense) => expense.expenseCategoryId === id,
          );

          const subTotal = filteredExpenses.reduce(
            (total, { value }) => total + value,
            0,
          );
          return (
            <Table
              key={id}
              title={name}
              firstColName="TÍTULO"
              secondColName="VALOR"
              rows={filteredExpenses}
              firstColKey="title"
              secondColKey="value"
              subTotal={subTotal}
            />
          );
        })}
        <div className="bg-yellow-300 text-zinc-900 font-semibold mt-4 w-full p-1 text-center">
          <div>TOTAL DE SAÍDAS</div>
          <div>
            {totalExpenses.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </div>
        </div>
      </>
    </ReportView>
  );
}
