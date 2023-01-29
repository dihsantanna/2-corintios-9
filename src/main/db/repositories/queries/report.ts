export const allMembersWithTithesAndOffersQuery = `
SELECT
  m.id AS id,
  m.name AS name,
  (
    SELECT
      CASE
        WHEN SUM(t.value) IS NULL THEN 0
        ELSE SUM(t.value)
      END
    FROM
      tithes t
    WHERE
      t.referenceMonth = $referenceMonth
      AND t.referenceYear = $referenceYear
      AND t.memberId = m.id
  ) AS totalTithes,
  (
    SELECT
      CASE
        WHEN SUM(o.value) IS NULL THEN 0
        ELSE SUM(o.value)
      END
    FROM
      offers o
    WHERE
      o.referenceMonth = $referenceMonth
      AND o.referenceYear = $referenceYear
      AND o.memberId = m.id
  ) as totalOffers
FROM
  members m
GROUP BY
  m.id,
  name
`;

export const reportTotalEntriesByReferenceDateQuery = `
SELECT
  (
    SELECT
      SUM(t.value)
    FROM
      tithes t
    WHERE
      t.referenceMonth = $referenceMonth
      AND t.referenceYear = $referenceYear
  ) AS totalTithes,
    (
    SELECT
      SUM(so.value)
    FROM
      offers so
    WHERE
      so.referenceMonth = $referenceMonth
      AND so.referenceYear = $referenceYear
      AND so.memberId IS NOT NULL
  ) AS totalSpecialOffers,
  (
    SELECT
      SUM(lo.value)
    FROM
      offers lo
    WHERE
      lo.referenceMonth = $referenceMonth
      AND lo.referenceYear = $referenceYear
      AND lo.memberId IS NULL
  ) AS totalLooseOffers,
  (
    SELECT
      SUM(et.total)
    FROM
      (
        SELECT
          SUM(ti.value) AS total
        FROM
          tithes ti
        WHERE
          ti.referenceMonth = $referenceMonth
          AND ti.referenceYear = $referenceYear
        UNION
        SELECT
          SUM(of.value)
        FROM
          offers of
        WHERE
          of.referenceMonth = $referenceMonth
        AND of.referenceYear = $referenceYear
      ) AS et
  ) AS totalEntries
`;
