from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
import logging
import json
import csv
from fetch_form import search_someone
import random

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)

logger = logging.getLogger(__name__)
  
f = open('config.json',)
data = json.load(f)
f.close()

wa_links_file = open("gruplar.csv",encoding='utf-8')
wa_links = list(csv.reader(wa_links_file,delimiter=','))
wa_links_file.close()

related_links_file = open("related.csv",encoding="utf-8")
related_links = list(csv.reader(related_links_file,delimiter='\t'))
related_links_file.close()

token = data["telegram_token"]

def save_user(user):
    try:
        with open("users.txt", "a") as f:
            f.write(f"{user}")
            f.write("\n")
    except:
        print("unable to save user")
        pass

def error(update, context):
    """Log Errors caused by Updates."""
    logger.warning('Update "%s" caused error "%s"', update, context.error)

def groups(update, context):
    chat_data = update["message"]["from_user"]
    try:
        result = search_someone(chat_data["username"])
        if(result):
            ybd = result[5]
            department = result[6]
            ytu_group = wa_links[random.choice([0,1,2])][1]
            ybd_group = wa_links[3][1]
            for i in wa_links:
                if(i[0] == result[6]):
                    faculty_link = "Üzgünüz bu grup kurulmadı. Kurulması için moderatöre mesaj atabilirsin!"
                    department_link = "Üzgünüz bu grup kurulmadı. Kurulması için moderatöre mesaj atabilirsin!"
                    try:
                        faculty_link = i[1]
                    except IndexError:
                        pass
                    try:
                        department_link = i[2]
                    except IndexError:
                        pass
                    message = f"{department} için oluşturduğumuz genel, fakülte ve bölüm gruplar bağlantılarını aşağıda bulabilirsin!\n\nGenel Grup\n{ytu_group}\n\nFakülte Grup\n{faculty_link}\n\nBölüm Grup\n{department_link}\n\n{f'Hazırlık {ybd_group}' if ybd == 'Evet' or ybd == 'Sınavın sonucuna bağlı' else ''}\n\nTelegram grubumuzu da unutma! https://t.me/ytu2022girisli"
                    update.message.reply_text(message)
                    return 
            update.message.reply_text("Bölümün için kurulmuş grup bulamadık! Lütfen moderatörle iletişime geçin!")
        else:
            update.message.reply_text(f"Üzgünüm {chat_data.first_name} ama adına bir başvuru bulamadık. Formu tekrar doldurur musun?\n\nhttps://forms.gle/TydAkAM2xS4TdVJp7")
    except NameError as e:
        update.message.reply_text(f"Bir sorunla karşılaştık :'( en kısa zamanda çözmeye çalışacağız")

def commands(update,context):
     update.message.reply_text(f"Bot ile kullanabileceğin komutlar şu şekilde:\n /gruplar => Bölümünle ilgili gruplara girmeni sağlar\n /komutlar => Bot ile kullanabileceğin komutları görmeni sağlar\n /linkler => Okul hayatında yardımcı olabilecek linkleri görebilirsin\n /anahtar kelime => kelime ile ilgili kulüp ve topluluk paylaşımları")
    
def links(update,context):
    update.message.reply_text(f"Bizi sosyal medya hesaplarımızdan takip edebilirsin:\nhttps://www.instagram.com/ytu2022girisli/\nhttps://twitter.com/ytu2022girisli/\n\nYıldızlıların sosyal medyadaki sesi\nhttps://twitter.com/nocontextytu\n\nYıldızlıların mobil uygulaması, Yıldız Cep!\nhttps://yildizcep.com")

def start(update, context):
    first_name = update["message"]["from_user"]["first_name"]
    update.message.reply_text(f"Selam {first_name}!\n\nKullanabileceğin diğer komutlar için /komutlar")
    save_user(update)

def related(update,context):
    try:
        word = update.message.text.replace("/anahtar ","")
        for i in related_links:
            if(word.lower() in i[0].lower()):
                update.message.reply_text(f"'{word}' anahtar kelimesiyle ilgili aşağıdaki linkleri bulduk!\n\n{i[1]}")
                return
        update.message.reply_text(f"'{word}' anahtar kelimesiyle ilgili link bulamadık! Bu anahtar kelimeyle ilgili önerilerini moderatörlere iletebilirsin!")
    except Exception as e:
        update.message.reply_text(f"Örnek kullanım şekli: /anahtar medikal {str(e)}")

def yardim(update,context):
    update.message.reply_text("Beni nasıl kullanabileceğini aşağıdaki bilgiselinden öğrenebilirisin!\n\nhttps://twitter.com/ytu2022girisli/status/1553336627703042048?s=20&t=3hCh0Kul_hb1yOA7ytEu9A")

def video(update,context):
    text = f"YTÜ Kampüs Turu \n\nYTÜ Yıldız- Davutpaşa Kampüs Turu -Alişo Yollarda \nhttps://youtu.be/9evKCvJK_r0\n\nYTÜ Davutpaşa Kampüs Turu - İEEE Kulübü \nhttps://youtu.be/yCLk1ZHFaOw \n\nYTÜ Davutpaşa Kampüs Turu - Deniz Seden Zengi \n\nhttps://youtu.be/-1gpOr9bkP0\n\nYTÜ Yıldız Kampüs Turu - Rana Toprak \n\nhttps://youtu.be/fw0KSSjFekY\n\nYTÜ Makine Mühendisliği Bölüm Tanıtımı- Makine Teknolojileri Kulübü \n\nhttps://youtu.be/MEepEvmu6R8\n\nYTÜ Matematik Mühendisliği Bölüm Tanıtımı - SKY Lab Kulübü \n\nhttps://youtu.be/dTI3dKie7fA\n\nYTÜ Endüstri Mühendisliği Bölüm Tanıtımı- SKY Lab Kulübü \n\nhttps://youtu.be/RxDX5Hlm7PI\n\nYTÜ Bilgisayar Mühendisliği Bölüm Tanıtımı - SKY Lab Kulübü \n\nhttps://youtu.be/-0vERbpFlZg\n\nYTÜ Fatih Sultan Mehmet Erkek Öğrenci Yurdu - Alişo Yollarda \n\nhttps://youtu.be/dAovTA1Stuw"
    update.message.reply_text(text)

def main():
    updater = Updater(token, use_context=True)
    dp = updater.dispatcher

    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("gruplar", groups))
    dp.add_handler(CommandHandler("komutlar", commands))
    dp.add_handler(CommandHandler("linkler", links))
    dp.add_handler(CommandHandler("anahtar", related))
    dp.add_handler(CommandHandler("yardim",yardim))
    dp.add_handler(CommandHandler("video",video))

    dp.add_error_handler(error)

    updater.start_polling()
    updater.idle()


if __name__ == '__main__':
    main()