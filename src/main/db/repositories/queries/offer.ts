export const createQuery = `
INSERT INTO offers (id, memberId, value, referenceMonth, referenceYear)
VALUES (?, ?, ?, ?, ?)
`;

export const findAllByReferencesWithMemberNameQuery = `
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

export const updateQuery = `
UPDATE offers
SET memberId = $memberId,
  value = $value,
  referenceMonth = $referenceMonth,
  referenceYear = $referenceYear
WHERE id = $id
`;

export const deleteQuery = 'DELETE FROM offers WHERE id = ?';
