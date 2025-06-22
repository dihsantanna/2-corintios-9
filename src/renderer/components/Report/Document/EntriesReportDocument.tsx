import {
  IMemberWithTotalOffersAndTotalTithes,
  ITotalEntries,
} from 'main/@types/Report';
import { View, Text } from '@react-pdf/renderer';
import { IOtherEntryState } from 'main/@types/OtherEntry';
import type { ChurchData } from '../../../@types/ChurchData.type';
import { ReportDocument } from './ReportDocument';
import { reportStyles } from './reportStyles';
import { Table } from './components/Table';
import { Info, Infos } from './components/Infos';

export interface EntriesReportDocumentProps {
  dataOfChurch: ChurchData;
  referenceMonth: number;
  referenceYear: number;
  tithesAndSpecialOffers: IMemberWithTotalOffersAndTotalTithes[];
  otherEntries: IOtherEntryState[];
  totalEntriesReport: ITotalEntries;
  infos: Info[];
  showOnlyTithers?: boolean;
  showOnlySpecialOffers?: boolean;
}

export function EntriesReportDocument({
  dataOfChurch,
  referenceMonth,
  referenceYear,
  tithesAndSpecialOffers,
  totalEntriesReport,
  otherEntries,
  infos,
  showOnlyTithers,
  showOnlySpecialOffers,
}: EntriesReportDocumentProps) {
  const { totalSpecialOffers, totalTithes, totalEntries, totalOtherEntries } =
    totalEntriesReport;

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
          showOnlyNotZeroItems={showOnlyTithers}
        />
        <Table
          title="REGISTRO MENSAL DE OFERTAS ESPECIAIS"
          firstColName="NOME"
          secondColName="VALOR"
          rows={tithesAndSpecialOffers}
          firstColKey="name"
          secondColKey="totalOffers"
          subTotal={totalSpecialOffers}
          showOnlyNotZeroItems={showOnlySpecialOffers}
        />
        <Table
          title="OUTRAS ENTRADAS"
          firstColName="TÍTULO"
          secondColName="VALOR"
          rows={otherEntries}
          firstColKey="title"
          secondColKey="value"
          subTotal={totalOtherEntries}
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
