/*
  Warnings:

  - A unique constraint covering the columns `[cuid]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cuid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_cuid_key" ON "users"("cuid");
