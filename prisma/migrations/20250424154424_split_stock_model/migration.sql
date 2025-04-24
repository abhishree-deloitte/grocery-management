/*
  Warnings:

  - You are about to drop the column `cashier` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `consumerName` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `dateAdded` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPrice` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Stock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "cashier",
DROP COLUMN "consumerName",
DROP COLUMN "dateAdded",
DROP COLUMN "price",
DROP COLUMN "quantity",
DROP COLUMN "sellingPrice",
DROP COLUMN "status",
ADD COLUMN     "totalQty" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "StockEntry" (
    "id" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "sellingPrice" DOUBLE PRECISION NOT NULL,
    "cashier" TEXT NOT NULL,
    "consumerName" TEXT,
    "dateAdded" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "StockEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StockEntry" ADD CONSTRAINT "StockEntry_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
