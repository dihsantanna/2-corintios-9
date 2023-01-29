export interface IMemberWithTotalOffersAndTotalTithes {
  id: string;
  name: string;
  totalTithes: number;
  totalOffers: number;
}

export interface ITotalEntries {
  totalTithes: number;
  totalSpecialOffers: number;
  totalLooseOffers: number;
  totalEntries: number;
}
