// payment-handler.js - Вебхук для обработки платежей
class PaymentHandler {
    constructor() {
        this.apiUrl = 'https://pay.crypt.bot/api';
        this.token = '477613:AAJXN238rLjxk7pP2L6DA7tNnnrYQ8V4BBE'; // ЗАМЕНИТЕ на реальный токен
    }

    // Создание инвойса
    async createInvoice(amount, asset = 'USDT', description = 'Пополнение баланса') {
        try {
            const response = await fetch(`${this.apiUrl}/createInvoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Crypto-Pay-API-Token': this.token
                },
                body: JSON.stringify({
                    asset: asset,
                    amount: amount.toString(),
                    description: description,
                    paid_btn_name: 'view_item',
                    paid_btn_url: window.location.href,
                    payload: JSON.stringify({
                        user_id: this.getUserId(),
                        amount: amount
                    }),
                    allow_comments: true,
                    allow_anonymous: false,
                    expires_in: 3600
                })
            });

            const data = await response.json();
            
            if (data.ok) {
                return {
                    success: true,
                    invoice: data.result
                };
            } else {
                throw new Error(data.error?.description || 'Ошибка создания счета');
            }
        } catch (error) {
            console.error('Create invoice error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Проверка статуса инвойса
    async checkInvoice(invoiceId) {
        try {
            const response = await fetch(`${this.apiUrl}/getInvoices?invoice_ids=${invoiceId}`, {
                headers: {
                    'Crypto-Pay-API-Token': this.token
                }
            });

            const data = await response.json();
            
            if (data.ok && data.result.items.length > 0) {
                return {
                    success: true,
                    invoice: data.result.items[0]
                };
            } else {
                throw new Error('Инвойс не найден');
            }
        } catch (error) {
            console.error('Check invoice error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    getUserId() {
        // Генерируем ID пользователя на основе Telegram Web App или создаем временный
        if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
            return window.Telegram.WebApp.initDataUnsafe.user.id.toString();
        }
        
        // Если нет Telegram, используем localStorage
        let userId = localStorage.getItem('user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('user_id', userId);
        }
        return userId;
    }
}

// Создаем глобальный экземпляр
window.PaymentHandler = new PaymentHandler();
