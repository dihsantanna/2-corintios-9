export const getQuery = /* sql */ `
SELECT
  d.logoSrc,
  d.name,
  d.foundationDate,
  d.cnpj,
  d.street,
  d.number,
  d.district,
  d.city,
  d.state,
  d.cep
FROM
  dataOfChurch d
WHERE
  d.id = 'DATA_OF_CHURCH'
`;

export const createOrUpdateQuery = /* sql */ `
INSERT
OR REPLACE
INTO dataOfChurch (id, logoSrc, name, foundationDate, cnpj, street, number, district, city, state, cep)
VALUES ('DATA_OF_CHURCH', $logoSrc, $name, $foundationDate, $cnpj, $street, $number, $district, $city, $state, $cep)
`;
