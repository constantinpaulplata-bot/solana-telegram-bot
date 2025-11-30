import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const sendTelegramMessage = async (text) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: "HTML",
    });
  } catch (err) {
    console.error("Telegram error:", err.response?.data || err.message);
  }
};

// Ruta Webhook pentru Helius
app.post("/webhook", async (req, res) => {
  console.log("HELIUS WEBHOOK RECEIVED:", req.body);

  await sendTelegramMessage("🚨 Nou eveniment detectat pe Solana!");

  res.status(200).send("OK");
});

// Pornire server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
