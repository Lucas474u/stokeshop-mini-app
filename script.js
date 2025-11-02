class EliteStokeShop {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.user = null;
        this.products = [];
        this.categories = [];
        this.currentProduct = null;
        this.userBalance = 150.00;
        this.cryptoWallets = {
            'TON': 'UQBvrPItSxKL-U2ikxdIYz3zWRCPlxMBaz3zVCHrLmD2OPOR',
            'USDT': 'TXdf14ohPHQsysio6VGQCdFyP9nVdYcbbt',
            'BTC': 'bc1q25ehtjq7k2crfvujr9dyhk640dj6tynlycjhvq',
            'LTC': 'ltc1qkg69x5vtd7rl2whu8ush45xch0q3vk3f34mvhv',
            'SOL': '6GpxJvee9DUm3ej6KSAmpTns6664ZQSpFZqde5aNCo7g',
            'USDC': '0x291754537797Ac70C0159ABF1701E773502f8CcB'
        };
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Elite Stoke Shop...');
        
        // Initialize Telegram Web App
        this.tg.expand();
        this.tg.enableClosingConfirmation();
        this.tg.ready();
        this.tg.setHeaderColor('#0a0a0a');
        this.tg.setBackgroundColor('#0a0a0a');

        // Get user data
        this.user = this.tg.initDataUnsafe?.user;
        console.log('👤 User data:', this.user);
        
        // Load data
        await this.loadCategories();
        await this.loadProducts();
        
        // Render UI
        this.renderUserInfo();
        this.renderCategories();
        this.renderFeaturedProducts();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('💎 Elite Stoke Shop initialized successfully');
    }

    renderUserInfo() {
        const balanceElement = document.getElementById('userBalance');
        const avatarContainer = document.getElementById('userAvatar');
        const avatarImage = document.getElementById('avatarImage');
        const avatarFallback = document.getElementById('avatarFallback');
        
        if (balanceElement) {
            balanceElement.textContent = this.userBalance.toFixed(2);
        }
        
        if (this.user) {
            const firstName = this.user.first_name || 'User';
            const lastName = this.user.last_name || '';
            const fullName = `${firstName} ${lastName}`.trim();
            
            // Set avatar fallback
            if (avatarFallback) {
                avatarFallback.textContent = firstName.charAt(0).toUpperCase();
            }
            
            // Try to get user profile photo from Telegram
            if (this.user.photo_url && avatarImage) {
                avatarImage.src = this.user.photo_url;
                avatarImage.alt = fullName;
                avatarImage.style.display = 'block';
                if (avatarFallback) avatarFallback.style.display = 'none';
                console.log('📸 User avatar loaded from Telegram');
            } else {
                if (avatarImage) avatarImage.style.display = 'none';
                if (avatarFallback) avatarFallback.style.display = 'flex';
                console.log('👤 Using fallback avatar');
            }
            
            console.log('✅ User info rendered:', {
                name: fullName,
                username: this.user.username,
                hasPhoto: !!this.user.photo_url,
                balance: this.userBalance
            });
        }
    }

    async loadCategories() {
        this.categories = [
            { id: 1, name: 'Telegram', icon: '📱', description: 'Аккаунты Telegram', color: '#0088cc' },
            { id: 2, name: 'VKontakte', icon: '👥', description: 'Аккаунты ВКонтакте', color: '#4c75a3' },
            { id: 3, name: 'Vinted', icon: '🛍️', description: 'Брут аккаунты Vinted', color: '#ff6b6b' },
            { id: 4, name: 'Wallapop', icon: '🏪', description: 'Аккаунты Wallapop', color: '#4ecdc4' },
            { id: 5, name: 'Facebook', icon: '📘', description: 'Аккаунты Facebook', color: '#1877f2' },
            { id: 6, name: 'Telegram Stars', icon: '⭐', description: 'Звезды Telegram', color: '#ffd700' },
            { id: 7, name: 'Telegram Premium', icon: '💎', description: 'Премиум подписки', color: '#0088cc' },
            { id: 8, name: 'Яндекс Сплит', icon: '🟡', description: 'Аккаунты Яндекс', color: '#ffcc00' },
            { id: 9, name: 'Ozon', icon: '📦', description: 'Аккаунты Ozon', color: '#005bff' },
            { id: 10, name: 'Wildberries', icon: '🎯', description: 'Аккаунты Wildberries', color: '#ff6b6b' },
            { id: 11, name: 'Госуслуги', icon: '🏛️', description: 'Аккаунты Госуслуг', color: '#4c75a3' }
        ];
        
        console.log('📂 Categories loaded:', this.categories.length);
    }

    async loadProducts() {
        this.products = [
            // Vinted Accounts (15)
            { id: 1, category: 'Vinted', name: 'Vinted BRUT Франция', price: 120.00, stock: 23, image: '🇫🇷', description: 'Премиум аккаунты Vinted Франция с гарантией 30 дней', details: ['Гео: Франция', 'Статус: Premium', 'Гарантия 30 дней'], featured: true },
            { id: 2, category: 'Vinted', name: 'Vinted BRUT Испания', price: 115.00, stock: 16, image: '🇪🇸', description: 'Качественные аккаунты Vinted Испания', details: ['Гео: Испания', 'Верификация: Да', 'Возраст: 2 мес'], featured: false },
            { id: 3, category: 'Vinted', name: 'Vinted BRUT Италия', price: 110.00, stock: 13, image: '🇮🇹', description: 'Итальянские аккаунты Vinted', details: ['Гео: Италия', 'Рейтинг: 4.8+', 'Продажи: 50+'], featured: false },
            { id: 4, category: 'Vinted', name: 'Vinted BRUT Германия', price: 125.00, stock: 12, image: '🇩🇪', description: 'Немецкие аккаунты Vinted', details: ['Гео: Германия', 'Активность: Высокая'], featured: true },
            { id: 5, category: 'Vinted', name: 'Vinted BRUT Польша', price: 100.00, stock: 17, image: '🇵🇱', description: 'Польские аккаунты Vinted', details: ['Гео: Польша', 'Гарантия', 'Свежие'], featured: false },
            { id: 6, category: 'Vinted', name: 'Vinted BRUT США', price: 140.00, stock: 21, image: '🇺🇸', description: 'Американские аккаунты Vinted', details: ['Гео: США', 'Рейтинг: 4.9+', 'Премиум'], featured: true },
            { id: 7, category: 'Vinted', name: 'Vinted BRUT Великобритания', price: 130.00, stock: 14, image: '🇬🇧', description: 'Британские аккаунты Vinted', details: ['Гео: Великобритания', 'Бизнес аккаунты'], featured: false },
            { id: 8, category: 'Vinted', name: 'Vinted BRUT Канада', price: 135.00, stock: 19, image: '🇨🇦', description: 'Канадские аккаунты Vinted', details: ['Гео: Канада', 'Активные пользователи'], featured: false },
            { id: 9, category: 'Vinted', name: 'Vinted BRUT Нидерланды', price: 105.00, stock: 18, image: '🇳🇱', description: 'Голландские аккаунты Vinted', details: ['Гео: Нидерланды', 'Гарантия 30 дней'], featured: false },
            { id: 10, category: 'Vinted', name: 'Vinted BRUT Бельгия', price: 95.00, stock: 14, image: '🇧🇪', description: 'Бельгийские аккаунты Vinted', details: ['Гео: Бельгия', 'Свежие аккаунты'], featured: false },
            { id: 11, category: 'Vinted', name: 'Vinted BRUT Португалия', price: 90.00, stock: 16, image: '🇵🇹', description: 'Португальские аккаунты Vinted', details: ['Гео: Португалия', 'Высокий рейтинг'], featured: false },
            { id: 12, category: 'Vinted', name: 'Vinted BRUT Швеция', price: 145.00, stock: 11, image: '🇸🇪', description: 'Шведские аккаунты Vinted', details: ['Гео: Швеция', 'Премиум качество'], featured: false },
            { id: 13, category: 'Vinted', name: 'Vinted BRUT Норвегия', price: 150.00, stock: 14, image: '🇳🇴', description: 'Норвежские аккаунты Vinted', details: ['Гео: Норвегия', 'Редкий регион'], featured: false },
            { id: 14, category: 'Vinted', name: 'Vinted BRUT Дания', price: 135.00, stock: 12, image: '🇩🇰', description: 'Датские аккаунты Vinted', details: ['Гео: Дания', 'Бизнес аккаунты'], featured: false },
            { id: 15, category: 'Vinted', name: 'Vinted BRUT Финляндия', price: 140.00, stock: 15, image: '🇫🇮', description: 'Финские аккаунты Vinted', details: ['Гео: Финляндия', 'Премиум статус'], featured: false },

            // Wallapop Accounts (13)
            { id: 16, category: 'Wallapop', name: 'Wallapop Испания #1', price: 25.00, stock: 10, image: '🏪', description: 'Качественный испанский аккаунт', details: ['Гео: Испания', 'Рейтинг: 4.7+', 'Отзывы: 50+'], featured: true },
            { id: 17, category: 'Wallapop', name: 'Wallapop Италия #2', price: 22.00, stock: 17, image: '🏪', description: 'Итальянский аккаунт Wallapop', details: ['Гео: Италия', 'Активность: Высокая'], featured: false },
            { id: 18, category: 'Wallapop', name: 'Wallapop Франция #3', price: 28.00, stock: 12, image: '🏪', description: 'Французский аккаунт Wallapop', details: ['Гео: Франция', 'Верификация: Да'], featured: false },
            { id: 19, category: 'Wallapop', name: 'Wallapop Португалия #4', price: 20.00, stock: 15, image: '🏪', description: 'Португальский аккаунт', details: ['Гео: Португалия', 'Свежий'], featured: false },
            { id: 20, category: 'Wallapop', name: 'Wallapop PREMIUM #5', price: 35.00, stock: 19, image: '🏪', description: 'Премиум аккаунт Wallapop', details: ['Рейтинг: 4.9+', 'Продажи: 100+'], featured: true },
            { id: 21, category: 'Wallapop', name: 'Wallapop BUSINESS #6', price: 45.00, stock: 16, image: '🏪', description: 'Бизнес аккаунт Wallapop', details: ['Лотов: 80+', 'Статус: Pro'], featured: false },
            { id: 22, category: 'Wallapop', name: 'Wallapop FRESH #7', price: 15.00, stock: 20, image: '🏪', description: 'Свежий аккаунт Wallapop', details: ['Возраст: 1 неделя', 'Гарантия'], featured: false },
            { id: 23, category: 'Wallapop', name: 'Wallapop VERIFIED #8', price: 30.00, stock: 9, image: '🏪', description: 'Верифицированный аккаунт', details: ['Верификация: Да', 'Trust Score: 85%'], featured: false },
            { id: 24, category: 'Wallapop', name: 'Wallapop TOP SELLER #9', price: 50.00, stock: 15, image: '🏪', description: 'Аккаунт топ продавца', details: ['Продажи: 150+', 'Рейтинг: 5.0'], featured: true },
            { id: 25, category: 'Wallapop', name: 'Wallapop PRO #10', price: 40.00, stock: 15, image: '🏪', description: 'Профессиональный аккаунт', details: ['Опыт: 2+ года', 'Статус: Pro'], featured: false },
            { id: 26, category: 'Wallapop', name: 'Wallapop STANDARD #11', price: 18.00, stock: 18, image: '🏪', description: 'Стандартный аккаунт', details: ['Базовая версия', 'Гарантия'], featured: false },
            { id: 27, category: 'Wallapop', name: 'Wallapop ULTIMATE #12', price: 55.00, stock: 18, image: '🏪', description: 'Ультимативный аккаунт', details: ['Все функции', 'Максимум'], featured: false },
            { id: 28, category: 'Wallapop', name: 'Wallapop ECONOMY #13', price: 12.00, stock: 25, image: '🏪', description: 'Экономный аккаунт', details: ['Бюджетный вариант', 'Надежный'], featured: false },

            // Facebook Accounts (16)
            { id: 29, category: 'Facebook', name: 'Facebook USA #1', price: 3.00, stock: 20, image: '📘', description: 'Американский аккаунт Facebook', details: ['Гео: США', 'Друзья: 500+', 'Активный'], featured: true },
            { id: 30, category: 'Facebook', name: 'Facebook UK #2', price: 2.80, stock: 18, image: '📘', description: 'Британский аккаунт Facebook', details: ['Гео: Великобритания', 'Верификация: Да'], featured: false },
            { id: 31, category: 'Facebook', name: 'Facebook Германия #3', price: 2.50, stock: 15, image: '📘', description: 'Немецкий аккаунт Facebook', details: ['Гео: Германия', 'Статус: Active'], featured: false },
            { id: 32, category: 'Facebook', name: 'Facebook Франция #4', price: 2.30, stock: 22, image: '📘', description: 'Французский аккаунт Facebook', details: ['Гео: Франция', 'Друзья: 300+'], featured: false },
            { id: 33, category: 'Facebook', name: 'Facebook Канада #5', price: 2.70, stock: 16, image: '📘', description: 'Канадский аккаунт Facebook', details: ['Гео: Канада', 'Премиум'], featured: false },
            { id: 34, category: 'Facebook', name: 'Facebook Испания #6', price: 1.80, stock: 25, image: '📘', description: 'Испанский аккаунт Facebook', details: ['Гео: Испания', 'Свежий'], featured: false },
            { id: 35, category: 'Facebook', name: 'Facebook Италия #7', price: 1.90, stock: 23, image: '📘', description: 'Итальянский аккаунт Facebook', details: ['Гео: Италия', 'Активность: Средняя'], featured: false },
            { id: 36, category: 'Facebook', name: 'Facebook Бразилия #8', price: 1.50, stock: 30, image: '📘', description: 'Бразильский аккаунт Facebook', details: ['Гео: Бразилия', 'Бюджетный'], featured: false },
            { id: 37, category: 'Facebook', name: 'Facebook Мексика #9', price: 1.60, stock: 28, image: '📘', description: 'Мексиканский аккаунт Facebook', details: ['Гео: Мексика', 'Надежный'], featured: false },
            { id: 38, category: 'Facebook', name: 'Facebook Австралия #10', price: 2.90, stock: 12, image: '📘', description: 'Австралийский аккаунт Facebook', details: ['Гео: Австралия', 'Редкий регион'], featured: false },
            { id: 39, category: 'Facebook', name: 'Facebook Япония #11', price: 2.20, stock: 14, image: '📘', description: 'Японский аккаунт Facebook', details: ['Гео: Япония', 'Качественный'], featured: false },
            { id: 40, category: 'Facebook', name: 'Facebook Южная Корея #12', price: 2.10, stock: 13, image: '📘', description: 'Корейский аккаунт Facebook', details: ['Гео: Южная Корея', 'Премиум'], featured: false },
            { id: 41, category: 'Facebook', name: 'Facebook Индия #13', price: 0.70, stock: 50, image: '📘', description: 'Индийский аккаунт Facebook', details: ['Гео: Индия', 'Эконом вариант'], featured: false },
            { id: 42, category: 'Facebook', name: 'Facebook Турция #14', price: 1.20, stock: 35, image: '📘', description: 'Турецкий аккаунт Facebook', details: ['Гео: Турция', 'Бюджетный'], featured: false },
            { id: 43, category: 'Facebook', name: 'Facebook Польша #15', price: 1.80, stock: 26, image: '📘', description: 'Польский аккаунт Facebook', details: ['Гео: Польша', 'Стандарт'], featured: false },
            { id: 44, category: 'Facebook', name: 'Facebook BUSINESS #16', price: 5.00, stock: 14, image: '📘', description: 'Бизнес аккаунт Facebook', details: ['Бизнес страница', 'Реклама'], featured: true },

            // VKontakte Accounts (7)
            { id: 45, category: 'VKontakte', name: 'ВК PREMIUM #1', price: 10.00, stock: 15, image: '👥', description: 'Премиум аккаунт ВКонтакте', details: ['Премиум: Да', 'ID: Красивый', 'Гарантия'], featured: true },
            { id: 46, category: 'VKontakte', name: 'ВК BUSINESS #2', price: 8.00, stock: 12, image: '👥', description: 'Бизнес страница ВКонтакте', details: ['Тип: Бизнес', 'Аудитория: 1000+'], featured: false },
            { id: 47, category: 'VKontakte', name: 'ВК STANDARD #3', price: 3.00, stock: 25, image: '👥', description: 'Стандартный аккаунт ВКонтакте', details: ['Тип: Стандарт', 'Гарантия: 30 дней'], featured: false },
            { id: 48, category: 'VKontakte', name: 'ВК FRESH #4', price: 2.00, stock: 20, image: '👥', description: 'Свежий аккаунт ВКонтакте', details: ['Возраст: 1 день', 'Чистый'], featured: false },
            { id: 49, category: 'VKontakte', name: 'ВК VERIFIED #5', price: 9.00, stock: 13, image: '👥', description: 'Верифицированный аккаунт ВКонтакте', details: ['Верификация: Да', 'Значок: Да'], featured: false },
            { id: 50, category: 'VKontakte', name: 'ВК CREATOR #6', price: 7.00, stock: 12, image: '👥', description: 'Аккаунт создателя контента', details: ['Подписчики: 5000+', 'Активный'], featured: false },
            { id: 51, category: 'VKontakte', name: 'ВК GAMING #7', price: 5.00, stock: 18, image: '👥', description: 'Игровой аккаунт ВКонтакте', details: ['Тема: Игры', 'Друзья: 1000+'], featured: false },

            // Telegram Accounts (8)
            { id: 52, category: 'Telegram', name: 'НОВОРЕГ', price: 4.00, stock: 25, image: '📱', description: 'Новый аккаунт Telegram', details: ['Возраст: 1 день', 'Чистый', 'Гарантия'], featured: true },
            { id: 53, category: 'Telegram', name: 'ФИЗ СИМ US', price: 5.00, stock: 15, image: '📱', description: 'Аккаунт с US сим-картой', details: ['Симка: США', 'Верификация: Да'], featured: false },
            { id: 54, category: 'Telegram', name: 'ФИЗ СИМ EU', price: 5.50, stock: 12, image: '📱', description: 'Аккаунт с EU сим-картой', details: ['Симка: Европа', 'Надежный'], featured: false },
            { id: 55, category: 'Telegram', name: 'ВИРТ СИМ', price: 4.50, stock: 20, image: '📱', description: 'Аккаунт с виртуальной симкой', details: ['Тип: Виртуальная', 'Быстрая активация'], featured: false },
            { id: 56, category: 'Telegram', name: 'БИЗНЕС', price: 6.00, stock: 10, image: '📱', description: 'Бизнес аккаунт Telegram', details: ['Тип: Бизнес', 'Лимиты: Увеличенные'], featured: false },
            { id: 57, category: 'Telegram', name: 'ПРЕМИУМ', price: 7.00, stock: 15, image: '📱', description: 'Премиум аккаунт Telegram', details: ['Премиум: Да', 'Номер: Красивый'], featured: true },
            { id: 58, category: 'Telegram', name: 'ВЕРИФИЦИРОВАН', price: 6.50, stock: 12, image: '📱', description: 'Верифицированный аккаунт', details: ['Верификация: Да', 'Надежный'], featured: false },
            { id: 59, category: 'Telegram', name: 'ПРО АККАУНТ', price: 5.80, stock: 7, image: '📱', description: 'Профессиональный аккаунт', details: ['Тип: Pro', 'Расширенные функции'], featured: false },

            // Telegram Stars (4)
            { id: 60, category: 'Telegram Stars', name: 'Telegram Stars 100', price: 0.80, stock: 100, image: '⭐', description: '100 звезд для Telegram', details: ['Количество: 100 звезд', 'Мгновенная доставка'], featured: true },
            { id: 61, category: 'Telegram Stars', name: 'Telegram Stars 500', price: 4.50, stock: 50, image: '⭐', description: '500 звезд для Telegram', details: ['Количество: 500 звезд', 'Выгодно'], featured: false },
            { id: 62, category: 'Telegram Stars', name: 'Telegram Stars 1000', price: 11.00, stock: 30, image: '⭐', description: '1000 звезд для Telegram', details: ['Количество: 1000 звезд', 'Экономия'], featured: true },
            { id: 63, category: 'Telegram Stars', name: 'Telegram Stars 5000', price: 50.00, stock: 15, image: '⭐', description: '5000 звезд для Telegram', details: ['Количество: 5000 звезд', 'Максимальная выгода'], featured: false },

            // Telegram Premium (3)
            { id: 64, category: 'Telegram Premium', name: 'Telegram Premium 3 месяца', price: 9.00, stock: 30, image: '💎', description: 'Премиум подписка на 3 месяца', details: ['Срок: 3 месяца', 'Экономия 10%'], featured: true },
            { id: 65, category: 'Telegram Premium', name: 'Telegram Premium 6 месяцев', price: 15.00, stock: 25, image: '💎', description: 'Премиум подписка на 6 месяцев', details: ['Срок: 6 месяцев', 'Экономия 20%'], featured: false },
            { id: 66, category: 'Telegram Premium', name: 'Telegram Premium 1 год', price: 25.00, stock: 20, image: '💎', description: 'Годовая премиум подписка', details: ['Срок: 1 год', 'Экономия 30%'], featured: true },

            // Яндекс Сплит (10)
            { id: 67, category: 'Яндекс Сплит', name: 'Яндекс Сплит НОВОРЕГ', price: 15.00, stock: 25, image: '🟡', description: 'Свежий аккаунт Яндекс Сплит', details: ['Тип: Новый', 'Лимиты: Базовые', 'Верификация: Нет'], featured: true },
            { id: 68, category: 'Яндекс Сплит', name: 'Яндекс Сплит ВЕРИФИЦИРОВАН', price: 25.00, stock: 18, image: '🟡', description: 'Верифицированный Яндекс Сплит', details: ['Верификация: Да', 'Телефон: Привязан', 'Лимиты: Средние'], featured: false },
            { id: 69, category: 'Яндекс Сплит', name: 'Яндекс Сплит PRO', price: 40.00, stock: 12, image: '🟡', description: 'Профессиональный Яндекс Сплит', details: ['Статус: PRO', 'Лимиты: Высокие', 'История: Чистая'], featured: true },
            { id: 70, category: 'Яндекс Сплит', name: 'Яндекс Сплит БИЗНЕС', price: 60.00, stock: 16, image: '🟡', description: 'Бизнес аккаунт Яндекс Сплит', details: ['Тип: Бизнес', 'Лимиты: Максимальные', 'API: Доступно'], featured: false },
            { id: 71, category: 'Яндекс Сплит', name: 'Яндекс Сплит МАКСИМУМ', price: 80.00, stock: 18, image: '🟡', description: 'Яндекс Сплит с максимальными лимитами', details: ['Лимиты: MAX', 'Приоритет: Высокий', 'Поддержка: 24/7'], featured: true },
            { id: 72, category: 'Яндекс Сплит', name: 'Яндекс Сплит СТАНДАРТ', price: 20.00, stock: 20, image: '🟡', description: 'Стандартный аккаунт Яндекс Сплит', details: ['Баланс: Средний', 'Лимиты: Стандарт', 'Гарантия: 30 дней'], featured: false },
            { id: 73, category: 'Яндекс Сплит', name: 'Яндекс Сплит ПРЕМИУМ', price: 50.00, stock: 10, image: '🟡', description: 'Премиум Яндекс Сплит аккаунт', details: ['Статус: Премиум', 'Лимиты: Расширенные', 'Привилегии: Да'], featured: false },
            { id: 74, category: 'Яндекс Сплит', name: 'Яндекс Сплит ВИП', price: 70.00, stock: 17, image: '🟡', description: 'VIP аккаунт Яндекс Сплит', details: ['Уровень: VIP', 'Лимиты: Неограниченные', 'Персональный менеджер'], featured: false },
            { id: 75, category: 'Яндекс Сплит', name: 'Яндекс Сплит АВТО', price: 35.00, stock: 15, image: '🟡', description: 'Яндекс Сплит для автоматизации', details: ['Автоматизация: Да', 'API: Полный доступ', 'Скрипты: Поддержка'], featured: false },
            { id: 76, category: 'Яндекс Сплит', name: 'Яндекс Сплит УЛЬТИМАТ', price: 90.00, stock: 16, image: '🟡', description: 'Ультимативный Яндекс Сплит со всеми функциями', details: ['Все функции', 'Максимальные лимиты', 'Приоритетная поддержка'], featured: true },

            // Ozon Accounts (8)
            { id: 77, category: 'Ozon', name: 'Ozon НОВОРЕГ', price: 20.00, stock: 20, image: '📦', description: 'Свежий аккаунт Ozon', details: ['Тип: Новый', 'Лимиты: Базовые', 'Верификация: Нет'], featured: true },
            { id: 78, category: 'Ozon', name: 'Ozon ВЕРИФИЦИРОВАН', price: 35.00, stock: 15, image: '📦', description: 'Верифицированный Ozon', details: ['Верификация: Да', 'Документы: Подтверждены', 'Лимиты: Средние'], featured: false },
            { id: 79, category: 'Ozon', name: 'Ozon PRO', price: 50.00, stock: 10, image: '📦', description: 'Профессиональный Ozon', details: ['Статус: PRO', 'Лимиты: Высокие', 'API: Доступно'], featured: true },
            { id: 80, category: 'Ozon', name: 'Ozon БИЗНЕС', price: 70.00, stock: 13, image: '📦', description: 'Бизнес аккаунт Ozon', details: ['Тип: Бизнес', 'Лимиты: Максимальные', 'Оборот: 500K+'], featured: false },
            { id: 81, category: 'Ozon', name: 'Ozon МАКСИМУМ', price: 80.00, stock: 17, image: '📦', description: 'Ozon с максимальными лимитами', details: ['Лимиты: MAX', 'Приоритет: Высокий', 'Поддержка: 24/7'], featured: true },
            { id: 82, category: 'Ozon', name: 'Ozon СТАНДАРТ', price: 25.00, stock: 18, image: '📦', description: 'Стандартный аккаунт Ozon', details: ['Баланс: Средний', 'Лимиты: Стандарт', 'Гарантия: 30 дней'], featured: false },
            { id: 83, category: 'Ozon', name: 'Ozon ПРЕМИУМ', price: 60.00, stock: 13, image: '📦', description: 'Премиум Ozon аккаунт', details: ['Статус: Премиум', 'Лимиты: Расширенные', 'Привилегии: Да'], featured: false },
            { id: 84, category: 'Ozon', name: 'Ozon СЕЛЛЕР', price: 90.00, stock: 12, image: '📦', description: 'Аккаунт продавца Ozon со всеми функциями', details: ['Все функции', 'Максимальные лимиты', 'Приоритетная поддержка'], featured: true },

            // Wildberries Accounts (9)
            { id: 85, category: 'Wildberries', name: 'WB SELLER #1', price: 30.00, stock: 12, image: '🎯', description: 'Аккаунт продавца Wildberries', details: ['Продавец: Да', 'Товары: 100+', 'Рейтинг: 4.9+'], featured: true },
            { id: 86, category: 'Wildberries', name: 'WB BUSINESS #2', price: 45.00, stock: 17, image: '🎯', description: 'Бизнес аккаунт Wildberries', details: ['Бизнес: Да', 'Оборот: 2M+', 'VIP'], featured: false },
            { id: 87, category: 'Wildberries', name: 'WB FRESH #3', price: 12.00, stock: 18, image: '🎯', description: 'Свежий аккаунт Wildberries', details: ['Возраст: 3 дня', 'Гарантия'], featured: false },
            { id: 88, category: 'Wildberries', name: 'WB VERIFIED #4', price: 35.00, stock: 18, image: '🎯', description: 'Верифицированный аккаунт WB', details: ['Верификация: Да', 'Полный доступ'], featured: false },
            { id: 89, category: 'Wildberries', name: 'WB PREMIUM #5', price: 40.00, stock: 12, image: '🎯', description: 'Премиум аккаунт Wildberries', details: ['Премиум: Да', 'Персональный менеджер'], featured: true },
            { id: 90, category: 'Wildberries', name: 'WB STANDARD #6', price: 18.00, stock: 14, image: '🎯', description: 'Стандартный аккаунт Wildberries', details: ['Стандарт: Да', 'Базовая функциональность'], featured: false },
            { id: 91, category: 'Wildberries', name: 'WB EXPRESS #7', price: 25.00, stock: 11, image: '🎯', description: 'Аккаунт WB Express', details: ['Express: Да', 'Срочная доставка'], featured: false },
            { id: 92, category: 'Wildberries', name: 'WB PARTNER #8', price: 32.00, stock: 17, image: '🎯', description: 'Партнерский аккаунт WB', details: ['Партнер: Да', 'Эксклюзивные условия'], featured: false },
            { id: 93, category: 'Wildberries', name: 'WB GOLD #9', price: 38.00, stock: 18, image: '🎯', description: 'Золотой аккаунт Wildberries', details: ['Золотой: Да', 'Максимальные привилегии'], featured: false },

            // Госуслуги Accounts (6)
            { id: 94, category: 'Госуслуги', name: 'Госуслуги STANDARD #1', price: 20.00, stock: 10, image: '🏛️', description: 'Стандартный аккаунт Госуслуг', details: ['Уровень: Стандарт', 'Базовые услуги'], featured: true },
            { id: 95, category: 'Госуслуги', name: 'Госуслуги VERIFIED #2', price: 35.00, stock: 17, image: '🏛️', description: 'Верифицированный аккаунт Госуслуг', details: ['Верификация: Да', 'Полный доступ'], featured: false },
            { id: 96, category: 'Госуслуги', name: 'Госуслуги PREMIUM #3', price: 50.00, stock: 19, image: '🏛️', description: 'Премиум аккаунт Госуслуг', details: ['Премиум: Да', 'Приоритетное обслуживание'], featured: true },
            { id: 97, category: 'Госуслуги', name: 'Госуслуги BUSINESS #4', price: 60.00, stock: 16, image: '🏛️', description: 'Бизнес аккаунт Госуслуг', details: ['Бизнес: Да', 'Юридические лица'], featured: false },
            { id: 98, category: 'Госуслуги', name: 'Госуслуги FRESH #5', price: 25.00, stock: 12, image: '🏛️', description: 'Свежий аккаунт Госуслуг', details: ['Возраст: 1 день', 'Чистый'], featured: false },
            { id: 99, category: 'Госуслуги', name: 'Госуслуги PRO #6', price: 45.00, stock: 6, image: '🏛️', description: 'Профессиональный аккаунт Госуслуг', details: ['Про: Да', 'Расширенные функции'], featured: false }
        ];
        
        console.log('📦 Products loaded:', this.products.length);
    }

    renderCategories() {
        const carousel = document.getElementById('categoriesCarousel');
        if (!carousel) return;
        
        carousel.innerHTML = '';
        
        this.categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-icon">${category.icon}</div>
                <div class="category-name">${category.name}</div>
            `;
            card.addEventListener('click', () => this.showCategoryProducts(category));
            carousel.appendChild(card);
        });
        
        console.log('✅ Categories rendered');
    }

    renderFeaturedProducts() {
        const showcase = document.getElementById('featuredProducts');
        if (!showcase) return;
        
        showcase.innerHTML = '';
        
        const featuredProducts = this.products.filter(p => p.featured);
        
        featuredProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                ${product.stock < 10 ? '<div class="product-badge">🔥</div>' : ''}
                <div class="product-image">${product.image}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-stock">В наличии: ${product.stock}</div>
            `;
            card.addEventListener('click', () => this.showProductModal(product));
            showcase.appendChild(card);
        });
        
        console.log('✅ Featured products rendered:', featuredProducts.length);
    }

    showProductModal(product) {
        this.currentProduct = product;
        
        const modal = document.getElementById('productModal');
        const name = document.getElementById('modalProductName');
        const visual = document.getElementById('modalProductVisual');
        const price = document.getElementById('modalProductPrice');
        const stock = document.getElementById('modalProductStock');
        const description = document.getElementById('modalProductDescription');
        const detailsContainer = document.getElementById('modalProductDetails');
        
        if (name) name.textContent = product.name;
        if (visual) visual.textContent = product.image;
        if (price) price.textContent = `$${product.price.toFixed(2)}`;
        if (stock) {
            const count = stock.querySelector('.stock-count');
            if (count) count.textContent = product.stock;
        }
        if (description) description.textContent = product.description;
        
        if (detailsContainer && product.details) {
            detailsContainer.innerHTML = '';
            product.details.forEach(detail => {
                const tag = document.createElement('div');
                tag.className = 'detail-tag';
                tag.textContent = detail;
                detailsContainer.appendChild(tag);
            });
        }
        
        if (modal) modal.classList.add('active');
        
        console.log('📱 Product modal opened:', product.name);
    }

    setupEventListeners() {
        // Modal close buttons
        this.setupModalClosers();
        
        // Buy button
        const buyBtn = document.getElementById('buyProductBtn');
        if (buyBtn) {
            buyBtn.addEventListener('click', () => this.showPaymentModal());
        }
        
        // View all products
        const viewAllBtn = document.getElementById('viewAllProducts');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => this.showAllProducts());
        }
        
        // Payment methods
        this.setupPaymentMethods();
        
        // Crypto wallets
        this.setupCryptoWallets();
        
        // Navigation
        this.setupNavigation();
        
        console.log('✅ Event listeners setup complete');
    }

    setupModalClosers() {
        const closers = [
            { id: 'closeProductModal', modal: 'productModal' },
            { id: 'closePaymentModal', modal: 'paymentModal' },
            { id: 'closeInvoiceModal', modal: 'invoiceModal' }
        ];
        
        closers.forEach(({ id, modal }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', () => {
                    const modalElement = document.getElementById(modal);
                    if (modalElement) modalElement.classList.remove('active');
                });
            }
        });
    }

    setupPaymentMethods() {
        const methodOptions = document.querySelectorAll('.method-option');
        methodOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const method = e.currentTarget.dataset.method;
                this.handlePaymentMethod(method);
            });
        });
    }

    setupCryptoWallets() {
        const paymentCards = document.querySelectorAll('.payment-card');
        paymentCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const method = e.currentTarget.dataset.method;
                if (method === 'crypto-bot') {
                    this.createCryptoBotInvoice();
                } else {
                    this.showCryptoWallet(method);
                }
            });
        });
    }

    setupNavigation() {
        const navOptions = document.querySelectorAll('.nav-option');
        navOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.handleNavigation(page);
                
                // Update active state
                navOptions.forEach(nav => nav.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
    }

    showPaymentModal() {
        const modal = document.getElementById('paymentModal');
        const productName = document.getElementById('paymentProductName');
        const productPrice = document.getElementById('paymentProductPrice');
        const userBalance = document.getElementById('paymentUserBalance');
        
        if (productName) productName.textContent = this.currentProduct.name;
        if (productPrice) productPrice.textContent = `$${this.currentProduct.price.toFixed(2)}`;
        if (userBalance) userBalance.textContent = `$${this.userBalance.toFixed(2)}`;
        
        const productModal = document.getElementById('productModal');
        if (productModal) productModal.classList.remove('active');
        
        if (modal) modal.classList.add('active');
    }

    handlePaymentMethod(method) {
        switch(method) {
            case 'balance':
                this.payWithBalance();
                break;
            case 'crypto':
                this.showCryptoPayment();
                break;
            case 'crypto-bot':
                this.createCryptoBotInvoice();
                break;
        }
    }

    payWithBalance() {
        if (this.userBalance >= this.currentProduct.price) {
            this.userBalance -= this.currentProduct.price;
            this.renderUserInfo();
            
            this.tg.showPopup({
                title: '🎉 Успешная покупка!',
                message: `Товар "${this.currentProduct.name}" успешно приобретен!\n\nСумма: $${this.currentProduct.price.toFixed(2)}\nНовый баланс: $${this.userBalance.toFixed(2)}`,
                buttons: [{ type: 'ok' }]
            });
            
            const paymentModal = document.getElementById('paymentModal');
            if (paymentModal) paymentModal.classList.remove('active');
        } else {
            this.tg.showPopup({
                title: '❌ Недостаточно средств',
                message: `Для покупки нужно: $${this.currentProduct.price.toFixed(2)}\nВаш баланс: $${this.userBalance.toFixed(2)}\n\nПополните баланс для совершения покупки`,
                buttons: [{ type: 'ok' }]
            });
        }
    }

    showCryptoPayment() {
        this.tg.showPopup({
            title: '💎 Криптовалютный платеж',
            message: 'Выберите криптовалюту для оплаты:',
            buttons: [
                { type: 'default', text: '💎 TON' },
                { type: 'default', text: '💰 USDT' },
                { type: 'default', text: '₿ Bitcoin' },
                { type: 'cancel', text: 'Отмена' }
            ]
        });
    }

    async createCryptoBotInvoice() {
        try {
            const invoice = await window.cryptoPay.createInvoice(this.currentProduct.price, 'USD');
            
            if (invoice.success) {
                this.showCryptoBotInvoice(invoice);
            } else {
                throw new Error(invoice.error);
            }
        } catch (error) {
            this.tg.showPopup({
                title: '❌ Ошибка',
                message: 'Не удалось создать счет для оплаты. Попробуйте позже.',
                buttons: [{ type: 'ok' }]
            });
        }
    }

    showCryptoBotInvoice(invoice) {
        const modal = document.getElementById('invoiceModal');
        const amount = document.getElementById('invoiceAmount');
        const link = document.getElementById('invoiceLink');
        
        if (amount) amount.textContent = `$${invoice.amount}`;
        if (link) link.href = invoice.pay_url;
        
        const paymentModal = document.getElementById('paymentModal');
        if (paymentModal) paymentModal.classList.remove('active');
        
        if (modal) modal.classList.add('active');
        
        // Start checking payment status
        this.checkInvoiceStatus(invoice.invoice_id);
    }

    async checkInvoiceStatus(invoiceId) {
        const checkStatus = async () => {
            try {
                const status = await window.cryptoPay.checkPayment(invoiceId);
                
                const statusElement = document.getElementById('invoiceStatus');
                if (!statusElement) return;
                
                if (status === 'paid') {
                    statusElement.className = 'status-indicator success';
                    statusElement.innerHTML = '<div class="status-dot"></div><span class="status-text">✅ Оплата получена!</span>';
                    
                    // Update balance
                    this.userBalance += this.currentProduct.price;
                    this.renderUserInfo();
                    
                    setTimeout(() => {
                        const invoiceModal = document.getElementById('invoiceModal');
                        if (invoiceModal) invoiceModal.classList.remove('active');
                    }, 2000);
                } else if (status === 'expired') {
                    statusElement.className = 'status-indicator expired';
                    statusElement.innerHTML = '<div class="status-dot"></div><span class="status-text">❌ Время оплаты истекло</span>';
                } else {
                    // Continue checking
                    setTimeout(checkStatus, 3000);
                }
            } catch (error) {
                console.error('Error checking invoice status:', error);
                setTimeout(checkStatus, 5000);
            }
        };
        
        checkStatus();
    }

    showCryptoWallet(coin) {
        const wallet = this.cryptoWallets[coin.toUpperCase()];
        const coinNames = {
            'ton': 'TON (The Open Network)',
            'usdt': 'USDT TRC20 (Tron)',
            'btc': 'Bitcoin (BTC)',
            'ltc': 'Litecoin (LTC)',
            'sol': 'Solana (SOL)',
            'usdc': 'USDC (ERC20)'
        };
        
        const coinName = coinNames[coin] || coin.toUpperCase();
        
        this.tg.showPopup({
            title: `💎 Кошелек ${coinName}`,
            message: `Адрес для пополнения:\n\n<code>${wallet}</code>\n\nСкопируйте этот адрес для отправки средств.\n\nМинимальная сумма: $10`,
            buttons: [{ type: 'ok' }]
        });
    }

    showCategoryProducts(category) {
        const categoryProducts = this.products.filter(p => p.category === category.name);
        
        // Create category products view
        const mainContent = document.querySelector('.main-content-area');
        mainContent.innerHTML = `
            <div class="category-view">
                <div class="view-header">
                    <button class="back-button" id="backToHome">← Назад</button>
                    <h2>${category.name}</h2>
                    <p>${category.description}</p>
                </div>
                <div class="products-grid" id="categoryProductsGrid"></div>
            </div>
        `;
        
        const grid = document.getElementById('categoryProductsGrid');
        categoryProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                ${product.stock < 10 ? '<div class="product-badge">🔥</div>' : ''}
                <div class="product-image">${product.image}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-stock">В наличии: ${product.stock}</div>
            `;
            card.addEventListener('click', () => this.showProductModal(product));
            grid.appendChild(card);
        });
        
        document.getElementById('backToHome').addEventListener('click', () => {
            this.showHomeView();
        });
    }

    showAllProducts() {
        const mainContent = document.querySelector('.main-content-area');
        mainContent.innerHTML = `
            <div class="all-products-view">
                <div class="view-header">
                    <button class="back-button" id="backToHome">← Назад</button>
                    <h2>Все товары</h2>
                    <p>Всего товаров: ${this.products.length}</p>
                </div>
                <div class="products-grid comprehensive" id="allProductsGrid"></div>
            </div>
        `;
        
        const grid = document.getElementById('allProductsGrid');
        
        this.products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                ${product.stock < 10 ? '<div class="product-badge">🔥</div>' : ''}
                <div class="product-image">${product.image}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-stock">В наличии: ${product.stock}</div>
            `;
            card.addEventListener('click', () => this.showProductModal(product));
            grid.appendChild(card);
        });
        
        document.getElementById('backToHome').addEventListener('click', () => {
            this.showHomeView();
        });
    }

    showHomeView() {
        const mainContent = document.querySelector('.main-content-area');
        mainContent.innerHTML = `
            <!-- Luxury Hero Section -->
            <section class="luxury-hero-section">
                <div class="hero-backdrop">
                    <div class="particle-field">
                        <div class="particle p1"></div>
                        <div class="particle p2"></div>
                        <div class="particle p3"></div>
                        <div class="particle p4"></div>
                    </div>
                </div>
                <div class="hero-core">
                    <div class="prestige-badge">
                        <span class="badge-text">EXCLUSIVE</span>
                        <div class="badge-aura"></div>
                    </div>
                    <h2 class="hero-headline">Элитный Маркетплейс <span class="text-gradient">Премиум Аккаунтов</span></h2>
                    <p class="hero-tagline">Эксклюзивные аккаунты с гарантией качества и мгновенной доставкой 24/7</p>
                    <div class="prestige-stats">
                        <div class="stat-elite">
                            <div class="stat-ornament">💎</div>
                            <div class="stat-data">
                                <div class="stat-number">${this.products.length}+</div>
                                <div class="stat-desc">Элитных товаров</div>
                            </div>
                        </div>
                        <div class="stat-elite">
                            <div class="stat-ornament">⭐</div>
                            <div class="stat-data">
                                <div class="stat-number">4.9</div>
                                <div class="stat-desc">Рейтинг качества</div>
                            </div>
                        </div>
                        <div class="stat-elite">
                            <div class="stat-ornament">⚡</div>
                            <div class="stat-data">
                                <div class="stat-number">24/7</div>
                                <div class="stat-desc">Поддержка</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Categories Carousel -->
            <section class="categories-carousel">
                <div class="section-head">
                    <h3 class="section-title">Категории</h3>
                    <div class="title-decoration">
                        <div class="decoration-bar"></div>
                        <div class="decoration-dot"></div>
                    </div>
                </div>
                <div class="carousel-track" id="categoriesCarousel"></div>
            </section>

            <!-- Featured Products Showcase -->
            <section class="products-showcase">
                <div class="showcase-header">
                    <div class="title-group">
                        <h3 class="section-title">Избранные Товары</h3>
                        <div class="title-sparkle">✨</div>
                    </div>
                    <button class="browse-all" id="viewAllProducts">
                        <span>Все товары</span>
                        <div class="arrow-icon">→</div>
                    </button>
                </div>
                <div class="showcase-track" id="featuredProducts"></div>
            </section>

            <!-- Crypto Payment Gallery -->
            <section class="crypto-gallery">
                <div class="section-head">
                    <h3 class="section-title">Элитные Способы Оплаты</h3>
                    <div class="crypto-tag">CRYPTO</div>
                </div>
                <div class="payment-grid">
                    <div class="payment-card" data-method="ton">
                        <div class="card-glow"></div>
                        <div class="payment-icon">
                            <div class="icon-base"></div>
                            <span>💎</span>
                        </div>
                        <div class="payment-info">
                            <div class="payment-name">TON</div>
                            <div class="payment-desc">The Open Network</div>
                        </div>
                        <div class="payment-arrow">→</div>
                    </div>
                    <div class="payment-card" data-method="usdt">
                        <div class="card-glow"></div>
                        <div class="payment-icon">
                            <div class="icon-base"></div>
                            <span>💰</span>
                        </div>
                        <div class="payment-info">
                            <div class="payment-name">USDT</div>
                            <div class="payment-desc">TRC20 Network</div>
                        </div>
                        <div class="payment-arrow">→</div>
                    </div>
                    <div class="payment-card" data-method="btc">
                        <div class="card-glow"></div>
                        <div class="payment-icon">
                            <div class="icon-base"></div>
                            <span>₿</span>
                        </div>
                        <div class="payment-info">
                            <div class="payment-name">Bitcoin</div>
                            <div class="payment-desc">BTC Network</div>
                        </div>
                        <div class="payment-arrow">→</div>
                    </div>
                    <div class="payment-card" data-method="crypto-bot">
                        <div class="card-glow"></div>
                        <div class="payment-icon">
                            <div class="icon-base"></div>
                            <span>🤖</span>
                        </div>
                        <div class="payment-info">
                            <div class="payment-name">Crypto Bot</div>
                            <div class="payment-desc">Мгновенная оплата</div>
                        </div>
                        <div class="payment-arrow">→</div>
                    </div>
                </div>
            </section>
        `;
        
        this.renderCategories();
        this.renderFeaturedProducts();
        
        const viewAllBtn = document.getElementById('viewAllProducts');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => this.showAllProducts());
        }
        
        this.setupCryptoWallets();
    }

    handleNavigation(page) {
        switch(page) {
            case 'home':
                this.showHomeView();
                break;
            case 'shop':
                this.showAllProducts();
                break;
            case 'balance':
                this.showBalanceView();
                break;
            case 'profile':
                this.showProfileView();
                break;
        }
    }

    showBalanceView() {
        const mainContent = document.querySelector('.main-content-area');
        mainContent.innerHTML = `
            <div class="balance-view">
                <div class="balance-hero">
                    <h2>Ваш баланс</h2>
                    <div class="balance-amount">$${this.userBalance.toFixed(2)}</div>
                    <button class="elite-btn primary" id="depositBtn">Пополнить баланс</button>
                </div>
                <div class="transaction-history">
                    <h3>История операций</h3>
                    <div class="transactions">
                        <div class="transaction">
                            <div class="transaction-info">
                                <div class="transaction-type">Пополнение</div>
                                <div class="transaction-date">Сегодня, 14:30</div>
                            </div>
                            <div class="transaction-amount positive">+$50.00</div>
                        </div>
                        <div class="transaction">
                            <div class="transaction-info">
                                <div class="transaction-type">Покупка товара</div>
                                <div class="transaction-date">Вчера, 11:15</div>
                            </div>
                            <div class="transaction-amount negative">-$25.00</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const depositBtn = document.getElementById('depositBtn');
        if (depositBtn) {
            depositBtn.addEventListener('click', () => this.showDepositView());
        }
    }

    showDepositView() {
        const mainContent = document.querySelector('.main-content-area');
        mainContent.innerHTML = `
            <div class="deposit-view">
                <h2>Пополнение баланса</h2>
                <div class="deposit-methods">
                    <div class="deposit-method" data-method="crypto-bot">
                        <div class="method-icon">🤖</div>
                        <div class="method-info">
                            <div class="method-name">Crypto Bot</div>
                            <div class="method-description">Мгновенное пополнение</div>
                        </div>
                    </div>
                    <div class="deposit-method" data-method="ton">
                        <div class="method-icon">💎</div>
                        <div class="method-info">
                            <div class="method-name">TON</div>
                            <div class="method-description">The Open Network</div>
                        </div>
                    </div>
                    <div class="deposit-method" data-method="usdt">
                        <div class="method-icon">💰</div>
                        <div class="method-info">
                            <div class="method-name">USDT TRC20</div>
                            <div class="method-description">Tron Network</div>
                        </div>
                    </div>
                </div>
                <button class="back-button" id="backToBalance">← Назад</button>
            </div>
        `;
        
        const depositMethods = document.querySelectorAll('.deposit-method');
        depositMethods.forEach(method => {
            method.addEventListener('click', (e) => {
                const methodType = e.currentTarget.dataset.method;
                if (methodType === 'crypto-bot') {
                    this.showCryptoBotDeposit();
                } else {
                    this.showCryptoWallet(methodType);
                }
            });
        });
        
        const backBtn = document.getElementById('backToBalance');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.showBalanceView());
        }
    }

    showCryptoBotDeposit() {
        this.tg.showPopup({
            title: '🤖 Пополнение через Crypto Bot',
            message: 'Введите сумму для пополнения (от $10 до $1000):',
            buttons: [
                { type: 'default', text: '$10' },
                { type: 'default', text: '$50' },
                { type: 'default', text: '$100' },
                { type: 'cancel', text: 'Отмена' }
            ]
        });
    }

    showProfileView() {
        const mainContent = document.querySelector('.main-content-area');
        const userName = this.user ? `${this.user.first_name} ${this.user.last_name || ''}`.trim() : 'Пользователь';
        const userId = this.user ? this.user.id : 'Unknown';
        
        mainContent.innerHTML = `
            <div class="profile-view">
                <div class="profile-header">
                    <div class="profile-avatar">
                        ${this.user && this.user.photo_url ? 
                            `<img src="${this.user.photo_url}" alt="${userName}">` : 
                            `<div class="avatar-fallback">${userName.charAt(0).toUpperCase()}</div>`
                        }
                    </div>
                    <div class="profile-info">
                        <h2>${userName}</h2>
                        <p>ID: ${userId}</p>
                    </div>
                </div>
                <div class="profile-stats">
                    <div class="stat-card">
                        <div class="stat-value">${this.products.filter(p => p.featured).length}</div>
                        <div class="stat-label">Покупок</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">$${this.userBalance.toFixed(0)}</div>
                        <div class="stat-label">Баланс</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">7</div>
                        <div class="stat-label">Дней в боте</div>
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="profile-action">
                        <span class="action-icon">⭐</span>
                        <span class="action-text">Избранное</span>
                    </button>
                    <button class="profile-action">
                        <span class="action-icon">🛒</span>
                        <span class="action-text">Мои заказы</span>
                    </button>
                    <button class="profile-action">
                        <span class="action-icon">🔔</span>
                        <span class="action-text">Уведомления</span>
                    </button>
                    <button class="profile-action">
                        <span class="action-icon">🌐</span>
                        <span class="action-text">Язык</span>
                    </button>
                </div>
            </div>
        `;
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EliteStokeShop();
});

// Add some additional CSS for the new views
const additionalStyles = `
    .category-view, .all-products-view, .balance-view, .deposit-view, .profile-view {
        padding: 20px 0;
    }
    
    .view-header {
        margin-bottom: 24px;
    }
    
    .back-button {
        background: var(--bg-glass-heavy);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--text-primary);
        padding: 10px 20px;
        border-radius: var(--border-radius);
        cursor: pointer;
        margin-bottom: 16px;
        font-size: 14px;
        font-weight: 600;
        transition: var(--transition);
    }
    
    .back-button:hover {
        border-color: var(--accent-primary);
        transform: translateX(-4px);
    }
    
    .products-grid.comprehensive {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
    }
    
    .product-category {
        font-size: 13px;
        color: var(--text-secondary);
        margin-bottom: 8px;
        font-weight: 500;
    }
    
    .balance-hero {
        background: var(--bg-glass-heavy);
        border-radius: var(--border-radius);
        padding: 32px;
        text-align: center;
        margin-bottom: 24px;
    }
    
    .balance-hero .balance-amount {
        font-size: 48px;
        font-weight: 800;
        margin: 16px 0;
        background: var(--accent-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .transaction-history {
        background: var(--bg-glass-heavy);
        border-radius: var(--border-radius);
        padding: 24px;
    }
    
    .transaction {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .transaction:last-child {
        border-bottom: none;
    }
    
    .transaction-type {
        font-weight: 600;
        margin-bottom: 4px;
    }
    
    .transaction-date {
        font-size: 12px;
        color: var(--text-secondary);
    }
    
    .transaction-amount {
        font-weight: 700;
        font-size: 16px;
    }
    
    .transaction-amount.positive {
        color: var(--success);
    }
    
    .transaction-amount.negative {
        color: var(--danger);
    }
    
    .deposit-view {
        text-align: center;
    }
    
    .deposit-methods {
        margin: 32px 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    
    .deposit-method {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: var(--bg-glass-heavy);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: var(--transition);
    }
    
    .deposit-method:hover {
        border-color: var(--accent-primary);
        transform: translateX(8px);
    }
    
    .method-icon {
        font-size: 24px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
    }
    
    .method-info {
        flex: 1;
        text-align: left;
    }
    
    .method-name {
        font-weight: 600;
        margin-bottom: 4px;
    }
    
    .method-description {
        font-size: 14px;
        color: var(--text-secondary);
    }
    
    .profile-view {
        text-align: center;
    }
    
    .profile-header {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 32px;
    }
    
    .profile-avatar {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        overflow: hidden;
        border: 3px solid rgba(255, 255, 255, 0.2);
    }
    
    .profile-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .avatar-fallback {
        width: 100%;
        height: 100%;
        background: var(--accent-gradient);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        font-weight: 800;
        color: white;
    }
    
    .profile-info {
        flex: 1;
        text-align: left;
    }
    
    .profile-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-bottom: 32px;
    }
    
    .stat-card {
        background: var(--bg-glass-heavy);
        border-radius: var(--border-radius);
        padding: 20px;
        text-align: center;
    }
    
    .stat-value {
        font-size: 24px;
        font-weight: 800;
        margin-bottom: 4px;
    }
    
    .stat-label {
        font-size: 13px;
        color: var(--text-secondary);
    }
    
    .profile-actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .profile-action {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: var(--bg-glass-heavy);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: var(--transition);
        width: 100%;
        color: var(--text-primary);
        font-size: 16px;
    }
    
    .profile-action:hover {
        border-color: var(--accent-primary);
        transform: translateX(8px);
    }
    
    .action-icon {
        font-size: 20px;
        width: 24px;
    }
    
    .action-text {
        flex: 1;
        text-align: left;
    }
    
    .detail-tag {
        display: inline-block;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 8px 16px;
        margin: 4px 8px 4px 0;
        font-size: 13px;
        font-weight: 500;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
