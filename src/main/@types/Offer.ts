export interface IOffer {
  memberId: string | null;
  value: number;
  referenceMonth: number;
  referenceYear: number;
}

export interface IOfferState extends IOffer {
  id: string;
}
