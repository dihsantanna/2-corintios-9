import { BsCalendar3 } from 'react-icons/bs';
import moment from 'moment';
import { Popover } from '@headlessui/react';
import { mergeObjects } from 'utils/mergeObjects';
import { useGlobalContext } from '../context/GlobalContext/GlobalContextProvider';
import { capitalize } from '../utils/capitalize';
import { getYears } from '../utils/years';
import { months } from '../utils/months';

const now = moment();
const limitDate = {
  year: now.year(),
  month: now.month() + 1,
};

export function FilterByMonthAndYear() {
  const { referenceDate, setReferenceDate, initialDate } = useGlobalContext();

  const date = moment(
    `${referenceDate.year}-${referenceDate.month
      .toString()
      .padStart(2, '0')}-01`,
  );

  // Função para verificar se um ano é válido (entre initialDate e limitDate)
  const isYearValid = (year: number): boolean => {
    return year >= initialDate.current.year && year <= limitDate.year;
  };

  // Função para verificar se um mês é válido para um determinado ano
  const isMonthValid = (month: number, year: number): boolean => {
    // Verificar limite inferior (initialDate)
    if (year < initialDate.current.year) {
      return false; // Anos anteriores são inválidos
    }
    if (
      year === initialDate.current.year &&
      month < initialDate.current.month
    ) {
      return false; // Meses anteriores ao inicial no mesmo ano são inválidos
    }

    // Verificar limite superior (limitDate)
    if (year > limitDate.year) {
      return false; // Anos posteriores ao limite são inválidos
    }
    if (year === limitDate.year && month > limitDate.month) {
      return false; // Meses posteriores ao limite no mesmo ano são inválidos
    }

    return true; // Mês está dentro do intervalo válido
  };

  // Função para ajustar o mês quando o ano é alterado
  const getValidMonthForYear = (year: number): number => {
    let validMonth = referenceDate.month;

    // Ajustar para o limite inferior (initialDate)
    if (year === initialDate.current.year) {
      validMonth = Math.max(validMonth, initialDate.current.month);
    }

    // Ajustar para o limite superior (limitDate)
    if (year === limitDate.year) {
      validMonth = Math.min(validMonth, limitDate.month);
    }

    return validMonth;
  };

  return (
    <Popover>
      <Popover.Button
        as="button"
        tabIndex={0}
        className="focus:outline-none focus:bg-teal-500 focus:text-zinc-900 flex items-center bg-zinc-900 rounded-sm
         py-2 px-3 hover:text-zinc-900 hover:bg-teal-500 gap-2"
      >
        {`${capitalize(date.format('MMMM'))} de ${date.format('YYYY')}`}
        <BsCalendar3 className="w-6 h-6" />
      </Popover.Button>

      <Popover.Panel className="absolute mt-1 z-10 border border-zinc-800/30 w-80 rounded-sm">
        <div className="bg-white rounded-sm p-2 w-full">
          <div className="flex justify-between items-center w-full mb-2">
            <div className="w-1/2 text-center">
              <span className="text-sm font-medium text-zinc-900">Mês</span>
            </div>
            <div className="w-1/2 text-center">
              <span className="text-sm font-medium text-zinc-900">Ano</span>
            </div>
          </div>
          <div className="flex justify-between w-full h-[524px]">
            <div className="w-1/2 text-center space-y-1">
              {Object.entries(months).map(([key, month]) => {
                const monthNumber = Number(key);
                const isDisabled = !isMonthValid(
                  monthNumber,
                  referenceDate.year,
                );
                const isSelected = monthNumber === referenceDate.month;

                return (
                  <button
                    type="button"
                    key={`${key}-${month}`}
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) {
                        setReferenceDate((prev) =>
                          mergeObjects(prev, { month: monthNumber }),
                        );
                      }
                    }}
                    className={`w-full flex items-center justify-center h-10 rounded-sm focus:outline-none py-2 px-3 ${
                      isDisabled
                        ? 'bg-zinc-300/50 text-zinc-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-teal-500 text-zinc-900'
                        : 'bg-zinc-800/10 text-zinc-900 hover:text-zinc-900 hover:bg-teal-500'
                    }`}
                  >
                    <span className="text-sm font-medium">{month}</span>
                  </button>
                );
              })}
            </div>
            <div className="w-[2px] mx-2 min-h-full bg-zinc-800/10" />
            <div className="w-1/2 text-center space-y-1">
              {getYears().map((year) => {
                const yearNumber = Number(year);
                const isDisabled = !isYearValid(yearNumber);
                const isSelected = yearNumber === referenceDate.year;

                return (
                  <button
                    type="button"
                    key={year}
                    disabled={isDisabled}
                    className={`w-full flex items-center justify-center h-10 rounded-sm focus:outline-none py-2 px-3 ${
                      isDisabled
                        ? 'bg-zinc-300/50 text-zinc-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-teal-500 text-zinc-900'
                        : 'bg-zinc-800/10 text-zinc-900 hover:text-zinc-900 hover:bg-teal-500'
                    }`}
                    onClick={() => {
                      if (!isDisabled) {
                        const validMonth = getValidMonthForYear(yearNumber);
                        setReferenceDate((prev) =>
                          mergeObjects(prev, {
                            year: yearNumber,
                            month: validMonth,
                          }),
                        );
                      }
                    }}
                  >
                    <span className="text-sm font-medium">{year}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  );
}
