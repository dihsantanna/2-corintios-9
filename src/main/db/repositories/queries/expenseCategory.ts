export const createQuery = /* sql */ `
INSERT INTO expenseCategories (id, name)
VALUES (?, ?)
`;

export const findAllQuery = /* sql */ `
SELECT
  *
FROM expenseCategories
`;

export const updateQuery = /* sql */ `
UPDATE expenseCategories
SET name = $name
WHERE id = $id
`;

export const deleteQuery = /* sql */ `
DELETE FROM expenseCategories
WHERE id = ?
`;
