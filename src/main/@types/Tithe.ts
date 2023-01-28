export interface ITithe {
  memberId: string;
  value: number;
  referenceMonth: number;
  referenceYear: number;
}

export interface ITitheState extends ITithe {
  id: string;
}
