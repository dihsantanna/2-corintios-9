import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ReportView } from './ReportView';

export function GeneralReport() {
  const [referenceMonth, setReferenceMonth] = useState(
    new Date().getMonth() + 1
  );
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [pdf, setPdf] = useState<Buffer | null>(null);

  useEffect(() => {
    const getReport = async () => {
      setPdf(null);
      const report = await window.report.general(referenceMonth, referenceYear);
      setPdf(report);
    };

    if (referenceMonth && referenceYear) getReport();
  }, [referenceMonth, referenceYear]);

  return (
    <ReportView
      title="Relatório Geral"
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
      setReferenceMonth={setReferenceMonth}
      setReferenceYear={setReferenceYear}
      pdf={pdf}
    />
  );
}
