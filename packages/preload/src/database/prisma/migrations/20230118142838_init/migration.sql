/*
  Warnings:

  - You are about to alter the column `referenceMonth` on the `Offer` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `referenceYear` on the `Offer` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `referenceMonth` on the `Tithe` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `referenceYear` on the `Tithe` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `referenceMonth` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `referenceYear` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT DEFAULT '',
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL,
    CONSTRAINT "Offer_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("id", "memberId", "referenceMonth", "referenceYear", "value") SELECT "id", "memberId", "referenceMonth", "referenceYear", "value" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
CREATE TABLE "new_Tithe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL,
    CONSTRAINT "Tithe_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tithe" ("id", "memberId", "referenceMonth", "referenceYear", "value") SELECT "id", "memberId", "referenceMonth", "referenceYear", "value" FROM "Tithe";
DROP TABLE "Tithe";
ALTER TABLE "new_Tithe" RENAME TO "Tithe";
CREATE TABLE "new_Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expenseCategoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL,
    CONSTRAINT "Expense_expenseCategoryId_fkey" FOREIGN KEY ("expenseCategoryId") REFERENCES "ExpenseCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("expenseCategoryId", "id", "referenceMonth", "referenceYear", "title", "value") SELECT "expenseCategoryId", "id", "referenceMonth", "referenceYear", "title", "value" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
