export const createQuery = `
INSERT INTO tithes (id, memberId, value, referenceMonth, referenceYear)
VALUES (?, ?, ?, ?, ?)
`;
