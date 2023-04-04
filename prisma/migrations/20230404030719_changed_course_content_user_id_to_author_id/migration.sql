/*
  Warnings:

  - You are about to drop the column `userId` on the `CourseContent` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `CourseContent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CourseContent" DROP CONSTRAINT "CourseContent_userId_fkey";

-- AlterTable
ALTER TABLE "CourseContent" DROP COLUMN "userId",
ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CourseContent" ADD CONSTRAINT "CourseContent_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
