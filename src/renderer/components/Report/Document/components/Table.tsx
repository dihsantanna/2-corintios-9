/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text, View } from '@react-pdf/renderer';
import * as colors from 'tailwindcss/colors';
import { reportStyles } from '../reportStyles';

interface ITableProps {
  title: string;
  firstColName: string;
  secondColName: string;
  firstColKey: string;
  secondColKey: string;
  rows: any[];
  subTotal: number;
}

export function Table({
  title,
  firstColName,
  secondColName,
  firstColKey,
  secondColKey,
  rows,
  subTotal,
}: ITableProps) {
  return (
    <View style={reportStyles.table} wrap={false}>
      <View style={reportStyles.tableTitle}>
        <Text>{title?.toUpperCase()}</Text>
      </View>
      <View style={reportStyles.tableHeader}>
        <View style={reportStyles.rowLeft}>
          <Text>{firstColName}</Text>
        </View>
        <View style={reportStyles.rowRight}>
          <Text>{secondColName}</Text>
        </View>
      </View>
      {rows.map((row, index) => (
        <View
          style={{
            ...reportStyles.tableRowContent,
            backgroundColor: index % 2 === 0 ? colors.white : colors.zinc[200],
          }}
          key={`${row[firstColKey]}-${row[secondColKey]}-${index + 1}`}
        >
          <View style={reportStyles.rowLeft}>
            <Text>{row?.[firstColKey]?.toUpperCase()}</Text>
          </View>
          <View style={reportStyles.rowRight}>
            <Text>
              {row[secondColKey].toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
          </View>
        </View>
      ))}
      <View style={reportStyles.subTotalContent}>
        <View style={reportStyles.subTotal}>
          <Text>TOTAL</Text>
          <Text>
            {subTotal.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}
