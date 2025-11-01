// Конфигурация
const CONFIG = {
    API_BASE_URL: 'https://SteveGolden.pythonanywhere.com/api', // Замените на ваш бэкенд
    BOT_TOKEN: '8198407414:AAGuficOzg5EZUeRsMWsz_u2RbsCRl8soX4'
};

// Глобальные переменные
let tg = null;
let currentUser = null;
let categories = [];
let products = [];
let currentCategoryId = null;

// Инициализация Telegram Web App
function initTelegramApp() {
    tg = window.Telegram.WebApp;
    
    // Расширяем на весь экран
    tg.expand();
    
    // Настраиваем основную кнопку
    tg.MainButton.setText("Открыть в боте");
    tg.MainButton.show();
    tg.MainButton.onClick(() => {
        tg.close();
    });
    
    // Получаем данные пользователя
    const initData = tg.initDataUnsafe;
    currentUser = initData.user;
    
    console.log('User initialized:', currentUser);
    
    // Загружаем данные пользователя
    loadUserData();
}

// Загрузка данных пользователя
async function loadUserData() {
    try {
        showLoading(true);
        
        // Загружаем баланс
        const balance = await apiCall('/user/balance');
        document.getElementById('userBalance').textContent = `$${balance.toFixed(2)}`;
        
        // Загружаем категории
        categories = await apiCall('/categories');
        renderCategories();
        
        // Загружаем статистику розыгрыша
        await loadGiveawayData();
        
        // Показываем главный экран
        showScreen('main');
        
    } catch (error) {
        showNotification('Ошибка загрузки данных', 'error');
        console.error('Load error:', error);
    } finally {
        showLoading(false);
    }
}

// API вызовы
async function apiCall(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'X-User-ID': currentUser?.id,
            'X-Telegram-Data': tg.initData
        }
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Управление экранами
function showScreen(screenName) {
    // Скрываем все экраны
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.add('hidden'));
    
    // Показываем нужный экран
    const targetScreen = document.getElementById(`${screenName}Screen`);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        targetScreen.classList.add('fade-in');
        
        // Загружаем данные для экрана если нужно
        switch(screenName) {
            case 'categories':
                loadCategories();
                break;
            case 'orders':
                loadOrders();
                break;
            case 'favorites':
                loadFavorites();
                break;
            case 'giveaway':
                loadGiveawayData();
                break;
        }
    }
}

// Загрузка и отображение категорий
async function loadCategories() {
    try {
        categories = await apiCall('/categories');
        renderCategories();
    } catch (error) {
        showNotification('Ошибка загрузки категорий', 'error');
    }
}

function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    
    if (!categories || categories.length === 0) {
        grid.innerHTML = '<div class="empty-state">Категории временно недоступны</div>';
        return;
    }
    
    grid.innerHTML = categories.map(category => `
        <div class="category-card" onclick="showCategoryProducts(${category.id})">
            <div class="category-icon">${category.emoji || '📁'}</div>
            <div class="category-name">${category.name_ru}</div>
            <div class="category-count">${category.product_count || '0'} товаров</div>
        </div>
    `).join('');
}

// Показать товары категории
async function showCategoryProducts(categoryId) {
    try {
        currentCategoryId = categoryId;
        const category = categories.find(c => c.id === categoryId);
        
        document.getElementById('productsCategoryTitle').textContent = category.name_ru;
        showScreen('products');
        
        products = await apiCall(`/categories/${categoryId}/products`);
        renderProducts();
        
    } catch (error) {
        showNotification('Ошибка загрузки товаров', 'error');
    }
}

function renderProducts() {
    const list = document.getElementById('productsList');
    
    if (!products || products.length === 0) {
        list.innerHTML = '<div class="empty-state">Товары временно отсутствуют</div>';
        return;
    }
    
    list.innerHTML = products.map(product => `
        <div class="product-card" onclick="showProduct(${product.id})">
            <div class="product-header">
                <div class="product-name">${product.name_ru}</div>
                <div class="product-price">$${product.price}</div>
            </div>
            <div class="product-stock">В наличии: ${product.stock} шт.</div>
            <div class="product-description">${product.description_ru}</div>
        </div>
    `).join('');
}

