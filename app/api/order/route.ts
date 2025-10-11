/* import { google } from "googleapis"; */
import { NextResponse } from "next/server";

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

    

    // 📞 Validate phone format (must start with 05 + 8 digits)
    

    // 🟢 Parse Google credentials from env
    /* const credentials = JSON.parse(
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}"
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID; */

    // ✅ Prepare data row
    const timestamp = new Date().toLocaleString();
/*     const values = [[name, phone, wilaya, baladiya, pointure, timestamp]];
 */
    // 🚀 Add row to Google Sheet (non-blocking)
   /*  const sheetsPromise = sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });
 */
    // 📩 Send Telegram notification (non-blocking)
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN!;
    const chatId = process.env.TELEGRAM_CHAT_ID!;
    console.log("Sending Telegram message to:", chatId);
    console.log("Bot token starts with:", telegramBotToken?.slice(0, 10));

    const message = `
📦 *Nouvelle commande reçue !*
👤 Nom : ${name}
📞 Téléphone : ${phone}
📍 Wilaya : ${wilaya}
🏠 Baladiya : ${baladiya}
👟 Pointure : ${pointure}
🕒 ${timestamp}
`;

    const telegramPromise = fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    // ✅ Run both async tasks but respond immediately
    Promise.allSettled([/* sheetsPromise,  */telegramPromise]).catch(console.error);

    return NextResponse.json({
      success: true,
      message: "Commande reçue avec succès ✅",
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}