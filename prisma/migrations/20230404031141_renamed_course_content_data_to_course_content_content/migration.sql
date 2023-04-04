/*
  Warnings:

  - You are about to drop the column `data` on the `CourseContent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CourseContent" DROP COLUMN "data",
ADD COLUMN     "content" JSONB;
