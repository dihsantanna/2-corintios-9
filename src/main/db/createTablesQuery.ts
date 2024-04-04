export const createTablesQuery = /* sql */ `
CREATE TABLE IF NOT EXISTS "members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "congregated" BOOLEAN NOT NULL DEFAULT false
);
CREATE TABLE IF NOT EXISTS "tithes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL,
    CONSTRAINT "tithe_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "otherEntries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT DEFAULT '',
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL,
    CONSTRAINT "offer_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "expenseCategories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "expenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expenseCategoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL,
    CONSTRAINT "expense_expenseCategoryId_fkey" FOREIGN KEY ("expenseCategoryId") REFERENCES "expenseCategories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "initialBalance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "withdrawalsToTheBankAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "dataOfChurch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logoSrc" TEXT DEFAULT '',
    "name" TEXT NOT NULL,
    "foundationDate" NUMERIC NOT NULL,
    "cnpj" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "cep" TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "expenseCategory_name_key" ON "expenseCategories"("name");

-- ALTER TABLE para adicionar a coluna 'description' com valor padrão NULL
ALTER TABLE otherEntries
ADD COLUMN description TEXT DEFAULT NULL;
`;
