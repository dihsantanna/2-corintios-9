import { FaFilePdf } from 'react-icons/fa';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReactElement, ReactNode, useEffect } from 'react';
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
  useEffect(() => {
    getReport();
  }, [getReport, referenceMonth, referenceYear]);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full text-zinc-900 relative">
        <div className="absolute left-11 top-6">
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
        </div>
        <div className="flex items-center justify-center gap-2">
          <FilterByMonthAndYear
            setReferenceMonth={setReferenceMonth}
            setReferenceYear={setReferenceYear}
            monthValue={referenceMonth}
            yearValue={referenceYear}
          />
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
