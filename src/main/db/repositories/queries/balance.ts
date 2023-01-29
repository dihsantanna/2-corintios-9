export const getQuery = `
SELECT
  ib.value,
  ib.referenceMonth,
  ib.referenceYear
FROM
  initialBalance ib
`;

export const createOrUpdateQuery = `
INSERT
OR REPLACE
INTO initialBalance (id, value, referenceMonth, referenceYear)
VALUES ('INITIAL_BALANCE', $value, $referenceMonth, $referenceYear)
`;
