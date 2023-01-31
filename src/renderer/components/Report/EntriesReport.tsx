import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { ReportView } from './ReportView';

export function EntriesReport() {
  const [referenceMonth, setReferenceMonth] = useState(
    new Date().getMonth() + 1
  );
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [monthAndYear, setMonthAndYear] = useState({
    month: referenceMonth,
    year: referenceYear,
  });
  const [pdf, setPdf] = useState<string>('');

  const mounted = useRef(false);

  const getReport = useCallback(async () => {
    if (referenceMonth && referenceYear) {
      try {
        setPdf('');
        const report = await window.report.entries(
          referenceMonth,
          referenceYear
        );
        setMonthAndYear({ month: referenceMonth, year: referenceYear });
        const blob = URL.createObjectURL(
          new Blob([report as Buffer], { type: 'application/pdf' })
        );
        setPdf(blob);
      } catch (err) {
        toast.error((err as Error).message);
      }
    }
  }, [referenceMonth, referenceYear]);

  useEffect(() => {
    if (!mounted.current) {
      getReport();
      mounted.current = true;
    }
  }, [getReport]);

  return (
    <ReportView
      title="Relatório de Entradas"
      monthAndYear={monthAndYear}
      getReport={getReport}
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
      setReferenceMonth={setReferenceMonth}
      setReferenceYear={setReferenceYear}
      pdf={pdf}
    />
  );
}
