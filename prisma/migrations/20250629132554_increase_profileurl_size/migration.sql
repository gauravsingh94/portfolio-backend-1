/*
  Warnings:

  - Made the column `jobTitle` on table `Portfolio` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Portfolio` MODIFY `jobTitle` VARCHAR(191) NOT NULL,
    MODIFY `skills` VARCHAR(191) NULL,
    MODIFY `profileUrl` LONGTEXT NULL;
