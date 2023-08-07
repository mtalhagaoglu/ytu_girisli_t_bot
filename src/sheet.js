import Parser from "public-google-sheets-parser";
import fs from "fs";
import { parse } from "csv";

async function downloadSheet() {
  const sheetId = process.env.SHEET_ID;
  const sheet = new Parser(sheetId);
  const data = await sheet.parse();
  return data;
}

async function controlSheet(username) {
  const data = await downloadSheet();
  const user = data.find(
    (userData) =>
      userData["Telegram Kullanıcı Adınız"].toLowerCase().trim() ===
      username.toLowerCase().trim()
  );
  if (!user) return false;
  return user;
}

async function findGroupsByDepartmentName(departmentName) {
  const filePath = "csv/2023gruplar.csv";
  let data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        if (row[0] === departmentName) {
          data = row;
        }
      })
      .on("end", function () {
        console.log(`${departmentName} grubu bilgileri paylaşıldı`);
        console.log(data);
        resolve(data);
      })
      .on("error", function (error) {
        console.log(error.message);
      });
  });
}

export { downloadSheet, controlSheet, findGroupsByDepartmentName };