// Показать детали товара
async function showProduct(productId) {
    try {
        const product = await apiCall(`/products/${productId}`);
        renderProductDetails(product);
        showScreen('product');
    } catch (error) {
        showNotification('Ошибка загрузки товара', 'error');
    }
}

function renderProductDetails(product) {
    const container = document.getElementById('productDetails');
    
    container.innerHTML = `
        <div class="detail-item">
            <div class="detail-label">Название</div>
            <div class="detail-value">${product.name_ru}</div>
        </div>
        
        <div class="detail-item">
            <div class="detail-label">Описание</div>
            <div class="detail-value">${product.description_ru}</div>
        </div>
        
        <div class="detail-item">
            <div class="detail-label">Детали</div>
            <div class="detail-value">${product.details_ru}</div>
        </div>
        
        <div class="detail-item">
            <div class="detail-label">Цена</div>
            <div class="detail-value" style="color: var(--primary); font-size: 24px; font-weight: 700;">
                $${product.price}
            </div>
        </div>
        
        <div class="detail-item">
            <div class="detail-label">В наличии</div>
            <div class="detail-value">${product.stock} шт.</div>
        </div>
        
        <div class="product-actions">
            <button class="btn-primary" onclick="buyProduct(${product.id})">
                🛒 Купить за $${product.price}
            </button>
            <button class="btn-secondary" onclick="toggleFavorite(${product.id})">
                ⭐ В избранное
            </button>
        </div>
    `;
}

// Покупка товара
async function buyProduct(productId) {
    try {
        const result = await apiCall('/purchase', {
            method: 'POST',
            body: JSON.stringify({ product_id: productId })
        });
        
        if (result.success) {
            showNotification('Покупка успешно завершена!', 'success');
            // Обновляем баланс
            loadUserData();
            showScreen('main');
        } else {
            showNotification(result.message || 'Ошибка покупки', 'error');
        }
    } catch (error) {
        showNotification('Ошибка при покупке', 'error');
    }
}

// Избранное
async function toggleFavorite(productId) {
    try {
        await apiCall('/favorites/toggle', {
            method: 'POST',
            body: JSON.stringify({ product_id: productId })
        });
        
        showNotification('Избранное обновлено', 'success');
    } catch (error) {
        showNotification('Ошибка обновления избранного', 'error');
    }
}

// Крипто депозит
function showCryptoDeposit() {
    showScreen('cryptoDeposit');
}

async function createCryptoInvoice() {
    const amountInput = document.getElementById('depositAmount');
    const amount = parseFloat(amountInput.value);
    
    if (!amount || amount < 10 || amount > 1000) {
        showNotification('Введите сумму от $10 до $1000', 'error');
        return;
    }
    
    try {
        const result = await apiCall('/deposit/crypto', {
            method: 'POST',
            body: JSON.stringify({ amount: amount })
        });
        
        if (result.success) {
            // Открываем инвойс в Telegram
            tg.openInvoice(result.invoice_url);
        } else {
            showNotification('Ошибка создания счета', 'error');
        }
    } catch (error) {
        showNotification('Ошибка создания платежа', 'error');
    }
}

// Кошельки
function showWallet(network) {
    const wallets = {
        'TON': 'UQBvrPItSxKL-U2ikxdIYz3zWRCPlxMBaz3zVCHrLmD2OPOR',
        'USDT': 'TXdf14ohPHQsysio6VGQCdFyP9nVdYcbbt',
        'BTC': 'bc1q25ehtjq7k2crfvujr9dyhk640dj6tynlycjhvq',
        'LTC': 'ltc1qkg69x5vtd7rl2whu8ush45xch0q3vk3f34mvhv'
    };
    
    document.getElementById('walletTitle').textContent = `${network} Кошелек`;
    document.getElementById('walletAddress').textContent = wallets[network];
    document.getElementById('walletCurrency').textContent = network;
    
    showScreen('wallet');
}

