/*
  Warnings:

  - You are about to drop the column `cashier` on the `StockEntry` table. All the data in the column will be lost.
  - You are about to drop the column `consumerName` on the `StockEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StockEntry" DROP COLUMN "cashier",
DROP COLUMN "consumerName";
