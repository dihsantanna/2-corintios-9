import { IDataOfChurch } from 'main/@types/DataOfChurch';
import { Document, Page, View, Image, Text } from '@react-pdf/renderer';
import { months } from '../../../utils/months';
import { reportStyles } from './reportStyles';

interface IReportDocumentProps {
  children: React.ReactNode;
  dataOfChurch: IDataOfChurch;
  title: string;
  referenceMonth: number;
  referenceYear: number;
}

type MonthKey = keyof typeof months;

export function ReportDocument({
  children,
  title,
  referenceMonth,
  referenceYear,
  dataOfChurch,
}: IReportDocumentProps) {
  const {
    logoSrc,
    name,
    foundationDate: date,
    cnpj,
    street,
    number,
    district,
    city,
    state,
    cep,
  } = dataOfChurch;

  const [day, month, year] = new Date(date)
    .toLocaleString('pt-BR')
    .split(' ')[0]
    .split('/');

  return (
    <Document
      author="Diogo Sant'Anna"
      creator="Diogo Sant'Anna"
      language="pt-BR"
      title={title}
      subject={`${title} referente ao mês de ${month} de ${year}`}
    >
      <Page size="A4" style={reportStyles.page}>
        {Object.keys(dataOfChurch).length ? (
          <View style={reportStyles.bodyReport}>
            <View style={reportStyles.headerReport}>
              {logoSrc && (
                <View style={reportStyles.logoContent}>
                  <Image style={reportStyles.logo} src={logoSrc} />
                </View>
              )}
              <Text style={reportStyles.titleReport}>{title}</Text>
            </View>
            <View style={reportStyles.subtitleContent}>
              <Text style={reportStyles.subtitleH2}>{name}</Text>
              <Text style={reportStyles.subtitleH3}>
                {`Organizada em ${day} de ${
                  months[+month as MonthKey]
                } de ${year}`}
              </Text>
              <Text style={reportStyles.subtitleH5}>{`CNPJ: ${cnpj}`}</Text>
              <Text style={reportStyles.subtitleH5}>
                {`${street}, ${number} - ${district} - ${city} - ${state}`}
              </Text>
              <Text style={reportStyles.subtitleH5}>{`CEP: ${cep}`}</Text>
            </View>
            <View style={reportStyles.reportDate}>
              <Text>
                {`Referente ao mês de ${
                  months[referenceMonth as MonthKey]
                } de ${referenceYear}`}
              </Text>
            </View>
            <View style={reportStyles.mainContent}>{children}</View>
          </View>
        ) : (
          <View>
            <Text>Carregando...</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
