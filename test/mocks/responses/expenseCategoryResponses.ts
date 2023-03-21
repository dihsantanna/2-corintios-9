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
      id: 'id1',
      name: 'name1',
    },
    {
      id: 'id3',
      name: 'name3',
    },
    {
      id: 'id2',
      name: 'name2',
    },
    {
      id: 'id4',
      name: 'name4',
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
