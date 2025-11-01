// app.js - Основная логика мини-приложения Stoke Shop

// Конфигурация
const CONFIG = {
    BOT_TOKEN: "8198407414:AAGuficOzg5EZUeRsMWsz_u2RbsCRl8soX4",
    ADMIN_ID: 7303763255,
    CRYPTO_BOT_API_TOKEN: "477613:AAJXN238rLjxk7pP2L6DA7tNnnrYQ8V4BBE"
};

// Состояние приложения
let appState = {
    userBalance: 0,
    userDeposits: 0,
    currentSection: 'main',
    selectedPayment: null,
    categories: [],
    orders: [],
    favorites: []
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Stoke Shop Mini App запущен');
    initializeApp();
});

// Основные функции
function initializeApp() {
    // Загружаем начальные данные
    loadUserData();
    loadCategories();
    setupEventListeners();
    
    // Показываем главную страницу
    showSection('main');
    
    // Скрываем загрузку
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 1000);
}

function loadUserData() {
    // Здесь будет загрузка данных пользователя из бота
    // Пока используем мок данные
    appState.userBalance = 0;
    appState.userDeposits = 0;
    
    updateUI();
}

function loadCategories() {
    // Мок данные категорий
    appState.categories = [
        { id: 1, name: 'Telegram', icon: '📱', count: 8 },
        { id: 2, name: 'ВКонтакте', icon: '👥', count: 7 },
        { id: 3, name: 'Vinted', icon: '🛍️', count: 15 },
        { id: 4, name: 'Wallapop', icon: '🏪', count: 13 },
        { id: 5, name: 'Facebook', icon: '📘', count: 16 },
        { id: 6, name: 'Звезды Telegram', icon: '⭐', count: 4 },
        { id: 7, name: 'Telegram Premium', icon: '💎', count: 3 },
        { id: 8, name: 'Яндекс', icon: '🟡', count: 10 },
        { id: 9, name: 'Ozon', icon: '📦', count: 8 },
        { id: 10, name: 'Wildberries', icon: '🎯', count: 9 },
        { id: 11, name: 'Госуслуги', icon: '🏛️', count: 6 }
    ];
    
    renderCategories();
}

function setupEventListeners() {
    // Обработчики для инпутов
    const depositInput = document.getElementById('depositAmount');
    if (depositInput) {
        depositInput.addEventListener('input', function(e) {
            const value = parseFloat(e.target.value);
            if (value < 10) {
                e.target.style.borderColor = '#dc2626';
            } else if (value > 1000) {
                e.target.style.borderColor = '#dc2626';
            } else {
                e.target.style.borderColor = '#4f46e5';
            }
        });
    }
    
    // Поиск
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterCategories(e.target.value);
        });
    }
}

// Навигация
function showSection(sectionId) {
    // Скрываем все секции
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Показываем выбранную секцию
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        appState.currentSection = sectionId;
    }
    
    // Обновляем активную кнопку навигации
    updateNavigation(sectionId);
    
    // Загружаем данные для секции если нужно
    loadSectionData(sectionId);
}

function updateNavigation(activeSection) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Сопоставляем секции с навигацией
    const sectionMap = {
        'main': 0,
        'categories': 0,
        'deposit': 1,
        'orders': 2,
        'favorites': 3
    };
    
    const navIndex = sectionMap[activeSection];
    if (navIndex !== undefined) {
        navItems[navIndex].classList.add('active');
    }
}

function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'orders':
            loadOrders();
            break;
        case 'favorites':
            loadFavorites();
            break;
        case 'giveaway':
            updateGiveawayStatus();
            break;
    }
}

// Категории
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    
    grid.innerHTML = appState.categories.map(category => `
        <div class="category-card" onclick="selectCategory(${category.id})">
            <div class="category-icon">${category.icon}</div>
            <div class="category-name">${category.name}</div>
            <div class="category-count">${category.count} товаров</div>
        </div>
    `).join('');
}

function filterCategories(searchTerm) {
    const filtered = appState.categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const grid = document.getElementById('categoriesGrid');
    if (grid) {
        grid.innerHTML = filtered.map(category => `
            <div class="category-card" onclick="selectCategory(${category.id})">
                <div class="category-icon">${category.icon}</div>
                <div class="category-name">${category.name}</div>
                <div class="category-count">${category.count} товаров</div>
            </div>
        `).join('');
    }
}

function selectCategory(categoryId) {
    showNotification(`Выбрана категория: ${categoryId}`);
    // Здесь будет переход к товарам категории
}

// Баланс и платежи
function refreshBalance() {
    showNotification('Обновление баланса...');
    // Здесь будет запрос к боту для обновления баланса
    
    setTimeout(() => {
        appState.userBalance += Math.random() * 10;
        updateUI();
        showNotification('Баланс обновлен!', 'success');
    }, 1000);
}

function selectPayment(method) {
    appState.selectedPayment = method;
    
    switch(method) {
        case 'crypto_bot':
            showSection('crypto_bot');
            break;
        case 'ton':
            showSection('ton_wallet');
            loadWalletAddress('ton');
            break;
        case 'usdt':
            showSection('ton
