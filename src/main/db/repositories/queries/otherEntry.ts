export const createQuery = /* sql */ `
INSERT INTO otherEntries (id, title, value, referenceMonth, referenceYear)
VALUES (?, ?, ?, ?, ?)
`;

export const findAllQuery = /* sql */ `
SELECT
  *
FROM
  otherEntries
WHERE
  referenceMonth = ? AND referenceYear = ?
`;

export const updateQuery = /* sql */ `
UPDATE otherEntries
SET title = $title,
  value = $value,
  referenceMonth = $referenceMonth,
  referenceYear = $referenceYear
WHERE id = $id
`;

export const deleteQuery = /* sql */ `
DELETE FROM otherEntries WHERE id = ?
`;
