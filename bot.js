import TelegramBot from "node-telegram-bot-api";
import butons from "./bot-buttons.js";
import chatManager from "./chat-manager.js";

const token = "8246092694:AAG1JPYrxd69MlUtFeJtQ8tPyfuqY1IbVy8";
const bot = new TelegramBot(token, { polling: true });

const adPattern = /https?:\/\/|t\.me\/|@[\w\d_]+/i;

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id || msg.from.username;
  const userName = msg.from.first_name;
  const text = msg.text;
  const chatType = msg.chat.type;

  if (!text) return; // Agar matnsiz xabar bo'lsa (stiker, rasm), kod to'xtaydi

  // 1. /start buyrug'i
  if (text === "/start") {
    const welcomeText = `*Salom! ${userName} Botga xush kelibsiz!*\n\nMeni gruppangiznga qoshing men sizga gruhni yurutishda quydagilar bilan yordam bera olaman.\n
*Gruh azolari bilan suhbatlashish.*
Men sizning guruhungizdagi azolar bilan o'zaro suhbat qurib chatni aktiv qila olaman.\n
*Reklamalarni tozalash.*
Men guruhingizdagi reklama habarlarni avtomatiski ochirib turaman bu sizga foydalanuvchilarni saqlashda yordam beradi.\n
*Spamni oldini olish.*
Men spam habarlarni aniqlab ularni guruhingizdan avtomatik ochirib turaman.\n
Quyidagi tugma orqali meni kanalga qo'shing va men ishlashim uchun *admin* huquqlarini bering!`;
    bot.sendMessage(chatId, welcomeText, {
      parse_mode: "Markdown",
      ...butons.addToChannel,
    });
    return;
  }

  // 2. Guruh va Superguruhlar uchun mantiq
  if (chatType === "group" || chatType === "supergroup") {
    // --- REKLAMA TEKSHIRUVI ---
    if (adPattern.test(text)) {
      try {
        const member = await bot.getChatMember(chatId, userId);
        const isAdmin =
          member.status === "administrator" || member.status === "creator";
        const isAnonymous = msg.sender_chat && msg.sender_chat.id === chatId;

        if (!isAdmin && !isAnonymous) {
          await bot.deleteMessage(chatId, msg.message_id);
          const warning = await bot.sendMessage(
            chatId,
            `Kechirasiz *${msg.from.first_name}*, reklamangiz o'chirildi! 🚫`,
            { parse_mode: "Markdown" }
          );

          setTimeout(() => {
            bot.deleteMessage(chatId, warning.message_id).catch(() => {});
          }, 5000);
          return; // Reklama bo'lsa, pastdagi AI kodiga o'tmaydi
        }
      } catch (error) {
        console.error("Adminlikni tekshirishda xato:", error.message);
      }
    }

    // --- AI BILAN SUHBAT (REPLY YOKI SALOM BO'LSA) ---
    const botInfo = await bot.getMe();
    const isReplyToBot =
      msg.reply_to_message && msg.reply_to_message.from.id === botInfo.id;
    const lowerText = text.toLowerCase();
    const mentionsBot =
      lowerText.includes("janonaxon") ||
      lowerText.includes("janona") ||
      lowerText.includes("salom") ||
      lowerText.includes("qalaysan");

    if (isReplyToBot || mentionsBot) {
      chatManager.handleGroupChat(bot, msg);
    }
  }
});
