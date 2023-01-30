export const createQuery = /* sql */ `
INSERT INTO offers (id, memberId, value, referenceMonth, referenceYear)
VALUES (?, ?, ?, ?, ?)
`;

export const findAllByReferencesWithMemberNameQuery = /* sql */ `
SELECT
  o.id AS id,
  o.memberId AS memberId,
  o.value AS value,
  o.referenceMonth AS referenceMonth,
  o.referenceYear AS referenceYear,
  m.name AS memberName
FROM
  offers o
LEFT JOIN members m ON memberId = m.id
WHERE
  referenceMonth = ? AND referenceYear = ?
`;

export const updateQuery = /* sql */ `
UPDATE offers
SET memberId = $memberId,
  value = $value,
  referenceMonth = $referenceMonth,
  referenceYear = $referenceYear
WHERE id = $id
`;

export const deleteQuery = /* sql */ `
DELETE FROM offers
WHERE id = ?
`;
