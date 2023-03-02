interface InfoProps {
  infos: {
    title: string;
    amount: number;
  }[];
}

export function Infos({ infos }: InfoProps) {
  return (
    <div className="w-full gap-2 p-1 text-zinc-900">
      {infos.map(({ title, amount }, index) => (
        <div
          key={`${title}-${amount}-${index + 1}`}
          className="flex items-center justify-between w-full"
        >
          <span>{title}:</span>
          <span className="font-bold w-3/5">
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
