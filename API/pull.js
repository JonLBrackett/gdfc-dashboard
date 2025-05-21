import { google } from "googleapis";
import credentials from "../gdfc-service-account.json" assert { type: "json" };

export default async function handler(req, res) {
  try {
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1R2HWC4VCFeTr9MgN_kxYQYycrFHPLO27MvKEPl-a1Ag";
    const range = "Sheet1!A2:F";

    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = response.data.values;

    if (!rows || rows.length === 0) return res.status(200).json([]);

    const data = rows.map((row) => ({
      name: row[0],
      made: Number(row[1]),
      sold: Number(row[2]),
      expected: Number(row[3]),
      inventory: Number(row[4]),
      lastUpdated: row[5] || "",
    }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
}