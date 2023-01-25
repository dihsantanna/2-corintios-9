import { useEffect, useRef, useState } from 'react';
import { Report } from './Report';
import {
  findAllMembersWithTithesByReferences,
  findAllMembersWithOffersByReferences,
  findAllLooseOffersByReferences,
  createEntriesReport,
} from '#preload';
import type { Offer } from '#preload';
import type { Screens } from '/@/@types/Screens.type';
import type { MemberWithTithe, MemberWithOffer } from '#preload';
import { TithesTable } from './Tables/TithesTable';
import { OffersTable } from './Tables/OffersTable';

interface EntriesReportProps {
  screenSelected: Screens;
}

export function EntriesReport({ screenSelected }: EntriesReportProps) {
  const [membersWithTithe, setMembersWithTithe] = useState<MemberWithTithe[]>([]);
  const [membersWithOffer, setMembersWithOffer] = useState<MemberWithOffer[]>([]);
  const [looseOffers, setLooseOffers] = useState<Offer[]>([]);
  const [referenceMonth, setReferenceMonth] = useState(new Date().getMonth() + 1);
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [totalTithes, setTotalTithes] = useState(0);
  const [totalOffers, setTotalOffers] = useState(0);
  const mounted = useRef(false);

  const reportToPDF = async () => {
    return await createEntriesReport({
      membersWithTithe,
      totalTithes,
      referenceMonth,
      referenceYear,
      membersWithOffer,
      looseOffers,
      totalOffers,
    });
  };

  useEffect(() => {
    if (screenSelected !== 'entriesReport' && mounted.current) {
      setMembersWithTithe([]);
      setReferenceMonth(new Date().getMonth() + 1);
      setReferenceYear(new Date().getFullYear());
      mounted.current = false;
    }

    if (screenSelected === 'entriesReport') {
      findAllMembersWithTithesByReferences(referenceMonth, referenceYear)
        .then((members) => {
          setMembersWithTithe(members);
          mounted.current = true;
        });
    }
  }, [screenSelected]);

  useEffect(() => {
    if (referenceMonth !== 0 && referenceYear !== 0) {
      findAllMembersWithTithesByReferences(referenceMonth, referenceYear)
        .then((membersWithTithesData) => {
          findAllMembersWithOffersByReferences(referenceMonth, referenceYear)
            .then((membersWithOfferData) => {
              findAllLooseOffersByReferences(referenceMonth, referenceYear)
                .then((looseOffersData) => {
                  setMembersWithTithe(membersWithTithesData);
                  setMembersWithOffer(membersWithOfferData);
                  setLooseOffers(looseOffersData);
                  mounted.current = true;
                });
            });
        });
    }
  }, [referenceMonth, referenceYear, screenSelected]);

  return (
    <Report
      screenSelected={screenSelected}
      screenName="entriesReport"
      title="Relatório de Entradas"
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
      setReferenceMonth={setReferenceMonth}
      setReferenceYear={setReferenceYear}
      reportToPdf={reportToPDF}
    >
      <TithesTable
        membersWithTithe={membersWithTithe}
        getTotal={setTotalTithes}
      />
      <OffersTable
        membersWithOffer={membersWithOffer}
        looseOffers={looseOffers}
        getTotal={setTotalOffers}
      />
      <div className="w-full bg-yellow-300 font-semibold mt-6 p-3 border flex flex-col items-center justify-center">
        <span>
          Total de Entradas
        </span>
        <span>
          {
            (totalOffers + totalTithes)
            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          }
        </span>
      </div>
    </Report>
  );
}
