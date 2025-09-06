/* eslint-disable @typescript-eslint/no-explicit-any */
interface ITableProps {
  title: string;
  firstColName: string;
  secondColName: string;
  firstColKey: string;
  secondColKey: string;
  rows: any[];
  subTotal: number;
  showOnlyNotZeroItems?: boolean;
}

export function Table({
  title,
  firstColName,
  secondColName,
  firstColKey,
  secondColKey,
  rows,
  subTotal,
  showOnlyNotZeroItems = false,
}: ITableProps) {
  return (
    <div className="w-full">
      <div className="w-full bg-blue-600 text-zinc-100 p-1 text-center font-semibold">
        {title?.toUpperCase()}
      </div>
      <div className="flex items-center justify-center bg-zinc-900 text-zinc-100 w-full font-semibold">
        <span className="flex justify-start p-1 w-1/2">{firstColName}</span>
        <span className="flex justify-end p-1 w-1/2 border-l-2 border-l-zinc-300">
          {secondColName}
        </span>
      </div>
      <div className="[&>*:nth-child(odd)]:bg-white [&>*:nth-child(even)]:bg-zinc-200">
        {rows
          .filter((row) => !showOnlyNotZeroItems || row[secondColKey] !== 0)
          .map((row, visibleIndex) => (
            <div
              className="flex items-center justify-center text-zinc-900 w-full"
              key={`${title}-${row[firstColKey] || visibleIndex}`}
            >
              <span className="flex justify-start p-1 w-1/2">
                {row?.[firstColKey]?.toUpperCase()}
              </span>
              <span className="flex justify-end p-1 w-1/2 font-semibold border-l-2 border-l-zinc-300">
                {row[secondColKey].toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
          ))}
      </div>
      <div className="flex justify-end font-semibold">
        <span className="w-1/2 bg-redOrange text-zinc-100 flex items-center justify-between p-1">
          <span>TOTAL</span>
          <span>
            {subTotal.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        </span>
      </div>
    </div>
  );
}
