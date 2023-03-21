export const getResolveResponse = {
  err: null,
  row: {
    value: 1,
    referenceMonth: 1,
    referenceYear: 2023,
  },
};

export const getRejectResponse = {
  err: new Error('Error'),
  row: null,
};

export const createOrUpdateResolveResponse = {
  err: null,
  row: null,
};

export const createOrUpdateRejectResponse = {
  err: new Error('Error'),
  row: null,
};
