import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import crypto from "crypto";

export const runtime = "nodejs";

// SHA256 hash function
const hash = (value: string) =>
  crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");

// In-memory rate limiter (resets on cold start)
const recentRequests = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();

    // Rate limit: 1 request per 30s per IP
    const lastRequest = recentRequests.get(ip);
    if (lastRequest && now - lastRequest < 30_000) {
      return NextResponse.json(
        { success: false, message: "Veuillez patienter avant de soumettre à nouveau." },
        { status: 429 }
      );
    }
    recentRequests.set(ip, now);

    const body = await req.json();
    const { product, name, phone, wilaya, baladiya, pointure, honeypot, eventId } = body;

    // Honeypot anti-bot
    if (honeypot && honeypot.trim() !== "") {
      console.warn("🚫 Spam bot detected");
      return NextResponse.json({ success: true }); // silently accept
    }

    // Validate fields
    if (!name || !phone || !wilaya || !baladiya || !pointure || !eventId) {
      return NextResponse.json({ success: false, message: "Champs manquants." }, { status: 400 });
    }

    // Save order in MongoDB
    await prisma.order.create({
      data: {
        product: typeof product === "object" ? product.name : product,
        name,
        phone,
        wilaya,
        baladiya,
        pointure,
      },
    });

    // Prepare hashed user data for Meta CAPI
    const hashedUserData = {
      ph: hash(phone.replace(/\D/g, "")),
      fn: hash(name.split(" ")[0] || ""),
      ln: hash(name.split(" ").slice(1).join(" ") || ""),
      client_ip_address: ip,
      client_user_agent: req.headers.get("user-agent"),
    };

    // Log offline pixel event in MongoDB
    await prisma.pixelEvent.create({
      data: {
        eventId,
        eventName: "Purchase",
        eventTime: new Date(),
        userData: hashedUserData,
        customData: {
          product,
          value: product.price,
          currency: "DZD",
        },
      },
    });

    // Send event to Meta CAPI
    const pixelId = process.env.FACEBOOK_PIXEL_ID!;
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN!;
    const capiEvent = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_id: eventId, // Deduplication ID must match browser-side fbq
          user_data: hashedUserData,
          custom_data: {
            currency: "DZD",
            value: product.price,
            content_name: product.name,
          },
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

    return NextResponse.json({ success: true, message: "Commande reçue ✅" });
  } catch (error) {
    console.error("💥 Erreur serveur:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
