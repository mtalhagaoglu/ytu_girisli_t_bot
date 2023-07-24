/*
  Warnings:

  - You are about to alter the column `telegramChatId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `telegramId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "school" TEXT NOT NULL DEFAULT 'ytü',
    "department" TEXT NOT NULL,
    "mobileOs" TEXT NOT NULL,
    "telegramId" INTEGER NOT NULL,
    "telegramFullName" TEXT NOT NULL,
    "telegramUsername" TEXT NOT NULL,
    "telegramChatId" INTEGER NOT NULL
);
INSERT INTO "new_User" ("department", "email", "fullName", "id", "mobileOs", "phoneNumber", "school", "telegramChatId", "telegramFullName", "telegramId", "telegramUsername") SELECT "department", "email", "fullName", "id", "mobileOs", "phoneNumber", "school", "telegramChatId", "telegramFullName", "telegramId", "telegramUsername" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
