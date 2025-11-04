export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { invoice_id } = req.body;

    const CRYPTO_BOT_TOKEN = process.env.CRYPTO_BOT_TOKEN;
    const API_URL = 'https://pay.crypt.bot/api';

    const response = await fetch(`${API_URL}/getInvoices?invoice_ids=${invoice_id}`, {
      headers: {
        'Crypto-Pay-API-Token': CRYPTO_BOT_TOKEN
      }
    });

    const data = await response.json();

    if (data.ok && data.result.items.length > 0) {
      const invoice = data.result.items[0];
      res.status(200).json({
        success: true,
        invoice: invoice
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invoice not found'
      });
    }
  } catch (error) {
    console.error('Check invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
