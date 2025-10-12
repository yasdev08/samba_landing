import { NextResponse } from "next/server";

export const runtime = "nodejs";

// 🗂️ Define a type for stored orders
type Order = {
  name: string;
  phone: string;
  wilaya: string;
  baladiya: string;
  pointure: string;
  timestamp: string;
};

// 🧠 In-memory order storage (temporary — resets on cold start)
const orders: Order[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Telegram command received:", body);

    const message = body?.message;
    if (!message?.text) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text.trim().toLowerCase();
    const botToken = process.env.TELEGRAM_BOT_TOKEN!;

    let reply = "";

    switch (text) {
      case "/test":
        reply = "✅ Le bot est en ligne et fonctionne parfaitement.";
        break;

      case "/stats":
        reply = `📊 Aujourd'hui: ${orders.length} commandes reçues.`;
        break;

      case "/orders":
        reply =
          orders.length > 0
            ? orders
                .slice(-5)
                .map(
                  (o, i) =>
                    `${i + 1}. ${o.name} - ${o.phone} (${o.wilaya}) - ${o.pointure}`
                )
                .join("\n")
            : "Aucune commande récente.";
        break;

      default:
        reply = "🤖 Commandes disponibles:\n/test\n/stats\n/orders";
        break;
    }

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: reply }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Telegram command error:", error);
    return NextResponse.json({ ok: false });
  }
}
