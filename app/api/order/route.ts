import { NextResponse } from "next/server";

// Use Node.js runtime (not edge)
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, wilaya, baladiya, pointure } = body;

    // 🧩 Validate fields
    if (!name || !phone || !wilaya || !baladiya || !pointure) {
      return NextResponse.json(
        { success: false, message: "Champs manquants." },
        { status: 400 }
      );
    }

 

    // 🕒 Timestamp (Algerian time)
    const timestamp = new Date().toLocaleString();

    // 📩 Telegram notification
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN!;
    const chatId = process.env.TELEGRAM_CHAT_ID!;
    const message = `
<b>📦 Nouvelle commande reçue !</b>

👤 <b>Nom :</b> ${name}
📞 <b>Téléphone :</b> ${phone}
📍 <b>Wilaya :</b> ${wilaya}
🏠 <b>Baladiya :</b> ${baladiya}
👟 <b>Pointure :</b> ${pointure}

🕒 <b>${timestamp}</b>
`;

    console.log("📨 Sending Telegram message to:", chatId);
    console.log("🪪 Bot token starts with:", telegramBotToken?.slice(0, 10));

    // ✅ Send Telegram message and wait for the response
    const res = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML", // safer than Markdown
        }),
      }
    );

    const data = await res.json();
    console.log("🤖 Telegram API response:", data);

    if (!data.ok) {
      console.error("❌ Telegram error:", data.description);
      return NextResponse.json(
        { success: false, message: "Erreur Telegram." },
        { status: 500 }
      );
    }

    // ✅ Return immediately when Telegram confirms success
    return NextResponse.json({
      success: true,
      message: "Commande reçue avec succès ✅",
    });
  } catch (error) {
    console.error("💥 Erreur serveur:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}
