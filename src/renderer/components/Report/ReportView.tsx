import { FaFilePdf } from 'react-icons/fa';
import { FilterByMonthAndYear } from '../FilterByMonthAndYear';
import { months } from '../../utils/months';

interface ReportViewProps {
  title: string;
  getReport: () => void;
  setReferenceMonth: React.Dispatch<React.SetStateAction<number>>;
  setReferenceYear: React.Dispatch<React.SetStateAction<number>>;
  referenceMonth: number;
  referenceYear: number;
  monthAndYear: { month: number; year: number };
  pdf: string;
}

type MonthKey = keyof typeof months;

export function ReportView({
  title,
  getReport,
  setReferenceMonth,
  setReferenceYear,
  referenceMonth,
  referenceYear,
  monthAndYear,
  pdf,
}: ReportViewProps) {
  const { month, year } = monthAndYear;
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-zinc-900 relative">
      <div className="flex items-center justify-center gap-2">
        <FilterByMonthAndYear
          setReferenceMonth={setReferenceMonth}
          setReferenceYear={setReferenceYear}
          monthValue={referenceMonth}
          yearValue={referenceYear}
        />
        <button
          title="Gerar Relatório"
          className="focus:outline-none text-zinc-200 focus:bg-yellow-300 focus:text-zinc-900 bg-red-600 hover:bg-yellow-300 hover:text-zinc-900 cursor-pointer w-max px-3 h-10 rounded-md font-semibold"
          type="button"
          onClick={getReport}
        >
          Gerar Relatório
        </button>
      </div>
      <div className="relative w-11/12 h-[90%] flex items-center justify-center rounded-md border border-zinc-200">
        {pdf ? (
          <>
            <iframe
              title={title}
              className="w-full h-full pl-12 pr-6 pt-8 flex flex-col items-center"
              src={pdf}
              loading="lazy"
            />
            <a
              title="Salvar PDF"
              className="focus:outline-2 focus:outline-teal-500 absolute top-11 right-[120px] inline-flex justify-center rounded-md bg-green-700 px-2 py-[6px] text-base font-medium text-zinc-200 shadow-sm hover:bg-green-600 hover:text-zinc-50 z-30"
              href={pdf}
              download={`${title} ${months[month as MonthKey]}-${year}.pdf`}
            >
              Salvar PDF
            </a>
          </>
        ) : (
          <span className="animate-pulse flex flex-col items-center justify-center gap-2">
            Gerando Relatório ...
            <FaFilePdf className="w-8 h-8 fill-red-500" />
          </span>
        )}
      </div>
    </div>
  );
}
