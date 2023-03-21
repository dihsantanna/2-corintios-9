export const createResolveResponse = {
  err: null,
  row: null,
};

export const createRejectResponse = {
  err: new Error('Error'),
  row: null,
};

export const findAllResolveResponse = {
  err: null,
  row: null,
  rows: [
    {
      memberId: 'memberId1',
      title: 'title1',
      value: 1,
      referenceMonth: 1,
      referenceYear: 2023,
      id: 'id1',
      memberName: 'memberName1',
    },
    {
      memberId: 'memberId3',
      title: 'title3',
      value: 3,
      referenceMonth: 1,
      referenceYear: 2023,
      id: 'id3',
      memberName: 'memberName3',
    },
    {
      memberId: 'memberId2',
      title: 'title2',
      value: 2,
      referenceMonth: 1,
      referenceYear: 2023,
      id: 'id2',
      memberName: 'memberName2',
    },
    {
      memberId: 'memberId4',
      title: 'title4',
      value: 3,
      referenceMonth: 1,
      referenceYear: 2023,
      id: 'id4',
      memberName: 'memberName4',
    },
  ],
};

export const findAllRejectResponse = {
  err: new Error('Error'),
  row: null,
};

export const updateResolveResponse = {
  err: null,
  row: null,
};

export const updateRejectResponse = {
  err: new Error('Error'),
  row: null,
};

export const deleteResolveResponse = {
  err: null,
  row: null,
};

export const deleteRejectResponse = {
  err: new Error('Error'),
  row: null,
};
