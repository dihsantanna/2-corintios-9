import { useEffect, useRef, useState } from 'react';
import { ReportView } from './ReportView';
import {
  findAllExpensesByReferences,
  findAllExpenseCategories,
  createOutputReport,
} from '#preload';
import type { Expense, ExpenseCategory } from '#preload';
import type { Screens } from '/@/@types/Screens.type';
import { toast } from 'react-toastify';

interface OutputReportProps {
  screenSelected: Screens;
}

export function OutputReport({ screenSelected }: OutputReportProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [referenceMonth, setReferenceMonth] = useState(new Date().getMonth() + 1);
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [pdf, setPdf] = useState<Buffer | null>(null);
  const mounted = useRef(false);

  const getPDF = async () => {
    return await createOutputReport({
      expenses,
      totalExpenses,
      referenceMonth,
      referenceYear,
      expenseCategories,
    });
  };

  const calculateTotalExpenses = (expensesArr: Expense[]) => {
    const total = expensesArr.reduce((total, expense) => total + expense.value, 0);
    setTotalExpenses(total);
  };

  useEffect(() => {
    if (screenSelected !== 'outputReport' && mounted.current) {
      setExpenses([]);
      setTotalExpenses(0);
      setPdf(null);
      setReferenceMonth(new Date().getMonth() + 1);
      setReferenceYear(new Date().getFullYear());
      mounted.current = false;
    }

    if (screenSelected === 'outputReport') {
      findAllExpenseCategories()
        .then((expenseCategories) => {
          findAllExpensesByReferences(referenceMonth, referenceYear)
            .then((expenses) => {
              setExpenseCategories(expenseCategories);
              setExpenses(expenses);
              calculateTotalExpenses(expenses);
              mounted.current = true;
            });
        });
    }
  }, [screenSelected]);

  useEffect(() => {
    if (referenceMonth !== 0 && referenceYear !== 0) {
      findAllExpensesByReferences(referenceMonth, referenceYear)
        .then((expenses) => {
          setExpenses(expenses);
          calculateTotalExpenses(expenses);
          mounted.current = true;
        });
    }
  }, [referenceMonth, referenceYear, screenSelected]);

  useEffect(() => {
    setPdf(null);
    getPDF().then((newPdf) => setPdf(newPdf)).catch((error) => {
      toast.error((error as Error).message);
    });
  }, [expenses]);

  return (
    <ReportView
      screenSelected={screenSelected}
      screenName="outputReport"
      title="Relatório de Saídas"
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
      setReferenceMonth={setReferenceMonth}
      setReferenceYear={setReferenceYear}
      pdf={pdf}
    />
  );
}
