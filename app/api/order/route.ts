import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

// 🧱 In-memory rate limit store (resets on cold start)
const recentRequests = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();

    // 🕒 Rate limit: 1 request per 30s per IP
    const lastRequest = recentRequests.get(ip);
    if (lastRequest && now - lastRequest < 30_000) {
      return NextResponse.json(
        { success: false, message: "Veuillez patienter avant de soumettre à nouveau." },
        { status: 429 }
      );
    }
    recentRequests.set(ip, now);

    const body = await req.json();
    const {product, name, phone, wilaya, baladiya, pointure, honeypot } = body;

    // 🪤 Honeypot anti-bot
    if (honeypot && honeypot.trim() !== "") {
      console.warn("🚫 Spam bot detected");
      return NextResponse.json({ success: true }); // silently accept
    }

    // 🧩 Validate fields
    if (!name || !phone || !wilaya || !baladiya || !pointure) {
      return NextResponse.json(
        { success: false, message: "Champs manquants." },
        { status: 400 }
      );
    }

    

    // 🕒 Timestamp
    const timestamp = new Date().toLocaleString("fr-DZ", {
      timeZone: "Africa/Algiers",
    });

     await prisma.order.create({
      data: {     product: typeof product === "object" ? product.name : product,name, phone, wilaya, baladiya, pointure },
    });

    // 🧠 Log offline pixel event
    await prisma.pixelEvent.create({
      data: {
        eventName: "Purchase",
        userData: { phone, name },
        customData: {
          value: typeof product === "object" ? product.price : product.price,
          currency: "DZD",
          content_name: typeof product === "object" ? product.name : product,
        },
      },
    });
    // 📩 Telegram
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN!;
    const chatId = process.env.TELEGRAM_CHAT_ID!;
    const message = `
<b>📦 Nouvelle commande reçue !</b>
🛎️ <b>Produit :</b> ${product.name} 
👤 <b>Nom :</b> ${name}
📞 <b>Téléphone :</b> ${phone}
📍 <b>Wilaya :</b> ${wilaya}
🏠 <b>Baladiya :</b> ${baladiya}
👟 <b>Pointure :</b> ${pointure}
🕒 <b>${timestamp}</b>
`;

    const res = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
      }
    );

    const pixelId = process.env.FACEBOOK_PIXEL_ID!;
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN!;
    const testCode = process.env.FACEBOOK_TEST_EVENT_CODE;

    const capiEvent = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          user_data: {
            client_ip_address: ip,
            client_user_agent: req.headers.get("user-agent"),
            ph: phone.replace(/\D/g, ""), // hash phone if you want
          },
          custom_data: {
            currency: "DZD",
            value: typeof product === "object" ? product.price : product.price,
            content_name: typeof product === "string" ? product : product.name,
          },
          event_source_url: req.headers.get("referer") || "https://samba-landing.vercel.app",
          ...(testCode ? { test_event_code: testCode } : {}),
        },
      ],
    };

    const capiRes = await fetch(
      `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(capiEvent),
      }
    );

    const capiData = await capiRes.json();
    console.log("📡 CAPI response:", capiData);

    const data = await res.json();
    console.log("Telegram API response:", data);

    return NextResponse.json({ success: true, message: "Commande reçue ✅" });
  } catch (error) {
    console.error("💥 Erreur serveur:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
