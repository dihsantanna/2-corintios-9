import { IExpenseCategoryState } from 'main/@types/ExpenseCategory';
import { IExpenseState } from 'main/@types/Expense';
import { Text, View } from '@react-pdf/renderer';
import { ReportDocument } from './ReportDocument';
import type { ChurchData } from '../../../@types/ChurchData.type';
import { reportStyles } from './reportStyles';
import { Table } from './components/Table';

interface OutputReportDocumentProps {
  dataOfChurch: ChurchData;
  referenceMonth: number;
  referenceYear: number;
  expenseCategories: IExpenseCategoryState[];
  expenses: IExpenseState[];
  totalExpenses: number;
}

export function OutputReportDocument({
  dataOfChurch,
  referenceMonth,
  referenceYear,
  expenseCategories,
  expenses,
  totalExpenses,
}: OutputReportDocumentProps) {
  return (
    <ReportDocument
      dataOfChurch={dataOfChurch}
      title="Relatório de Saídas"
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
    >
      <>
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
        <View style={reportStyles.totalContent} wrap={false}>
          <Text>TOTAL DE SAÍDAS</Text>
          <Text>
            {totalExpenses.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
        </View>
      </>
    </ReportDocument>
  );
}
