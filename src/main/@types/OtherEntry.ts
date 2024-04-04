export interface IOtherEntry {
  title: string;
  value: number;
  description?: string | null;
  referenceMonth: number;
  referenceYear: number;
}

export interface IOtherEntryState extends IOtherEntry {
  id: string;
}
