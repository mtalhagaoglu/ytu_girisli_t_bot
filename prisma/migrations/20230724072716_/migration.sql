/*
  Warnings:

  - Added the required column `telegramFullName` to the `User` table without a default value. This is not possible if the table is not empty.

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
    "telegramId" TEXT NOT NULL,
    "telegramFullName" TEXT NOT NULL,
    "telegramUsername" TEXT NOT NULL,
    "telegramChatId" TEXT NOT NULL
);
INSERT INTO "new_User" ("department", "email", "fullName", "id", "mobileOs", "phoneNumber", "school", "telegramChatId", "telegramId", "telegramUsername") SELECT "department", "email", "fullName", "id", "mobileOs", "phoneNumber", "school", "telegramChatId", "telegramId", "telegramUsername" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
