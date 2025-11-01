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
        
        // Load data and setup
        this.loadUserData();
        this.loadCategories();
        this.loadProducts();
        this.setupEventListeners();
        this.updateUI();
        
        console.log('Stoke Shop Mini App initialized');
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
            }
            
            // Username and ID
            const username = this.user.username ? `@${this.user.username}` : 
                            this.user.first_name || 'Пользователь';
            
            document.getElementById('username').textContent = username;
            document.getElementById('profileName').textContent = username;
            document.getElementById('userId').textContent = this.user.id;
            document.getElementById('profileUserId').textContent = this.user.id;
            
            // Check if user is admin (your ID)
            if (this.user.id === 7303763255) {
                document.getElementById('adminPanel').style.display = 'block';
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
    }

    loadCategories() {
        this.categories = [
            { id: 1, name: 'Telegram', emoji: '📱', count: 8 },
            { id: 2, name: 'Vinted', emoji: '🛍️', count: 15 },
            { id: 3, name: 'Wallapop', emoji: '🏪', count: 13 },
            { id: 4, name: 'Facebook', emoji: '📘', count: 16 },
            { id: 5, name: 'Яндекс', emoji: '🟡', count: 10 },
            { id: 6, name: 'Ozon', emoji: '📦', count: 8 },
            { id: 7, name: 'Wildberries', emoji: '🎯', count: 9 },
            { id: 8, name: 'Госуслуги', emoji: '🏛️', count: 6 }
        ];
        
        this.renderCategories();
    }

    loadProducts() {
        // All accounts from your database
        this.products = [
            // Telegram accounts (8)
            { id: 1, name: 'НОВОРЕГ Telegram', price: 4, stock: 25, description: 'Новый аккаунт Telegram с гарантией', category: 'Telegram', isFavorite: false },
            { id: 2, name: 'ФИЗ СИМ
