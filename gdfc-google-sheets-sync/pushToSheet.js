const { google } = require('googleapis');
const fs = require('fs');

// Load service account credentials
const credentials = require('./gdfc-service-account.json');

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function pushToSheet(data) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = '1R2HWC4VCFeTr9MgN_kxYQYycrFHPLO27MvKEPl-a1Ag';
  const range = "'Sheet1'!A2:F";

  const values = data.map(row => [
    row.name,
    row.made,
    row.sold,
    row.expected,
    row.inventory,
    row.lastUpdated
  ]);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values },
  });

  console.log('✅ Data pushed to Google Sheet');
}

// Example usage
const sampleData = [
  { name: "Beef Bash - Frozen", made: 60, sold: 45, expected: 10, inventory: 15, lastUpdated: "5/21/2025" }
];

pushToSheet(sampleData);