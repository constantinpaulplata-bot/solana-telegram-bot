require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

console.log("Bot ONLINE! 🔥");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Botul funcționează! 🚀");
});

function sendTestAlert() {
  const chatId = process.env.CHAT_ID;

  const message = `
🚀 *TEST ALERT*  
Moneda exemplu detectată!  
MC: $1,200  
Momentum: 83  
Safety: 71  
Organic: 50  
Rating: SAFU 🟢
`;

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
}

setInterval(sendTestAlert, 15000);
