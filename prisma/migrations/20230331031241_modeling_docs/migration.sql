/*
  Warnings:

  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `content` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "published" DROP DEFAULT,
ALTER COLUMN "title" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "age",
DROP COLUMN "createdAt",
DROP COLUMN "role",
ALTER COLUMN "name" SET NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
