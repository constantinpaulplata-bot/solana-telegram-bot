import WebSocket from 'ws';
import TelegramBot from 'node-telegram-bot-api';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

// === PORNIRE BOT TELEGRAM ===
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
console.log("Telegram Bot ACTIV 🔥");

// === WEBSOCKET HELIUS ===
const ws = new WebSocket(
  `wss://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
);

ws.on("open", () => {
  console.log("Conectat la Helius WebSocket 🚀");

  // Abonare la tranzacții create-token
  ws.send(
    JSON.stringify({
      jsonrpc: "2.0",
      id: "token-create",
      method: "transactionSubscribe",
      params: [
        {
          vote: false,
          accountInclude: [],
        },
        {
          commitment: "processed",
        },
      ],
    })
  );
});

ws.on("message", async (msg) => {
  try {
    const data = JSON.parse(msg);

    // Ignorăm non-evente
    if (!data.params || !data.params.result) return;

    const tx = data.params.result;

    // Căutăm Instruction de CREATE TOKEN
    const logs = tx?.meta?.logMessages || [];
    const isTokenCreate = logs.some((l) =>
      l.includes("InitializeMint") || l.includes("mint")
    );

    if (!isTokenCreate) return;

    const signature = tx.transaction.signatures[0];
    const mintAddress = tx.transaction.message.accountKeys[0];

    console.log("TOKEN NOU DETECTAT 🚨", mintAddress);

    await bot.sendMessage(
      CHAT_ID,
      `🚀 *TOKEN NOU CREAT PE SOLANA* 🚀
Mint: \`${mintAddress}\`
TX: https://solscan.io/tx/${signature}
Mint Info: https://solscan.io/token/${mintAddress}

⚠️ Tocmai a fost creat un token nou!`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error("EROARE prelucrare mesaj:", error);
  }
});

ws.on("error", (err) => {
  console.error("WS ERROR:", err);
});

ws.on("close", () => {
  console.log("WebSocket închis. Reconectare...");
  setTimeout(() => process.exit(1), 2000);
});
