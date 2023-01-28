export const createQuery = `
INSERT INTO offers (id, memberId, value, referenceMonth, referenceYear)
VALUES (?, ?, ?, ?, ?)
`;
