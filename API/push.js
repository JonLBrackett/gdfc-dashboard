// /api/push.js — Vercel serverless function
import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST supported');

  try {
    const data = req.body;
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = '1R2HWC4VCFeTr9MgN_kxYQYycrFHPLO27MvKEPl-a1Ag';
    const range = 'Sheet1!A2:F';

    const values = data.map(row => [
      row.name,
      row.made,
      row.sold,
      row.expected,
      row.inventory,
      row.lastUpdated || new Date().toLocaleString(),
    ]);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Sheet Push Error:', err);
    res.status(500).json({ error: 'Failed to push data' });
  }
}
