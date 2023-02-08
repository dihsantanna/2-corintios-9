import { Text, View } from '@react-pdf/renderer';
import { reportStyles } from '../reportStyles';

interface InfoProps {
  infos: {
    title: string;
    amount: number;
  }[];
}

export function Infos({ infos }: InfoProps) {
  return (
    <View style={reportStyles.info} wrap={false}>
      {infos.map(({ title, amount }) => (
        <View style={reportStyles.infoContent}>
          <Text>{title}:</Text>
          <Text style={reportStyles.infoAmount}>
            {amount.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
        </View>
      ))}
    </View>
  );
}
