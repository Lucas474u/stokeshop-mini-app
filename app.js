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
        
        // Crypto Pay API credentials - ЗАМЕНИ НА СВОЙ КЛЮЧ ИЗ @CryptoBot (/api)
        this.cryptoPayConfig = {
            apiKey: '477613:AAJXN238rLjxk7pP2L6DA7tNnnrYQ8V4BBE',
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
        this.tg.expand();
        this.tg.enableClosingConfirmation();
        this.tg.setHeaderColor('#000000');
        this.tg.setBackgroundColor('#000000');
        
        this.user = this.tg.initDataUnsafe?.user;
        
        this.loadLanguagePreference();
        this.loadUserData();
        this.loadCategories();
        this.loadProducts();
        this.setupEventListeners();
        this.updateUI();
        
        console.log('Stoke Shop Mini App initialized', this.user);
    }

    loadLanguagePreference() {
        const savedLang = localStorage.getItem('stoke_language');
        if (savedLang) {
            this.currentLanguage = savedLang;
        }
        this.applyLanguage();
    }

    applyLanguage() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[this.currentLanguage][key]) {
                element.textContent = this.translations[this.currentLanguage][key];
            }
        });

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
        if (this.user) {
            console.log('Telegram user data:', this.user);
            
            if (this.user.photo_url) {
                const userAvatar = document.getElementById('userAvatar');
                const profileAvatar = document.getElementById('profileAvatar');
                
                userAvatar.src = this.user.photo_url;
                profileAvatar.src = this.user.photo_url;
                
                userAvatar.style.display = 'block';
                profileAvatar.style.display = 'block';
                document.getElementById('avatarFallback').style.display = 'none';
                document.getElementById('profileAvatarFallback').style.display = 'none';
            } else {
                document.getElementById('avatarFallback').style.display = 'flex';
                document.getElementById('profileAvatarFallback').style.display = 'flex';
                
                const name = this.user.first_name || 'User';
                const initial = name.charAt(0).toUpperCase();
                document.getElementById('avatarFallback').textContent = initial;
                document.getElementById('profileAvatarFallback').textContent = initial;
            }
            
            const username = this.user.username ? `@${this.user.username}` : this.user.first_name || 'User';
            document.getElementById('username').textContent = username;
            document.getElementById('profileName').textContent = username;
            document.getElementById('userId').textContent = this.user.id;
            document.getElementById('profileUserId').textContent = this.user.id;
            
            if (this.user.id === 7303763255) {
                document.getElementById('adminPanel').classList.remove('hidden');
            }
        }
        
        const savedBalance = localStorage.getItem('stoke_balance');
        if (savedBalance) this.userData.balance = parseFloat(savedBalance);
        
        const savedDeposits = localStorage.getItem('stoke_deposits');
        if (savedDeposits) this.userData.totalDeposited = parseFloat(savedDeposits);
        
        const savedSpent = localStorage.getItem('stoke_spent');
        if (savedSpent) this.userData.totalSpent = parseFloat(savedSpent);

        const savedOrders = localStorage.getItem('stoke_orders');
        if (savedOrders) this.userData.ordersCount = parseInt(savedOrders);

        const savedFavorites = localStorage.getItem('stoke_favorites');
        if (savedFavorites) this.userData.favoritesCount = parseInt(savedFavorites);
    }

    loadCategories() {
        this.categories = [
            { id: 1, name: '📱 Telegram', count: 8 },
            { id: 2, name: '👥 VKontakte', count: 7 },
            { id: 3, name: '👗 Vinted', count: 15 },
            { id: 4, name: '🛍️ Wallapop', count: 13 },
            { id: 5, name: '🌐 Facebook', count: 16 },
            { id: 6, name: '⭐ Telegram Stars', count: 4 },
            { id: 7, name: '👑 Telegram Premium', count: 3 },
            { id: 8, name: '🔍 Yandex', count: 10 },
            { id: 9, name: '📦 Ozon', count: 8 },
            { id: 10, name: '🎁 Wildberries', count: 9 },
            { id: 11, name: '🏛️ Gosuslugi', count: 6 }
        ];
        this.renderCategories();
    }

    loadProducts() {
        // Все твои аккаунты
        this.products = [
            // Telegram accounts (8)
            { id: 1, name: 'НОВОРЕГ Telegram', price: 4, stock: 25, description: 'Новый аккаунт Telegram с гарантией', category: 'Telegram', isFavorite: false },
            { id: 2, name: 'ФИЗ СИМ US', price: 5, stock: 15, description: 'Аккаунт с US сим-картой', category: 'Telegram', isFavorite: false },
            { id: 3, name: 'ФИЗ СИМ EU', price: 5.5, stock: 12, description: 'Аккаунт с EU сим-картой', category: 'Telegram', isFavorite: false },
            { id: 4, name: 'ВИРТ СИМ', price: 4.5, stock: 20, description: 'Аккаунт с виртуальной симкой', category: 'Telegram', isFavorite: false },
            { id: 5, name: 'БИЗНЕС', price: 6, stock: 10, description: 'Бизнес аккаунт Telegram', category: 'Telegram', isFavorite: false },
            { id: 6, name: 'ПРЕМИУМ', price: 7, stock: 15, description: 'Премиум аккаунт Telegram', category: 'Telegram', isFavorite: false },
            { id: 7, name: 'ВЕРИФИЦИРОВАН', price: 6.5, stock: 12, description: 'Верифицированный аккаунт', category: 'Telegram', isFavorite: false },
            { id: 8, name: 'ПРО АККАУНТ', price: 5.8, stock: 7, description: 'Профессиональный аккаунт', category: 'Telegram', isFavorite: false },

            // VKontakte accounts (7)
            { id: 9, name: 'ВК PREMIUM', price: 10, stock: 15, description: 'Премиум аккаунт ВК', category: 'VKontakte', isFavorite: false },
            { id: 10, name: 'ВК BUSINESS', price: 8, stock: 12, description: 'Бизнес страница ВК', category: 'VKontakte', isFavorite: false },
            { id: 11, name: 'ВК STANDARD', price: 3, stock: 25, description: 'Стандартный аккаунт ВК', category: 'VKontakte', isFavorite: false },
            { id: 12, name: 'ВК FRESH', price: 2, stock: 20, description: 'Свежий аккаунт ВК', category: 'VKontakte', isFavorite: false },
            { id: 13, name: 'ВК VERIFIED', price: 9, stock: 13, description: 'Верифицированный аккаунт ВК', category: 'VKontakte', isFavorite: false },
            { id: 14, name: 'ВК CREATOR', price: 7, stock: 12, description: 'Аккаунт создателя контента', category: 'VKontakte', isFavorite: false },
            { id: 15, name: 'ВК GAMING', price: 5, stock: 18, description: 'Игровой аккаунт ВК', category: 'VKontakte', isFavorite: false },

            // Vinted accounts (15)
            { id: 16, name: 'Vinted BRUT Франция', price: 120, stock: 23, description: 'Премиум аккаунты Vinted Франция', category: 'Vinted', isFavorite: false },
            { id: 17, name: 'Vinted BRUT Испания', price: 115, stock: 16, description: 'Качественные аккаунты Vinted', category: 'Vinted', isFavorite: false },
            { id: 18, name: 'Vinted BRUT Италия', price: 110, stock: 13, description: 'Итальянские аккаунты Vinted', category: 'Vinted', isFavorite: false },
            { id: 19, name: 'Vinted BRUT Германия', price: 125, stock: 12, description: 'Немецкие аккаунты Vinted', category: 'Vinted', isFavorite: false },
            { id: 20, name: 'Vinted BRUT Польша', price: 100, stock: 17, description: 'Польские аккаунты Vinted', category: 'Vinted', isFavorite: false },
            { id: 21, name: 'Vinted BRUT США', price: 140, stock: 21, description: 'Американские аккаунты Vinted', category: 'Vinted', isFavorite: false },
            { id: 22, name: 'Vinted BRUT Великобритания', price: 130, stock: 14, description: 'Британские аккаунты Vinted', category: 'Vinted', isFavorite: false },
            { id: 23, name: 'Vinted BRUT Канада', price: 135, stock: 19, description: 'Канадские аккаунты Vinted', category: 'Vinted', isFavorite: false },
            { id: 24, name: 'Vinted BRUT Нидерланды', price: 105, stock: 18, description: 'Голландские аккаунты Vinted', category: 'Vinted', isFavorite: false },
            { id: 25, name: 'Vinted BRUT Бельгия', price: 95, stock: 14, description: 'Бельгийские аккаунты Vinted', category: 'Vinted', isFavorite: false },
            { id: 26, name: 'Vinted BRUT Португалия', price: 90, stock: 16, description: 'Португальские аккаунты Vinted', category: 'Vinted', isFavorite: false },
            { id: 27, name: 'Vinted BRUT Швеция', price: 145, stock: 11, description: 'Шведские аккаунты Vinted', category: 'Vinted', isFavorite: false },
            { id: 28, name: 'Vinted BRUT Норвегия', price: 150, stock: 14, description: 'Норвежские аккаунты Vinted', category: 'Vinted', isFavorite: false },
            { id: 29, name: 'Vinted BRUT Дания', price: 135, stock: 12, description: 'Датские аккаунты Vinted', category: 'Vinted', isFavorite: false },
            { id: 30, name: 'Vinted BRUT Финляндия', price: 140, stock: 15, description: 'Финские аккаунты Vinted', category: 'Vinted', isFavorite: false },

            // Wallapop accounts (13)
            { id: 31, name: 'Wallapop Испания', price: 25, stock: 10, description: 'Качественный испанский аккаунт', category: 'Wallapop', isFavorite: false },
            { id: 32, name: 'Wallapop Италия', price: 22, stock: 17, description: 'Итальянский аккаунт Wallapop', category: 'Wallapop', isFavorite: false },
            { id: 33, name: 'Wallapop Франция', price: 28, stock: 12, description: 'Французский аккаунт Wallapop', category: 'Wallapop', isFavorite: false },
            { id: 34, name: 'Wallapop Португалия', price: 20, stock: 15, description: 'Португальский аккаунт', category: 'Wallapop', isFavorite: false },
            { id: 35, name: 'Wallapop PREMIUM', price: 35, stock: 19, description: 'Премиум аккаунт Wallapop', category: 'Wallapop', isFavorite: false },
            { id: 36, name: 'Wallapop BUSINESS', price: 45, stock: 16, description: 'Бизнес аккаунт Wallapop', category: 'Wallapop', isFavorite: false },
            { id: 37, name: 'Wallapop FRESH', price: 15, stock: 20, description: 'Свежий аккаунт Wallapop', category: 'Wallapop', isFavorite: false },
            { id: 38, name: 'Wallapop VERIFIED', price: 30, stock: 9, description: 'Верифицированный аккаунт', category: 'Wallapop', isFavorite: false },
            { id: 39, name: 'Wallapop TOP SELLER', price: 50, stock: 15, description: 'Аккаунт топ продавца', category: 'Wallapop', isFavorite: false },
            { id: 40, name: 'Wallapop PRO', price: 40, stock: 15, description: 'Профессиональный аккаунт', category: 'Wallapop', isFavorite: false },
            { id: 41, name: 'Wallapop STANDARD', price: 18, stock: 18, description: 'Стандартный аккаунт', category: 'Wallapop', isFavorite: false },
            { id: 42, name: 'Wallapop ULTIMATE', price: 55, stock: 18, description: 'Ультимативный аккаунт', category: 'Wallapop', isFavorite: false },
            { id: 43, name: 'Wallapop ECONOMY', price: 12, stock: 25, description: 'Экономный аккаунт', category: 'Wallapop', isFavorite: false },

            // Facebook accounts (16)
            { id: 44, name: 'Facebook USA', price: 3, stock: 20, description: 'Американский аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 45, name: 'Facebook UK', price: 2.8, stock: 18, description: 'Британский аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 46, name: 'Facebook Германия', price: 2.5, stock: 15, description: 'Немецкий аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 47, name: 'Facebook Франция', price: 2.3, stock: 22, description: 'Французский аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 48, name: 'Facebook Канада', price: 2.7, stock: 16, description: 'Канадский аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 49, name: 'Facebook Испания', price: 1.8, stock: 25, description: 'Испанский аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 50, name: 'Facebook Италия', price: 1.9, stock: 23, description: 'Итальянский аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 51, name: 'Facebook Бразилия', price: 1.5, stock: 30, description: 'Бразильский аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 52, name: 'Facebook Мексика', price: 1.6, stock: 28, description: 'Мексиканский аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 53, name: 'Facebook Австралия', price: 2.9, stock: 12, description: 'Австралийский аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 54, name: 'Facebook Япония', price: 2.2, stock: 14, description: 'Японский аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 55, name: 'Facebook Южная Корея', price: 2.1, stock: 13, description: 'Корейский аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 56, name: 'Facebook Индия', price: 0.7, stock: 50, description: 'Индийский аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 57, name: 'Facebook Турция', price: 1.2, stock: 35, description: 'Турецкий аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 58, name: 'Facebook Польша', price: 1.8, stock: 26, description: 'Польский аккаунт Facebook', category: 'Facebook', isFavorite: false },
            { id: 59, name: 'Facebook BUSINESS', price: 5, stock: 14, description: 'Бизнес аккаунт Facebook', category: 'Facebook', isFavorite: false },

            // Telegram Stars
            { id: 60, name: 'Telegram Stars 100', price: 0.8, stock: 100, description: '100 звезд для Telegram', category: 'Telegram Stars', isFavorite: false },
            { id: 61, name: 'Telegram Stars 500', price: 4.5, stock: 50, description: '500 звезд для Telegram', category: 'Telegram Stars', isFavorite: false },
            { id: 62, name: 'Telegram Stars 1000', price: 11, stock: 30, description: '1000 звезд для Telegram', category: 'Telegram Stars', isFavorite: false },
            { id: 63, name: 'Telegram Stars 5000', price: 50, stock: 15, description: '5000 звезд для Telegram', category: 'Telegram Stars', isFavorite: false },

            // Telegram Premium
            { id: 64, name: 'Telegram Premium 3 месяца', price: 9, stock: 30, description: 'Премиум подписка на 3 месяца', category: 'Telegram Premium', isFavorite: false },
            { id: 65, name: 'Telegram Premium 6 месяцев', price: 15, stock: 25, description: 'Премиум подписка на 6 месяцев', category: 'Telegram Premium', isFavorite: false },
            { id: 66, name: 'Telegram Premium 1 год', price: 25, stock: 20, description: 'Годовая премиум подписка', category: 'Telegram Premium', isFavorite: false },

            // Yandex
            { id: 67, name: 'Яндекс Сплит НОВОРЕГ', price: 15, stock: 25, description: 'Свежий аккаунт Яндекс Сплит', category: 'Yandex', isFavorite: false },
            { id: 68, name: 'Яндекс Сплит ВЕРИФИЦИРОВАН', price: 25, stock: 18, description: 'Верифицированный Яндекс Сплит', category: 'Yandex', isFavorite: false },
            { id: 69, name: 'Яндекс Сплит PRO', price: 40, stock: 12, description: 'Профессиональный Яндекс Сплит', category: 'Yandex', isFavorite: false },
            { id: 70, name: 'Яндекс Сплит БИЗНЕС', price: 60, stock: 16, description: 'Бизнес аккаунт Яндекс Сплит', category: 'Yandex', isFavorite: false },
            { id: 71, name: 'Яндекс Сплит МАКСИМУМ', price: 80, stock: 18, description: 'Яндекс Сплит с максимальными лимитами', category: 'Yandex', isFavorite: false },
            { id: 72, name: 'Яндекс Сплит СТАНДАРТ', price: 20, stock: 20, description: 'Стандартный аккаунт Яндекс Сплит', category: 'Yandex', isFavorite: false },
            { id: 73, name: 'Яндекс Сплит ПРЕМИУМ', price: 50, stock: 10, description: 'Премиум Яндекс Сплит аккаунт', category: 'Yandex', isFavorite: false },
            { id: 74, name: 'Яндекс Сплит ВИП', price: 70, stock: 17, description: 'VIP аккаунт Яндекс Сплит', category: 'Yandex', isFavorite: false },
            { id: 75, name: 'Яндекс Сплит АВТО', price: 35, stock: 15, description: 'Яндекс Сплит для автоматизации', category: 'Yandex', isFavorite: false },
            { id: 76, name: 'Яндекс Сплит УЛЬТИМАТ', price: 90, stock: 16, description: 'Ультимативный Яндекс Сплит со всеми функциями', category: 'Yandex', isFavorite: false },

            // Ozon
            { id: 77, name: 'Ozon НОВОРЕГ', price: 20, stock: 20, description: 'Свежий аккаунт Ozon', category: 'Ozon', isFavorite: false },
            { id: 78, name: 'Ozon ВЕРИФИЦИРОВАН', price: 35, stock: 15, description: 'Верифицированный Ozon', category: 'Ozon', isFavorite: false },
            { id: 79, name: 'Ozon PRO', price: 50, stock: 10, description: 'Профессиональный Ozon', category: 'Ozon', isFavorite: false },
            { id: 80, name: 'Ozon БИЗНЕС', price: 70, stock: 13, description: 'Бизнес аккаунт Ozon', category: 'Ozon', isFavorite: false },
            { id: 81, name: 'Ozon МАКСИМУМ', price: 80, stock: 17, description: 'Ozon с максимальными лимитами', category: 'Ozon', isFavorite: false },
            { id: 82, name: 'Ozon СТАНДАРТ', price: 25, stock: 18, description: 'Стандартный аккаунт Ozon', category: 'Ozon', isFavorite: false },
            { id: 83, name: 'Ozon ПРЕМИУМ', price: 60, stock: 13, description: 'Премиум Ozon аккаунт', category: 'Ozon', isFavorite: false },
            { id: 84, name: 'Ozon СЕЛЛЕР', price: 90, stock: 12, description: 'Аккаунт продавца Ozon со всеми функциями', category: 'Ozon', isFavorite: false },

            // Wildberries
            { id: 85, name: 'WB SELLER', price: 30, stock: 12, description: 'Аккаунт продавца Wildberries', category: 'Wildberries', isFavorite: false },
            { id: 86, name: 'WB BUSINESS', price: 45, stock: 17, description: 'Бизнес аккаунт Wildberries', category: 'Wildberries', isFavorite: false },
            { id: 87, name: 'WB FRESH', price: 12, stock: 18, description: 'Свежий аккаунт Wildberries', category: 'Wildberries', isFavorite: false },
            { id: 88, name: 'WB VERIFIED', price: 35, stock: 18, description: 'Верифицированный аккаунт WB', category: 'Wildberries', isFavorite: false },
            { id: 89, name: 'WB PREMIUM', price: 40, stock: 12, description: 'Премиум аккаунт Wildberries', category: 'Wildberries', isFavorite: false },
            { id: 90, name: 'WB STANDARD', price: 18, stock: 14, description: 'Стандартный аккаунт Wildberries', category: 'Wildberries', isFavorite: false },
            { id: 91, name: 'WB EXPRESS', price: 25, stock: 11, description: 'Аккаунт WB Express', category: 'Wildberries', isFavorite: false },
            { id: 92, name: 'WB PARTNER', price: 32, stock: 17, description: 'Партнерский аккаунт WB', category: 'Wildberries', isFavorite: false },
            { id: 93, name: 'WB GOLD', price: 38, stock: 18, description: 'Золотой аккаунт Wildberries', category: 'Wildberries', isFavorite: false },

            // Gosuslugi
            { id: 94, name: 'Госуслуги STANDARD', price: 20, stock: 10, description: 'Стандартный аккаунт Госуслуг', category: 'Gosuslugi', isFavorite: false },
            { id: 95, name: 'Госуслуги VERIFIED', price: 35, stock: 17, description: 'Верифицированный аккаунт Госуслуг', category: 'Gosuslugi', isFavorite: false },
            { id: 96, name: 'Госуслуги PREMIUM', price: 50, stock: 19, description: 'Премиум аккаунт Госуслуг', category: 'Gosuslugi', isFavorite: false },
            { id: 97, name: 'Госуслуги BUSINESS', price: 60, stock: 16, description: 'Бизнес аккаунт Госуслуг', category: 'Gosuslugi', isFavorite: false },
            { id: 98, name: 'Госуслуги FRESH', price: 25, stock: 12, description: 'Свежий аккаунт Госуслуг', category: 'Gosuslugi', isFavorite: false },
            { id: 99, name: 'Госуслуги PRO', price: 45, stock: 6, description: 'Профессиональный аккаунт Госуслуг', category: 'Gosuslugi', isFavorite: false }
        ];
        this.renderProducts();
    }

    setupEventListeners() {
        // ... все твои обработчики событий без изменений ...
        document.getElementById('languageBtn').addEventListener('click', () => {
            this.showModal('languageSelector');
        });

        document.getElementById('closeLanguageModal').addEventListener('click', () => {
            this.hideModal('languageSelector');
        });

        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const lang = e.currentTarget.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });

        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        document.getElementById('depositBtn').addEventListener('click', () => {
            this.showDepositModal();
        });

        document.querySelectorAll('.amount-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectAmount(parseInt(e.currentTarget.getAttribute('data-amount')));
            });
        });

        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', (e) => {
                this.selectPaymentMethod(e.currentTarget.getAttribute('data-method'));
            });
        });

        document.getElementById('confirmDepositBtn').addEventListener('click', () => {
            this.processDeposit();
        });

        document.getElementById('openCryptoBotBtn').addEventListener('click', () => {
            this.openCryptoBot();
        });

        document.getElementById('checkCryptoPaymentBtn').addEventListener('click', () => {
            this.checkCryptoPayment();
        });

        document.getElementById('copyWalletBtn').addEventListener('click', () => {
            this.copyWalletAddress();
        });

        document.getElementById('buyNowBtn').addEventListener('click', () => {
            this.buyProduct();
        });

        document.getElementById('addFavoriteBtn').addEventListener('click', () => {
            this.toggleFavorite();
        });

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

        document.getElementById('adminStatsBtn').addEventListener('click', () => {
            this.handleAdminAction('stats');
        });

        document.getElementById('adminKassaBtn').addEventListener('click', () => {
            this.handleAdminAction('kassa');
        });

        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleMenuAction(action);
            });
        });

        document.getElementById('closeDepositModal').addEventListener('click', () => {
            this.hideModal('depositModal');
        });

        document.getElementById('closeCryptoModal').addEventListener('click', () => {
            this.hideModal('cryptoBotModal');
            this.stopPaymentTimer();
            this.stopAutoPaymentCheck();
        });

        document.getElementById('closeWalletModal').addEventListener('click', () => {
            this.hideModal('walletModal');
        });

        document.getElementById('closeProductModal').addEventListener('click', () => {
            this.hideModal('productModal');
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterProducts(e.target.value);
        });

        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        document.getElementById('categoriesGrid').addEventListener('click', (e) => {
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard) {
                const categoryName = categoryCard.querySelector('.category-name').textContent;
                this.showCategoryProducts(categoryName);
            }
        });

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
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

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
        
        document.querySelectorAll('.amount-option').forEach(option => {
            const optionAmount = parseInt(option.getAttribute('data-amount'));
            option.classList.toggle('active', optionAmount === amount);
        });
        
        document.getElementById('selectedDepositAmount').textContent = amount;
    }

    selectPaymentMethod(method) {
        this.selectedMethod = method;
        
        document.querySelectorAll('.payment-method').forEach(methodEl => {
            methodEl.classList.remove('active');
        });
        document.querySelector(`[data-method="${method}"]`).classList.add('active');
    }

    showDepositModal() {
        this.selectedAmount = 10;
        this.selectedMethod = 'crypto_bot';
        
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
        // Create invoice via Crypto Pay API
        console.log('Creating invoice for amount:', this.selectedAmount);
        const invoiceData = await this.createRealCryptoInvoice(this.selectedAmount);
        
        if (invoiceData.success) {
            this.cryptoInvoiceId = invoiceData.result.invoice_id;
            document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].invoice_created;
            
            // Set up REAL payment link
            const openCryptoBotBtn = document.getElementById('openCryptoBotBtn');
            openCryptoBotBtn.onclick = () => {
                // Правильная ссылка для открытия Crypto Bot с инвойсом
                const botInvoiceUrl = invoiceData.result.bot_invoice_url;
                console.log('Opening Crypto Bot with URL:', botInvoiceUrl);
                // Открываем в новом окне
                window.open(botInvoiceUrl, '_blank');
                // Также можно попробовать открыть через Telegram
                this.tg.openTelegramLink(botInvoiceUrl);
            };
            
            // Start payment timer (15 минут)
            this.startPaymentTimer();
            
            console.log('Real invoice created successfully:', invoiceData.result);
        } else {
            throw new Error(invoiceData.error || 'Failed to create invoice');
        }
        
    } catch (error) {
        console.error('Error creating real invoice:', error);
        document.getElementById('cryptoStatus').textContent = 'Ошибка создания инвойса: ' + error.message;
        document.getElementById('cryptoStatus').style.color = 'var(--danger)';
        
        // Показываем кнопку для ручного создания инвойса
        const openCryptoBotBtn = document.getElementById('openCryptoBotBtn');
        openCryptoBotBtn.onclick = () => {
            this.showMessage('Сначала настройте Crypto Pay API ключ в настройках бота');
        };
    }
}

