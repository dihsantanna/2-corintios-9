import { FaFilePdf } from 'react-icons/fa';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReactElement, ReactNode, useState } from 'react';
import { FilterByMonthAndYear } from '../FilterByMonthAndYear';
import { LogoChurch } from '../LogoChurch';

interface ReportViewProps {
  fileName: string;
  document: ReactElement<Document>;
  children: ReactNode;
  getReport: () => void;
  setReferenceMonth: React.Dispatch<React.SetStateAction<number>>;
  setReferenceYear: React.Dispatch<React.SetStateAction<number>>;
  referenceMonth: number;
  referenceYear: number;
  isLoading: boolean;
}

export function ReportView({
  fileName,
  document,
  children,
  getReport,
  setReferenceMonth,
  setReferenceYear,
  referenceMonth,
  referenceYear,
  isLoading,
}: ReportViewProps) {
  const [generatePDF, setGeneratePDF] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full text-zinc-900 relative">
        <div className="absolute left-11 top-6">
          {!generatePDF ? (
            <button
              className="flex items-baseline font-semibold opacity-70 hover:opacity-100"
              type="button"
              title="Gerar PDF"
              onClick={() => setGeneratePDF(true)}
              disabled={isLoading}
            >
              <FaFilePdf className="w-5 h-5 fill-red-500" />
              Gerar PDF
            </button>
          ) : (
            <PDFDownloadLink
              className="flex items-baseline font-semibold"
              document={document}
              fileName={fileName}
            >
              {({ loading }) =>
                loading ? (
                  <span className="animate-pulse">Gerando PDF...</span>
                ) : (
                  <span
                    title="Exportar PDF"
                    className="flex items-baseline font-semibold opacity-70 hover:opacity-100"
                  >
                    <FaFilePdf className="w-5 h-5 fill-red-500" />
                    Exportar PDF
                  </span>
                )
              }
            </PDFDownloadLink>
          )}
        </div>
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
            onClick={() => {
              getReport();
              setGeneratePDF(false);
            }}
          >
            Gerar Relatório
          </button>
        </div>
        <div className="relative w-11/12 h-[90%] flex items-center justify-center rounded-md border border-zinc-200">
          {isLoading ? (
            <span className="animate-pulse flex flex-col items-center justify-center gap-2">
              Gerando Relatório ...
              <FaFilePdf className="w-8 h-8 fill-red-500" />
            </span>
          ) : (
            <div className="h-full w-full p-4 overflow-y-auto scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-900">
              {children}
            </div>
          )}
        </div>
      </div>
      <LogoChurch />
    </>
  );
}
