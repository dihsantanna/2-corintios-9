import {
  IMemberWithTotalOffersAndTotalTithes,
  ITotalEntries,
} from 'main/@types/Report';
import { View, Text } from '@react-pdf/renderer';
import type { ChurchData } from '../../../App';
import { ReportDocument } from './ReportDocument';
import { reportStyles } from './reportStyles';
import { Table } from './components/Table';
import { Infos } from './components/Infos';

export interface EntriesReportDocumentProps {
  dataOfChurch: ChurchData;
  referenceMonth: number;
  referenceYear: number;
  tithesAndSpecialOffers: IMemberWithTotalOffersAndTotalTithes[];
  totalEntriesReport: ITotalEntries;
  infos: {
    title: string;
    amount: number;
  }[];
}

export function EntriesReportDocument({
  dataOfChurch,
  referenceMonth,
  referenceYear,
  tithesAndSpecialOffers,
  totalEntriesReport,
  infos,
}: EntriesReportDocumentProps) {
  const { totalSpecialOffers, totalTithes, totalEntries } = totalEntriesReport;

  return (
    <ReportDocument
      dataOfChurch={dataOfChurch}
      title="Relatório de Entradas"
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
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
        <View style={reportStyles.totalContent} wrap={false}>
          <Text>TOTAL DE ENTRADAS</Text>
          <Text>
            {totalEntries.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
        </View>
      </>
    </ReportDocument>
  );
}
