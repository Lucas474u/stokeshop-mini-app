# Stokeshop Backend

Backend server for Stokeshop with Crypto Bot payment integration.

## Features

- ✅ Crypto Bot payment processing
- ✅ Webhook handling for instant payments
- ✅ Invoice creation API
- ✅ Secure signature verification

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Generate secret key: `node generate-secret.js`
4. Set environment variables (see .env.example)
5. Deploy to your server
6. Setup webhook: `node setup-webhook.js`

## Environment Variables

- `WEBHOOK_SECRET` - Your webhook secret key
- `CRYPTO_BOT_TOKEN` - Crypto Bot API token  
- `WEBHOOK_URL` - Your server URL for webhooks
- `PORT` - Server port (default: 3000)

## Deployment

This app can be deployed to:
- Railway
- Heroku
- DigitalOcean
- AWS
- Any Node.js hosting
