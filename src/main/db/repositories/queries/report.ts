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

export const previousBalanceQuery = `
SELECT
  (((
    SELECT
      ib.value
    FROM
      initialBalance ib
  ) + totalEntries ) - totalExpenses) AS previousBalance
FROM
(
  SELECT
    SUM(a.amount) AS totalEntries,
    SUM(DISTINCT te.amount) AS totalExpenses
  FROM
  (
    SELECT
      SUM(t.value) AS amount
    FROM
      tithes t
    WHERE
      CASE
        WHEN t.referenceYear = $referenceYear THEN t.referenceMonth < $referenceMonth
        ELSE t.referenceYear < $referenceYear
      END
    UNION
    SELECT
      SUM(o.value)
    FROM
      offers o
    WHERE
      CASE
        WHEN o.referenceYear = $referenceYear THEN o.referenceMonth < $referenceMonth
        ELSE o.referenceYear < $referenceYear
      END
  ) a
  LEFT JOIN (
    SELECT
      SUM(e.value) AS amount
    FROM
      expenses e
    WHERE
      CASE
        WHEN e.referenceYear = $referenceYear THEN e.referenceMonth < $referenceMonth
        ELSE e.referenceYear < $referenceYear
      END
  ) te
) b
`;
