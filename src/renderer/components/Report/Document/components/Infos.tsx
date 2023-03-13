import { Text, View } from '@react-pdf/renderer';
import { reportStyles } from '../reportStyles';

export interface Info {
  title: string;
  amount: number;
}

interface InfoProps {
  infos: Info[];
  isTop?: boolean;
}

export function Infos({ infos, isTop }: InfoProps) {
  return (
    <View style={reportStyles.info} wrap={false}>
      {infos.map(({ title, amount }, index) => (
        <View
          style={reportStyles.infoContent}
          key={`${title}-${amount}-${index + 1}`}
        >
          <Text
            style={{
              fontFamily:
                (isTop && !index) || index === infos.length - 1
                  ? 'Helvetica-Bold'
                  : 'Helvetica',
            }}
          >
            {title}:
          </Text>
          <Text
            style={{
              ...reportStyles.infoAmount,
              textAlign: isTop && !index ? 'right' : 'left',
            }}
          >
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
