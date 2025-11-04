// payment-handler.js - Клиент для работы с платежами
class PaymentHandler {
    constructor() {
        this.apiUrl = '/api'; // Используем относительные пути к вашему серверу
    }

    // Создание инвойса через ваш сервер
    async createInvoice(amount, asset = 'USDT', description = 'Пополнение баланса') {
        try {
            const response = await fetch(`${this.apiUrl}/create-invoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    asset: asset,
                    description: description,
                    user_id: this.getUserId()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                return {
                    success: true,
                    invoice: data.invoice
                };
            } else {
                throw new Error(data.error || 'Ошибка создания счета');
            }
        } catch (error) {
            console.error('Create invoice error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Проверка статуса инвойса через ваш сервер
    async checkInvoice(invoiceId) {
        try {
            const response = await fetch(`${this.apiUrl}/check-invoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    invoice_id: invoiceId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                return {
                    success: true,
                    invoice: data.invoice
                };
            } else {
                throw new Error(data.error || 'Инвойс не найден');
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
        if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
            return window.Telegram.WebApp.initDataUnsafe.user.id.toString();
        }
        
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
