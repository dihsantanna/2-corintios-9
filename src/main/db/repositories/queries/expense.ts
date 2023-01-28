export const createQuery = `
INSERT INTO expenses (id, expenseCategoryId, title, value, referenceMonth, referenceYear)
VALUES (?, ?, ?, ?, ?, ?)
`;
