// Дополнительные функции и утилиты

// Обновление таймера розыгрыша
function updateGiveawayTimer() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // +7 дней
    
    function update() {
        const now = new Date();
        const diff = endDate - now;
        
        if (diff <= 0) {
            document.getElementById('timerDays').textContent = '00';
            document.getElementById('timerHours').textContent = '00';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        document.getElementById('timerDays').textContent = days.toString().padStart(2, '0');
        document.getElementById('timerHours').textContent = hours.toString().padStart(2, '0');
    }
    
    update();
    setInterval(update, 1000 * 60); // Обновлять каждую минуту
}

// Поиск товаров
function initSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск товаров...';
    searchInput.className = 'search-input';
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterProducts(searchTerm);
    });
    
    // Добавляем поиск в хедер категорий
    const categoriesHeader = document.querySelector('#categoriesScreen .screen-header');
    if (categoriesHeader) {
        categoriesHeader.appendChild(searchInput);
    }
}

function filterProducts(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        const productDescription = card.querySelector('.product-description').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Анимации
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current.toLocaleString();
        
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Инициализация анимаций статистики
function initStatsAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValue = entry.target.querySelector('.stat-value');
                const currentValue = parseInt(statValue.textContent);
                
                if (!statValue.dataset.animated) {
                    animateValue(statValue, 0, currentValue, 2000);
                    statValue.dataset.animated = 'true';
                }
            }
        });
    });
    
    document.querySelectorAll('.stat-item').forEach(item => {
        observer.observe(item);
    });
}

// Обработка глубоких ссылок
function handleDeepLinks() {
    const urlParams = new URLSearchParams(window.location.search);
    const screen = urlParams.get('screen');
    const id = urlParams.get('id');
    
    if (screen && id) {
        switch(screen) {
            case 'product':
                showProduct(parseInt(id));
                break;
            case 'category':
                showCategoryProducts(parseInt(id));
                break;
            case 'deposit':
                showScreen('deposit');
                break;
        }
    }
}

// Инициализация дополнительных функций
document.addEventListener('DOMContentLoaded', function() {
    updateGiveawayTimer();
    initSearch();
    initStatsAnimation();
    handleDeepLinks();
});

// Обработчики ошибок
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('Произошла ошибка в приложении', 'error');
});

// Оффлайн режим
window.addEventListener('online', function() {
    showNotification('Соединение восстановлено', 'success');
    loadUserData();
});

window.addEventListener('offline', function() {
    showNotification('Отсутствует соединение с интернетом', 'error');
});
