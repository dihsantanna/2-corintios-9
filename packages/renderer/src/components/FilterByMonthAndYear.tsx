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
        title='Escolha um mês'
        name="filterByMonth"
        onChange={({ target: { value } }) => setReferenceMonth(+value)}
        value={monthValue}
        className="focus:outline-2 focus:outline-teal-500 cursor-pointer text-center text-zinc-200 bg-zinc-900 p-2 font-light block w-full leading-normal rounded-sm"
      >
        <option
          disabled
          value={0}
        >
          Selecione o mês
        </option>
        {
          Object.entries(months).map(([key, value]) => (
            <option title={value} key={key} value={key}>{value}</option>
          ))
        }
      </select>
      <select
        title='Escolha um ano'
        name="filterByYear"
        onChange={({ target: { value } }) => setReferenceYear(+value)}
        value={yearValue}
        className="focus:outline-2 focus:outline-teal-500 cursor-pointer text-center text-zinc-200 bg-zinc-900 p-2 font-light block w-full leading-normal rounded-sm"
      >
        <option
          disabled
          value={0}
        >
          Selecione o ano
        </option>
        {
          getYears().map((year) => (
            <option title={year.toString()} key={year} value={year}>{year}</option>
          ))
        }
      </select>
    </div>
  );
}
