const { google } = require('googleapis');
const fs = require('fs');

// Load service account credentials
const credentials = require('./gdfc-service-account.json');

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function pullFromSheet() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = '1R2HWC4VCFeTr9MgN_kxYQYycrFHPLO27MvKEPl-a1Ag';
  const range = "'Sheet1'!A2:F";

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values;
  if (rows.length) {
    const parsed = rows.map(([name, made, sold, expected, inventory, lastUpdated]) => ({
      name,
      made: parseInt(made),
      sold: parseInt(sold),
      expected: parseInt(expected),
      inventory: parseInt(inventory),
      lastUpdated,
    }));

    console.log('✅ Pulled data:', parsed);
    return parsed;
  } else {
    console.log('No data found.');
    return [];
  }
}

pullFromSheet();