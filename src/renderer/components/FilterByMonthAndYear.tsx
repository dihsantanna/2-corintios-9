import { useEffect, useRef } from 'react';
import { months } from '../utils/months';
import { getYears } from '../utils/years';

interface FilterByMonthAndYearProps {
  setReferenceMonth: (month: number) => void;
  setReferenceYear: (year: number) => void;
  monthValue: number;
  yearValue: number;
}

export function FilterByMonthAndYear({
  setReferenceMonth,
  setReferenceYear,
  monthValue,
  yearValue,
}: FilterByMonthAndYearProps) {
  const initialDate = useRef({
    month: 0,
    year: 0,
  });
  useEffect(() => {
    const getInitialBalance = async () => {
      const initialBalance = await window.initialBalance.get();
      if (initialBalance) {
        initialDate.current = {
          month: initialBalance.referenceMonth,
          year: initialBalance.referenceYear,
        };
      }
    };
    getInitialBalance();
  }, []);
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <select
        title="Escolha um mês"
        name="filterByMonth"
        onChange={({ target: { value } }) => setReferenceMonth(+value)}
        value={monthValue}
        className="cursor-pointer text-center text-zinc-200 bg-zinc-900 p-2 font-light block w-full leading-normal rounded-sm"
      >
        <option disabled value={0}>
          Selecione o mês
        </option>
        {Object.entries(months).map(([key, value]) => {
          const { month, year } = initialDate.current;
          return (
            <option
              title={value}
              key={key}
              value={key}
              disabled={
                new Date(`${year}-${month}-01`).getTime() >
                  new Date(`${yearValue}-${key}-01`).getTime() ||
                new Date().getTime() <
                  new Date(`${yearValue}-${key}-01`).getTime()
              }
            >
              {value}
            </option>
          );
        })}
      </select>
      <select
        title="Escolha um ano"
        name="filterByYear"
        onChange={({ target: { value } }) => setReferenceYear(+value)}
        value={yearValue}
        className="cursor-pointer text-center text-zinc-200 bg-zinc-900 p-2 font-light block w-full leading-normal rounded-sm"
      >
        <option disabled value={0}>
          Selecione o ano
        </option>
        {getYears().map((year) => (
          <option
            title={year.toString()}
            key={year}
            value={year}
            disabled={
              new Date(
                `${initialDate.current.year}-${initialDate.current.month}-01`,
              ).getTime() > new Date(`${year}-${monthValue}-01`).getTime() ||
              new Date().getTime() <
                new Date(`${year}-${monthValue}-01`).getTime()
            }
          >
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
