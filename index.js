import express from "express";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const app = express();
app.use(express.json());

// Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });
const CHAT_ID = process.env.CHAT_ID;

// Helius webhook endpoint
app.post("/webhook", async (req, res) => {
  console.log("💥 Webhook received:", req.body);

  try {
    const events = req.body;

    if (!events || events.length === 0) {
      return res.status(200).send("No events");
    }

    // Loop through all enhanced events
    for (const event of events) {
      if (event.type === "TOKEN2022_MINT" || event.type === "TOKEN_MINT") {
        const tokenMint = event?.tokenTransfers?.[0]?.mint;

        if (!tokenMint) continue;

        const msg = `
🚀 NEW TOKEN DETECTED!
Mint: <code>${tokenMint}</code>
Program: ${event.program}
        `;

        await bot.sendMessage(CHAT_ID, msg, { parse_mode: "HTML" });
      }
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("ERROR in webhook:", err);
    res.status(500).send("ERR");
  }
});

// Render port handling
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