async createRealCryptoInvoice(amount) {
    // Проверяем допустимые суммы
    const allowedAmounts = [10, 25, 50, 100, 200, 500];
    if (!allowedAmounts.includes(amount)) {
        throw new Error(`Invalid amount selected: $${amount}`);
    }

    // Проверяем API ключ
    if (!this.cryptoPayConfig.apiKey || this.cryptoPayConfig.apiKey === '12345:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') {
        throw new Error('Crypto Pay API ключ не настроен. Получите ключ в @CryptoBot командой /api');
    }

    try {
        console.log('Sending request to Crypto Pay API...');
        
        const response = await fetch(this.cryptoPayConfig.baseUrl + 'createInvoice', {
            method: 'POST',
            headers: {
                'Crypto-Pay-API-Token': this.cryptoPayConfig.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                asset: 'USDT', // Можно использовать: USDT, BTC, ETH, TON, LTC, etc.
                amount: amount.toString(),
                description: `Deposit $${amount} to Stoke Shop`,
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

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('HTTP Error:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.ok) {
            return {
                success: true,
                result: data.result
            };
        } else {
            console.error('API Error:', data.error);
            throw new Error(data.error?.name || `API Error: ${JSON.stringify(data.error)}`);
        }
    } catch (error) {
        console.error('Crypto Pay API error:', error);
        
        // Более детальная информация об ошибке
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Не удалось подключиться к Crypto Pay API. Проверьте интернет соединение.');
        } else if (error.message.includes('401')) {
            throw new Error('Неверный API ключ. Проверьте ключ в @CryptoBot');
        } else if (error.message.includes('403')) {
            throw new Error('Доступ запрещен. Проверьте настройки API в @CryptoBot');
        } else {
            throw error;
        }
    }
}

async checkCryptoPayment() {
    if (!this.cryptoInvoiceId) {
        this.showMessage('No active invoice found');
        return;
    }

    // Если это демо-инвойс, не проверяем
    if (this.cryptoInvoiceId.startsWith('demo_')) {
        document.getElementById('cryptoStatus').textContent = 'Демо-режим: оплата не проверяется';
        return;
    }

    const statusElement = document.getElementById('cryptoStatus');
    statusElement.textContent = this.currentLanguage === 'ru' ? '🔄 Проверка оплаты...' : '🔄 Checking payment...';
    statusElement.style.color = 'var(--ios-text)';
    
    try {
        const paymentStatus = await this.checkRealInvoiceStatus(this.cryptoInvoiceId);
        
        if (paymentStatus.paid) {
            await this.handleSuccessfulPayment();
        } else if (paymentStatus.expired) {
            statusElement.textContent = this.translations[this.currentLanguage].invoice_expired;
            statusElement.style.color = 'var(--danger)';
        } else {
            statusElement.textContent = this.currentLanguage === 'ru' ? '⏳ Ожидание оплаты...' : '⏳ Waiting for payment...';
            statusElement.style.color = 'var(--warning)';
        }
        
    } catch (error) {
        console.error('Payment check error:', error);
        statusElement.textContent = 'Ошибка проверки: ' + error.message;
        statusElement.style.color = 'var(--danger)';
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
                throw new Error(`HTTP error: ${response.status}`);
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
                throw new Error('Invoice not found');
            }
        } catch (error) {
            console.error('Invoice check error:', error);
            throw error;
        }
    }

    async handleSuccessfulPayment() {
        document.getElementById('cryptoStatus').textContent = this.translations[this.currentLanguage].payment_success;
        document.getElementById('cryptoStatus').style.color = 'var(--success)';
        
        this.userData.balance += this.selectedAmount;
        this.userData.totalDeposited += this.selectedAmount;
        this.saveUserData();
        this.updateUI();
        
        this.stopPaymentTimer();
        this.stopAutoPaymentCheck();
        
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
        this.autoCheckInterval = setInterval(() => {
            this.checkCryptoPayment();
        }, 10000); // Проверка каждые 10 секунд
    }

    stopAutoPaymentCheck() {
        if (this.autoCheckInterval) {
            clearInterval(this.autoCheckInterval);
            this.autoCheckInterval = null;
        }
    }

    startPaymentTimer() {
        let timeLeft = 15 * 60;
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
        const categoryProducts = this.products.filter(p => p.category === categoryName.replace(/[📱👥👗🛍️🌐⭐👑🔍📦🎁🏛️]/g, '').trim());
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
        
        const favoriteText = this.translations[this.currentLanguage].add_to_favorites;
        document.getElementById('addFavoriteBtn').innerHTML = `❤️ ${favoriteText}`;
        
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
            this.showMessage('❤️ ' + (this.currentLanguage === 'ru' ? 'Добавлено в избранное' : 'Added to favorites'));
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
        setTimeout(() => {
            this.showMessage(this.currentLanguage === 'ru' ? 'Данные обновлены!' : 'Data updated!');
        }, 1000);
    }

    updateUI() {
        document.getElementById('userBalance').textContent = this.userData.balance.toFixed(2);
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
}

Telegram.WebApp.ready();
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StokeShopApp();
});

