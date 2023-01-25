import type { Screens } from '/@/@types/Screens.type';
import { FilterByMonthAndYear } from '../FilterByMonthAndYear';
import { months } from '/@/utils/months';
import { FaFilePdf } from 'react-icons/fa';

interface ReportViewProps {
  screenSelected: Screens;
  screenName: Screens;
  title: string;
  setReferenceMonth: React.Dispatch<React.SetStateAction<number>>;
  setReferenceYear: React.Dispatch<React.SetStateAction<number>>;
  referenceMonth: number;
  referenceYear: number;
  pdf: Buffer | null;
}

type MonthKey = keyof typeof months;

export function ReportView({
  screenSelected,
  screenName,
  title,
  setReferenceMonth,
  setReferenceYear,
  referenceMonth,
  referenceYear,
  pdf,
}: ReportViewProps) {
  const pdfUrl = () => URL.createObjectURL(new Blob([pdf as Buffer], { type: 'application/pdf' }));
  return (
    <div
      style={{
        display: screenSelected === screenName ? 'flex' : 'none',
      }}
      className="flex flex-col items-center justify-center w-full h-full text-zinc-900 relative"
    >
      <FilterByMonthAndYear
        setReferenceMonth={setReferenceMonth}
        setReferenceYear={setReferenceYear}
        monthValue={referenceMonth}
        yearValue={referenceYear}
      />
      <div
        className="relative w-11/12 h-[90%] flex items-center justify-center rounded-md border border-zinc-200 "
      >
        {
          pdf
            ? (
              <>
                <iframe
                  className="w-full h-full pl-12 pr-6 pt-8 flex flex-col items-center"
                  src={pdfUrl()}
                  loading='lazy'
                />
                <a
                  title="Salvar PDF"
                  className="absolute top-11 right-[120px] inline-flex justify-center rounded-md bg-green-700 px-2 py-[6px] text-base font-medium text-zinc-200 shadow-sm hover:bg-green-600 hover:text-zinc-50 z-30"
                  href={pdfUrl()}
                  download={
                    `${title} ${months[referenceMonth as MonthKey]}-${referenceYear}.pdf`
                  }
                >
                  Salvar PDF
                </a>
              </>
            )
            : (<span className="animate-pulse flex flex-col items-center justify-center gap-2">
              Gerando Relatório ...
              <FaFilePdf className="w-8 h-8 fill-red-500" />
            </span>)
        }
      </div>
    </div>
  );
}
