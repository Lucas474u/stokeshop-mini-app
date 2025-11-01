// Main Application Logic
class StokeShopApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.user = null;
        this.categories = [];
        this.products = [];
        this.userData = {};
        
        this.init();
    }

    async init() {
        // Initialize Telegram Web App
        this.tg.expand();
        this.tg.enableClosingConfirmation();
        
        // Get user data
        this.user = this.tg.initDataUnsafe?.user;
        
        // Load initial data
        await this.loadInitialData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Show main screen
        this.showScreen('main');
    }

    async loadInitialData() {
        try {
            // Simulate API calls
            await this.loadUserData();
            await this.loadCategories();
            await this.loadProducts();
            await this.loadStats();
            
            this.updateUI();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Ошибка загрузки данных');
        }
    }

    async loadUserData() {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                this.userData = {
                    balance: 125.50,
                    username: this.user?.username || 'Пользователь',
                    isAdmin: this.user?.id === 7303763255, // Check if user is admin
                    giveawayParticipant: true
                };
                resolve();
            }, 500);
        });
    }

    async loadCategories() {
        // Simulate API call
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
            }, 300);
        });
    }

    async loadProducts() {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                this.products = [
                    {
                        id: 1,
                        name: 'Vinted BRUT Франция',
                        price: 120,
                        stock: 23,
                        description: 'Премиум аккаунты Vinted Франция с гарантией 30 дней',
                        category: 'Vinted'
                    },
                    {
                        id: 2,
                        name: 'Wallapop PREMIUM',
                        price: 35,
                        stock: 5,
                        description: 'Премиум аккаунт Wallapop с рейтингом 4.9+',
                        category: 'Wallapop'
                    },
                    {
                        id: 3,
                        name: 'Telegram Stars 1000',
                        price: 11,
                        stock: 30,
                        description: '1000 звезд для Telegram с мгновенной доставкой',
                        category: 'Telegram'
                    }
                ];
                resolve();
            }, 400);
        });
    }

    async loadStats() {
        // Stats are hardcoded for demo
        return Promise.resolve();
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
                const categoryId = categoryCard.getAttribute('data-id');
                this.showCategoryProducts(categoryId);
            }
        });

        // Product clicks
        document.getElementById('productsGrid').addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productId = productCard.getAttribute('data-id');
                this.showProductModal(productId);
            }
        });

        // Modal controls
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModals();
            });
        });

        // Deposit button
        document.getElementById('depositBtn').addEventListener('click', () => {
            this.showDepositModal();
        });

        // Participate button
        document.getElementById('participateBtn').addEventListener('click', () => {
            this.participateInGiveaway();
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        // Deposit methods
        document.querySelectorAll('.method-card').forEach(method => {
            method.addEventListener('click', (e) => {
                const methodName = e.currentTarget.getAttribute('data-method');
                this.selectDepositMethod(methodName);
            });
        });

        // Profile actions
        document.querySelectorAll('.profile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleProfileAction(action);
            });
        });

        // Buy button
        document.getElementById('buyBtn').addEventListener('click', () => {
            this.buyProduct();
        });

        // Favorite button
        document.getElementById('favoriteBtn').addEventListener('click', () => {
            this.toggleFavorite();
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
    }

    updateUI() {
        // Update user info
        document.getElementById('username').textContent = this.user?.username || 'Пользователь';
        document.getElementById('userBalance').textContent = this.userData.balance.toFixed(2);
        document.getElementById('profileBalance').textContent = this.userData.balance.toFixed(2);

        // Update stats
        document.getElementById('totalUsers').textContent = '1,247';
        document.getElementById('giveawayParticipants').textContent = '4,586';
        document.getElementById('activeProducts').textContent = '156';

        // Render categories
        this.renderCategories();

        // Render products
        this.renderProducts();

        // Show/hide admin panel
        if (this.userData.isAdmin) {
            document.getElementById('adminPanel').classList.remove('hidden');
        }

        // Update giveaway status
        document.getElementById('participationStatus').textContent = 
            this.userData.giveawayParticipant ? '✅ Участвуете' : '❌ Не участвуете';
    }

    renderCategories() {
        const grid = document.getElementById('categoriesGrid');
        grid.innerHTML = this.categories.map(category => `
            <div class="category-card" data-id="${category.id}">
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

    showCategoryProducts(categoryId) {
        const category = this.categories.find(cat => cat.id == categoryId);
        const categoryProducts = this.products.filter(p => p.category === category.name);
        
        this.renderProducts(categoryProducts);
        this.switchTab('products');
        
        // Show category name in products tab
        document.querySelector('#products .section-title').textContent = `Товары: ${category.name}`;
    }

    showProductModal(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return;

        document.getElementById('productModalTitle').textContent = product.name;
        document.getElementById('productModalPrice').textContent = `$${product.price}`;
        document.getElementById('productModalStock').textContent = `В наличии: ${product.stock} шт`;
        document.getElementById('productModalDescription').textContent = product.description;
        
        document.getElementById('productModal').classList.remove('hidden');
    }

    showDepositModal() {
        document.getElementById('depositModal').classList.remove('hidden');
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    async participateInGiveaway() {
        if (this.userData.giveawayParticipant) {
            this.showMessage('Вы уже участвуете в розыгрыше!');
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.userData.giveawayParticipant = true;
            document.getElementById('participationStatus').textContent = '✅ Участвуете';
            
            this.showMessage('🎉 Вы успешно зарегистрированы в розыгрыше!');
            
        } catch (error) {
            this.showError('Ошибка при регистрации в розыгрыше');
        }
    }

    async buyProduct() {
        const productName = document.getElementById('productModalTitle').textContent;
        const productPrice = parseFloat(document.getElementById('productModalPrice').textContent.replace('$', ''));
        
        if (this.userData.balance < productPrice) {
            this.showError('Недостаточно средств на балансе');
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.userData.balance -= productPrice;
            this.updateBalanceUI();
            
            this.closeModals();
            this.showMessage(`🎉 Покупка "${productName}" успешно завершена!`);
            
        } catch (error) {
            this.showError('Ошибка при покупке товара');
        }
    }

    async refreshData() {
        this.showMessage('Обновление данных...');
        await this.loadInitialData();
        this.showMessage('Данные обновлены!');
    }

    selectDepositMethod(method) {
        this.showMessage(`Выбран метод: ${method.toUpperCase()}`);
        // Here you would integrate with actual payment system
        this.closeModals();
    }

    handleProfileAction(action) {
        switch (action) {
            case 'orders':
                this.showMessage('История заказов');
                break;
            case 'favorites':
                this.showMessage('Избранные товары');
                break;
            case 'support':
                this.tg.openTelegramLink('https://t.me/stokeshopchannel');
                break;
            case 'about':
                this.showMessage('Stoke Shop - Премиум магазин аккаунтов');
                break;
        }
    }

    toggleFavorite() {
        this.showMessage('Добавлено в избранное');
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
        
        // Here you would apply the actual filter
        this.showMessage(`Фильтр: ${button.textContent}`);
    }

    updateBalanceUI() {
        document.getElementById('userBalance').textContent = this.userData.balance.toFixed(2);
        document.getElementById('profileBalance').textContent = this.userData.balance.toFixed(2);
    }

    showMessage(message) {
        this.tg.showPopup({
            title: 'Уведомление',
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

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StokeShopApp();
});
