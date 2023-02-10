export interface IMemberWithTotalOffersAndTotalTithes {
  id: string;
  name: string;
  totalTithes: number;
  totalOffers: number;
}

export interface ITotalEntries {
  previousBalance: number;
  totalTithes: number;
  totalSpecialOffers: number;
  totalLooseOffers: number;
  totalWithdrawalsBankAccount: number;
  totalEntries: number;
}

export interface IPartialBalance {
  previousBalance: number;
  totalTithes: number;
  totalSpecialOffers: number;
  totalLooseOffers: number;
  totalWithdraws: number;
  totalEntries: number;
  totalExpenses: number;
  totalBalance: number;
}

export interface IEntriesState {
  tithesAndSpecialOffers: IMemberWithTotalOffersAndTotalTithes[];
  totalEntries: ITotalEntries;
}
