const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });
const app = express();

app.use(express.json());

app.post("/webhook", async (req, res) => {
    console.log("🔔 Webhook received:", req.body);

    const tokenAddress = req.body?.events?.[0]?.mint || "Unknown";
    
    await bot.sendMessage(
        process.env.CHAT_ID,
        `🚀 Token nou detectat!\n\nAddress: ${tokenAddress}`
    );

    res.sendStatus(200);
});

app.get("/", (req, res) => {
    res.send("Bot is running!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
