import { useEffect, useState } from 'react';
import type { MemberWithOffer } from '#preload';
import type { Offer } from '#preload';


interface OffersTableProps {
  membersWithOffer: MemberWithOffer[];
  looseOffers: Offer[];
  getTotal: (total: number) => void;
}

export function OffersTable({ membersWithOffer, looseOffers, getTotal }: OffersTableProps) {
  const [totalSpecialOffers, setTotalSpecialOffers] = useState(0);
  const [totalLooseOffers, setTotalLooseOffers] = useState(0);

  const handleTotalSpecialOffers = () => {
    return membersWithOffer
      .reduce((acc, { Offer: offers }) => (
        acc + offers.reduce((acc, { value }) => acc + value, 0)
      ), 0);
  };

  const handleTotalLooseOffers = () => {
    return looseOffers.reduce((acc, { value }) => acc + value, 0);
  };

  useEffect(() => {
    const totalSpecial = handleTotalSpecialOffers();
    const totalLoose = handleTotalLooseOffers();
    setTotalSpecialOffers(totalSpecial);
    setTotalLooseOffers(totalLoose);
    getTotal(totalSpecial + totalLoose);
  }, [membersWithOffer]);

  return (
    <div className="w-full">
      <div className="w-full py-2 bg-blue-600 text-zinc-100 font-semibold text-lg text-center border">
        Registro Mensal de Ofertas Especiais
      </div>
      <div className="w-full flex items-center justify-center bg-zinc-900 text-zinc-100 font-semibold">
        <span className="w-1/2 border p-2">Nome</span>
        <span className="w-1/2 text-right border p-2">Valor</span>
      </div>
        {membersWithOffer.map(({ id, name, Offer: offers}) => (
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
                offers
                  .reduce((acc, { value }) => acc + value, 0)
                  .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              }
            </span>
          </div>
        ))}
      <div className="w-full flex flex-col">
        <span
          className="w-1/2 bg-zinc-900 text-zinc-100 flex items-center justify-end p-2 self-end border"
        >
          {`Total: ${totalSpecialOffers.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
        </span>
      </div>
      <div className="w-full py-2 bg-blue-600 text-zinc-100 font-semibold text-lg text-center border">
        Registro Mensal de Ofertas de Gazofilácio
      </div>
            <div className="w-full flex flex-col">
        <span
          className="w-1/2 bg-zinc-900 text-zinc-100 flex items-center justify-end p-2 self-end border"
        >
          {`Total: ${totalLooseOffers.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
        </span>
      </div>
    </div>
  );
}
