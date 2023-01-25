import { useEffect, useRef, useState } from 'react';
import { Report } from './Report';
import {
  findAllExpensesByReferences,
  findAllExpenseCategories,
  createOutputReport,
} from '#preload';
import type { Expense, ExpenseCategory } from '#preload';
import type { Screens } from '/@/@types/Screens.type';
import { ExpensesTable } from './Tables/ExpensesTable';

interface OutputReportProps {
  screenSelected: Screens;
}

export function OutputReport({ screenSelected }: OutputReportProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [referenceMonth, setReferenceMonth] = useState(new Date().getMonth() + 1);
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [totalExpenses, setTotalExpenses] = useState(0);
  const mounted = useRef(false);

  const reportToPDF = async () => {
    return await createOutputReport({
      expenses,
      totalExpenses,
      referenceMonth,
      referenceYear,
      expenseCategories,
    });
  };

  const calculateTotalExpenses = () => {
    const total = expenses.reduce((total, expense) => total + expense.value, 0);
    setTotalExpenses(total);
  };

  useEffect(() => {
    if (screenSelected !== 'outputReport' && mounted.current) {
      setExpenses([]);
      setTotalExpenses(0);
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
              calculateTotalExpenses();
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
          calculateTotalExpenses();
          mounted.current = true;
        });
    }
  }, [referenceMonth, referenceYear, screenSelected]);

  return (
    <Report
      screenSelected={screenSelected}
      screenName="outputReport"
      title="Relatório de Saídas"
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
      setReferenceMonth={setReferenceMonth}
      setReferenceYear={setReferenceYear}
      reportToPdf={reportToPDF}
    >
      <ExpensesTable
        expenseCategories={expenseCategories}
        expenses={expenses}
      />
      <div className="w-full bg-yellow-300 font-semibold mt-6 p-3 border flex flex-col items-center justify-center">
        <span>
          Total de Saídas
        </span>
        <span>
          {
            totalExpenses
            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          }
        </span>
      </div>
    </Report>
  );
}
