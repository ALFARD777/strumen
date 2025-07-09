/*
  Warnings:

  - You are about to drop the column `cuid` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_cuid_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "cuid";
