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
      expenseCategoryId: 'expenseCategoryId1',
      title: 'title1',
      value: 100,
      referenceMonth: 1,
      referenceYear: 2023,
      id: 'id1',
      expenseCategoryName: 'expenseCategoryName1',
    },
    {
      expenseCategoryId: 'expenseCategoryId1',
      title: 'title3',
      value: 300,
      referenceMonth: 1,
      referenceYear: 2023,
      id: 'id3',
      expenseCategoryName: 'expenseCategoryName1',
    },
    {
      expenseCategoryId: 'expenseCategoryId2',
      title: 'title2',
      value: 200,
      referenceMonth: 1,
      referenceYear: 2023,
      id: 'id2',
      expenseCategoryName: 'expenseCategoryName2',
    },
    {
      expenseCategoryId: 'expenseCategoryId2',
      title: 'title2',
      value: 300,
      referenceMonth: 1,
      referenceYear: 2023,
      id: 'id4',
      expenseCategoryName: 'expenseCategoryName2',
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
