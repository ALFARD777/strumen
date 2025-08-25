/*
  Warnings:

  - You are about to drop the column `imageBlob` on the `news` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "news" DROP COLUMN "imageBlob",
ADD COLUMN     "imagePath" TEXT;
