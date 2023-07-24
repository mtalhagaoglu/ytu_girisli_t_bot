import Parser from "public-google-sheets-parser";

async function downloadSheet() {
  const sheetId = process.env.SHEET_ID;
  const sheet = new Parser(sheetId);
  const data = await sheet.parse();
  return data;
}

async function controlSheet(username) {
  const data = await downloadSheet();
  const user = data.find(
    (userData) => userData["Telegram Kullanıcı Adınız"] === username
  );
  if (!user) return false;
  return user;
}

export { downloadSheet, controlSheet };
