const crypto = require('crypto');
const fs = require('fs');

console.log('🔐 Generating webhook secret...');

// Генерируем случайный секретный ключ
const secretKey = crypto.randomBytes(32).toString('hex');

console.log('=========================================');
console.log('✅ YOUR WEBHOOK SECRET KEY:');
console.log('=========================================');
console.log(secretKey);
console.log('=========================================');
console.log('📋 Copy this key and save it securely!');
console.log('🔒 Use it in your deployment environment');
console.log('=========================================');

// Создаем пример .env файла
const envExample = `# Copy this file to .env and fill in your values
WEBHOOK_SECRET=your_generated_secret_here
CRYPTO_BOT_TOKEN=477613:AAJXN238rLjxk7pP2L6DA7tNnnrYQ8V4BBE
WEBHOOK_URL=https://your-domain.com/webhook/crypto-pay
PORT=3000

# Deployment Instructions:
# 1. Set WEBHOOK_SECRET to: ${secretKey}
# 2. Replace WEBHOOK_URL with your actual domain
# 3. Make sure your server supports HTTPS`;

fs.writeFileSync('.env.example', envExample);
console.log('📁 .env.example file created');
console.log('⚠️  Remember to set environment variables in your deployment');
