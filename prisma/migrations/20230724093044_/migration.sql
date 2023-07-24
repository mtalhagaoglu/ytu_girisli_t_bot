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
    "telegramId" INTEGER NOT NULL,
    "telegramFullName" TEXT NOT NULL,
    "telegramUsername" TEXT,
    "telegramChatId" INTEGER NOT NULL
);
INSERT INTO "new_User" ("department", "email", "fullName", "id", "mobileOs", "phoneNumber", "school", "telegramChatId", "telegramFullName", "telegramId", "telegramUsername") SELECT "department", "email", "fullName", "id", "mobileOs", "phoneNumber", "school", "telegramChatId", "telegramFullName", "telegramId", "telegramUsername" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
