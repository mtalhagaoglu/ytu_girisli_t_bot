import "dotenv/config";
import { Telegraf, Markup, session } from "telegraf";
import { addUser, updateUserInfo, getUser } from "./db.js";

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
  ctx.reply(`${department} ile ilgili gruplar:\n\nNOT IPLEMENTED YET`);
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

bot.on("text", (ctx) => {
  const userReply = ctx.message.text;
  const step = ctx?.session?.step || 0;
  switch (step) {
    case 1:
      if (userReply === "Google Form") {
        ctx.reply("NOT IMPLEMENTED YET");
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
        "Teşekkürler! Kaydın tamamlandı. /gruplar komutu ile bölümün ile ilgili gruplara ulaşabilirsin."
      );
    default:
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
