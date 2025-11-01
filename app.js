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
        `).join
