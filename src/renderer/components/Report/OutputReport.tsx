import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ReportView } from './ReportView';

export function OutputReport() {
  const [referenceMonth, setReferenceMonth] = useState(
    new Date().getMonth() + 1
  );
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [pdf, setPdf] = useState<Buffer | null>(null);

  useEffect(() => {
    const getReport = async () => {
      try {
        const report = await window.report.output(
          referenceMonth,
          referenceYear
        );
        setPdf(report);
      } catch (err) {
        toast.error((err as Error).message);
      }
    };
    if (referenceMonth !== 0 && referenceYear !== 0) getReport();
  }, [referenceMonth, referenceYear]);

  return (
    <ReportView
      title="Relatório de Saídas"
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
      setReferenceMonth={setReferenceMonth}
      setReferenceYear={setReferenceYear}
      pdf={pdf}
    />
  );
}
