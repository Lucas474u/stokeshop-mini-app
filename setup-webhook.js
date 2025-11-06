require('dotenv').config();
const axios = require('axios');

const CRYPTO_BOT_TOKEN = process.env.CRYPTO_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

async function setupWebhook() {
    try {
        console.log('🔧 Setting up Crypto Bot webhook...');
        console.log(`📝 Webhook URL: ${WEBHOOK_URL}`);
        
        const response = await axios.post('https://pay.crypt.bot/api/setWebhook', {
            url: WEBHOOK_URL,
            secret_key: WEBHOOK_SECRET
        }, {
            headers: {
                'Crypto-Pay-API-Token': CRYPTO_BOT_TOKEN
            }
        });

        console.log('✅ Webhook setup result:', response.data);
        
        if (response.data.ok) {
            console.log('🎉 Webhook configured successfully!');
        } else {
            console.log('❌ Webhook setup failed:', response.data.error);
        }
    } catch (error) {
        console.error('💥 Error setting up webhook:', error.response?.data || error.message);
    }
}

// Также можно посмотреть текущие настройки вебхука
async function getWebhookInfo() {
    try {
        const response = await axios.get('https://pay.crypt.bot/api/getWebhookInfo', {
            headers: {
                'Crypto-Pay-API-Token': CRYPTO_BOT_TOKEN
            }
        });
        
        console.log('Current webhook info:', response.data);
    } catch (error) {
        console.error('Error getting webhook info:', error.response?.data || error.message);
    }
}

setupWebhook();
