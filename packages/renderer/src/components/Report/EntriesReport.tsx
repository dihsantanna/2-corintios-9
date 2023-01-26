import { useEffect, useState } from 'react';
import { ReportView } from './ReportView';
import {
  findAllMembersWithTithesByReferences,
  findAllMembersWithOffersByReferences,
  findAllLooseOffersByReferences,
  createEntriesReport,
} from '#preload';
import type { Offer } from '#preload';
import type { MemberWithTithe, MemberWithOffer } from '#preload';
import { toast } from 'react-toastify';


export function EntriesReport() {
  const [referenceMonth, setReferenceMonth] = useState(new Date().getMonth() + 1);
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [pdf, setPdf] = useState<Buffer | null>(null);

  const getTotalTithes = (membersWithTithe: MemberWithTithe[]) => {
    return membersWithTithe
      .reduce((acc, { Tithe: tithe }) => (
        acc + tithe.reduce((acc, { value }) => acc + value, 0)
      ), 0);
  };

  const getTotalSpecialOffers = (membersWithOffer: MemberWithOffer[]) => {
    return membersWithOffer
      .reduce((acc, { Offer: offers }) => (
        acc + offers.reduce((acc, { value }) => acc + value, 0)
      ), 0);
  };

  const getTotalLooseOffers = (looseOffers: Offer[]) => {
    return looseOffers.reduce((acc, { value }) => acc + value, 0);
  };

  const getTotalOffers = (
    membersWithOffer: MemberWithOffer[],
    looseOffers: Offer[],
  ) => getTotalLooseOffers(looseOffers) + getTotalSpecialOffers(membersWithOffer);

  const getPDF = async (
    membersWithTithe: MemberWithTithe[],
    membersWithOffer: MemberWithOffer[],
    looseOffers: Offer[],
  ) => {
    const totalTithes = getTotalTithes(membersWithTithe);
    const totalOffers = getTotalOffers(membersWithOffer, looseOffers);

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
    if (referenceMonth !== 0 && referenceYear !== 0) {
      findAllMembersWithTithesByReferences(referenceMonth, referenceYear)
        .then((membersWithTithesData) => {
          findAllMembersWithOffersByReferences(referenceMonth, referenceYear)
            .then((membersWithOfferData) => {
              findAllLooseOffersByReferences(referenceMonth, referenceYear)
                .then((looseOffersData) => {
                  setPdf(null);
                  getPDF(membersWithTithesData, membersWithOfferData, looseOffersData)
                    .then((newPdf) => setPdf(newPdf))
                    .catch((error) => {
                      toast.error((error as Error).message);
                  });
                });
            });
        });
    }
  }, [referenceMonth, referenceYear]);

  return (
    <ReportView
      title="Relatório de Entradas"
      referenceMonth={referenceMonth}
      referenceYear={referenceYear}
      setReferenceMonth={setReferenceMonth}
      setReferenceYear={setReferenceYear}
      pdf={pdf}
    />
  );
}
