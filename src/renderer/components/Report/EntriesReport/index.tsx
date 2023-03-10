import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { IEntriesState } from 'main/@types/Report';
import { ReportView } from '../ReportView';
import { EntriesReportDocument } from '../Document/EntriesReportDocument';
import { months } from '../../../utils/months';
import { Infos } from '../Infos';
import { Table } from '../Table';
import { useGlobalContext } from '../../../context/GlobalContext/GlobalContextProvider';

type MonthKey = keyof typeof months;

const INITIAL_STATE: IEntriesState = {
  tithesAndSpecialOffers: [],
  totalEntries: {
    totalLooseOffers: 0,
    totalSpecialOffers: 0,
    totalTithes: 0,
    totalWithdrawalsBankAccount: 0,
    totalEntries: 0,
    previousBalance: 0,
  },
};

export function EntriesReport() {
  const [referenceMonth, setReferenceMonth] = useState(
    new Date().getMonth() + 1
  );
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [monthAndYear, setMonthAndYear] = useState({
    month: referenceMonth,
    year: referenceYear,
  });
  const [entries, setEntries] = useState<IEntriesState>({ ...INITIAL_STATE });
  const [loading, setLoading] = useState(false);
  const { churchData } = useGlobalContext();

  const mounted = useRef(false);

  const getReport = useCallback(async () => {
    if (referenceMonth && referenceYear) {
      setLoading(true);
      try {
        const allEntries = await window.report.entries(
          referenceMonth,
          referenceYear
        );
        setMonthAndYear({ month: referenceMonth, year: referenceYear });
        setEntries(allEntries);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
  }, [referenceMonth, referenceYear]);

  useEffect(() => {
    if (!mounted.current) {
      getReport();
      mounted.current = true;
    }
  }, [getReport]);

  const { tithesAndSpecialOffers, totalEntries } = entries;

  const {
    totalLooseOffers,
    totalWithdrawalsBankAccount,
    totalTithes,
    totalSpecialOffers,
    totalEntries: totalAllEntries,
  } = totalEntries;

  const infos = [
    { title: 'OFERTAS DE GAZOFIL??CIO', amount: totalLooseOffers },
    {
      title: 'SAQUES EM CONTA BANC??RIA',
      amount: totalWithdrawalsBankAccount,
    },
  ];

  return (
    <ReportView
      fileName={`Relatorio-de-entradas-${months[
        monthAndYear.month as MonthKey
      ].toLowerCase()}-${monthAndYear.year}.pdf`}
      getReport={getReport}
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
      setReferenceMonth={setReferenceMonth}
      setReferenceYear={setReferenceYear}
      isLoading={loading}
      document={
        <EntriesReportDocument
          dataOfChurch={churchData}
          referenceMonth={monthAndYear.month}
          referenceYear={monthAndYear.year}
          tithesAndSpecialOffers={tithesAndSpecialOffers}
          totalEntriesReport={totalEntries}
          infos={infos}
        />
      }
    >
      <>
        <Infos infos={infos} />
        <Table
          title="REGISTRO MENSAL DE DIZIMISTAS"
          firstColName="NOME"
          secondColName="VALOR"
          rows={tithesAndSpecialOffers}
          firstColKey="name"
          secondColKey="totalTithes"
          subTotal={totalTithes}
        />
        <Table
          title="REGISTRO MENSAL DE OFERTAS ESPECIAIS"
          firstColName="NOME"
          secondColName="VALOR"
          rows={tithesAndSpecialOffers}
          firstColKey="name"
          secondColKey="totalOffers"
          subTotal={totalSpecialOffers}
        />
        <div className="bg-yellow-300 text-zinc-900 font-semibold mt-4 w-full p-1 text-center">
          <div>TOTAL DE ENTRADAS</div>
          <div>
            {totalAllEntries.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </div>
        </div>
      </>
    </ReportView>
  );
}
