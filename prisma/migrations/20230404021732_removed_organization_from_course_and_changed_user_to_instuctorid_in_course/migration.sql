/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Course` table. All the data in the column will be lost.
  - Added the required column `instructorId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_userId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "organizationId",
DROP COLUMN "userId",
ADD COLUMN     "instructorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
