/*
  Warnings:

  - You are about to drop the column `winstreak` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "winstreak",
ADD COLUMN     "currentstreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxstreak" INTEGER NOT NULL DEFAULT 0;
