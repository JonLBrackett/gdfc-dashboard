import { google } from "googleapis";
const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

export default async function handler(req, res) {
  try {
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1R2HWC4VCFeTr9MgN_kxYQYycrFHPLO27MvKEPl-a1Ag";
    const range = "Sheet1!A2";

    const data = req.body.map((item) => [
      item.name,
      item.made,
      item.sold,
      item.expected,
      item.inventory,
      item.lastUpdated || "",
    ]);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: data },
    });

    res.status(200).json({ message: "Data pushed to Google Sheets" });
  } catch (error) {
    res.status(500).json({ error: "Failed to push data", details: error.message });
  }
}