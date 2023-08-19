import { findGroupsByDepartmentName } from "./sheet.js";

const group = await findGroupsByDepartmentName(
  "Bilgisayar ve Öğretim Teknolojileri Eğitimi Lisans Programı"
);

console.log(group);
