/*
  Warnings:

  - You are about to alter the column `telegramChatId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `telegramId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "school" TEXT DEFAULT 'ytü',
    "department" TEXT,
    "mobileOs" TEXT,
    "ybd" TEXT,
    "telegramId" BIGINT NOT NULL,
    "telegramFullName" TEXT NOT NULL,
    "telegramUsername" TEXT,
    "telegramChatId" BIGINT NOT NULL,
    "advert" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("advert", "department", "email", "fullName", "id", "mobileOs", "phoneNumber", "school", "telegramChatId", "telegramFullName", "telegramId", "telegramUsername", "ybd") SELECT "advert", "department", "email", "fullName", "id", "mobileOs", "phoneNumber", "school", "telegramChatId", "telegramFullName", "telegramId", "telegramUsername", "ybd" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
