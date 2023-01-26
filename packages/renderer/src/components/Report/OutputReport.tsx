import { useEffect, useState } from 'react';
import { ReportView } from './ReportView';
import {
  findAllExpensesByReferences,
  findAllExpenseCategories,
  createOutputReport,
} from '#preload';
import type { Expense, ExpenseCategory } from '#preload';
import { toast } from 'react-toastify';

export function OutputReport() {
  const [referenceMonth, setReferenceMonth] = useState(new Date().getMonth() + 1);
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [pdf, setPdf] = useState<Buffer | null>(null);

  const getTotalExpenses = (expenses: Expense[]) => {
    return expenses.reduce((total, expense) => total + expense.value, 0);
  };

  const getPDF = async (expenses: Expense[], expenseCategories: ExpenseCategory[]) => {
    const totalExpenses = getTotalExpenses(expenses);
    return await createOutputReport({
      expenses,
      totalExpenses,
      referenceMonth,
      referenceYear,
      expenseCategories,
    });
  };

  useEffect(() => {
    if (referenceMonth !== 0 && referenceYear !== 0) {
      findAllExpenseCategories()
        .then((expenseCategories) => {
          findAllExpensesByReferences(referenceMonth, referenceYear)
          .then((expenses) => {
            setPdf(null);
            getPDF(expenses, expenseCategories).then((newPdf) => setPdf(newPdf)).catch((error) => {
              toast.error((error as Error).message);
            });
          });
        });
    }
  }, [referenceMonth, referenceYear]);

  return (
    <ReportView
      title="Relatório de Saídas"
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
      setReferenceMonth={setReferenceMonth}
      setReferenceYear={setReferenceYear}
      pdf={pdf}
    />
  );
}
