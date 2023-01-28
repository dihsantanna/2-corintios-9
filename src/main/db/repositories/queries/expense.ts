export const createQuery = `
INSERT INTO expenses (id, expenseCategoryId, title, value, referenceMonth, referenceYear)
VALUES (?, ?, ?, ?, ?, ?)
`;

export const findAllByReferencesWithMemberNameQuery = `
SELECT
  e.id AS id,
  e.expenseCategoryId AS expenseCategoryId,
  e.title AS title,
  e.value AS value,
  e.referenceMonth AS referenceMonth,
  e.referenceYear AS referenceYear,
  ec.name as expenseCategoryName
FROM
  expenses e
INNER JOIN
  expenseCategories ec ON expenseCategoryId = ec.id
WHERE
  referenceMonth = ? AND referenceYear = ?
`;

export const updateQuery = `
UPDATE expenses
SET expenseCategoryId = $expenseCategoryId,
  title = $title,
  value = $value
WHERE
  id = $id
`;

export const deleteQuery = `
DELETE FROM expenses
WHERE id = ?
`;
