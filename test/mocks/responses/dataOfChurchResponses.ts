export const getResolveResponse = {
  err: null,
  row: {
    logoSrc: 'logoSrc',
    name: 'name',
    foundationDate: new Date(),
    cnpj: 'cnpj',
    street: 'street',
    number: 'number',
    district: 'district',
    city: 'city',
    state: 'state',
    cep: 'cep',
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
