export const createQuery = `
INSERT INTO members (id, name, congregated)
VALUES (?, ? ,?)
`;

export const findAllQuery = `SELECT * FROM members`;
