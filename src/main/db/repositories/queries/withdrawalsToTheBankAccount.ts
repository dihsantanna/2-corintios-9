export const createQuery = /* sql */ `
INSERT INTO withdrawalsToTheBankAccount (id, value, referenceMonth, referenceYear)
VALUES ($id, $value, $referenceMonth, $referenceYear)
`;

export const findAllByReferenceDateQuery = /* sql */ `
SELECT
  *
FROM
  withdrawalsToTheBankAccount
WHERE
  referenceMonth = $referenceMonth AND referenceYear = $referenceYear
`;

export const updateQuery = /* sql */ `
UPDATE withdrawalsToTheBankAccount
SET value = $value,
    referenceMonth = $referenceMonth,
    referenceYear = $referenceYear,
WHERE
  id = $id
`;

export const deleteQuery = /* sql */ `
DELETE FROM withdrawalsToTheBankAccount
WHERE id = ?
`;
