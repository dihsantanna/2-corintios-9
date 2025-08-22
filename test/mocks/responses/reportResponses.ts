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
      totalTithes: 100,
      totalOffers: 100,
    },
    {
      id: 'id3',
      name: 'name3',
      totalTithes: 300,
      totalOffers: 300,
    },
    {
      id: 'id4',
      name: 'name4',
      totalTithes: 200,
      totalOffers: 200,
    },
    {
      id: 'id2',
      name: 'name2',
      totalTithes: 400,
      totalOffers: 400,
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
    previousBalance: 2000,
    totalTithes: 1000,
    totalSpecialOffers: 500,
    totalLooseOffers: 500,
    totalOtherEntries: 1000,
    totalWithdrawalsBankAccount: 1000,
    totalEntries: 3000,
  },
};

export const getTotalEntriesRejectResponse = {
  err: new Error('Error'),
  row: null,
};
