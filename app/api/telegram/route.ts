import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { stringify } from "csv-stringify/sync";

const prisma = new PrismaClient();

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const message = data?.message;
    const chatId = message?.chat?.id;
    const text: string = message?.text || "";

    if (!chatId || !text) {
      return NextResponse.json({ success: false });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN!;
    const sendMessage = async (text: string) => {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown",
        }),
      });
    };

    // --- Commands ---
    if (text === "/test") {
      await sendMessage("✅ Le bot est en ligne !");
    }

    else if (text === "/stats") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const ordersToday = await prisma.order.count({
        where: { createdAt: { gte: today } },
      });
      await sendMessage(`📊 Commandes reçues aujourd'hui : *${ordersToday}*`);
    }

    else if (text === "/orders") {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      if (orders.length === 0) {
        await sendMessage("Aucune commande trouvée.");
      } else {
        const list = orders
          .map(
            (o) =>
              `#${o.id}\n👤 ${o.product} ${o.name}\n📞 ${o.phone}\n📍 ${o.wilaya} - ${o.baladiya}\n👟 ${o.pointure}\n🕒 ${o.createdAt.toLocaleString()}`
          )
          .join("\n\n");
        await sendMessage(`📦 *5 dernières commandes:*\n\n${list}`);
      }
    }

    else if (text.startsWith("/delete")) {
      const id = text.split(" ")[1];
      if (!id) return await sendMessage("⚠️ Utilisez: /delete <id>");

      const deleted = await prisma.order.delete({ where: { id } }).catch(() => null);
      if (deleted) await sendMessage(`🗑️ Commande *${id}* supprimée.`);
      else await sendMessage("❌ Commande introuvable.");
    }

    else if (text === "/export") {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (orders.length === 0)
        return await sendMessage("Aucune commande à exporter.");

      const csv = stringify(
        orders.map((o) => [
          o.id,
          o.product,
          o.name,
          o.phone,
          o.wilaya,
          o.baladiya,
          o.pointure,
          o.createdAt.toISOString(),
        ]),
        {
          header: true,
          columns: [
            "ID",
            "Produit",
            "Nom",
            "Téléphone",
            "Wilaya",
            "Baladiya",
            "Pointure",
            "Date",
          ],
        }
      );

      // Telegram files upload
      const formData = new FormData();
      formData.append("chat_id", chatId.toString());
      formData.append(
        "document",
        new Blob([csv], { type: "text/csv" }),
        "commandes.csv"
      );

      await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: "POST",
        body: formData,
      });
    }

    else {
      await sendMessage("🤖 Commande non reconnue. Essayez /orders, /stats, /export, /delete <id>");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("💥 Erreur serveur:", err);
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}
