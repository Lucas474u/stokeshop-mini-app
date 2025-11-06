require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для проверки подписи вебхука
function verifySignature(req, res, buf) {
    const signature = req.headers['crypto-pay-api-signature-sha256'];
    
    if (!signature) {
        console.warn('❌ Missing signature header');
        throw new Error('Missing signature');
    }

    const expectedSignature = crypto
        .createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(buf)
        .digest('hex');

    if (signature !== expectedSignature) {
        console.error('❌ Invalid webhook signature');
        throw new Error('Invalid signature');
    }
    
    console.log('✅ Webhook signature verified');
}

app.use(express.json({ verify: verifySignature }));

// Хранилище данных
const userStorage = new Map();
const invoiceStorage = new Map();

// Вебхук для Crypto Bot
app.post('/webhook/crypto-pay', async (req, res) => {
    try {
        console.log('✅ Valid webhook received:', JSON.stringify(req.body, null, 2));
        
        const { update_type, payload, invoice_id } = req.body;
        
        if (update_type === 'invoice_paid') {
            await handlePaidInvoice(req.body);
        }

        res.json({ status: 'ok', message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Обработка оплаченного инвойса
async function handlePaidInvoice(data) {
    const { payload, invoice_id } = data;
    
    try {
        console.log(`💰 Processing paid invoice: ${invoice_id}`);
        
        const payloadData = JSON.parse(payload);
        const { userId, amount } = payloadData;
        
        // Обновляем баланс пользователя
        const user = userStorage.get(userId) || { balance: 0, totalDeposited: 0 };
        user.balance += parseFloat(amount);
        user.totalDeposited += parseFloat(amount);
        userStorage.set(userId, user);

        console.log(`✅ User ${userId} balance updated: +$${amount}, new balance: $${user.balance}`);

    } catch (error) {
        console.error('Error handling paid invoice:', error);
    }
}

// API для создания инвойса
app.post('/api/create-invoice', async (req, res) => {
    try {
        const { userId, amount, asset = 'USDT', description = 'Пополнение баланса' } = req.body;

        if (!userId || !amount) {
            return res.status(400).json({ error: 'Missing required fields: userId and amount' });
        }

        // Конвертируем сумму в криптовалюту
        const cryptoAmount = await convertToCryptoAmount(amount, asset);
        
        const requestData = {
            asset: asset,
            amount: cryptoAmount.toString(),
            description: description,
            paid_btn_name: 'open_bot',
            paid_btn_url: 'https://t.me/stokeshop_bot',
            payload: JSON.stringify({ userId, amount: parseFloat(amount), type: 'deposit' }),
            allow_comments: true,
            allow_anonymous: false,
            expires_in: 3600
        };

        console.log('Creating invoice with data:', requestData);

        const response = await axios.post('https://pay.crypt.bot/api/createInvoice', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Crypto-Pay-API-Token': process.env.CRYPTO_BOT_TOKEN
            }
        });

        if (response.data.ok) {
            const invoice = response.data.result;
            
            // Сохраняем информацию об инвойсе
            invoiceStorage.set(invoice.invoice_id, {
                userId,
                amount: parseFloat(amount),
                asset,
                status: 'active',
                created_at: new Date(),
                invoice_data: invoice
            });

            // Обновляем данные пользователя
            const user = userStorage.get(userId) || { balance: 0, pendingInvoices: [], totalDeposited: 0 };
            user.pendingInvoices.push(invoice.invoice_id);
            userStorage.set(userId, user);

            res.json({
                success: true,
                invoice: {
                    id: invoice.invoice_id,
                    pay_url: invoice.pay_url,
                    bot_invoice_url: invoice.bot_invoice_url,
                    amount: invoice.amount,
                    asset: invoice.asset,
                    description: invoice.description,
                    status: invoice.status
                }
            });
        } else {
            throw new Error(response.data.error || 'Unknown error from Crypto Bot');
        }
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Вспомогательная функция для конвертации
async function convertToCryptoAmount(usdAmount, asset) {
    const rates = {
        'USDT': 1,
        'TON': 0.05,
        'BTC': 0.000025,
        'ETH': 0.0005,
        'BNB': 0.003,
        'TRX': 8.5
    };

    const rate = rates[asset] || 1;
    return (usdAmount / rate).toFixed(8);
}

// Старт сервера
app.listen(PORT, () => {
    console.log('=========================================');
    console.log('🚀 Stokeshop Webhook Server Started');
    console.log('=========================================');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🔐 Webhook Secret: ${process.env.WEBHOOK_SECRET ? '✅ Set' : '❌ Missing'}`);
    console.log(`🤖 Crypto Bot Token: ${process.env.CRYPTO_BOT_TOKEN ? '✅ Set' : '❌ Missing'}`);
    console.log('=========================================');
});
