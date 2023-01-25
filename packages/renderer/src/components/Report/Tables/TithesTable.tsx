import { useEffect, useState } from 'react';
import type { MemberWithTithe } from '#preload';


interface TithesTableProps {
  membersWithTithe: MemberWithTithe[];
  getTotal: (total: number) => void;
}

export function TithesTable({ membersWithTithe, getTotal }: TithesTableProps) {
  const [total, setTotal] = useState(0);

  const handleTotal = () => {
    return membersWithTithe
      .reduce((acc, { Tithe: tithe }) => (
        acc + tithe.reduce((acc, { value }) => acc + value, 0)
      ), 0);
  };

  useEffect(() => {
    const total = handleTotal();
    setTotal(total);
    getTotal(total);
  }, [membersWithTithe]);

  return (
    <div className="w-full">
      <div className="w-full py-2 bg-blue-600 text-zinc-100 font-semibold text-lg text-center border">
        Registro Mensal de Dizimistas
      </div>
      <div className="w-full flex items-center justify-center bg-zinc-900 text-zinc-100 font-semibold">
        <span className="w-1/2 border p-2">Nome</span>
        <span className="w-1/2 text-right border p-2">Valor</span>
      </div>
        {membersWithTithe.map(({id, name, Tithe: tithe}) => (
      <div className="w-full  flex items-center justify-center" key={id}>
            <span
              className="w-1/2 border p-2"
            >
              {name}
            </span>
            <span
              className="w-1/2 text-right p-2 border"
            >
              {
                tithe
                  .reduce((acc, { value }) => acc + value, 0)
                  .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              }
            </span>
      </div>
        ))}
      <div className="w-full flex flex-col">
        <span className="w-1/2 bg-zinc-900 text-zinc-100 flex items-center justify-end p-2 self-end border">{`Total: ${total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`}</span>
      </div>
  </div>
  );
}
