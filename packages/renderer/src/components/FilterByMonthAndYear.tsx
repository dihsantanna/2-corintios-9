import { months } from '../utils/months';
import { getYears } from '../utils/years';

interface FilterByMonthAndYearProps {
  setReferenceMonth: (month: number) => void
  setReferenceYear: (year: number) => void
  monthValue: number
  yearValue: number
}

export function FilterByMonthAndYear({ setReferenceMonth, setReferenceYear, monthValue, yearValue }: FilterByMonthAndYearProps) {
  return (
    <div
      className="flex items-center justify-center gap-2 py-2"
    >
      <select
        name="filterByMonth"
        onChange={({ target: { value } }) => setReferenceMonth(+value)}
        value={monthValue}
        className="cursor-pointer text-center text-zinc-200 bg-zinc-900 p-2 font-light focus:outline-none block w-full leading-normal rounded-sm"
      >
        <option
          disabled
          value={0}
        >
          Selecione o mês
        </option>
        {
          Object.entries(months).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))
        }
      </select>
      <select
        name="filterByYear"
        onChange={({ target: { value } }) => setReferenceYear(+value)}
        value={yearValue}
        className="cursor-pointer text-center text-zinc-200 bg-zinc-900 p-2 font-light focus:outline-none block w-full leading-normal rounded-sm"
      >
        <option
          disabled
          value={0}
        >
          Selecione o ano
        </option>
        {
          getYears().map((year) => (
            <option key={year} value={year}>{year}</option>
          ))
        }
      </select>
    </div>
  );
}
