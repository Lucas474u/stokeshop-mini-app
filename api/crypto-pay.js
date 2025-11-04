export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, invoice_id, amount, asset, description } = req.body;

    console.log('Received request:', { action, amount, asset });

    if (action === 'createInvoice') {
      // Токен Crypto Bot (замените на ваш реальный)
      const CRYPTO_BOT_TOKEN = process.env.CRYPTO_BOT_TOKEN || '477613:AAJXN238rLjxk7pP2L6DA7tNnnrYQ8V4BBE';

      const invoiceData = {
        asset: asset || 'USDT',
        amount: parseFloat(amount),
        description: description || 'Пополнение баланса Stoke Shop',
        paid_btn_name: 'viewItem',
        paid_btn_url: 'https://t.me/cryptosending_bot',
        allow_comments: true,
        allow_anonymous: true,
        expires_in: 3600
      };

      console.log('Creating invoice with data:', invoiceData);

      // 🔥 ВАЖНО: Используем createInvoice а не getInvoices!
      const response = await fetch('https://pay.crypt.bot/api/createInvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Crypto-Pay-API-Token': CRYPTO_BOT_TOKEN
        },
        body: JSON.stringify(invoiceData)
      });

      const data = await response.json();
      console.log('Crypto Bot API response:', data);
      
      if (data.ok) {
        return res.status(200).json({
          success: true,
          invoice: data.result
        });
      } else {
        return res.status(400).json({
          success: false,
          error: data.error?.description || 'Ошибка создания инвойса'
        });
      }
    }

    if (action === 'checkInvoice') {
      const CRYPTO_BOT_TOKEN = process.env.CRYPTO_BOT_TOKEN || 'YOUR_CRYPTO_BOT_TOKEN';

      console.log('Checking invoice:', invoice_id);

      // 🔥 ВАЖНО: Для проверки используем getInvoices
      const response = await fetch('https://pay.crypt.bot/api/getInvoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Crypto-Pay-API-Token': CRYPTO_BOT_TOKEN
        },
        body: JSON.stringify({
          invoice_ids: invoice_id
        })
      });

      const data = await response.json();
      console.log('Check invoice response:', data);
      
      if (data.ok && data.result.items.length > 0) {
        return res.status(200).json({
          success: true,
          invoice: data.result.items[0]
        });
      } else {
        return res.status(400).json({
          success: false,
          error: 'Инвойс не найден'
        });
      }
    }

    return res.status(400).json({ error: 'Unknown action' });

  } catch (error) {
    console.error('Crypto Pay API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error: ' + error.message 
    });
  }
}
