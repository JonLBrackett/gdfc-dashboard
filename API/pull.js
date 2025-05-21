// /api/pull.js — Vercel serverless function
import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = '1R2HWC4VCFeTr9MgN_kxYQYycrFHPLO27MvKEPl-a1Ag';
    const range = 'Sheet1!A2:F';

    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = response.data.values || [];

    const data = rows.map(([name, made, sold, expected, inventory, lastUpdated]) => ({
      name,
      made: parseInt(made),
      sold: parseInt(sold),
      expected: parseInt(expected),
      inventory: parseInt(inventory),
      lastUpdated,
    }));

    res.status(200).json(data);
  } catch (err) {
    console.error('Sheet Pull Error:', err);
    res.status(500).json({ error: 'Failed to pull data' });
  }
}
