export const closeResolveResponse = {
  err: null,
  row: null,
};

export const closeRejectResponse = {
  err: null,
  row: null,
  closeErr: new Error('Error'),
};

export const getOffersAndTithesFromMembersResolveResponse = {
  err: null,
  row: null,
  rows: [
    {
      id: 'id1',
      name: 'name1',
      totalTithes: 1,
      totalOffers: 1,
    },
    {
      id: 'id3',
      name: 'name3',
      totalTithes: 3,
      totalOffers: 3,
    },
    {
      id: 'id4',
      name: 'name4',
      totalTithes: 2,
      totalOffers: 2,
    },
    {
      id: 'id2',
      name: 'name2',
      totalTithes: 4,
      totalOffers: 4,
    },
  ],
};

export const getOffersAndTithesFromMembersRejectResponse = {
  err: new Error('Error'),
  row: null,
};

export const getTotalEntriesResolveResponse = {
  err: null,
  row: {
    previousBalance: 20,
    totalTithes: 10,
    totalSpecialOffers: 5,
    totalLooseOffers: 5,
    totalWithdrawalsBankAccount: 10,
    totalEntries: 30,
  },
};

export const getTotalEntriesRejectResponse = {
  err: new Error('Error'),
  row: null,
};
