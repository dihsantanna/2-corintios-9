import type { Screens } from '/@/@types/Screens.type';
import { ReactComponent as Logo } from '../../../assets/logo.svg';
import { FilterByMonthAndYear } from '../FilterByMonthAndYear';
import { months } from '/@/utils/months';
import { ModalPDFExport } from './ModalPDFExport';

interface ReportProps {
  screenSelected: Screens;
  screenName: Screens;
  children: React.ReactNode;
  title: string;
  setReferenceMonth: React.Dispatch<React.SetStateAction<number>>;
  setReferenceYear: React.Dispatch<React.SetStateAction<number>>;
  referenceMonth: number;
  referenceYear: number;
  reportToPdf: () => Promise<Buffer | undefined>;
}

type MonthKey = keyof typeof months;

export function Report({
  screenSelected,
  screenName,
  children,
  title,
  setReferenceMonth,
  setReferenceYear,
  referenceMonth,
  referenceYear,
  reportToPdf,
}: ReportProps) {
  return (
    <div
      style={{
        display: screenSelected === screenName ? 'flex' : 'none',
      }}
      className="flex flex-col items-center justify-center w-full h-full text-zinc-900 relative"
    >
      <ModalPDFExport
        title={title}
        reportToPdf={reportToPdf}
        referenceMonth={referenceMonth}
        referenceYear={referenceYear}
      />
      <FilterByMonthAndYear
        setReferenceMonth={setReferenceMonth}
        setReferenceYear={setReferenceYear}
        monthValue={referenceMonth}
        yearValue={referenceYear}
      />
      <div
        id="entries-report-to-pdf"
        className="w-[800px] min-h-[90%] pl-12 pr-6 pt-8 rounded-md border border-zinc-200 flex flex-col items-center overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-zinc-100 scroll-smooth"
      >
        <header
          className="relative flex items-center justify-center h-16 w-full"
        >
          <div className="absolute left-0 top-0 bg-white rounded-tl-md rounded-br-md w-20 h-20 flex items-center justify-center">
            <Logo className="w-14 h-14" />
          </div>
          <h1
            className="text-3xl text-center font-bold text-zinc-900 bg-yellow-300 p-3 flex-1 rounded-l-none rounded-t-md h-16"
          >
            {title}
          </h1>
        </header>
        <div className="w-full bg-yellow-300 text-zinc-900 flex flex-col justify-center items-center">
          <h2 className="text-2xl italic font-semibold">Igreja Batista de Marco II</h2>
          <h3 className="text-lg italic font-semibold">Organizada em 30 de Junho de 1996</h3>
          <h5 className="text-sm">CNPJ - 02.079.900/001-00</h5>
          <h5 className="text-sm">Rua Manoel Ribeiro Marinho, 127 - Marco II - Nova Iguaçu - RJ</h5>
          <h5 className="text-sm">CEP: 26.261-170</h5>
        </div>
        <div
          className="w-full flex items-baseline justify-end text-base italic h-16 rounded-md pr-2"
        >
          {`Relatório referente ao mês de ${months[referenceMonth as MonthKey]} de ${referenceYear}`}
        </div>
        <main
          className="flex flex-col w-full items-center justify-center"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
