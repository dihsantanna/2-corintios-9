import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ReportView } from './ReportView';

export function EntriesReport() {
  const [referenceMonth, setReferenceMonth] = useState(
    new Date().getMonth() + 1
  );
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [pdf, setPdf] = useState<Buffer | null>(null);

  useEffect(() => {
    const getReport = async () => {
      try {
        const report = await window.report.entries(
          referenceMonth,
          referenceYear
        );
        setPdf(report);
      } catch (err) {
        toast.error((err as Error).message);
      }
    };

    if (referenceMonth && referenceYear) getReport();
  }, [referenceMonth, referenceYear]);

  return (
    <ReportView
      title="Relatório de Entradas"
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
      setReferenceMonth={setReferenceMonth}
      setReferenceYear={setReferenceYear}
      pdf={pdf}
    />
  );
}
