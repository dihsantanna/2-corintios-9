export const createQuery = /* sql */ `
INSERT INTO tithes (id, memberId, value, referenceMonth, referenceYear)
VALUES (?, ?, ?, ?, ?)
`;

export const findAllByReferencesWithMemberNameQuery = /* sql */ `
SELECT
  t.id AS id,
  t.memberId AS memberId,
  t.value AS value,
  t.referenceMonth AS referenceMonth,
  t.referenceYear AS referenceYear,
  m.name AS memberName
FROM
  tithes t
INNER JOIN members m ON memberId = m.id
WHERE
  referenceMonth = ? AND referenceYear = ?
`;

export const updateQuery = /* sql */ `
UPDATE tithes
SET memberId = $memberId,
  value = $value,
  referenceMonth = $referenceMonth,
  referenceYear = $referenceYear
WHERE id = $id
`;

export const deleteQuery = /* sql */ `
DELETE FROM tithes WHERE id = ?
`;
