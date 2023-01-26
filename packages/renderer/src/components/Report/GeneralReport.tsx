import { useEffect, useState } from 'react';
import { ReportView } from './ReportView';
import {
  findAllExpenseCategories,
  createGeneralReport,
  findBalanceById,
  findExpensesByRange,
  findOffersByRange,
  findTithesByRange,
} from '#preload';
import type { Expense, ExpenseCategory, Tithe, Offer, Balance } from '#preload';
import { toast } from 'react-toastify';

export function GeneralReport() {
  const [referenceMonth, setReferenceMonth] = useState(new Date().getMonth() + 1);
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [pdf, setPdf] = useState<Buffer | null>(null);

  const getPreviousBalance = (expenses: Expense[], tithes: Tithe[], offers: Offer[], initialBalance: Balance) => {
    const { value, referenceMonth: previousMonth, referenceYear: previousYear } = initialBalance;

    const initialValue = referenceYear < previousYear
      || (referenceYear === previousYear && referenceMonth <= previousMonth)
      ? 0 : value;

    const previousTithes = tithes.reduce((total, tithe) => {
      if (tithe.referenceMonth === referenceMonth && tithe.referenceYear === referenceYear) return total;
      return total + tithe.value;
    }, 0);

    const previousOffers = offers.reduce((total, offer) => {
      if (offer.referenceMonth === referenceMonth && offer.referenceYear === referenceYear) return total;
      return total + offer.value;
    }, 0);

    const previousExpenses = expenses.reduce((total, expense) => {
      if (expense.referenceMonth === referenceMonth && expense.referenceYear === referenceYear) return total;
      return total + expense.value;
    }, 0);

    return (initialValue + previousTithes + previousOffers) - previousExpenses;
  };

  const getTotalExpenses = (currentExpenses: Expense[]) => {
    return currentExpenses.reduce((total, expense) =>  total + expense.value, 0);
  };

  const getTotalEntries = (currentTithes: Tithe[], currentOffers: Offer[]) => {
    const totalTithes = currentTithes.reduce((total, tithe) => total + tithe.value, 0);

    const totalOffers = currentOffers.reduce((total, offer) => total + offer.value, 0);

    return totalTithes + totalOffers;
  };

  const getPDF = async (
    expenseCategories: ExpenseCategory[],
    expenses: Expense[],
    tithes: Tithe[],
    offer: Offer[],
    initialBalance: Balance,
  ) => {
    const currentExpenses = expenses.filter((expense) => expense.referenceMonth === referenceMonth && expense.referenceYear === referenceYear);
    const currentTithes = tithes.filter((tithe) => tithe.referenceMonth === referenceMonth && tithe.referenceYear === referenceYear);
    const currentOffers = offer.filter((offer) => offer.referenceMonth === referenceMonth && offer.referenceYear === referenceYear);

    const previousBalance = getPreviousBalance(expenses, tithes, offer, initialBalance);

    const totalEntries = getTotalEntries(currentTithes, currentOffers);

    const totalExpenses = getTotalExpenses(currentExpenses);

    const balance = (previousBalance + totalEntries) - totalExpenses;

    return await createGeneralReport({
      previousBalance,
      totalEntries,
      expenses: currentExpenses,
      totalExpenses,
      referenceMonth,
      referenceYear,
      expenseCategories,
      balance,
    });
  };

  useEffect(() => {
    findBalanceById('INITIAL_BALANCE').then((newBalance) => {

      let balance: Balance = {
        id: 'INITIAL_BALANCE',
        value: 0,
        referenceMonth: 0,
        referenceYear: 0,
      };

      if (newBalance) {
        balance = {...newBalance};
      }

      const params = {
        previousMonth:balance.referenceMonth,
        previousYear: balance.referenceYear,
        currentMonth: referenceMonth,
        currentYear: referenceYear,
      };

      findAllExpenseCategories().then((expenseCategories) => {
          findExpensesByRange(params)
            .then((expenses) => {
              findOffersByRange(params)
                .then((offers) => {
                  findTithesByRange(params)
                    .then((tithes) => {

                      setPdf(null);
                      getPDF(expenseCategories, expenses, tithes, offers, balance)
                        .then((newPdf) => setPdf(newPdf))
                          .catch((error) => {
                            toast.error((error as Error).message);
                          });

                    });
                });
            });
        });
    });
  }, []);

    useEffect(() => {
    findBalanceById('INITIAL_BALANCE').then((balance) => {
      if (balance) {
        const params = {
          previousMonth: balance.referenceMonth,
          previousYear: balance.referenceYear,
          currentMonth: referenceMonth,
          currentYear: referenceYear,
        };

        findAllExpenseCategories().then((expenseCategories) => {
            findExpensesByRange(params)
              .then((expenses) => {
                findOffersByRange(params)
                  .then((offers) => {
                    findTithesByRange(params)
                      .then((tithes) => {

                        setPdf(null);
                        getPDF(expenseCategories, expenses, tithes, offers, balance)
                          .then((newPdf) => setPdf(newPdf))
                            .catch((error) => {
                              toast.error((error as Error).message);
                            });

                      });
                  });
              });
        });
      }
    });
  }, [referenceMonth, referenceYear]);

  return (
    <ReportView
      title="Relatório Geral"
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
      setReferenceMonth={setReferenceMonth}
      setReferenceYear={setReferenceYear}
      pdf={pdf}
    />
  );
}
