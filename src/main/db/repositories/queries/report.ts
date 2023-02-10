export const allMembersWithTithesAndOffersQuery = /* sql */ `
SELECT
  m.id AS id,
  m.name AS name,
  (
    SELECT
      IFNULL(SUM(t.value), 0)
    FROM
      tithes t
    WHERE
      t.referenceMonth = $referenceMonth
      AND t.referenceYear = $referenceYear
      AND t.memberId = m.id
  ) AS totalTithes,
  (
    SELECT
      IFNULL(SUM(o.value), 0)
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

export const reportTotalEntriesByReferenceDateQuery = /* sql */ `
SELECT
  (
    SELECT
      IFNULL(SUM(t.value), 0)
    FROM
      tithes t
    WHERE
      t.referenceMonth = $referenceMonth
      AND t.referenceYear = $referenceYear
  ) AS totalTithes,
  (
    SELECT
      IFNULL(SUM(so.value), 0)
    FROM
      offers so
    WHERE
      so.referenceMonth = $referenceMonth
      AND so.referenceYear = $referenceYear
      AND so.memberId IS NOT NULL
  ) AS totalSpecialOffers,
  (
    SELECT
      IFNULL(SUM(lo.value), 0)
    FROM
      offers lo
    WHERE
      lo.referenceMonth = $referenceMonth
      AND lo.referenceYear = $referenceYear
      AND lo.memberId IS NULL
  ) AS totalLooseOffers,
  (
    SELECT
      IFNULL(SUM(wb.value), 0)
    FROM
      withdrawalsToTheBankAccount wb
    WHERE
      wb.referenceMonth = $referenceMonth
      AND wb.referenceYear = $referenceYear
  ) AS totalWithdrawalsBankAccount,
  (
    SELECT
      IFNULL(SUM(et.total), 0)
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
        UNION
        SELECT
          SUM(wb.value)
        FROM
          withdrawalsToTheBankAccount wb
        WHERE
          wb.referenceMonth = $referenceMonth
          AND wb.referenceYear = $referenceYear
      ) AS et
  ) AS totalEntries,
  (
    SELECT
    (((
      SELECT
        IFNULL(ib.value, 0)
      FROM
        initialBalance ib
      ) + IFNULL(totalEntries, 0) ) - IFNULL(totalExpenses, 0))
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
        UNION
        SELECT
          SUM(wb.value)
        FROM
          withdrawalsToTheBankAccount wb
        WHERE
          CASE
            WHEN wb.referenceYear = $referenceYear THEN wb.referenceMonth < $referenceMonth
            ELSE wb.referenceYear < $referenceYear
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
    )
  ) AS previousBalance
`;
