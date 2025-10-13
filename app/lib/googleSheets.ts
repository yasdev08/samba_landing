import { google } from "googleapis";

export async function addToSheet(name: string, phone: string, address: string) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID!;

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Orders!A:C",
    valueInputOption: "RAW",
    requestBody: { values: [[name, phone, address, new Date().toLocaleString()]] },
  });
}
