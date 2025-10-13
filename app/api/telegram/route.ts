import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
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

      case "/stats": {
        const today = new Date().toLocaleDateString("fr-DZ", { timeZone: "Africa/Algiers" });
        const orders = await prisma.order.findMany();
        const todayCount = orders.filter(
          (o) => o.timestamp.toLocaleDateString("fr-DZ", { timeZone: "Africa/Algiers" }) === today
        ).length;
        reply = `📊 Aujourd'hui: ${todayCount} commandes reçues.`;
        break;
      }

      case "/orders": {
        const orders = await prisma.order.findMany({ orderBy: { timestamp: "desc" }, take: 5 });
        reply =
          orders.length > 0
            ? orders
                .map(
                  (o, i) =>
                    `${i + 1}. ${o.name} - ${o.phone} (${o.wilaya}) - ${o.pointure}`
                )
                .join("\n")
            : "Aucune commande récente.";
        break;
      }

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
