const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(bodyParser.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// ROOT
app.get("/", (req, res) => {
  res.send("Bot is running.");
});

// WEBHOOK
app.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook received:", JSON.stringify(req.body, null, 2));

    const events = req.body;
    if (!events?.[0]) return res.sendStatus(200);

    const event = events[0];
    if (event.type !== "TOKEN_MINT") return res.sendStatus(200);

    const mint = event?.data?.mint;
    const name = event?.data?.name || "Unknown";
    const symbol = event?.data?.symbol || "???";

    const msg = `
🚀 NEW TOKEN MINTED  
Name: ${name}  
Symbol: ${symbol}  
Mint: ${mint}
    `;

    await bot.sendMessage(CHAT_ID, msg.trim());
    res.sendStatus(200);

  } catch (error) {
    console.log("Error:", error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
