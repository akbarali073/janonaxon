// botni kanalga qoshish tugmasi
module.exports.addToChannel = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "➕ Guruhga qo'shish ➕",
          url: "https://t.me/janonaxonbot?startgroup=true&admin=delete_messages+invite_users+pin_messages",
        },
      ],
    ],
  },
};
