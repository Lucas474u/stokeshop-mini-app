// Main Application Logic
class StokeShopApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.user = null;
        this.categories = [];
        this.products = [];
        this.userData = {};
        this.selectedAmount = 10;
        this.selectedMethod = 'crypto_bot';
        this.currentProduct = null;
        
        this.init();
    }

    async init() {
        try {
            // Initialize Telegram Web App
            this.tg.expand();
            this.tg.enableClosingConfirmation();
            
            // Get user data from Telegram
            this.user = this.tg.initDataUnsafe?.user;
            
            // Show loading screen
            this.showScreen('loading');
            
            // Load initial data
            await this.loadInitialData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Show main screen
            this.showScreen('main');
            
            console.log('Stoke Shop Mini App initialized successfully');
            
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('Ошибка инициализации приложения');
        }
    }

    async loadInitialData() {
        try {
            // Simulate API calls - in real app, these would be actual API calls to your bot
            await this.loadUserData();
            await this.loadCategories();
            await this.loadProducts();
            
            this.updateUI();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Ошибка загрузки данных');
        }
    }

    async loadUserData() {
        // Simulate API call to get user data
        return new Promise(resolve => {
            setTimeout(() => {
                // Check if user is admin (your ID)
                const isAdmin = this.user?.id === 7303763255;
                
                this.userData = {
                    balance: 125.50,
                    username: this.user?.username || this.user?.first_name || 'Пользователь',
                    isAdmin: isAdmin,
                    ordersCount: 3,
                    favoritesCount: 2,
                    totalDeposits: 150.00,
                    giveawayParticipant: true
                };
                resolve();
            }, 1000);
        });
    }

    async loadCategories() {
        // Simulate API call - in real app, get from your bot
        return new Promise(resolve => {
            setTimeout(() => {
                this.categories = [
                    { id: 1, name: 'Telegram', emoji: '📱', count: 8 },
                    { id: 2, name: 'Vinted', emoji: '🛍️', count: 15 },
                    { id: 3, name: 'Wallapop', emoji: '🏪', count: 13 },
                    { id: 4, name: 'Facebook', emoji: '📘', count: 16 },
                    { id: 5, name: 'Яндекс', emoji: '🟡', count: 10 },
                    { id: 6, name: 'Ozon', emoji: '📦', count: 8 }
                ];
                resolve();
            }, 500);
        });
    }

    async loadProducts() {
        // Simulate API call - in real app, get from your bot
        return new Promise(resolve => {
            setTimeout(() => {
                this.products = [
                    {
                        id: 1,
                        name: 'Vinted BRUT Франция',
                        price: 120,
                        stock: 23,
                        description: 'Премиум аккаунты Vinted Франция с гарантией 30 дней',
                        category: 'Vinted',
                        isFavorite: false
                    },
                    {
                        id: 2,
                        name: 'Wallapop PREMIUM',
                        price: 35,
                        stock: 5,
                        description: 'Премиум аккаунт Wallapop с рейтингом 4.9+ и 100+ продажами',
                        category: 'Wallapop',
                        isFavorite: true
                    },
                    {
                        id: 3,
                        name: 'Telegram Stars 1000',
                        price: 11,
                        stock: 30,
                        description: '1000 звезд для Telegram с мгновенной доставкой',
                        category: 'Telegram',
                        isFavorite: false
                    },
                    {
                        id: 4,
                        name: 'Facebook USA Premium',
                        price: 3.5,
                        stock: 20,
                        description: 'Американский аккаунт Facebook с 500+ друзьями',
                        category: 'Facebook',
                        isFavorite: false
                    }
                ];
                resolve();
            }, 700);
        });
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
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

        // Deposit button
        document.getElementById('depositBtn').addEventListener('click', () => {
            this.showDepositModal();
        });

        // Amount buttons
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectAmount(parseInt(e.target.getAttribute('data-amount')));
            });
        });

        // Payment methods
        document.querySelectorAll('.method-card').forEach(method => {
            method.addEventListener('click', (e) => {
                this.selectPaymentMethod(e.currentTarget.getAttribute('data-method'));
            });
        });

        // Confirm deposit
        document.getElementById('confirmDeposit').addEventListener('click', () => {
            this.processDeposit();
        });

        // Buy product
        document.getElementById('buyBtn').addEventListener('click', () => {
            this.buyProduct();
        });

        // Favorite product
        document.getElementById('favoriteBtn').addEventListener('click', () => {
            this.toggleFavorite();
        });

        // Profile actions
        document.querySelectorAll('.profile-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleProfileAction(action);
            });
        });

        // Admin actions
        document.querySelectorAll('.admin-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleAdminAction(action);
            });
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        // Modal close buttons
        document.getElementById('closeDepositModal').addEventListener('click', () => {
            this.hideModal('depositModal');
        });

        document.getElementById('closeProductModal').addEventListener('click', () => {
            this.hideModal('productModal');
        });

        document.getElementById('closeCryptoModal').addEventListener('click', () => {
            this.hideModal('cryptoBotModal');
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterProducts(e.target.value);
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.activateFilter(e.target);
            });
        });

        // Crypto Bot actions
        document.getElementById('openCryptoBot').addEventListener('click', () => {
            this.openCryptoBot();
        });

        document.getElementById('checkCryptoPayment').addEventListener('click', () => {
            this.checkCryptoPayment();
        });
    }

    updateUI() {
        // Update user info
        document.getElementById('username').textContent = this.userData.username;
        document.getElementById('userBalance').textContent = this.userData.balance.toFixed(2);
        document.getElementById('profileBalance').textContent = this.userData.balance.toFixed(2);

        // Update profile counts
        document.getElementById('ordersCount').textContent = this.userData.ordersCount;
        document.getElementById('favoritesCount').textContent = this.userData.favoritesCount;

        // Show/hide admin panel
        if (this.userData.isAdmin) {
            document.getElementById('adminSection').classList.remove('hidden');
        }

        // Render categories
        this.renderCategories();

        // Render products
        this.renderProducts();
    }

    renderCategories() {
        const grid = document.getElementById('categoriesGrid');
        grid.innerHTML = this.categories.map(category => `
            <div class="category-card">
                <div class="category-icon">${category.emoji}</div>
                <div class="category-name">${category.name}</div>
                <div class="category-count">${category.count} товаров</div>
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
                        <div class="product-stock ${product.stock < 10 ? 'low' : ''}">
                            В наличии: ${product.stock} шт
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

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenName).classList.add('active');
    }

    showModal(modalName) {
        document.getElementById(modalName).classList.add('active');
    }

    hideModal(modalName) {
        document.getElementById(modalName).classList.remove('active');
    }

    showCategoryProducts(categoryName) {
        const categoryProducts = this.products.filter(p => p.category === categoryName);
        
        this.renderProducts(categoryProducts);
        this.switchTab('products');
        
        // Update search placeholder
        document.getElementById('searchInput').placeholder = `🔍 Поиск в ${categoryName}...`;
    }

    showProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        this.currentProduct = product;

        document.getElementById('productModalTitle').textContent = product.name;
        document.getElementById('productModalPrice').textContent = `$${product.price}`;
        document.getElementById('productModalStock').textContent = `В наличии: ${product.stock} шт`;
        document.getElementById('productModalDescription').textContent = product.description;
        
        // Update favorite button
        const favoriteBtn = document.getElementById('favoriteBtn');
        favoriteBtn.textContent = product.isFavorite ? '❌ Удалить из избранного' : '⭐ Добавить в избранное';
        
        this.showModal('productModal');
    }

    showDepositModal() {
        this.selectedAmount = 10;
        this.selectedMethod = 'crypto_bot';
        this.updateDepositModal();
        this.showModal('depositModal');
    }

    updateDepositModal() {
        // Update amount buttons
        document.querySelectorAll('.amount-btn').forEach(btn => {
            const amount = parseInt(btn.getAttribute('data-amount'));
            btn.classList.toggle('active', amount === this.selectedAmount);
        });

        // Update payment methods
        document.querySelectorAll('.method-card').forEach(method => {
            const methodName = method.getAttribute('data-method');
            method.classList.toggle('selected', methodName === this.selectedMethod);
        });

        // Update confirm button
        document.getElementById('selectedAmount').textContent = this.selectedAmount;
    }

    selectAmount(amount) {
        this.selectedAmount = amount;
        this.updateDepositModal();
    }

    selectPaymentMethod(method) {
        this.selectedMethod = method;
        this.updateDepositModal();
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
        document.getElementById('cryptoStatus').textContent = 'Создание инвойса...';
        
        try {
            // Simulate API call to create invoice
            // In real app, you would call your bot's API
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simulate successful invoice creation
            const invoiceUrl = `https://t.me/CryptoBot?start=invoice_${Date.now()}`;
            
            document.getElementById('cryptoStatus').textContent = 'Инвойс создан!';
            document.getElementById('openCryptoBot').onclick = () => {
                this.tg.openInvoice(invoiceUrl);
            };
            
            // Start payment timer
            this.startPaymentTimer();
            
        } catch (error) {
            document.getElementById('cryptoStatus').textContent = 'Ошибка создания инвойса';
            document.getElementById('cryptoStatus').style.color = 'var(--danger)';
        }
    }

    startPaymentTimer() {
        let timeLeft = 15 * 60; // 15 minutes in seconds
        const timerElement = document.getElementById('cryptoTimer');
        
        const timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `⏰ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                document.getElementById('cryptoStatus').textContent = 'Время оплаты истекло';
                document.getElementById('cryptoStatus').style.color = 'var(--danger)';
            }
            
            timeLeft--;
        }, 1000);
    }

    async checkCryptoPayment() {
        document.getElementById('cryptoStatus').textContent = 'Проверка оплаты...';
        
        try {
            // Simulate payment check
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simulate successful payment (in real app, check with your bot)
            const success = Math.random() > 0.5; // 50% chance for demo
            
            if (success) {
                document.getElementById('cryptoStatus').textContent = '✅ Оплата получена!';
                document.getElementById('cryptoStatus').style.color = 'var(--success)';
                
                // Update balance
                this.userData.balance += this.selectedAmount;
                this.updateUI();
                
                setTimeout(() => {
                    this.hideModal('cryptoBotModal');
                    this.hideModal('depositModal');
                    this.showMessage(`Баланс пополнен на $${this.selectedAmount}!`);
                }, 2000);
            } else {
                document.getElementById('cryptoStatus').textContent = '❌ Оплата не найдена';
                document.getElementById('cryptoStatus').style.color = 'var(--danger)';
            }
            
        } catch (error) {
            document.getElementById('cryptoStatus').textContent = 'Ошибка проверки';
            document.getElementById('cryptoStatus').style.color = 'var(--danger)';
        }
    }

    showWalletAddress(method) {
        const addresses = {
            'ton': 'UQBvrPItSxKL-U2ikxdIYz3zWRCPlxMBaz3zVCHrLmD2OPOR',
            'usdt': 'TXdf14ohPHQsysio6VGQCdFyP9nVdYcbbt'
        };
        
        const address = addresses[method];
        const message = `Адрес для пополнения (${method.toUpperCase()}):\n\n<code>${address}</code>\n\nПосле отправки средств баланс пополнится автоматически.`;
        
        this.showMessage(message);
        this.hideModal('depositModal');
    }

    async buyProduct() {
        if (!this.currentProduct) return;

        if (this.userData.balance < this.currentProduct.price) {
            this.showError('Недостаточно средств на балансе');
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Update balance and stock
            this.userData.balance -= this.currentProduct.price;
            this.currentProduct.stock -= 1;
            this.userData.ordersCount += 1;
            
            this.updateUI();
            this.hideModal('productModal');
            
            this.showMessage(`🎉 Покупка "${this.currentProduct.name}" успешно завершена!`);
            
        } catch (error) {
            this.showError('Ошибка при покупке товара');
        }
    }

    toggleFavorite() {
        if (!this.currentProduct) return;

        this.currentProduct.isFavorite = !this.currentProduct.isFavorite;
        
        if (this.currentProduct.isFavorite) {
            this.userData.favoritesCount += 1;
            this.showMessage('✅ Добавлено в избранное');
        } else {
            this.userData.favoritesCount -= 1;
            this.showMessage('❌ Удалено из избранного');
        }
        
        this.updateUI();
        
        // Update favorite button text
        const favoriteBtn = document.getElementById('favoriteBtn');
        favoriteBtn.textContent = this.currentProduct.isFavorite ? '❌ Удалить из избранного' : '⭐ Добавить в избранное';
    }

    handleProfileAction(action) {
        switch (action) {
            case 'orders':
                this.showMessage('📦 История заказов загружается...');
                break;
            case 'favorites':
                this.showMessage('⭐ Загрузка избранных товаров...');
                break;
            case 'giveaway':
                this.showGiveawayInfo();
                break;
            case 'support':
                this.tg.openTelegramLink('https://t.me/stokeshopchannel');
                break;
        }
    }

    handleAdminAction(action) {
        switch (action) {
            case 'stats':
                this.showAdminStats();
                break;
            case 'users':
                this.showMessage('👥 Управление пользователями');
                break;
            case 'products':
                this.showMessage('🛒 Управление товарами');
                break;
            case 'kassa':
                this.showKassa();
                break;
        }
    }

    showGiveawayInfo() {
        const message = `🎉 <b>РОЗЫГРЫШ 3x iPhone 17 Pro Max</b>\n\n` +
                       `Участников: 4,586\n` +
                       `До конца: 5 дней 18 часов\n` +
                       `Ваш статус: ✅ Участвуете\n\n` +
                       `Ваша сумма пополнений: $${this.userData.totalDeposits}`;
        
        this.showMessage(message);
    }

    showAdminStats() {
        const message = `📊 <b>Статистика магазина</b>\n\n` +
                       `👥 Пользователей: 1,247\n` +
                       `🛒 Товаров: 156\n` +
                       `💰 Выручка: $28,450\n` +
                       `📈 Заказов сегодня: 15`;
        
        this.showMessage(message);
    }

    showKassa() {
        const totalCash = 28450.75;
        const message = `💰 <b>Касса проекта</b>\n\n` +
                       `Общая сумма всех пополнений: $${totalCash.toFixed(2)}`;
        
        this.showMessage(message);
    }

    filterProducts(searchTerm) {
        const filtered = this.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderProducts(filtered);
    }

    activateFilter(button) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        let filteredProducts = this.products;
        
        switch (filter) {
            case 'in_stock':
                filteredProducts = this.products.filter(p => p.stock > 0);
                break;
            case 'popular':
                filteredProducts = this.products.filter(p => p.price > 50);
                break;
        }
        
        this.renderProducts(filteredProducts);
    }

    async refreshData() {
        this.showMessage('Обновление данных...');
        await this.loadInitialData();
        this.showMessage('Данные обновлены!');
    }

    openCryptoBot() {
        // This would open Crypto Bot in real implementation
        this.tg.openTelegramLink('https://t.me/CryptoBot');
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
            title: 'Ошибка',
            message: message,
            buttons: [{ type: 'ok' }]
        });
    }
}

// Initialize app when Telegram Web App is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StokeShopApp();
});
