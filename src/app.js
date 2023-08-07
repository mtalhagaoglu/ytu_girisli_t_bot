import "dotenv/config";
import { Telegraf, Markup, session } from "telegraf";
import { addUser, updateUserInfo, getUser } from "./db.js";
import {
  downloadSheet,
  controlSheet,
  findGroupsByDepartmentName,
} from "./sheet.js";
import config from "./config.json" assert { type: "json" };

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

bot.start((ctx) => {
  const message = ctx.message;
  const user = message.from;
  ctx.session = { step: 0 };
  addUser(user, message.chat);
  ctx.reply(
    `Merhaba ${user.first_name}! Yıldız'a hoşgeldin!\n\nBenim aracılığımla Yıldız deneyimini arttırabilirsin. Hemen kayıt olmak ve ihtiyacın olan bilgileri almak için /kayit komutunu kullan!\n\nAklına takılan bir sorun olursa belki /yardim komutunu kullanmak isteyebilirsin.`
  );
});

bot.command("kayit", (ctx) => {
  ctx.session = {
    step: 1,
  };
  ctx.reply(`Kayıt sürecini nasıl ilerletmek istersin?`, getKayitKeyboard());
});

function getKayitKeyboard() {
  return Markup.keyboard(["Google Form", "Bot"]).oneTime().resize();
}

bot.command("gruplar", async (ctx) => {
  const user = await getUser(ctx.from.id);
  if (!user) {
    ctx.reply("Önce /kayit komutu ile kayıt olmalısın.");
    return;
  }
  const department = user.department;
  if (!department) {
    ctx.reply("Önce /kayit komutu ile kayıt olmalısın.");
    return;
  }
  const gruplar = await findGroupsByDepartmentName(department);
  if (gruplar?.length) {
    ctx.reply(
      `${department} ile ilgili grupları aşağıda bulabilirsin!\n\nFakülte Whatsapp Grubu: ${
        gruplar[1]
      }\n\nBölüm Whatsapp Grubu: ${
        gruplar[2]
      }\n\nGenel 2023 Girişliler Whatsap Grubu: ${gruplar[4]}${
        user.ybd
          ? `\n\nHazırlık okumayı düşündüğün için dilersen hazırlık grubuna da katılabilirsin: ${gruplar[3]}`
          : ""
      }`
    );
    return;
  }
  ctx.reply(
    `${department} ile ilgili grup bulunamadı lütfen admin ile iletişime geçmeye çalış.`
  );
});

bot.command("yardim", (ctx) => {
  ctx.reply("NOT IMPLEMENTED YET");
});

bot.command("linkler", (ctx) => [
  ctx.reply(
    `İşte işine yarayabilecek bazı linkler:\n\n${config.links
      .map(({ title, url }) => `${title}\n${url}`)
      .join("\n\n")}`
  ),
]);

bot.command("komutlar", (ctx) => {
  ctx.reply(
    `Kullanabileceğin komutlar:\n\n/kayit\n/gruplar\n/yardim\n/linkler`
  );
});

bot.command("formkontrol", async (ctx) => {
  const username = ctx.from.username;
  if (!username) {
    ctx.reply(
      "Kullanıcı adın olmadan Google Form ile kayıt olamazsın. Lütfen Telegram ayarlarından bir kullanıcı adı belirle yada bot ile kayıt ol."
    );
    return;
  }
  const user = await controlSheet(username);
  if (!user) {
    ctx.reply("Google Form ile kayıt olmamışsın.");
    ctx.reply(
      `Kayıt olurken doğru kullanıcı adını kullandığına emin ol.\n\nTelegram kullaıcı adın: ${username}`
    );
    return;
  }
  await updateUserInfo(ctx.from.id, "fullName", user["İsim, Soyisim"]);
  await updateUserInfo(
    ctx.from.id,
    "email",
    user["Aktif Olarak Kullandığınız E-Mail Adresiniz"]
  );
  await updateUserInfo(
    ctx.from.id,
    "department",
    user["Kazandığınız Bölümü Seçiniz"]
  );
  await updateUserInfo(
    ctx.from.id,
    "ybd",
    user["Hazırlık Okumayı Düşünüyor Musunuz?"]
  );
  await updateUserInfo(
    ctx.from.id,
    "phoneNumber",
    user["Telefon Numarası"].toString()
  );
  await updateUserInfo(
    ctx.from.id,
    "mobileOs",
    user["Mobil cihazınızda hangi işletim sistemini kullanıyorsunuz?"]
  );
  await updateUserInfo(
    ctx.from.id,
    "advert",
    user["Yıldızlılara özel kampanyalardan haberdar olmak ister misiniz?"] ===
      "Evet"
  );
  ctx.reply("Kaydın tamamlandı. /gruplar komutu ile gruplara ulaşabilirsin.");
});

