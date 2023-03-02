import { IExpenseCategoryState } from 'main/@types/ExpenseCategory';
import { IExpenseState } from 'main/@types/Expense';
import { Text, View } from '@react-pdf/renderer';
import { ReportDocument } from './ReportDocument';
import type { ChurchData } from '../../../@types/ChurchData.type';
import { reportStyles } from './reportStyles';
import { Table } from './components/Table';
import { Info, Infos } from './components/Infos';

interface GeneralReportDocumentProps {
  dataOfChurch: ChurchData;
  referenceMonth: number;
  referenceYear: number;
  expenseCategories: IExpenseCategoryState[];
  expenses: IExpenseState[];
  infoTop: Info[];
  infoBottom: Info[];
}

export function GeneralReportDocument({
  dataOfChurch,
  referenceMonth,
  referenceYear,
  expenseCategories,
  expenses,
  infoTop,
  infoBottom,
}: GeneralReportDocumentProps) {
  return (
    <ReportDocument
      dataOfChurch={dataOfChurch}
      title="Relatório Geral"
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
    >
      <>
        <Infos infos={infoTop} />
        {expenseCategories.map(({ id, name }) => {
          const filteredExpenses = expenses.filter(
            (expense) => expense.expenseCategoryId === id
          );

          const subTotal = filteredExpenses.reduce(
            (total, { value }) => total + value,
            0
          );
          return (
            <Table
              key={id}
              title={name}
              firstColName="TÍTULO"
              secondColName="VALOR"
              rows={filteredExpenses}
              firstColKey="title"
              secondColKey="value"
              subTotal={subTotal}
            />
          );
        })}
        <Infos infos={infoBottom} />
        <View style={reportStyles.signature} wrap={false}>
          <View style={reportStyles.signatureContent}>
            <Text>_______________________________</Text>
            <Text>Tesoureiro(a)</Text>
          </View>
          <View style={reportStyles.signatureContent}>
            <Text>_______________________________</Text>
            <Text>Relator(a) da Comissão de Finanças</Text>
          </View>
          <View style={reportStyles.signatureContent}>
            <Text>_______________________________</Text>
            <Text>Pastor(a) Presidente</Text>
          </View>
        </View>
      </>
    </ReportDocument>
  );
}
