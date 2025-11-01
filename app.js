class StokeShopApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.user = null;
        this.userData = {
            balance: 0,
            totalDeposited: 0,
            totalSpent: 0,
            ordersCount: 0,
            favoritesCount: 0
        };
        this.categories = [];
        this.products = [];
        this.selectedAmount = 10;
        this.selectedMethod = 'crypto_bot';
        this.currentProduct = null;
        this.currentLanguage = 'ru';
        this.cryptoInvoiceId = null;
        this.paymentTimer = null;
        this.autoCheckInterval = null;
        
        // Crypto Pay API credentials - ЗАМЕНИТЕ НА ВАШ РЕАЛЬНЫЙ API КЛЮЧ
        this.cryptoPayConfig = {
            apiKey: '12345:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // Замените на ваш ключ
            baseUrl: 'https://pay.crypt.bot/api/'
        };
        
        this.translations = {
            ru: {
                balance: 'Баланс',
                deposit: 'Пополнить',
                shop: 'Магазин',
                orders: 'Заказы',
                favorites: 'Избранное',
                support: 'Поддержка',
                categories: 'Категории',
                all_products: 'Все товары',
                profile: 'Профиль',
                main: 'Главная',
                select_amount: 'Выберите сумму',
                payment_method: 'Способ оплаты',
                crypto_bot_desc: 'Мгновенно • Без комиссии',
                creating_invoice: 'Создание инвойса...',
                open_crypto_bot: 'Открыть Crypto Bot',
                check_payment: 'Проверить оплату',
                wallet_instructions: 'Отправьте точную сумму на этот адрес. Ваш баланс будет пополнен автоматически после подтверждения.',
                copy_address: 'Скопировать адрес',
                in_stock: 'В наличии',
                buy_now: 'Купить сейчас',
                add_to_favorites: 'Добавить в избранное',
                search_placeholder: 'Поиск товаров...',
                total_spent: 'Всего потрачено',
                insufficient_balance: 'Недостаточно средств',
                payment_success: 'Оплата успешна!',
                payment_failed: 'Оплата не прошла',
                invoice_created: 'Инвойс создан',
                invoice_paid: 'Инвойс оплачен',
                invoice_expired: 'Время инвойса истекло'
            },
            en: {
                balance: 'Balance',
                deposit: 'Deposit',
                shop: 'Shop',
                orders: 'Orders',
                favorites: 'Favorites',
                support: 'Support',
                categories: 'Categories',
                all_products: 'All Products',
                profile: 'Profile',
                main: 'Main',
                select_amount: 'Select amount',
                payment_method: 'Payment method',
                crypto_bot_desc: 'Instant • No fees',
                creating_invoice: 'Creating invoice...',
                open_crypto_bot: 'Open Crypto Bot',
                check_payment: 'Check Payment',
                wallet_instructions: 'Send the exact amount to this address. Your balance will be updated automatically after confirmation.',
                copy_address: 'Copy Address',
                in_stock: 'In stock',
                buy_now: 'Buy Now',
                add_to_favorites: 'Add to Favorites',
                search_placeholder: 'Search products...',
                total_spent: 'Total Spent',
                insufficient_balance: 'Insufficient balance',
                payment_success: 'Payment successful!',
                payment_failed: 'Payment failed',
                invoice_created: 'Invoice created',
                invoice_paid: 'Invoice paid',
                invoice_expired: 'Invoice expired'
            }
        };

        this.walletAddresses = {
            'TON': 'UQBvrPItSxKL-U2ikxdIYz3zWRCPlxMBaz3zVCHrLmD2OPOR',
            'USDT': 'TXdf14ohPHQsysio6VGQCdFyP9nVdYcbbt',
            'LTC': 'ltc1qkg69x5vtd7rl2whu8ush45xch0q3vk3f34mvhv',
            'BTC': 'bc1q25ehtjq7k2crfvujr9dyhk640dj6tynlycjhvq',
            'SOL': '6GpxJvee9DUm3ej6KSAmpTns6664ZQSpFZqde5aNCo7g',
            'USDC': '0x291754537797Ac70C0159ABF1701E773502f8CcB'
        };

        this.init();
    }

    init() {
        // Initialize Telegram Web App
        this.tg.expand();
        this.tg.enableClosingConfirmation();
        this.tg.setHeaderColor('#000000');
        this.tg.setBackgroundColor('#000000');
        
        // Get user data from Telegram
        this.user = this.tg.initDataUnsafe?.user;
        
        // Load language preference
        this.loadLanguagePreference();
        
        // Load data and setup
        this.loadUserData();
        this.loadCategories();
        this.loadProducts();
        this.setupEventListeners();
        this.updateUI();
        
        console.log('Stoke Shop Mini App initialized');
    }

    // ... остальные методы без изменений до processCryptoBotDeposit ...

    async processCryptoBotDeposit() {
        this.showModal('cryptoBotModal');
        
        // Update crypto modal
        document.getElementById('cryptoAmount').textContent = this.selectedAmount;
        document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].creating_invoice;
        
        try {
            // Create real invoice via Crypto Pay API
            const invoiceData = await this.createRealCryptoInvoice(this.selectedAmount);
            
            if (invoiceData.success) {
                this.cryptoInvoiceId = invoiceData.result.invoice_id;
                document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].invoice_created;
                
                // Set up REAL payment link
                const openCryptoBotBtn = document.getElementById('openCryptoBotBtn');
                openCryptoBotBtn.onclick = () => {
                    // Открываем Crypto Bot с правильной ссылкой на оплату
                    window.open(invoiceData.result.bot_invoice_url, '_blank');
                };
                
                // Start payment timer
                this.startPaymentTimer();
                
                // Start automatic payment checking
                this.startAutoPaymentCheck();
                
                console.log('Real invoice created:', invoiceData.result);
            } else {
                throw new Error(invoiceData.error || 'Failed to create invoice');
            }
            
        } catch (error) {
            console.error('Error creating real invoice:', error);
            document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].payment_failed + ': ' + error.message;
            document.getElementById('cryptoStatus').style.color = 'var(--danger)';
            
            // Fallback to simulation
            setTimeout(() => {
                this.createSimulatedInvoice();
            }, 2000);
        }
    }

    async createRealCryptoInvoice(amount) {
        // Проверяем допустимые суммы
        const allowedAmounts = [10, 25, 50, 100, 200, 500];
        if (!allowedAmounts.includes(amount)) {
            throw new Error('Invalid amount selected');
        }

        try {
            const response = await fetch(this.cryptoPayConfig.baseUrl + 'createInvoice', {
                method: 'POST',
                headers: {
                    'Crypto-Pay-API-Token': this.cryptoPayConfig.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    asset: 'USDT', // Можно использовать: USDT, BTC, ETH, TON, etc.
                    amount: amount.toString(),
                    description: `Deposit $${amount} to Stoke Shop - User ${this.user?.id || 'unknown'}`,
                    hidden_message: 'Thank you for your payment! 🎉',
                    paid_btn_name: 'view_item',
                    paid_btn_url: 'https://t.me/stokeshopbot',
                    payload: JSON.stringify({
                        user_id: this.user?.id || 'unknown',
                        username: this.user?.username || 'unknown',
                        amount: amount,
                        type: 'balance_deposit',
                        currency: 'USD',
                        timestamp: Date.now(),
                        shop: 'Stoke Shop'
                    }),
                    allow_comments: true,
                    allow_anonymous: false,
                    expires_in: 3600 // 1 час
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            
            if (data.ok) {
                return {
                    success: true,
                    result: data.result
                };
            } else {
                throw new Error(data.error?.name || `API Error: ${JSON.stringify(data.error)}`);
            }
        } catch (error) {
            console.error('Real Crypto Pay API error:', error);
            throw error; // Пробрасываем ошибку для обработки выше
        }
    }

    createSimulatedInvoice() {
        console.log('Creating simulated invoice for demo purposes');
        
        // Создаем демо-инвойс с реалистичными данными
        const demoInvoiceId = 'demo_inv_' + Date.now();
        const botInvoiceUrl = `https://t.me/CryptoBot?start=invoice_${demoInvoiceId}`;
        
        this.cryptoInvoiceId = demoInvoiceId;
        document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].invoice_created + ' (Demo)';
        
        // Настраиваем кнопку для демо
        const openCryptoBotBtn = document.getElementById('openCryptoBotBtn');
        openCryptoBotBtn.onclick = () => {
            this.showMessage(this.currentLanguage === 'ru' 
                ? '🚧 Демо-режим: В реальном приложении здесь будет открываться Crypto Bot с инвойсом' 
                : '🚧 Demo: In real app, Crypto Bot would open with invoice');
        };
        
        // Запускаем таймер
        this.startPaymentTimer();
        this.startAutoPaymentCheck();
    }

    async checkCryptoPayment() {
        if (!this.cryptoInvoiceId) {
            this.showMessage('No active invoice found');
            return;
        }

        document.getElementById('cryptoStatus').textContent = this.currentLanguage === 'ru' ? '🔄 Проверка оплаты...' : '🔄 Checking payment...';
        
        try {
            let paymentStatus;
            
            // Проверяем, реальный это инвойс или демо
            if (this.cryptoInvoiceId.startsWith('demo_inv_')) {
                paymentStatus = await this.checkDemoInvoiceStatus();
            } else {
                paymentStatus = await this.checkRealInvoiceStatus(this.cryptoInvoiceId);
            }
            
            if (paymentStatus.paid) {
                await this.handleSuccessfulPayment();
            } else if (paymentStatus.expired) {
                document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].invoice_expired;
                document.getElementById('cryptoStatus').style.color = 'var(--danger)';
                this.stopAutoPaymentCheck();
            } else {
                document.getElementById('cryptoStatus').textContent = this.currentLanguage === 'ru' ? '⏳ Ожидание оплаты...' : '⏳ Waiting for payment...';
                document.getElementById('cryptoStatus').style.color = 'var(--warning)';
            }
            
        } catch (error) {
            console.error('Payment check error:', error);
            document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].payment_failed;
            document.getElementById('cryptoStatus').style.color = 'var(--danger)';
        }
    }

    async checkRealInvoiceStatus(invoiceId) {
        try {
            const response = await fetch(`${this.cryptoPayConfig.baseUrl}getInvoices?invoice_ids=${invoiceId}`, {
                method: 'GET',
                headers: {
                    'Crypto-Pay-API-Token': this.cryptoPayConfig.apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.ok && data.result.items.length > 0) {
                const invoice = data.result.items[0];
                return {
                    paid: invoice.status === 'paid',
                    expired: invoice.status === 'expired',
                    active: invoice.status === 'active'
                };
            } else {
                throw new Error('Invoice not found in API response');
            }
        } catch (error) {
            console.error('Real invoice check error:', error);
            throw error;
        }
    }

    async checkDemoInvoiceStatus() {
        // Демо-логика: после 3 проверок считаем оплаченным
        const checkCount = parseInt(localStorage.getItem('demo_check_count') || '0');
        const paid = checkCount >= 2;
        
        localStorage.setItem('demo_check_count', (checkCount + 1).toString());
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    paid: paid,
                    expired: false,
                    active: !paid
                });
            }, 1500);
        });
    }

    async handleSuccessfulPayment() {
        document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].payment_success;
        document.getElementById('cryptoStatus').style.color = 'var(--success)';
        
        // Update user balance
        this.userData.balance += this.selectedAmount;
        this.userData.totalDeposited += this.selectedAmount;
        this.saveUserData();
        this.updateUI();
        
        // Stop timers
        this.stopPaymentTimer();
        this.stopAutoPaymentCheck();
        
        // Reset demo counter if it was a demo payment
        if (this.cryptoInvoiceId.startsWith('demo_inv_')) {
            localStorage.removeItem('demo_check_count');
        }
        
        // Show success and close modals
        setTimeout(() => {
            this.hideModal('cryptoBotModal');
            this.hideModal('depositModal');
            const successMessage = this.currentLanguage === 'ru'
                ? `🎉 Оплата прошла успешно! На ваш баланс зачислено $${this.selectedAmount}`
                : `🎉 Payment successful! $${this.selectedAmount} added to your balance`;
            this.showMessage(successMessage);
        }, 2000);
    }

    startAutoPaymentCheck() {
        // Автоматическая проверка статуса каждые 10 секунд
        this.autoCheckInterval = setInterval(() => {
            this.checkCryptoPayment();
        }, 10000);
    }

    stopAutoPaymentCheck() {
        if (this.autoCheckInterval) {
            clearInterval(this.autoCheckInterval);
            this.autoCheckInterval = null;
        }
    }

    startPaymentTimer() {
        let timeLeft = 15 * 60; // 15 минут
        const timerElement = document.getElementById('cryptoTimer');
        
        this.paymentTimer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `⏰ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                this.stopPaymentTimer();
                document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].invoice_expired;
                document.getElementById('cryptoStatus').style.color = 'var(--danger)';
                this.stopAutoPaymentCheck();
            }
            
            timeLeft--;
        }, 1000);
    }

    stopPaymentTimer() {
        if (this.paymentTimer) {
            clearInterval(this.paymentTimer);
            this.paymentTimer = null;
        }
    }

    // ... остальные методы без изменений ...
}
