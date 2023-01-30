export const createQuery = /* sql */ `
INSERT INTO members (id, name, congregated)
VALUES (?, ? ,?)
`;

export const findAllQuery = /* sql */ `
SELECT
  *
FROM members`;

export const updateQuery = /* sql */ `
UPDATE members
SET name = $name,
congregated = $congregated
WHERE id = $id
`;

export const deleteQuery = /* sql */ `
DELETE FROM members WHERE id = ?
`;
