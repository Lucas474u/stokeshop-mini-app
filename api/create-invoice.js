export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, asset, description, user_id } = req.body;

    // Ваши реальные данные от Crypto Bot
    const CRYPTO_BOT_TOKEN = process.env.CRYPTO_BOT_TOKEN;
    const API_URL = 'https://pay.crypt.bot/api';

    const response = await fetch(`${API_URL}/createInvoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Crypto-Pay-API-Token': CRYPTO_BOT_TOKEN
      },
      body: JSON.stringify({
        asset: asset || 'USDT',
        amount: amount.toString(),
        description: description || 'Пополнение баланса',
        hidden_message: `Пополнение баланса для пользователя ${user_id}`,
        paid_btn_name: 'return',
        paid_btn_url: `https://t.me/cryptosending_bot?start=success_${user_id}`,
        payload: JSON.stringify({ user_id, amount }),
        allow_comments: true,
        allow_anonymous: true,
        expires_in: 3600
      })
    });

    const data = await response.json();

    if (data.ok) {
      res.status(200).json({
        success: true,
        invoice: data.result
      });
    } else {
      res.status(400).json({
        success: false,
        error: data.error?.description || 'Ошибка создания счета'
      });
    }
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
