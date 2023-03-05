interface InfoProps {
  infos: {
    title: string;
    amount: number;
  }[];
  isTop?: boolean;
}

export function Infos({ infos, isTop }: InfoProps) {
  return (
    <div className="w-full gap-2 p-1 text-zinc-900">
      {infos.map(({ title, amount }, index) => (
        <div
          key={`${title}-${amount}-${index + 1}`}
          className={`flex items-center justify-between w-full ${
            (isTop && !index) || index === infos.length - 1 ? 'font-bold' : ''
          }`}
        >
          <span>{title}:</span>
          <span
            className={`font-bold w-3/5 ${isTop && !index ? 'text-right' : ''}`}
          >
            {amount.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        </div>
      ))}
    </div>
  );
}