function copyWalletAddress() {
    const address = document.getElementById('walletAddress').textContent;
    navigator.clipboard.writeText(address).then(() => {
        showNotification('Адрес скопирован!', 'success');
    });
}

// Розыгрыш
async function loadGiveawayData() {
    try {
        const data = await apiCall('/giveaway');
        
        document.getElementById('participantsCount').textContent = 
            data.participants_count.toLocaleString();
        document.getElementById('userDeposits').textContent = `$${data.user_deposits}`;
        
        // Прогресс бар
        const progress = Math.min((data.user_deposits / 30) * 100, 100);
        document.getElementById('depositProgress').style.width = `${progress}%`;
        
        // Кнопка участия
        const btn = document.getElementById('participateBtn');
        if (data.is_participating) {
            btn.textContent = '✅ Вы уже участвуете';
            btn.disabled = true;
        } else if (data.user_deposits >= 30) {
            btn.textContent = '🎁 Участвовать в розыгрыше';
            btn.disabled = false;
        } else {
            btn.textContent = `❌ Нужно пополнить еще $${30 - data.user_deposits}`;
            btn.disabled = true;
        }
        
    } catch (error) {
        console.error('Giveaway load error:', error);
    }
}

async function participateGiveaway() {
    try {
        const result = await apiCall('/giveaway/participate', {
            method: 'POST'
        });
        
        if (result.success) {
            showNotification('Вы успешно зарегистрированы в розыгрыше!', 'success');
            loadGiveawayData();
        } else {
            showNotification(result.message || 'Ошибка регистрации', 'error');
        }
    } catch (error) {
        showNotification('Ошибка участия в розыгрыше', 'error');
    }
}

// Загрузка заказов
async function loadOrders() {
    try {
        const orders = await apiCall('/orders');
        renderOrders(orders);
    } catch (error) {
        showNotification('Ошибка загрузки заказов', 'error');
    }
}

function renderOrders(orders) {
    const list = document.getElementById('ordersList');
    
    if (!orders || orders.length === 0) {
        list.innerHTML = '<div class="empty-state">У вас пока нет заказов</div>';
        return;
    }
    
    list.innerHTML = orders.map(order => `
        <div class="product-card">
            <div class="product-header">
                <div class="product-name">${order.product_name}</div>
                <div class="product-price">$${order.price}</div>
            </div>
            <div class="product-stock">Заказ #${order.id} • ${new Date(order.created_at).toLocaleDateString()}</div>
            <div class="product-description">Статус: ${order.status === 'completed' ? '✅ Завершен' : '🔄 В обработке'}</div>
        </div>
    `).join('');
}

// Загрузка избранного
async function loadFavorites() {
    try {
        const favorites = await apiCall('/favorites');
        renderFavorites(favorites);
    } catch (error) {
        showNotification('Ошибка загрузки избранного', 'error');
    }
}

function renderFavorites(favorites) {
    const list = document.getElementById('favoritesList');
    
    if (!favorites || favorites.length === 0) {
        list.innerHTML = '<div class="empty-state">У вас пока нет избранных товаров</div>';
        return;
    }
    
    list.innerHTML = favorites.map(product => `
        <div class="product-card" onclick="showProduct(${product.id})">
            <div class="product-header">
                <div class="product-name">${product.name_ru}</div>
                <div class="product-price">$${product.price}</div>
            </div>
            <div class="product-stock">В наличии: ${product.stock} шт.</div>
            <div class="product-description">${product.description_ru}</div>
        </div>
    `).join('');
}

// Утилиты
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initTelegramApp();
});
