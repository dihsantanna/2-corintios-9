/*
  Warnings:

  - You are about to drop the column `member_id` on the `Tithe` table. All the data in the column will be lost.
  - You are about to drop the column `reference_month` on the `Tithe` table. All the data in the column will be lost.
  - You are about to drop the column `reference_year` on the `Tithe` table. All the data in the column will be lost.
  - You are about to drop the column `member_id` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `reference_month` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `reference_year` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `expense_category_id` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `reference_month` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `reference_year` on the `Expense` table. All the data in the column will be lost.
  - Added the required column `memberId` to the `Tithe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceMonth` to the `Tithe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceYear` to the `Tithe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceMonth` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceYear` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expenseCategoryId` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceMonth` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceYear` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tithe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "referenceMonth" TEXT NOT NULL,
    "referenceYear" TEXT NOT NULL,
    CONSTRAINT "Tithe_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tithe" ("id", "value") SELECT "id", "value" FROM "Tithe";
DROP TABLE "Tithe";
ALTER TABLE "new_Tithe" RENAME TO "Tithe";
CREATE TABLE "new_Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT DEFAULT '',
    "value" REAL NOT NULL,
    "referenceMonth" TEXT NOT NULL,
    "referenceYear" TEXT NOT NULL,
    CONSTRAINT "Offer_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("id", "value") SELECT "id", "value" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
CREATE TABLE "new_Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expenseCategoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "referenceMonth" TEXT NOT NULL,
    "referenceYear" TEXT NOT NULL,
    CONSTRAINT "Expense_expenseCategoryId_fkey" FOREIGN KEY ("expenseCategoryId") REFERENCES "ExpenseCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("id", "title", "value") SELECT "id", "title", "value" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
