import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { IExpenseState } from 'main/@types/Expense';
import { IExpenseCategoryState } from 'main/@types/ExpenseCategory';
import { ITotalEntries } from 'main/@types/Report';
import { ReportView } from '../ReportView';
import { months } from '../../../utils/months';
import { GeneralReportDocument } from '../Document/GeneralReportDocument';
import { Table } from '../Table';
import { Infos } from '../Infos';
import { useGlobalContext } from '../../../context/GlobalContext/GlobalContextProvider';

type MonthKey = keyof typeof months;

const INITIAL_STATE: ITotalEntries = {
  totalLooseOffers: 0,
  totalSpecialOffers: 0,
  totalTithes: 0,
  totalWithdrawalsBankAccount: 0,
  totalOtherEntries: 0,
  totalEntries: 0,
  previousBalance: 0,
};

export function GeneralReport() {
  const { churchData, referenceDate } = useGlobalContext();
  const [monthAndYear, setMonthAndYear] = useState({
    month: referenceDate.month,
    year: referenceDate.year,
  });
  const [expenses, setExpenses] = useState<IExpenseState[]>([]);
  const [categories, setCategories] = useState<IExpenseCategoryState[]>([]);
  const [totalEntries, setTotalEntries] = useState({
    ...INITIAL_STATE,
  } as ITotalEntries);
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
        const { totalEntries: entries } = await window.report.entries(
          month,
          year,
        );
        setTotalEntries(entries);
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

  const handleInfoTop = useCallback(() => {
    const info = [
      {
        title: 'SALDO ANTERIOR',
        amount: totalEntries.previousBalance,
      },
      {
        title: 'DÍZIMOS',
        amount: totalEntries.totalTithes,
      },
      {
        title: 'OFERTAS ESPECIAIS',
        amount: totalEntries.totalSpecialOffers,
      },
      {
        title: 'OFERTAS DE GAZOFILÁCIO',
        amount: totalEntries.totalLooseOffers,
      },
      ...(totalEntries.totalOtherEntries
        ? [
            {
              title: 'OUTRAS ENTRADAS',
              amount: totalEntries.totalOtherEntries,
            },
          ]
        : []),
    ];

    if (totalEntries.totalWithdrawalsBankAccount) {
      info.push({
        title: 'SAQUES EM CONTA BANCÁRIA',
        amount: totalEntries.totalWithdrawalsBankAccount,
      });
    }

    info.push({
      title: 'TOTAL DE ENTRADAS',
      amount: totalEntries.totalEntries,
    });

    return info;
  }, [totalEntries]);

  const infoTop = handleInfoTop();

  const infoBottom = [
    {
      title: 'TOTAL GERAL DE ENTRADAS',
      amount: totalEntries.totalEntries + totalEntries.previousBalance,
    },
    {
      title: 'TOTAL DE SAÍDAS',
      amount: totalExpenses,
    },
    {
      title: `SALDO P/ O MÊS DE ${
        months?.[monthAndYear.month as MonthKey] !== 'Dezembro'
          ? months?.[(monthAndYear.month + 1) as MonthKey]?.toUpperCase()
          : 'JANEIRO'
      }`,
      amount:
        totalEntries.previousBalance +
        totalEntries.totalEntries -
        totalExpenses,
    },
  ];

  return (
    <ReportView
      fileName={`Relatorio-geral-${months[
        monthAndYear.month as MonthKey
      ].toLowerCase()}-${monthAndYear.year}.pdf`}
      getReport={getReport}
      isLoading={loading}
      document={
        <GeneralReportDocument
          dataOfChurch={churchData}
          expenseCategories={categories}
          expenses={expenses}
          referenceMonth={monthAndYear.month}
          referenceYear={monthAndYear.year}
          infoTop={infoTop}
          infoBottom={infoBottom}
        />
      }
    >
      <>
        <Infos infos={infoTop} isTop />
        {categories.map(({ id, name }) => {
          const filteredExpenses = expenses.filter(
            (expense) => expense.expenseCategoryId === id,
          );

          const subTotal = filteredExpenses.reduce(
            (total, { value }) => total + value,
            0,
          );
          return subTotal ? (
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
          ) : null;
        })}
        <Infos infos={infoBottom} />
      </>
    </ReportView>
  );
}
