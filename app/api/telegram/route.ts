import { NextResponse } from "next/server";

let orders: any[] = []; // In-memory store for now (you can switch to DB later)

export const runtime = "nodejs";

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

    if (text === "/test") {
      reply = "✅ Le bot est en ligne et fonctionne parfaitement.";
    } else if (text === "/stats") {
      reply = `📊 Aujourd'hui: ${orders.length} commandes reçues.`;
    } else if (text === "/orders") {
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
    } else {
      reply = "🤖 Commandes disponibles:\n/test\n/stats\n/orders";
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
