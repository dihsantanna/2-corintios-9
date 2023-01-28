export const createQuery = `
INSERT INTO expenseCategories (id, name)
VALUES (?, ?)
`;

export const findAllQuery = 'SELECT * FROM expenseCategories';

export const updateQuery =
  'UPDATE expenseCategories SET name = $name WHERE id = $id';

export const deleteQuery = 'DELETE FROM expenseCategories WHERE id = ?';
