export const createResolveResponse = {
  err: null,
  row: null,
};

export const createRejectResponse = {
  err: new Error('Error'),
  row: null,
};

export const findAllByReferenceDateResolveResponse = {
  err: null,
  row: null,
  rows: [
    {
      id: 'id1',
      value: 100,
      referenceMonth: 1,
      referenceYear: 2023,
    },
    {
      id: 'id3',
      value: 200,
      referenceMonth: 1,
      referenceYear: 2023,
    },
    {
      id: 'id2',
      value: 300,
      referenceMonth: 1,
      referenceYear: 2023,
    },
  ],
};

export const findAllByReferenceDateRejectResponse = {
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
