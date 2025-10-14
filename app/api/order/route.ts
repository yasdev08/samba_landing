// /api/order/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import crypto from "crypto";

export const runtime = "nodejs";

<<<<<<< HEAD
// SHA256 hash helper
=======

// SHA256 hash function
>>>>>>> a526522a6374f1be4fb564790ce4d8d8dd3841c8
const hash = (value: string) =>
  crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");

// In-memory rate limiter (resets on cold start)
const recentRequests = new Map<string, number>();

export async function POST(req: Request) {
const eventId = crypto.randomUUID();
  try {
    // Get client IP safely in Next.js App Router
    const xForwardedFor = req.headers.get("x-forwarded-for");
    const ip =
      xForwardedFor?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0";

    const now = Date.now();

    // Rate limit: 1 request per 30s per IP
    const lastRequest = recentRequests.get(ip);
    if (lastRequest && now - lastRequest < 30_000) {
      return NextResponse.json(
        {
          success: false,
          message: "Veuillez patienter avant de soumettre à nouveau.",
        },
        { status: 429 }
      );
    }
    recentRequests.set(ip, now);

    const timeStamp = new Date().toLocaleString("fr-FR", {
      timeZone: "Africa/Algiers",
    });
    const body = await req.json();
    const {
      product,
      name,
      phone,
      wilaya,
      baladiya,
      pointure,
      honeypot,
      eventId,
    } = body;

    // Honeypot anti-bot
    if (honeypot && honeypot.trim() !== "") {
      console.warn("🚫 Spam bot detected");
      return NextResponse.json({ success: true }); // silently accept
    }

    // Validate required fields
    if (
      !name ||
      !phone ||
      !wilaya ||
      !baladiya ||
      !pointure ||
      !product?.name
    ) {
      return NextResponse.json(
        { success: false, message: "Champs manquants ou produit invalide." },
        { status: 400 }
      );
    }

    // Ensure product price exists (fallback to 0 if missing)
    const price = product.price ?? 0;

    // Save order in DB
    await prisma.order.create({
      data: {
        product: product.name,
        name,
        phone,
        wilaya,
        baladiya,
        pointure,
      },
    });

    // Generate per-request eventId for deduplication
    const finalEventId = eventId || crypto.randomUUID();

    // Hashed user data for Meta CAPI
    const hashedUserData = {
      ph: hash(phone.replace(/\D/g, "")),
      fn: hash(name.split(" ")[0] || ""),
      ln: hash(name.split(" ").slice(1).join(" ") || ""),
      client_ip_address: ip,
      client_user_agent: req.headers.get("user-agent") || "",

      fbp: body.fbp,
      fbc: body.fbc,
    };

    // Log offline Pixel event
    await prisma.pixelEvent.create({
      data: {
        eventId: finalEventId,
        eventName: "Purchase",
        eventTime: new Date(),
        userData: hashedUserData,
        customData: {
          product: product.name,
          value: price,
          currency: "DZD",
        },
      },
    });

    // Telegram message
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN!;
    const chatId = process.env.TELEGRAM_CHAT_ID!;
    const telegramPayload = {
      chat_id: chatId,
      text: `<b>📦 Nouvelle commande reçue !</b>
🛎️ <b>Produit :</b> ${product.name} 
👤 <b>Nom :</b> ${name}
📞 <b>Tel :</b> ${phone}
📍 <b>Wilaya :</b> ${wilaya}
🏠 <b>Baladiya :</b> ${baladiya}
👟 <b>Pointure :</b> ${pointure}
🕒 <b>${timeStamp}</b>`,
      parse_mode: "HTML",
    };

    // Meta CAPI payload
    const pixelId = process.env.FACEBOOK_PIXEL_ID!;
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN!;
    const capiEvent = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_id: finalEventId,
          user_data: hashedUserData,
          custom_data: {
            currency: "DZD",
            value: price,
            content_name: product.name,
          },
        },
      ],
    };

    // Send Telegram + CAPI concurrently
    const [telegramRes, capiRes] = await Promise.all([
      fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telegramPayload),
      }),
      fetch(
        `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(capiEvent),
        }
      ),
    ]);

    // Log Telegram response
    const telegramData = await telegramRes.json();
    console.log("📨 Telegram response:", telegramData);

    // Log CAPI response
    const capiData = await capiRes.json();
    console.log("📊 Meta CAPI response:", capiData);

    // Return success + eventId for browser fbq
    return NextResponse.json({
      success: true,
      finalEventId,
      message: "Commande reçue ✅",
    });
  } catch (error) {
    console.error("💥 Erreur serveur:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}
