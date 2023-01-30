export const getQuery = /* sql */ `
SELECT
  ib.value,
  ib.referenceMonth,
  ib.referenceYear
FROM
  initialBalance ib
`;

export const createOrUpdateQuery = /* sql */ `
INSERT
OR REPLACE
INTO initialBalance (id, value, referenceMonth, referenceYear)
VALUES ('INITIAL_BALANCE', $value, $referenceMonth, $referenceYear)
`;
