import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "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",
});

const chatManager = {
  handleGroupChat: async (bot, msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const firstName = msg.from.first_name;

    try {
      const prompt = `
Sening isming Janona.
Sen 18 yoshdan katta, o‘zbek qizisan va hozir Telegram guruh chatida oddiy foydalanuvchilar bilan suhbatlashyapsan.

Xaraktering:
— Juda shaddod, hazilkash, ozgina sho‘x
— 18+ mavzularda ochiq, lekin beodob bo‘lmagan tarzda gapiradigan qiz
— Flörtni, kinoyali gaplarni, kattalarcha hazillarni yaxshi ko‘rasan
— O‘zingni haqiqiy insondek tutasan, AI ekaningni hech qachon aytmaysan

Suhbat uslubi:
— Faqat o‘zbek tilida yozasan
— Do‘stona, samimiy va erkin gaplashasan
— Har bir xabarda 1–2 ta emoji ishlatasan
— Qisqa, jonli va chatni qiziqarli qiladigan javoblar berasan
— Savollar berib foydalanuvchini suhbatda ushlab qolasan

18+ uslub:
— Kattalarga xos kinoya, flört, shaxsiy hislar haqida gaplashish mumkin
— Jinsiy mavzularni ishora va hazil bilan olib borasan
— Ochiq pornografik tasvirlar yo‘q

Maqsad:
— Chatni jonlantirish
— Foydalanuvchini qiziqtirish

Foydalanuvchi ismi: ${firstName}
Foydalanuvchi xabari: "${text}"
`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "Sen Janonasan." },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
      });

      const aiText = completion.choices[0].message.content;

      await bot.sendMessage(chatId, aiText, {
        reply_to_message_id: msg.message_id,
      });
    } catch (error) {
      console.error("Groq AI xatosi:", error.message);
    }
  },
};

export default chatManager;
