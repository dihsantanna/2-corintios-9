export interface IOtherEntry {
  title: string;
  value: number;
  referenceMonth: number;
  referenceYear: number;
}

export interface IOtherEntryState extends IOtherEntry {
  id: string;
}
