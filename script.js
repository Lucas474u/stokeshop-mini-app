class StokeShopApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.user = null;
        this.products = [];
        this.categories = [];
        this.currentProduct = null;
        this.userBalance = 150.00; // Simulated balance
        
        this.init();
    }

    async init() {
        // Initialize Telegram Web App
        this.tg.expand();
        this.tg.enableClosingConfirmation();
        this.tg.ready();

        // Get user data
        this.user = this.tg.initDataUnsafe?.user;
        
        // Load data
        await this.loadCategories();
        await this.loadProducts();
        
        // Render UI
        this.renderUserInfo();
        this.renderCategories();
        this.renderFeaturedProducts();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('Stoke Shop Mini App initialized');
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
    }

    async loadProducts() {
        this.products = [
            // Vinted Accounts (15)
            { id: 1, category: 'Vinted', name: 'Vinted BRUT Франция', price: 120.00, stock: 23, image: '🇫🇷', description: 'Премиум аккаунты Vinted Франция с гарантией 30 дней', details: 'Гео: Франция | Статус: Premium | Гарантия 30 дней', featured: true },
            { id: 2, category: 'Vinted', name: 'Vinted BRUT Испания', price: 115.00, stock: 16, image: '🇪🇸', description: 'Качественные аккаунты Vinted Испания', details: 'Гео: Испания | Верификация: Да | Возраст: 2 мес', featured: false },
            { id: 3, category: 'Vinted', name: 'Vinted BRUT Италия', price: 110.00, stock: 13, image: '🇮🇹', description: 'Итальянские аккаунты Vinted', details: 'Гео: Италия | Рейтинг: 4.8+ | Продажи: 50+', featured: false },
            { id: 4, category: 'Vinted', name: 'Vinted BRUT Германия', price: 125.00, stock: 12, image: '🇩🇪', description: 'Немецкие аккаунты Vinted', details: 'Гео: Германия | Активность: Высокая', featured: true },
            { id: 5, category: 'Vinted', name: 'Vinted BRUT Польша', price: 100.00, stock: 17, image: '🇵🇱', description: 'Польские аккаунты Vinted', details: 'Гео: Польша | Гарантия | Свежие', featured: false },
            { id: 6, category: 'Vinted', name: 'Vinted BRUT США', price: 140.00, stock: 21, image: '🇺🇸', description: 'Американские аккаунты Vinted', details: 'Гео: США | Рейтинг: 4.9+ | Премиум', featured: true },
            { id: 7, category: 'Vinted', name: 'Vinted BRUT Великобритания', price: 130.00, stock: 14, image: '🇬🇧', description: 'Британские аккаунты Vinted', details: 'Гео: Великобритания | Бизнес аккаунты', featured: false },
            { id: 8, category: 'Vinted', name: 'Vinted BRUT Канада', price: 135.00, stock: 19, image: '🇨🇦', description: 'Канадские аккаунты Vinted', details: 'Гео: Канада | Активные пользователи', featured: false },
            { id: 9, category: 'Vinted', name: 'Vinted BRUT Нидерланды', price: 105.00, stock: 18, image: '🇳🇱', description: 'Голландские аккаунты Vinted', details: 'Гео: Нидерланды | Гарантия 30 дней', featured: false },
            { id: 10, category: 'Vinted', name: 'Vinted BRUT Бельгия', price: 95.00, stock: 14, image: '🇧🇪', description: 'Бельгийские аккаунты Vinted', details: 'Гео: Бельгия | Свежие аккаунты', featured: false },
            { id: 11, category: 'Vinted', name: 'Vinted BRUT Португалия', price: 90.00, stock: 16, image: '🇵🇹', description: 'Португальские аккаунты Vinted', details: 'Гео: Португалия | Высокий рейтинг', featured: false },
            { id: 12, category: 'Vinted', name: 'Vinted BRUT Швеция', price: 145.00, stock: 11, image: '🇸🇪', description: 'Шведские аккаунты Vinted', details: 'Гео: Швеция | Премиум качество', featured: false },
            { id: 13, category: 'Vinted', name: 'Vinted BRUT Норвегия', price: 150.00, stock: 14, image: '🇳🇴', description: 'Норвежские аккаунты Vinted', details: 'Гео: Норвегия | Редкий регион', featured: false },
            { id: 14, category: 'Vinted', name: 'Vinted BRUT Дания', price: 135.00, stock: 12, image: '🇩🇰', description: 'Датские аккаунты Vinted', details: 'Гео: Дания | Бизнес аккаунты', featured: false },
            { id: 15, category: 'Vinted', name: 'Vinted BRUT Финляндия', price: 140.00, stock: 15, image: '🇫🇮', description: 'Финские аккаунты Vinted', details: 'Гео: Финляндия | Премиум статус', featured: false },

            // Wallapop Accounts (13)
            { id: 16, category: 'Wallapop', name: 'Wallapop Испания #1', price: 25.00, stock: 10, image: '🏪', description: 'Качественный испанский аккаунт', details: 'Гео: Испания | Рейтинг: 4.7+ | Отзывы: 50+', featured: true },
            { id: 17, category: 'Wallapop', name: 'Wallapop Италия #2', price: 22.00, stock: 17, image: '🏪', description: 'Итальянский аккаунт Wallapop', details: 'Гео: Италия | Активность: Высокая', featured: false },
            { id: 18, category: 'Wallapop', name: 'Wallapop Франция #3', price: 28.00, stock: 12, image: '🏪', description: 'Французский аккаунт Wallapop', details: 'Гео: Франция | Верификация: Да', featured: false },
            { id: 19, category: 'Wallapop', name: 'Wallapop Португалия #4', price: 20.00, stock: 15, image: '🏪', description: 'Португальский аккаунт', details: 'Гео: Португалия | Свежий', featured: false },
            { id: 20, category: 'Wallapop', name: 'Wallapop PREMIUM #5', price: 35.00, stock: 19, image: '🏪', description: 'Премиум аккаунт Wallapop', details: 'Рейтинг: 4.9+ | Продажи: 100+', featured: true },
            { id: 21, category: 'Wallapop', name: 'Wallapop BUSINESS #6', price: 45.00, stock: 16, image: '🏪', description: 'Бизнес аккаунт Wallapop', details: 'Лотов: 80+ | Статус: Pro', featured: false },
            { id: 22, category: 'Wallapop', name: 'Wallapop FRESH #7', price: 15.00, stock: 20, image: '🏪', description: 'Свежий аккаунт Wallapop', details: 'Возраст: 1 неделя | Гарантия', featured: false },
            { id: 23, category: 'Wallapop', name: 'Wallapop VERIFIED #8', price: 30.00, stock: 9, image: '🏪', description: 'Верифицированный аккаунт', details: 'Верификация: Да | Trust Score: 85%', featured: false },
            { id: 24, category: 'Wallapop', name: 'Wallapop TOP SELLER #9', price: 50.00, stock: 15, image: '🏪', description: 'Аккаунт топ продавца', details: 'Продажи: 150+ | Рейтинг: 5.0', featured: true },
            { id: 25, category: 'Wallapop', name: 'Wallapop PRO #10', price: 40.00, stock: 15, image: '🏪', description: 'Профессиональный аккаунт', details: 'Опыт: 2+ года | Статус: Pro', featured: false },
            { id: 26, category: 'Wallapop', name: 'Wallapop STANDARD #11', price: 18.00, stock: 18, image: '🏪', description: 'Стандартный аккаунт', details: 'Базовая версия | Гарантия', featured: false },
            { id: 27, category: 'Wallapop', name: 'Wallapop ULTIMATE #12', price: 55.00, stock: 18, image: '🏪', description: 'Ультимативный аккаунт', details: 'Все функции | Максимум', featured: false },
            { id: 28, category: 'Wallapop', name: 'Wallapop ECONOMY #13', price: 12.00, stock: 25, image: '🏪', description: 'Экономный аккаунт', details: 'Бюджетный вариант | Надежный', featured: false },

            // Facebook Accounts (16)
            { id: 29, category: 'Facebook', name: 'Facebook USA #1', price: 3.00, stock: 20, image: '📘', description: 'Американский аккаунт Facebook', details: 'Гео: США | Друзья: 500+ | Активный', featured: true },
            { id: 30, category: 'Facebook', name: 'Facebook UK #2', price: 2.80, stock: 18, image: '📘', description: 'Британский аккаунт Facebook', details: 'Гео: Великобритания | Верификация: Да', featured: false },
            { id: 31, category: 'Facebook', name: 'Facebook Германия #3', price: 2.50, stock: 15, image: '📘', description: 'Немецкий аккаунт Facebook', details: 'Гео: Германия | Статус: Active', featured: false },
            { id: 32, category: 'Facebook', name: 'Facebook Франция #4', price: 2.30, stock: 22, image: '📘', description: 'Французский аккаунт Facebook', details: 'Гео: Франция | Друзья: 300+', featured: false },
            { id: 33, category: 'Facebook', name: 'Facebook Канада #5', price: 2.70, stock: 16, image: '📘', description: 'Канадский аккаунт Facebook', details: 'Гео: Канада | Премиум', featured: false },
            { id: 34, category: 'Facebook', name: 'Facebook Испания #6', price: 1.80, stock: 25, image: '📘', description: 'Испанский аккаунт Facebook', details: 'Гео: Испания | Свежий', featured: false },
            { id: 35, category: 'Facebook', name: 'Facebook Италия #7', price: 1.90, stock: 23, image: '📘', description: 'Итальянский аккаунт Facebook', details: 'Гео: Италия | Активность: Средняя', featured: false },
            { id: 36, category: 'Facebook', name: 'Facebook Бразилия #8', price: 1.50, stock: 30, image: '📘', description: 'Бразильский аккаунт Facebook', details: 'Гео: Бразилия | Бюджетный', featured: false },
            { id: 37, category: 'Facebook', name: 'Facebook Мексика #9', price: 1.60, stock: 28, image: '📘', description: 'Мексиканский аккаунт Facebook', details: 'Гео: Мексика | Надежный', featured: false },
            { id: 38, category: 'Facebook', name: 'Facebook Австралия #10', price: 2.90, stock: 12, image: '📘', description: 'Австралийский аккаунт Facebook', details: 'Гео: Австралия | Редкий регион', featured: false },
            { id: 39, category: 'Facebook', name: 'Facebook Япония #11', price: 2.20, stock: 14, image: '📘', description: 'Японский аккаунт Facebook', details: 'Гео: Япония | Качественный', featured: false },
            { id: 40, category: 'Facebook', name: 'Facebook Южная Корея #12', price: 2.10, stock: 13, image: '📘', description: 'Корейский аккаунт Facebook', details: 'Гео: Южная Корея | Премиум', featured: false },
            { id: 41, category: 'Facebook', name: 'Facebook Индия #13', price: 0.70, stock: 50, image: '📘', description: 'Индийский аккаунт Facebook', details: 'Гео: Индия | Эконом вариант', featured: false },
            { id: 42, category: 'Facebook', name: 'Facebook Турция #14', price: 1.20, stock: 35, image: '📘', description: 'Турецкий аккаунт Facebook', details: 'Гео: Турция | Бюджетный', featured: false },
            { id: 43, category: 'Facebook', name: 'Facebook Польша #15', price: 1.80, stock: 26, image: '📘', description: 'Польский аккаунт Facebook', details: 'Гео: Польша | Стандарт', featured: false },
            { id: 44, category: 'Facebook', name: 'Facebook BUSINESS #16', price: 5.00, stock: 14, image: '📘', description: 'Бизнес аккаунт Facebook', details: 'Бизнес страница | Реклама', featured: true },

            // VKontakte Accounts (7)
            { id: 45, category: 'VKontakte', name: 'ВК PREMIUM #1', price: 10.00, stock: 15, image: '👥', description: 'Премиум аккаунт ВКонтакте', details: 'Премиум: Да | ID: Красивый | Гарантия', featured: true },
            { id: 46, category: 'VKontakte', name: 'ВК BUSINESS #2', price: 8.00, stock: 12, image: '👥', description: 'Бизнес страница ВКонтакте', details: 'Тип: Бизнес | Аудитория: 1000+', featured: false },
            { id: 47, category: 'VKontakte', name: 'ВК STANDARD #3', price: 3.00, stock: 25, image: '👥', description: 'Стандартный аккаунт ВКонтакте', details: 'Тип: Стандарт | Гарантия: 30 дней', featured: false },
            { id: 48, category: 'VKontakte', name: 'ВК FRESH #4', price: 2.00, stock: 20, image: '👥', description: 'Свежий аккаунт ВКонтакте', details: 'Возраст: 1 день | Чистый', featured: false },
            { id: 49, category: 'VKontakte', name: 'ВК VERIFIED #5', price: 9.00, stock: 13, image: '👥', description: 'Верифицированный аккаунт ВКонтакте', details: 'Верификация: Да | Значок: Да', featured: false },
            { id: 50, category: 'VKontakte', name: 'ВК CREATOR #6', price: 7.00, stock: 12, image: '👥', description: 'Аккаунт создателя контента', details: 'Подписчики: 5000+ | Активный', featured: false },
            { id: 51, category: 'VKontakte', name: 'ВК GAMING #7', price: 5.00, stock: 18, image: '👥', description: 'Игровой аккаунт ВКонтакте', details: 'Тема: Игры | Друзья: 1000+', featured: false },

            // Telegram Accounts (8)
            { id: 52, category: 'Telegram', name: 'НОВОРЕГ', price: 4.00, stock: 25, image: '📱', description: 'Новый аккаунт Telegram', details: 'Возраст: 1 день | Чистый | Гарантия', featured: true },
            { id: 53, category: 'Telegram', name: 'ФИЗ СИМ US', price: 5.00, stock: 15, image: '📱', description: 'Аккаунт с US сим-картой', details: 'Симка: США | Верификация: Да', featured: false },
            { id: 54, category: 'Telegram', name: 'ФИЗ СИМ EU', price: 5.50, stock: 12, image: '📱', description: 'Аккаунт с EU сим-картой', details: 'Симка: Европа | Надежный', featured: false },
            { id: 55, category: 'Telegram', name: 'ВИРТ СИМ', price: 4.50, stock: 20, image: '📱', description: 'Аккаунт с виртуальной симкой', details: 'Тип: Виртуальная | Быстрая активация', featured: false },
            { id: 56, category: 'Telegram', name: 'БИЗНЕС', price: 6.00, stock: 10, image: '📱', description: 'Бизнес аккаунт Telegram', details: 'Тип: Бизнес | Лимиты: Увеличенные', featured: false },
            { id: 57, category: 'Telegram', name: 'ПРЕМИУМ', price: 7.00, stock: 15, image: '📱', description: 'Премиум аккаунт Telegram', details: 'Премиум: Да | Номер: Красивый', featured: true },
            { id: 58, category: 'Telegram', name: 'ВЕРИФИЦИРОВАН', price: 6.50, stock: 12, image: '📱', description: 'Верифицированный аккаунт', details: 'Верификация: Да | Надежный', featured: false },
            { id: 59, category: 'Telegram', name: 'ПРО АККАУНТ', price: 5.80, stock: 7, image: '📱', description: 'Профессиональный аккаунт', details: 'Тип: Pro | Расширенные функции', featured: false },

            // Telegram Stars (4)
            { id: 60, category: 'Telegram Stars', name: 'Telegram Stars 100', price: 0.80, stock: 100, image: '⭐', description: '100 звезд для Telegram', details: 'Количество: 100 звезд | Мгновенная доставка', featured: true },
            { id: 61, category: 'Telegram Stars', name: 'Telegram Stars 500', price: 4.50, stock: 50, image: '⭐', description: '500 звезд для Telegram', details: 'Количество: 500 звезд | Выгодно', featured: false },
            { id: 62, category: 'Telegram Stars', name: 'Telegram Stars 1000', price: 11.00, stock: 30, image: '⭐', description: '1000 звезд для Telegram', details: 'Количество: 1000 звезд | Экономия', featured: true },
            { id: 63, category: 'Telegram Stars', name: 'Telegram Stars 5000', price: 50.00, stock: 15, image: '⭐', description: '5000 звезд для Telegram', details: 'Количество: 5000 звезд | Максимальная выгода', featured: false },

            // Telegram Premium (3)
            { id: 64, category: 'Telegram Premium', name: 'Telegram Premium 3 месяца', price: 9.00, stock: 30, image: '💎', description: 'Премиум подписка на 3 месяца', details: 'Срок: 3 месяца | Экономия 10%', featured: true },
            { id: 65, category: 'Telegram Premium', name: 'Telegram Premium 6 месяцев', price: 15.00, stock: 25, image: '💎', description: 'Премиум подписка на 6 месяцев', details: 'Срок: 6 месяцев | Экономия 20%', featured: false },
            { id: 66, category: 'Telegram Premium', name: 'Telegram Premium 1 год', price: 25.00, stock: 20, image: '💎', description: 'Годовая премиум подписка', details: 'Срок: 1 год | Экономия 30%', featured: true },

            // Яндекс Сплит (10)
            { id: 67, category: 'Яндекс Сплит', name: 'Яндекс Сплит НОВОРЕГ', price: 15.00, stock: 25, image: '🟡', description: 'Свежий аккаунт Яндекс Сплит', details: 'Тип: Новый | Лимиты: Базовые | Верификация: Нет', featured: true },
            { id: 68, category: 'Яндекс Сплит', name: 'Яндекс Сплит ВЕРИФИЦИРОВАН', price: 25.00, stock: 18, image: '🟡', description: 'Верифицированный Яндекс Сплит', details: 'Верификация: Да | Телефон: Привязан | Лимиты: Средние', featured: false },
            { id: 69, category: 'Яндекс Сплит', name: 'Яндекс Сплит PRO', price: 40.00, stock: 12, image: '🟡', description: 'Профессиональный Яндекс Сплит', details: 'Статус: PRO | Лимиты: Высокие | История: Чистая', featured: true },
            { id: 70, category: 'Яндекс Сплит', name: 'Яндекс Сплит БИЗНЕС', price: 60.00, stock: 16, image: '🟡', description: 'Бизнес аккаунт Яндекс Сплит', details: 'Тип: Бизнес | Лимиты: Максимальные | API: Доступно', featured: false },
            { id: 71, category: 'Яндекс Сплит', name: 'Яндекс Сплит МАКСИМУМ', price: 80.00, stock: 18, image: '🟡', description: 'Яндекс Сплит с максимальными лимитами', details: 'Лимиты: MAX | Приоритет: Высокий | Поддержка: 24/7', featured: true },
            { id: 72, category: 'Яндекс Сплит', name: 'Яндекс Сплит СТАНДАРТ', price: 20.00, stock: 20, image: '🟡', description: 'Стандартный аккаунт Яндекс Сплит', details: 'Баланс: Средний | Лимиты: Стандарт | Гарантия: 30 дней', featured: false },
            { id: 73, category: 'Яндекс Сплит', name: 'Яндекс Сплит ПРЕМИУМ', price: 50.00, stock: 10, image: '🟡', description: 'Премиум Яндекс Сплит аккаунт', details: 'Статус: Премиум | Лимиты: Расширенные | Привилегии: Да', featured: false },
            { id: 74, category: 'Яндекс Сплит', name: 'Яндекс Сплит ВИП', price: 70.00, stock: 17, image: '🟡', description: 'VIP аккаунт Яндекс Сплит', details: 'Уровень: VIP | Лимиты: Неограниченные | Персональный менеджер', featured: false },
            { id: 75, category: 'Яндекс Сплит', name: 'Яндекс Сплит АВТО', price: 35.00, stock: 15, image: '🟡', description: 'Яндекс Сплит для автоматизации', details: 'Автоматизация: Да | API: Полный доступ | Скрипты: Поддержка', featured: false },
            { id: 76, category: 'Яндекс Сплит', name: 'Яндекс Сплит УЛЬТИМАТ', price: 90.00, stock: 16, image: '🟡', description: 'Ультимативный Яндекс Сплит со всеми функциями', details: 'Все функции | Максимальные лимиты | Приоритетная поддержка', featured: true },

            // Ozon Accounts (8)
            { id: 77, category: 'Ozon', name: 'Ozon НОВОРЕГ', price: 20.00, stock: 20, image: '📦', description: 'Свежий аккаунт Ozon', details: 'Тип: Новый | Лимиты: Базовые | Верификация: Нет', featured: true },
            { id: 78, category: 'Ozon', name: 'Ozon ВЕРИФИЦИРОВАН', price: 35.00, stock: 15, image: '📦', description: 'Верифицированный Ozon', details: 'Верификация: Да | Документы: Подтверждены | Лимиты: Средние', featured: false },
            { id: 79, category: 'Ozon', name: 'Ozon PRO', price: 50.00, stock: 10, image: '📦', description: 'Профессиональный Ozon', details: 'Статус: PRO | Лимиты: Высокие | API: Доступно', featured: true },
            { id: 80, category: 'Ozon', name: 'Ozon БИЗНЕС', price: 70.00, stock: 13, image: '📦', description: 'Бизнес аккаунт Ozon', details: 'Тип: Бизнес | Лимиты: Максимальные | Оборот: 500K+', featured: false },
            { id: 81, category: 'Ozon', name: 'Ozon МАКСИМУМ', price: 80.00, stock: 17, image: '📦', description: 'Ozon с максимальными лимитами', details: 'Лимиты: MAX | Приоритет: Высокий | Поддержка: 24/7', featured: true },
            { id: 82, category: 'Ozon', name: 'Ozon СТАНДАРТ', price: 25.00, stock: 18, image: '📦', description: 'Стандартный аккаунт Ozon', details: 'Баланс: Средний | Лимиты: Стандарт | Гарантия: 30 дней', featured: false },
            { id: 83, category: 'Ozon', name: 'Ozon ПРЕМИУМ', price: 60.00, stock: 13, image: '📦', description: 'Премиум Ozon аккаунт', details: 'Статус: Премиум | Лимиты: Расширенные | Привилегии: Да', featured: false },
            { id: 84, category: 'Ozon', name: 'Ozon СЕЛЛЕР', price: 90.00, stock: 12, image: '📦', description: 'Аккаунт продавца Ozon со всеми функциями', details: 'Все функции | Максимальные лимиты | Приоритетная поддержка', featured: true },

            // Wildberries Accounts (9)
            { id: 85, category: 'Wildberries', name: 'WB SELLER #1', price: 30.00, stock: 12, image: '🎯', description: 'Аккаунт продавца Wildberries', details: 'Продавец: Да | Товары: 100+ | Рейтинг: 4.9+', featured: true },
            { id: 86, category: 'Wildberries', name: 'WB BUSINESS #2', price: 45.00, stock: 17, image: '🎯', description: 'Бизнес аккаунт Wildberries', details: 'Бизнес: Да | Оборот: 2M+ | VIP', featured: false },
            { id: 87, category: 'Wildberries', name: 'WB FRESH #3', price: 12.00, stock: 18, image: '🎯', description: 'Свежий аккаунт Wildberries', details: 'Возраст: 3 дня | Гарантия', featured: false },
            { id: 88, category: 'Wildberries', name: 'WB VERIFIED #4', price: 35.00, stock: 18, image: '🎯', description: 'Верифицированный аккаунт WB', details: 'Верификация: Да | Полный доступ', featured: false },
            { id: 89, category: 'Wildberries', name: 'WB PREMIUM #5', price: 40.00, stock: 12, image: '🎯', description: 'Премиум аккаунт Wildberries', details: 'Премиум: Да | Персональный менеджер', featured: true },
            { id: 90, category: 'Wildberries', name: 'WB STANDARD #6', price: 18.00, stock: 14, image: '🎯', description: 'Стандартный аккаунт Wildberries', details: 'Стандарт: Да | Базовая функциональность', featured: false },
            { id: 91, category: 'Wildberries', name: 'WB EXPRESS #7', price: 25.00, stock: 11, image: '🎯', description: 'Аккаунт WB Express', details: 'Express: Да | Срочная доставка', featured: false },
            { id: 92, category: 'Wildberries', name: 'WB PARTNER #8', price: 32.00, stock: 17, image: '🎯', description: 'Партнерский аккаунт WB', details: 'Партнер: Да | Эксклюзивные условия', featured: false },
            { id: 93, category: 'Wildberries', name: 'WB GOLD #9', price: 38.00, stock: 18, image: '🎯', description: 'Золотой аккаунт Wildberries', details: 'Золотой: Да | Максимальные привилегии', featured: false },

            // Госуслуги Accounts (6)
            { id: 94, category: 'Госуслуги', name: 'Госуслуги STANDARD #1', price: 20.00, stock: 10, image: '🏛️', description: 'Стандартный аккаунт Госуслуг', details: 'Уровень: Стандарт | Базовые услуги', featured: true },
            { id: 95, category: 'Госуслуги', name: 'Госуслуги VERIFIED #2', price: 35.00, stock: 17, image: '🏛️', description: 'Верифицированный аккаунт Госуслуг', details: 'Верификация: Да | Полный доступ', featured: false },
            { id: 96, category: 'Госуслуги', name: 'Госуслуги PREMIUM #3', price: 50.00, stock: 19, image: '🏛️', description: 'Премиум аккаунт Госуслуг', details: 'Премиум: Да | Приоритетное обслуживание', featured: true },
            { id: 97, category: 'Госуслуги', name: 'Госуслуги BUSINESS #4', price: 60.00, stock: 16, image: '🏛️', description: 'Бизнес аккаунт Госуслуг', details: 'Бизнес: Да | Юридические лица', featured: false },
            { id: 98, category: 'Госуслуги', name: 'Госуслуги FRESH #5', price: 25.00, stock: 12, image: '🏛️', description: 'Свежий аккаунт Госуслуг', details: 'Возраст: 1 день | Чистый', featured: false },
            { id: 99, category: 'Госуслуги', name: 'Госуслуги PRO #6', price: 45.00, stock: 6, image: '🏛️', description: 'Профессиональный аккаунт Госуслуг', details: 'Про: Да | Расширенные функции', featured: false }
        ];
    }

    renderUserInfo() {
        const balanceElement = document.getElementById('userBalance');
        const avatarElement = document.getElementById('userAvatar');
        
        if (this.user) {
            const firstName = this.user.first_name || 'User';
            balanceElement.textContent = `$${this.userBalance.toFixed(2)}`;
            avatarElement.textContent = firstName.charAt(0).toUpperCase();
        }
    }

    renderCategories() {
        const grid = document.getElementById('categoriesGrid');
        grid.innerHTML = '';
        
        this.categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-icon">${category.icon}</div>
                <div class="category-name">${category.name}</div>
            `;
            card.addEventListener('click', () => this.showCategoryProducts(category));
            grid.appendChild(card);
        });
    }

    renderFeaturedProducts() {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = '';
        
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
            grid.appendChild(card);
        });
    }

    showCategoryProducts(category) {
        const categoryProducts = this.products.filter(p => p.category === category.name);
        
        // Create category products view
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="category-header">
                <button class="back-button" id="backToHome">← Назад</button>
                <h2>${category.name}</h2>
                <p>${category.description}</p>
            </div>
            <div class="products-grid" id="categoryProductsGrid"></div>
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

    showHomeView() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="hero-content">
                    <h2>Premium Accounts Marketplace</h2>
                    <p>Качественные аккаунты с гарантией и мгновенной доставкой</p>
                    <div class="hero-stats">
                        <div class="stat">
                            <span class="stat-number">${this.products.length}+</span>
                            <span class="stat-label">Товаров</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">4.9★</span>
                            <span class="stat-label">Рейтинг</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">24/7</span>
                            <span class="stat-label">Поддержка</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Categories Grid -->
            <section class="categories-section">
                <h3 class="section-title">Категории</h3>
                <div class="categories-grid" id="categoriesGrid"></div>
            </section>

            <!-- Featured Products -->
            <section class="products-section">
                <div class="section-header">
                    <h3 class="section-title">Популярные товары</h3>
                    <button class="view-all" id="viewAll">Все товары</button>
                </div>
                <div class="products-grid" id="productsGrid"></div>
            </section>

            <!-- Crypto Payment Methods -->
            <section class="payment-section">
                <h3 class="section-title">Способы оплаты</h3>
                <div class="crypto-grid">
                    <div class="crypto-item" data-coin="ton">
                        <div class="crypto-icon">💎</div>
                        <span>TON</span>
                    </div>
                    <div class="crypto-item" data-coin="usdt">
                        <div class="crypto-icon">💰</div>
                        <span>USDT</span>
                    </div>
                    <div class="crypto-item" data-coin="btc">
                        <div class="crypto-icon">₿</div>
                        <span>Bitcoin</span>
                    </div>
                    <div class="crypto-item" data-coin="eth">
                        <div class="crypto-icon">◇</div>
                        <span>Ethereum</span>
                    </div>
                    <div class="crypto-item" data-coin="crypto-bot">
                        <div class="crypto-icon">🤖</div>
                        <span>Crypto Bot</span>
                    </div>
                </div>
            </section>
        `;
        
        this.renderCategories();
        this.renderFeaturedProducts();
        
        document.getElementById('viewAll').addEventListener('click', () => {
            this.showAllProducts();
        });
    }

    showAllProducts() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="category-header">
                <button class="back-button" id="backToHome">← Назад</button>
                <h2>Все товары</h2>
                <p>Всего товаров: ${this.products.length}</p>
            </div>
            <div class="products-grid" id="allProductsGrid"></div>
        `;
        
        const grid = document.getElementById('allProductsGrid');
        grid.className = 'products-grid all-products';
        
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

    showProductModal(product) {
        this.currentProduct = product;
        
        const modal = document.getElementById('productModal');
        const name = document.getElementById('modalProductName');
        const image = document.getElementById('modalProductImage');
        const price = document.getElementById('modalProductPrice');
        const stock = document.getElementById('modalProductStock');
        const description = document.getElementById('modalProductDescription');
        const details = document.getElementById('modalProductDetails');
        
        name.textContent = product.name;
        image.src = product.image;
        image.alt = product.name;
        price.textContent = `$${product.price.toFixed(2)}`;
        stock.textContent = `В наличии: ${product.stock} шт.`;
        description.textContent = product.description;
        details.textContent = product.details;
        
        modal.classList.add('active');
    }

    setupEventListeners() {
        // Modal close buttons
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('productModal').classList.remove('active');
        });

        document.getElementById('closePaymentModal').addEventListener('click', () => {
            document.getElementById('paymentModal').classList.remove('active');
        });

        document.getElementById('closeInvoiceModal').addEventListener('click', () => {
            document.getElementById('invoiceModal').classList.remove('active');
        });

        // Buy button
        document.getElementById('buyProduct').addEventListener('click', () => {
            this.showPaymentModal();
        });

        // Payment method selection
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const method = e.currentTarget.dataset.method;
                this.handlePaymentMethod(method);
            });
        });

        // Crypto items
        document.querySelectorAll('.crypto-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const coin = e.currentTarget.dataset.coin;
                this.showCryptoWallet(coin);
            });
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.handleNavigation(page);
                
                // Update active state
                document.querySelectorAll('.nav-item').forEach(nav => {
                    nav.classList.remove('active');
                });
                e.currentTarget.classList.add('active');
            });
        });

        // View all button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'viewAll') {
                this.showAllProducts();
            }
        });
    }

    showPaymentModal() {
        const modal = document.getElementById('paymentModal');
        const productName = document.getElementById('paymentProductName');
        const productPrice = document.getElementById('paymentProductPrice');
        const userBalance = document.getElementById('paymentUserBalance');
        
        productName.textContent = this.currentProduct.name;
        productPrice.textContent = `$${this.currentProduct.price.toFixed(2)}`;
        userBalance.textContent = `$${this.userBalance.toFixed(2)}`;
        
        document.getElementById('productModal').classList.remove('active');
        modal.classList.add('active');
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
            
            // Show success message
            this.tg.showPopup({
                title: 'Успешная покупка!',
                message: `Товар "${this.currentProduct.name}" успешно приобретен!`,
                buttons: [{ type: 'ok' }]
            });
            
            document.getElementById('paymentModal').classList.remove('active');
        } else {
            this.tg.showPopup({
                title: 'Недостаточно средств',
                message: 'Пополните баланс для совершения покупки',
                buttons: [{ type: 'ok' }]
            });
        }
    }

    showCryptoPayment() {
        this.tg.showPopup({
            title: 'Криптовалютный платеж',
            message: 'Выберите криптовалюту для оплаты',
            buttons: [
                { type: 'default', text: 'TON' },
                { type: 'default', text: 'USDT' },
                { type: 'default', text: 'BTC' },
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
                title: 'Ошибка',
                message: 'Не удалось создать счет для оплаты',
                buttons: [{ type: 'ok' }]
            });
        }
    }

    showCryptoBotInvoice(invoice) {
        const modal = document.getElementById('invoiceModal');
        const amount = document.getElementById('invoiceAmount');
        const link = document.getElementById('invoiceLink');
        
        amount.textContent = `$${invoice.amount}`;
        link.href = invoice.pay_url;
        
        document.getElementById('paymentModal').classList.remove('active');
        modal.classList.add('active');
        
        // Start checking payment status
        this.checkInvoiceStatus(invoice.invoice_id);
    }

    async checkInvoiceStatus(invoiceId) {
        const checkStatus = async () => {
            try {
                const status = await window.cryptoPay.checkPayment(invoiceId);
                
                if (status === 'paid') {
                    document.getElementById('invoiceStatus').className = 'status success';
                    document.getElementById('invoiceStatus').textContent = '✅ Оплата получена!';
                    
                    // Update balance
                    this.userBalance += this.currentProduct.price;
                    this.renderUserInfo();
                    
                    setTimeout(() => {
                        document.getElementById('invoiceModal').classList.remove('active');
                    }, 2000);
                } else if (status === 'expired') {
                    document.getElementById('invoiceStatus').className = 'status expired';
                    document.getElementById('invoiceStatus').textContent = '❌ Время оплаты истекло';
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
        const wallets = {
            'ton': 'UQBvrPItSxKL-U2ikxdIYz3zWRCPlxMBaz3zVCHrLmD2OPOR',
            'usdt': 'TXdf14ohPHQsysio6VGQCdFyP9nVdYcbbt',
            'btc': 'bc1q25ehtjq7k2crfvujr9dyhk640dj6tynlycjhvq',
            'eth': '0x291754537797Ac70C0159ABF1701E773502f8CcB'
        };
        
        const wallet = wallets[coin];
        const coinNames = {
            'ton': 'TON',
            'usdt': 'USDT TRC20',
            'btc': 'Bitcoin',
            'eth': 'Ethereum'
        };
        
        this.tg.showPopup({
            title: `Кошелек ${coinNames[coin]}`,
            message: `Адрес для пополнения:\n\n<code>${wallet}</code>\n\nСкопируйте этот адрес для отправки средств.`,
            buttons: [{ type: 'ok' }]
        });
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
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="balance-view">
                <div class="balance-card">
                    <h2>Ваш баланс</h2>
                    <div class="balance-amount">$${this.userBalance.toFixed(2)}</div>
                    <button class="btn-primary" id="depositButton">Пополнить баланс</button>
                </div>
                <div class="transaction-history">
                    <h3>История операций</h3>
                    <div class="transactions-list">
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
        
        document.getElementById('depositButton').addEventListener('click', () => {
            this.showDepositView();
        });
    }

    showDepositView() {
        const mainContent = document.querySelector('.main-content');
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
        
        document.querySelectorAll('.deposit-method').forEach(method => {
            method.addEventListener('click', (e) => {
                const methodType = e.currentTarget.dataset.method;
                if (methodType === 'crypto-bot') {
                    this.showCryptoBotDeposit();
                } else {
                    this.showCryptoWallet(methodType);
                }
            });
        });
        
        document.getElementById('backToBalance').addEventListener('click', () => {
            this.showBalanceView();
        });
    }

    showCryptoBotDeposit() {
        this.tg.showPopup({
            title: 'Пополнение через Crypto Bot',
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
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="profile-view">
                <div class="profile-header">
                    <div class="profile-avatar">${this.user ? this.user.first_name.charAt(0).toUpperCase() : 'U'}</div>
                    <div class="profile-info">
                        <h2>${this.user ? this.user.first_name : 'User'}</h2>
                        <p>ID: ${this.user ? this.user.id : 'Unknown'}</p>
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
    new StokeShopApp();
});
