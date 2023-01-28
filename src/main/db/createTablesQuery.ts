export const createTablesQuery = `
CREATE TABLE "members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "congregated" BOOLEAN NOT NULL DEFAULT false
);
CREATE TABLE "tithes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL,
    CONSTRAINT "tithe_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE "offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT DEFAULT '',
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL,
    CONSTRAINT "offer_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE "expenseCategories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expenseCategoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL,
    CONSTRAINT "expense_expenseCategoryId_fkey" FOREIGN KEY ("expenseCategoryId") REFERENCES "expenseCategories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE "initialBalance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL
);
CREATE UNIQUE INDEX "expenseCategory_name_key" ON "expenseCategories"("name");
`;
