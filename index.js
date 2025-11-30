import TelegramBot from "node-telegram-bot-api";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

// ---------------------------
// 1. Telegram Bot
// ---------------------------

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
  polling: false, // nu folosim polling pe Render
});

// ---------------------------
// 2. Express Server (pentru Helius Webhook)
// ---------------------------

const app = express();
app.use(bodyParser.json());

// Endpoint unde Helius trimite evenimentele
app.post("/webhook", async (req, res) => {
  const body = req.body;

  // Trimitem tot ce vine, fără filtre
  bot.sendMessage(
    process.env.CHAT_ID,
    `🚀 *New Activity Detected!*\n\n\`\`\`json\n${JSON.stringify(body, null, 2)}\n\`\`\``,
    { parse_mode: "Markdown" }
  );

  res.sendStatus(200);
});

// ---------------------------
// 3. Pornim serverul pe Render
// ---------------------------

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Helius listener active on port ${PORT}`);
  console.log("Bot ONLINE! 🔥");
});

// ---------------------------
// 4. Mesaj de confirmare la pornire
// ---------------------------

bot.sendMessage(process.env.CHAT_ID, "Botul este LIVE pe Render! 🚀");
