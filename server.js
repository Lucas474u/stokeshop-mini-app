const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 🔽🔽🔽 ВАШ ТОКЕН ОТ CryptoBot 🔽🔽🔽
const CRYPTO_BOT_TOKEN = '477613:AAJXN238rLjxk7pP2L6DA7tNnnrYQ8V4BBE';
// 🔼🔼🔼 ВАШ ТОКЕН ОТ CryptoBot 🔼🔼🔼

const CRYPTO_BOT_API_URL = 'https://pay.crypt.bot/api';

// Создание инвойса
app.post('/api/create-invoice', async (req, res) => {
    try {
        const { amount, asset, description, user_id } = req.body;

        console.log('Creating invoice:', { amount, asset, user_id });

        const response = await axios.post(`${CRYPTO_BOT_API_URL}/createInvoice`, {
            asset: asset || 'USDT',
            amount: amount.toString(),
            description: description || 'Пополнение баланса Stoke Shop',
            hidden_message: '✅ Баланс пополнен! Спасибо за покупку!',
            paid_btn_name: 'return',
            paid_btn_url: 'https://t.me/cryptosending_bot',
            payload: JSON.stringify({ user_id: user_id, amount: amount }),
            allow_comments: true,
            allow_anonymous: false,
            expires_in: 3600
        }, {
            headers: { 
                'Content-Type': 'application/json',
                'Crypto-Pay-API-Token': CRYPTO_BOT_TOKEN 
            }
        });

        console.log('Crypto Bot response:', response.data);

        if (response.data.ok) {
            res.json({ 
                success: true, 
                invoice: response.data.result 
            });
        } else {
            res.status(400).json({ 
                success: false, 
                error: response.data.error?.description || 'Ошибка создания счета' 
            });
        }
    } catch (error) {
        console.error('Server error creating invoice:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Ошибка сервера: ' + (error.response?.data?.error?.description || error.message) 
        });
    }
});

// Проверка статуса инвойса
app.post('/api/check-invoice', async (req, res) => {
    try {
        const { invoice_id } = req.body;

        console.log('Checking invoice:', invoice_id);

        const response = await axios.get(`${CRYPTO_BOT_API_URL}/getInvoices`, {
            headers: {
                'Crypto-Pay-API-Token': CRYPTO_BOT_TOKEN
            },
            params: {
                invoice_ids: invoice_id
            }
        });

        console.log('Check invoice response:', response.data);

        if (response.data.ok && response.data.result.items.length > 0) {
            res.json({
                success: true,
                invoice: response.data.result.items[0]
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Инвойс не найден'
            });
        }
    } catch (error) {
        console.error('Error checking invoice:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: 'Ошибка сервера: ' + error.message
        });
    }
});

// Тест
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Сервер работает!' });
});

// Обслуживание статических файлов
app.use(express.static('.'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🚀 Сервер запущен на порту', PORT);
});
