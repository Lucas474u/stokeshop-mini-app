const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 🔽🔽🔽 ВСТАВЬТЕ СЮДА ВАШ ТОКЕН ОТ CryptoBot 🔽🔽🔽
const CRYPTO_BOT_TOKEN = '477613:AAJXN238rLjxk7pP2L6DA7tNnnrYQ8V4BBE'; // ЗАМЕНИТЕ НА СВОЙ
// 🔼🔼🔼 ВСТАВЬТЕ СЮДА ВАШ ТОКЕН ОТ CryptoBot 🔼🔼🔼

const CRYPTO_BOT_API_URL = 'https://pay.crypt.bot/api';

// Создание инвойса
app.post('/api/create-invoice', async (req, res) => {
    try {
        const { amount, asset, description, user_id } = req.body;

        const response = await axios.post(`${CRYPTO_BOT_API_URL}/createInvoice`, {
            asset: asset || 'USDT',
            amount: amount.toString(),
            description: description || 'Пополнение баланса Stoke Shop',
            hidden_message: '✅ Баланс пополнен!',
            payload: JSON.stringify({ user_id: user_id, amount: amount })
        }, {
            headers: { 'Crypto-Pay-API-Token': CRYPTO_BOT_TOKEN }
        });

        if (response.data.ok) {
            res.json({ success: true, invoice: response.data.result });
        } else {
            res.status(400).json({ success: false, error: 'Ошибка' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Ошибка сервера' });
    }
});

// ==================== ДОБАВЬТЕ ЭТОТ КОД ====================
// Проверка статуса инвойса
app.post('/api/check-invoice', async (req, res) => {
    try {
        const { invoice_id } = req.body;

        const response = await axios.get(`${CRYPTO_BOT_API_URL}/getInvoices?invoice_ids=${invoice_id}`, {
            headers: {
                'Crypto-Pay-API-Token': CRYPTO_BOT_TOKEN
            }
        });

        if (response.data.ok) {
            res.json({
                success: true,
                invoice: response.data.result[0]
            });
        } else {
            res.status(400).json({
                success: false,
                error: response.data.error
            });
        }
    } catch (error) {
        console.error('Error checking invoice:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// ==================== КОНЕЦ ДОБАВЛЕННОГО КОДА ====================

// ==================== УДАЛИТЕ ИЛИ ЗАКОММЕНТИРУЙТЕ WEBHOOK ====================
// Webhook (пока не используется)
/*
app.post('/webhook/crypto-bot', (req, res) => {
    console.log('💰 Платеж получен:', req.body);
    res.sendStatus(200);
});
*/
// ==================== КОНЕЦ УДАЛЕНИЯ WEBHOOK ====================

// Тест
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Сервер работает!' });
});

app.listen(3000, () => {
    console.log('🚀 Сервер запущен');
});