bot.on("text", (ctx) => {
  const userReply = ctx.message.text;
  const step = ctx?.session?.step || 0;
  switch (step) {
    case 1:
      if (userReply === "Google Form") {
        const user = ctx.from;
        if (!user.username) {
          ctx.reply(
            "Kullanıcı adın olmadan Google Form ile kayıt olamazsın. Lütfen Telegram ayarlarından bir kullanıcı adı belirle yada bot ile kayıt ol."
          );
          return;
        }
        ctx.reply(
          `Kaydını Google Form üzerinden devam ettirmek için aşağıdaki bağlantıya tıklayabilirsin:\n\nhttps://docs.google.com/forms/d/e/1FAIpQLSfCnUmyqaW__hkCuM31okpnQGiC4oYFyZuD7AzVv8B5MYk0sg/viewform?usp=pp_url&entry.889610041=${user.username}`
        );
        ctx.reply(
          "Kaydını tamamladıktan sonra /formkontrol komutu ile kaydını kontrol edebilir daha sonrasında /gruplar ile bölümün ile ilgili grup bağlantılarına erişebilirsin!"
        );
      } else if (userReply === "Bot") {
        ctx.reply("İsmin nedir?");
        ctx.session.step = 2;
      }
      break;
    case 2:
      updateUserInfo(ctx.from.id, "fullName", userReply);
      ctx.reply("Aktif kullandığın e-posta adresin nedir?");
      ctx.session.step = 3;
      break;
    case 3:
      updateUserInfo(ctx.from.id, "email", userReply);
      ctx.reply("Hangi bölümü kazandın?", getDepartmentKeyboard());
      ctx.session.step = 4;
      break;
    case 4:
      updateUserInfo(ctx.from.id, "department", userReply);
      ctx.reply("Hazırlık okumayı düşünüyor musun?", getYesOrNoKeyboard());
      ctx.session.step = 5;
      break;
    case 5:
      updateUserInfo(ctx.from.id, "ybd", userReply);
      ctx.reply("Telefon numaran nedir?");
      ctx.session.step = 6;
      break;
    case 6:
      updateUserInfo(ctx.from.id, "phoneNumber", userReply);
      ctx.reply("Hangi telefonu kullanıyorsun?", getPhoneOsKeyboard());
      ctx.session.step = 7;
      break;
    case 7:
      updateUserInfo(ctx.from.id, "mobileOs", userReply);
      ctx.reply(
        "Yıldızlılara özel kampanyalardan haberdar olmak ister misin?",
        getYesOrNoKeyboard()
      );
      ctx.session.step = 8;
      break;
    case 8:
      updateUserInfo(ctx.from.id, "advert", userReply === "Evet");
      ctx.reply(
        "Teşekkürler! Kaydın tamamlandı. /gruplar komutu ile bölümün ile ilgili gruplara ulaşabilirsin."
      );
      ctx.session.step = 0;
      break;
    default:
      ctx.reply(
        "/komutlar komutu ile kullanabileceğin komutları görebilirsin."
      );
      break;
  }
});

function getDepartmentKeyboard() {
  return Markup.keyboard(config.departments).oneTime().resize();
}

function getYesOrNoKeyboard() {
  return Markup.keyboard(["Evet", "Hayır"]).oneTime().resize();
}

function getPhoneOsKeyboard() {
  return Markup.keyboard(["Android", "IOS"]).oneTime().resize();
}

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
