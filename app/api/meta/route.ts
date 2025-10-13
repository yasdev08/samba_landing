import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.pixelEvent.findMany({
      where: { sent_to_meta: false },
      take: 10, // batch limit
    });

    if (events.length === 0) {
      return NextResponse.json({ message: "Aucun événement en attente." });
    }

    const pixelId = process.env.FACEBOOK_PIXEL_ID!;
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN!;

    for (const event of events) {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: [
              {
                event_name: event.eventName,
                event_time: event.eventTime,
                user_data: event.userData,
                custom_data: event.customData,
              },
            ],
          }),
        }
      );

      if (response.ok) {
        await prisma.pixelEvent.update({
          where: { id: event.id },
          data: { sent_to_meta: true },
        });
      } else {
        console.error("❌ Failed to sync:", await response.text());
      }
    }

    return NextResponse.json({ success: true, synced: events.length });
  } catch (error) {
    console.error("💥 Sync error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur de synchronisation." },
      { status: 500 }
    );
  }
}
