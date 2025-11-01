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
        this.tg.setHeaderColor('#0F172A');
        this.tg.setBackgroundColor('#020617');
        
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

    loadLanguagePreference() {
        const savedLang = localStorage.getItem('stoke_language');
        if (savedLang) {
            this.currentLanguage = savedLang;
        }
        this.applyLanguage();
    }

    applyLanguage() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[this.currentLanguage][key]) {
                element.textContent = this.translations[this.currentLanguage][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-ph]').forEach(element => {
            const key = element.getAttribute('data-i18n-ph');
            if (this.translations[this.currentLanguage][key]) {
                element.placeholder = this.translations[this.currentLanguage][key];
            }
        });
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('stoke_language', lang);
        this.applyLanguage();
        this.hideModal('languageSelector');
    }

    loadUserData() {
        // Get real user data from Telegram
        if (this.user) {
            // Avatar
            if (this.user.photo_url) {
                document.getElementById('userAvatar').src = this.user.photo_url;
                document.getElementById('profileAvatar').src = this.user.photo_url;
            } else {
                document.getElementById('avatarFallback').style.display = 'flex';
                document.getElementById('profileAvatarFallback').style.display = 'flex';
                
                // Create initial from name
                const name = this.user.first_name || 'U';
                const initial = name.charAt(0).toUpperCase();
                document.getElementById('avatarFallback').textContent = initial;
                document.getElementById('profileAvatarFallback').textContent = initial;
            }
            
            // Username and ID
            const username = this.user.username ? `@${this.user.username}` : 
                            this.user.first_name || 'User';
            
            document.getElementById('username').textContent = username;
            document.getElementById('profileName').textContent = username;
            document.getElementById('userId').textContent = this.user.id;
            document.getElementById('profileUserId').textContent = this.user.id;
            
            // Check if user is admin (your ID)
            if (this.user.id === 7303763255) {
                document.getElementById('adminPanel').classList.remove('hidden');
            }
        }
        
        // Load balance from localStorage (in real app - from your backend)
        const savedBalance = localStorage.getItem('stoke_balance');
        if (savedBalance) {
            this.userData.balance = parseFloat(savedBalance);
        }
        
        const savedDeposits = localStorage.getItem('stoke_deposits');
        if (savedDeposits) {
            this.userData.totalDeposited = parseFloat(savedDeposits);
        }
        
        const savedSpent = localStorage.getItem('stoke_spent');
        if (savedSpent) {
            this.userData.totalSpent = parseFloat(savedSpent);
        }

        const savedOrders = localStorage.getItem('stoke_orders');
        if (savedOrders) {
            this.userData.ordersCount = parseInt(savedOrders);
        }

        const savedFavorites = localStorage.getItem('stoke_favorites');
        if (savedFavorites) {
            this.userData.favoritesCount = parseInt(savedFavorites);
        }
    }

    loadCategories() {
        this.categories = [
            { id: 1, name: 'Telegram', count: 8 },
            { id: 2, name: 'VKontakte', count: 7 },
            { id: 3, name: 'Vinted', count: 15 },
            { id: 4, name: 'Wallapop', count: 13 },
            { id: 5, name: 'Facebook', count: 16 },
            { id: 6, name: 'Telegram Stars', count: 4 },
            { id: 7, name: 'Telegram Premium', count: 3 },
            { id: 8, name: 'Yandex', count: 10 },
            { id: 9, name: 'Ozon', count: 8 },
            { id: 10, name: 'Wildberries', count: 9 },
            { id: 11, name: 'Gosuslugi', count: 6 }
        ];
        
        this.renderCategories();
    }

    loadProducts() {
        // All products from your database
        this.products = [
            // Telegram accounts
            { id: 1, name: 'НОВОРЕГ Telegram', price: 4, stock: 25, description: 'Новый аккаунт Telegram с гарантией', category: 'Telegram', isFavorite: false },
            { id: 2, name: 'ФИЗ СИМ US', price: 5, stock: 15, description: 'Аккаунт с US сим-картой', category: 'Telegram', isFavorite: false },
            { id: 3, name: 'ПРЕМИУМ Telegram', price: 7, stock: 15, description: 'Премиум аккаунт Telegram', category: 'Telegram', isFavorite: false },
            
            // Vinted accounts
            { id: 4, name: 'Vinted BRUT Франция', price: 120, stock: 23, description: 'Премиум аккаунты Vinted Франция', category: 'Vinted', isFavorite: false },
            { id: 5, name: 'Vinted BRUT Испания', price: 115, stock: 16, description: 'Качественные аккаунты Vinted', category: 'Vinted', isFavorite: false },
            { id: 6, name: 'Vinted BRUT США', price: 140, stock: 21, description: 'Американские аккаунты Vinted', category: 'Vinted', isFavorite: false },
            
            // Wallapop accounts
            { id: 7, name: 'Wallapop PREMIUM', price: 35, stock: 19, description: 'Премиум аккаунт Wallapop', category: 'Wallapop', isFavorite: false },
            { id: 8, name: 'Wallapop BUSINESS', price: 45, stock: 16, description: 'Бизнес аккаунт Wallapop', category: 'Wallapop', isFavorite: false },
            
            // Facebook accounts
            { id: 9, name: 'Facebook USA', price: 3, stock: 20, description: 'Американский аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 10, name: 'Facebook BUSINESS', price: 5, stock: 14, description: 'Бизнес аккаунт Facebook', category: 'Facebook', isFavorite: false },
            
            // Telegram Stars
            { id: 11, name: 'Telegram Stars 100', price: 0.8, stock: 100, description: '100 звезд для Telegram', category: 'Telegram Stars', isFavorite: false },
            { id: 12, name: 'Telegram Stars 1000', price: 11, stock: 30, description: '1000 звезд для Telegram', category: 'Telegram Stars', isFavorite: false },
            
            // Yandex accounts
            { id: 13, name: 'Яндекс Сплит ПРЕМИУМ', price: 50, stock: 10, description: 'Премиум Яндекс Сплит аккаунт', category: 'Yandex', isFavorite: false },
            
            // Ozon accounts
            { id: 14, name: 'Ozon ПРЕМИУМ', price: 60, stock: 13, description: 'Премиум Ozon аккаунт', category: 'Ozon', isFavorite: false },
            
            // Wildberries accounts
            { id: 15, name: 'WB PREMIUM', price: 40, stock: 12, description: 'Премиум аккаунт Wildberries', category: 'Wildberries', isFavorite: false },
            
            // Gosuslugi accounts
            { id: 16, name: 'Госуслуги PREMIUM', price: 50, stock: 19, description: 'Премиум аккаунт Госуслуг', category: 'Gosuslugi', isFavorite: false }
        ];
        
        this.renderProducts();
    }

    setupEventListeners() {
        // Language selection
        document.getElementById('languageBtn').addEventListener('click', () => {
            this.showModal('languageSelector');
        });

        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const lang = e.currentTarget.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });

        // Tab navigation
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Deposit button
        document.getElementById('depositBtn').addEventListener('click', () => {
            this.showDepositModal();
        });

        document.getElementById('profileDepositBtn').addEventListener('click', () => {
            this.showDepositModal();
        });

        // Amount selection
        document.querySelectorAll('.amount-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectAmount(parseInt(e.currentTarget.getAttribute('data-amount')));
            });
        });

        // Payment method selection
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', (e) => {
                this.selectPaymentMethod(e.currentTarget.getAttribute('data-method'));
            });
        });

        // Confirm deposit
        document.getElementById('confirmDepositBtn').addEventListener('click', () => {
            this.processDeposit();
        });

        // Crypto Bot actions
        document.getElementById('openCryptoBotBtn').addEventListener('click', () => {
            this.openCryptoBot();
        });

        document.getElementById('checkCryptoPaymentBtn').addEventListener('click', () => {
            this.checkCryptoPayment();
        });

        // Wallet actions
        document.getElementById('copyWalletBtn').addEventListener('click', () => {
            this.copyWalletAddress();
        });

        // Product actions
        document.getElementById('buyNowBtn').addEventListener('click', () => {
            this.buyProduct();
        });

        document.getElementById('addFavoriteBtn').addEventListener('click', () => {
            this.toggleFavorite();
        });

        // Quick actions
        document.getElementById('shopAction').addEventListener('click', () => {
            this.switchTab('products');
        });

        document.getElementById('ordersAction').addEventListener('click', () => {
            this.showMessage(this.translations[this.currentLanguage].orders + ': ' + this.userData.ordersCount);
        });

        document.getElementById('favoritesAction').addEventListener('click', () => {
            this.showMessage(this.translations[this.currentLanguage].favorites + ': ' + this.userData.favoritesCount);
        });

        document.getElementById('supportAction').addEventListener('click', () => {
            this.tg.openTelegramLink('https://t.me/stokeshopchannel');
        });

        // Admin actions
        document.querySelectorAll('.admin-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleAdminAction(action);
            });
        });

        // Mini menu
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleMenuAction(action);
            });
        });

        // Modal close buttons
        document.getElementById('closeDepositModal').addEventListener('click', () => {
            this.hideModal('depositModal');
        });

        document.getElementById('closeCryptoModal').addEventListener('click', () => {
            this.hideModal('cryptoBotModal');
            this.stopPaymentTimer();
        });

        document.getElementById('closeWalletModal').addEventListener('click', () => {
            this.hideModal('walletModal');
        });

        document.getElementById('closeProductModal').addEventListener('click', () => {
            this.hideModal('productModal');
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterProducts(e.target.value);
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        // Category clicks
        document.getElementById('categoriesGrid').addEventListener('click', (e) => {
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard) {
                const categoryName = categoryCard.querySelector('.category-name').textContent;
                this.showCategoryProducts(categoryName);
            }
        });

        // Product clicks
        document.getElementById('productsGrid').addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productId = parseInt(productCard.getAttribute('data-id'));
                this.showProductModal(productId);
            }
        });
    }

    renderCategories() {
        const grid = document.getElementById('categoriesGrid');
        grid.innerHTML = this.categories.map(category => `
            <div class="category-card" data-category="${category.name}">
                <div class="category-name">${category.name}</div>
                <div class="category-count">${category.count} ${this.currentLanguage === 'ru' ? 'товаров' : 'products'}</div>
            </div>
        `).join('');
    }

    renderProducts(products = this.products) {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-header">
                    <div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-stock ${product.stock < 10 ? 'low' : product.stock === 0 ? 'out' : ''}">
                            ${this.currentLanguage === 'ru' ? 'В наличии' : 'In stock'}: ${product.stock}
                        </div>
                    </div>
                    <div class="product-price">$${product.price}</div>
                </div>
                <div class="product-description">${product.description}</div>
            </div>
        `).join('');
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    showModal(modalName) {
        document.getElementById(modalName).classList.add('active');
    }

    hideModal(modalName) {
        document.getElementById(modalName).classList.remove('active');
    }

    selectAmount(amount) {
        this.selectedAmount = amount;
        
        // Update UI
        document.querySelectorAll('.amount-option').forEach(option => {
            const optionAmount = parseInt(option.getAttribute('data-amount'));
            option.classList.toggle('active', optionAmount === amount);
        });
        
        document.getElementById('selectedDepositAmount').textContent = amount;
    }

    selectPaymentMethod(method) {
        this.selectedMethod = method;
        
        // Update UI
        document.querySelectorAll('.payment-method').forEach(methodEl => {
            methodEl.classList.remove('active');
        });
        document.querySelector(`[data-method="${method}"]`).classList.add('active');
    }

    showDepositModal() {
        this.selectedAmount = 10;
        this.selectedMethod = 'crypto_bot';
        
        // Reset UI
        document.querySelectorAll('.amount-option').forEach(option => {
            const amount = parseInt(option.getAttribute('data-amount'));
            option.classList.toggle('active', amount === 10);
        });
        
        document.querySelectorAll('.payment-method').forEach(method => {
            method.classList.remove('active');
        });
        document.querySelector('[data-method="crypto_bot"]').classList.add('active');
        
        document.getElementById('selectedDepositAmount').textContent = '10';
        
        this.showModal('depositModal');
    }

    async processDeposit() {
        if (this.selectedMethod === 'crypto_bot') {
            await this.processCryptoBotDeposit();
        } else {
            this.showWalletAddress(this.selectedMethod);
        }
    }

    async processCryptoBotDeposit() {
        this.showModal('cryptoBotModal');
        
        // Update crypto modal
        document.getElementById('cryptoAmount').textContent = this.selectedAmount;
        document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].creating_invoice;
        
        try {
            // Create invoice via your bot's backend
            const invoiceData = await this.createCryptoInvoice(this.selectedAmount);
            
            if (invoiceData.success) {
                this.cryptoInvoiceId = invoiceData.invoice_id;
                document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].invoice_created;
                
                // Set up payment link
                document.getElementById('openCryptoBotBtn').onclick = () => {
                    window.open(invoiceData.pay_url, '_blank');
                };
                
                // Start payment timer
                this.startPaymentTimer();
            } else {
                throw new Error(invoiceData.error);
            }
            
        } catch (error) {
            console.error('Error creating invoice:', error);
            document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].payment_failed;
            document.getElementById('cryptoStatus').style.color = 'var(--danger)';
        }
    }

    async createCryptoInvoice(amount) {
        // In a real app, this would call your backend API
        // For demo purposes, we'll simulate the API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    invoice_id: 'inv_' + Date.now(),
                    pay_url: `https://t.me/CryptoBot?start=invoice_${Date.now()}`
                });
            }, 1000);
        });
    }

    async checkCryptoPayment() {
        if (!this.cryptoInvoiceId) return;

        document.getElementById('cryptoStatus').textContent = this.currentLanguage === 'ru' ? 'Проверка оплаты...' : 'Checking payment...';
        
        try {
            // Check payment status via your bot's backend
            const paymentStatus = await this.checkInvoiceStatus(this.cryptoInvoiceId);
            
            if (paymentStatus.paid) {
                document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].payment_success;
                document.getElementById('cryptoStatus').style.color = 'var(--success)';
                
                // Update balance
                this.userData.balance += this.selectedAmount;
                this.userData.totalDeposited += this.selectedAmount;
                this.saveUserData();
                this.updateUI();
                
                this.stopPaymentTimer();
                
                setTimeout(() => {
                    this.hideModal('cryptoBotModal');
                    this.hideModal('depositModal');
                    this.showMessage(`${this.translations[this.currentLanguage].payment_success} $${this.selectedAmount}`);
                }, 2000);
            } else {
                document.getElementById('cryptoStatus').textContent = this.currentLanguage === 'ru' ? 'Оплата не найдена' : 'Payment not found';
                document.getElementById('cryptoStatus').style.color = 'var(--danger)';
            }
            
        } catch (error) {
            document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].payment_failed;
            document.getElementById('cryptoStatus').style.color = 'var(--danger)';
        }
    }

    async checkInvoiceStatus(invoiceId) {
        // In a real app, this would call your backend API
        // For demo, we'll simulate random success
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    paid: Math.random() > 0.7 // 30% chance for demo
                });
            }, 1500);
        });
    }

    startPaymentTimer() {
        let timeLeft = 15 * 60; // 15 minutes
        const timerElement = document.getElementById('cryptoTimer');
        
        this.paymentTimer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `⏰ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                this.stopPaymentTimer();
                document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].invoice_expired;
                document.getElementById('cryptoStatus').style.color = 'var(--danger)';
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

    showWalletAddress(method) {
        const address = this.walletAddresses[method.toUpperCase()];
        if (!address) {
            this.showMessage('Address not found for this method');
            return;
        }

        document.getElementById('walletModalTitle').textContent = method.toUpperCase() + ' Wallet';
        document.getElementById('walletAddress').textContent = address;
        this.hideModal('depositModal');
        this.showModal('walletModal');
    }

    copyWalletAddress() {
        const address = document.getElementById('walletAddress').textContent;
        navigator.clipboard.writeText(address).then(() => {
            this.showMessage(this.translations[this.currentLanguage].copy_address + ' ✓');
        });
    }

    showCategoryProducts(categoryName) {
        const categoryProducts = this.products.filter(p => p.category === categoryName);
        this.renderProducts(categoryProducts);
        this.switchTab('products');
    }

    showProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        this.currentProduct = product;

        document.getElementById('productModalTitle').textContent = product.name;
        document.getElementById('productModalPrice').textContent = product.price;
        
        const stockText = this.currentLanguage === 'ru' ? 'В наличии' : 'In stock';
        document.getElementById('productModalStock').textContent = `${stockText}: ${product.stock}`;
        document.getElementById('productModalStock').className = `product-stock ${product.stock < 10 ? 'low' : product.stock === 0 ? 'out' : ''}`;
        
        document.getElementById('productModalDescription').textContent = product.description;
        
        // Update favorite button
        const favoriteText = this.translations[this.currentLanguage].add_to_favorites;
        document.getElementById('addFavoriteBtn').innerHTML = `⭐ ${favoriteText}`;
        
        this.showModal('productModal');
    }

    buyProduct() {
        if (!this.currentProduct) return;

        if (this.userData.balance < this.currentProduct.price) {
            this.showMessage(this.translations[this.currentLanguage].insufficient_balance);
            return;
        }

        if (this.currentProduct.stock <= 0) {
            this.showMessage(this.currentLanguage === 'ru' ? 'Товар закончился' : 'Product out of stock');
            return;
        }

        // Process purchase
        this.userData.balance -= this.currentProduct.price;
        this.userData.totalSpent += this.currentProduct.price;
        this.userData.ordersCount += 1;
        this.currentProduct.stock -= 1;

        this.saveUserData();
        this.updateUI();
        this.hideModal('productModal');

        const successMessage = this.currentLanguage === 'ru' 
            ? `🎉 Покупка "${this.currentProduct.name}" успешно завершена!`
            : `🎉 Purchase "${this.currentProduct.name}" completed successfully!`;
        
        this.showMessage(successMessage);
    }

    toggleFavorite() {
        if (!this.currentProduct) return;

        this.currentProduct.isFavorite = !this.currentProduct.isFavorite;
        
        if (this.currentProduct.isFavorite) {
            this.userData.favoritesCount += 1;
            this.showMessage('⭐ ' + (this.currentLanguage === 'ru' ? 'Добавлено в избранное' : 'Added to favorites'));
        } else {
            this.userData.favoritesCount -= 1;
            this.showMessage('❌ ' + (this.currentLanguage === 'ru' ? 'Удалено из избранного' : 'Removed from favorites'));
        }
        
        this.saveUserData();
        this.updateUI();
    }

    handleAdminAction(action) {
        switch (action) {
            case 'stats':
                const statsMessage = this.currentLanguage === 'ru'
                    ? '📊 Статистика магазина\n\n👥 Пользователей: 1,247\n🛒 Товаров: 156\n💰 Выручка: $28,450'
                    : '📊 Shop Statistics\n\n👥 Users: 1,247\n🛒 Products: 156\n💰 Revenue: $28,450';
                this.showMessage(statsMessage);
                break;
            case 'kassa':
                const kassaMessage = this.currentLanguage === 'ru'
                    ? '💰 Касса проекта\n\nОбщая сумма пополнений: $28,450.75'
                    : '💰 Project Cash\n\nTotal deposits: $28,450.75';
                this.showMessage(kassaMessage);
                break;
        }
    }

    handleMenuAction(action) {
        switch (action) {
            case 'main':
                this.switchTab('categories');
                break;
            case 'shop':
                this.switchTab('products');
                break;
            case 'balance':
                this.showDepositModal();
                break;
            case 'support':
                this.tg.openTelegramLink('https://t.me/stokeshopchannel');
                break;
        }

        // Update active menu button
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-action="${action}"]`).classList.add('active');
    }

    filterProducts(searchTerm) {
        const filtered = this.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderProducts(filtered);
    }

    refreshData() {
        this.showMessage(this.currentLanguage === 'ru' ? 'Обновление данных...' : 'Refreshing data...');
        // In real app, you would reload from backend
        setTimeout(() => {
            this.showMessage(this.currentLanguage === 'ru' ? 'Данные обновлены!' : 'Data updated!');
        }, 1000);
    }

    updateUI() {
        // Update balance
        document.getElementById('userBalance').textContent = this.userData.balance.toFixed(2);
        document.getElementById('profileBalance').textContent = this.userData.balance.toFixed(2);
        
        // Update stats
        document.getElementById('ordersCount').textContent = this.userData.ordersCount;
        document.getElementById('favoritesCount').textContent = this.userData.favoritesCount;
        document.getElementById('totalSpent').textContent = this.userData.totalSpent.toFixed(2);
    }

    saveUserData() {
        localStorage.setItem('stoke_balance', this.userData.balance.toString());
        localStorage.setItem('stoke_deposits', this.userData.totalDeposited.toString());
        localStorage.setItem('stoke_spent', this.userData.totalSpent.toString());
        localStorage.setItem('stoke_orders', this.userData.ordersCount.toString());
        localStorage.setItem('stoke_favorites', this.userData.favoritesCount.toString());
    }

    showMessage(message) {
        this.tg.showPopup({
            title: 'Stoke Shop',
            message: message,
            buttons: [{ type: 'ok' }]
        });
    }

    showError(message) {
        this.tg.showPopup({
            title: this.currentLanguage === 'ru' ? 'Ошибка' : 'Error',
            message: message,
            buttons: [{ type: 'ok' }]
        });
    }
}

// Initialize app when Telegram Web App is ready
Telegram.WebApp.ready();
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StokeShopApp();
});
