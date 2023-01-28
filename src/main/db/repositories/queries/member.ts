export const createQuery = `
INSERT INTO members (id, name, congregated)
VALUES (?, ? ,?)
`;

export const findAllQuery = `SELECT * FROM members`;

export const updateQuery = `
UPDATE members SET name = $name, congregated = $congregated WHERE id = $id
`;

export const deleteQuery = `
DELETE FROM members WHERE id = ?
`;
