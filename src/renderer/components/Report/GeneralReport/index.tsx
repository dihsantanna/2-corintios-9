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
  totalEntries: 0,
  previousBalance: 0,
};

export function GeneralReport() {
  const [referenceMonth, setReferenceMonth] = useState(
    new Date().getMonth() + 1
  );
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [monthAndYear, setMonthAndYear] = useState({
    month: referenceMonth,
    year: referenceYear,
  });
  const [expenses, setExpenses] = useState<IExpenseState[]>([]);
  const [categories, setCategories] = useState<IExpenseCategoryState[]>([]);
  const [totalEntries, setTotalEntries] = useState({
    ...INITIAL_STATE,
  } as ITotalEntries);
  const [loading, setLoading] = useState(false);
  const { churchData } = useGlobalContext();

  const mounted = useRef(false);

  const getCategories = useCallback(async () => {
    try {
      const allCategories = await window.expenseCategory.findAll();
      setCategories(allCategories);
    } catch (err) {
      toast.error(
        `Erro ao buscar categorias de despesa: ${(err as Error).message}`
      );
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const totalExpenses = expenses.reduce((total, { value }) => total + value, 0);

  const getReport = useCallback(async () => {
    if (referenceMonth && referenceYear) {
      try {
        setLoading(true);
        const allExpenses =
          await window.expense.findAllByReferencesWithCategoryName(
            referenceMonth,
            referenceYear
          );
        const { totalEntries: entries } = await window.report.entries(
          referenceMonth,
          referenceYear
        );
        setTotalEntries(entries);
        setMonthAndYear({ month: referenceMonth, year: referenceYear });
        setExpenses(allExpenses);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
  }, [referenceMonth, referenceYear]);

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
        title: 'D??ZIMOS',
        amount: totalEntries.totalTithes,
      },
      {
        title: 'OFERTAS ESPECIAIS',
        amount: totalEntries.totalSpecialOffers,
      },
      {
        title: 'OFERTAS DE GAZOFIL??CIO',
        amount: totalEntries.totalLooseOffers,
      },
    ];

    if (totalEntries.totalWithdrawalsBankAccount) {
      info.push({
        title: 'SA??DAS BANC??RIAS',
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
      title: 'TOTAL DE SA??DAS',
      amount: totalExpenses,
    },
    {
      title: `SALDO P/ O M??S DE ${months[
        (monthAndYear.month + 1) as MonthKey
      ].toLocaleUpperCase()}`,
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
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
      setReferenceMonth={setReferenceMonth}
      setReferenceYear={setReferenceYear}
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
            (expense) => expense.expenseCategoryId === id
          );

          const subTotal = filteredExpenses.reduce(
            (total, { value }) => total + value,
            0
          );
          return (
            <Table
              key={id}
              title={name}
              firstColName="T??TULO"
              secondColName="VALOR"
              rows={filteredExpenses}
              firstColKey="title"
              secondColKey="value"
              subTotal={subTotal}
            />
          );
        })}
        <Infos infos={infoBottom} />
      </>
    </ReportView>
  );
}
