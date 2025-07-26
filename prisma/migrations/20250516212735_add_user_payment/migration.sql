/*
  Warnings:

  - Added the required column `addByAdminID` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paidAt` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "addByAdminID" TEXT NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "method" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_addByAdminID_fkey" FOREIGN KEY ("addByAdminID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
