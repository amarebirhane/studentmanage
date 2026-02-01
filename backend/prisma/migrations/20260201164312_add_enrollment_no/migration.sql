/*
  Warnings:

  - A unique constraint covering the columns `[enrollmentNo]` on the table `StudentProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "enrollmentNo" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_enrollmentNo_key" ON "StudentProfile"("enrollmentNo");
