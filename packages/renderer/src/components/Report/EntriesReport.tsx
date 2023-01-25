import { useEffect, useRef, useState } from 'react';
import { ReportView } from './ReportView';
import {
  findAllMembersWithTithesByReferences,
  findAllMembersWithOffersByReferences,
  findAllLooseOffersByReferences,
  createEntriesReport,
} from '#preload';
import type { Offer } from '#preload';
import type { Screens } from '/@/@types/Screens.type';
import type { MemberWithTithe, MemberWithOffer } from '#preload';
import { toast } from 'react-toastify';

interface EntriesReportProps {
  screenSelected: Screens;
}

export function EntriesReport({ screenSelected }: EntriesReportProps) {
  const [membersWithTithe, setMembersWithTithe] = useState<MemberWithTithe[]>([]);
  const [membersWithOffer, setMembersWithOffer] = useState<MemberWithOffer[]>([]);
  const [looseOffers, setLooseOffers] = useState<Offer[]>([]);
  const [referenceMonth, setReferenceMonth] = useState(new Date().getMonth() + 1);
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [pdf, setPdf] = useState<Buffer | null>(null);

  const mounted = useRef(false);

  const getTotalTithes = () => {
    return membersWithTithe
      .reduce((acc, { Tithe: tithe }) => (
        acc + tithe.reduce((acc, { value }) => acc + value, 0)
      ), 0);
  };

  const getTotalSpecialOffers = () => {
    return membersWithOffer
      .reduce((acc, { Offer: offers }) => (
        acc + offers.reduce((acc, { value }) => acc + value, 0)
      ), 0);
  };

  const getTotalLooseOffers = () => {
    return looseOffers.reduce((acc, { value }) => acc + value, 0);
  };

  const getTotalOffers = () => getTotalLooseOffers() + getTotalSpecialOffers();

  const getPDF = async () => {
    const totalTithes = getTotalTithes();
    const totalOffers = getTotalOffers();

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

  useEffect(() => {
    setPdf(null);
    getPDF().then((newPdf) => setPdf(newPdf)).catch((error) => {
      toast.error((error as Error).message);
    });
  }, [membersWithTithe, membersWithOffer, looseOffers]);

  return (
    <ReportView
      screenSelected={screenSelected}
      screenName="entriesReport"
      title="Relatório de Entradas"
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
      setReferenceMonth={setReferenceMonth}
      setReferenceYear={setReferenceYear}
      pdf={pdf}
    />
  );
}
