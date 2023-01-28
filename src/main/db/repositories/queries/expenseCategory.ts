export const createQuery = `
INSERT INTO expenseCategories (id, name)
VALUES (?, ?)
`;

export const findAllQuery = 'SELECT * FROM expenseCategories';
