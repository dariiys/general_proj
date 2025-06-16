const themeToggle = document.querySelector('.theme-toggle');
        const body = document.body;
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            document.getElementById('colorScheme').value = newTheme;
        });
        
        // Перевіряємо збережену тему при завантаженні сторінки
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', savedTheme);
        
        document.addEventListener('DOMContentLoaded', function() {
            const slider = document.getElementById('productsSlider');
            const prevBtn = document.querySelector('.prev');
            const nextBtn = document.querySelector('.next');
            const productCards = document.querySelectorAll('.product-card');
            const cardWidth = productCards[0].offsetWidth + 20;
            let currentIndex = 0;
            const visibleCards = 5;
            const totalCards = productCards.length;
            
            // Клонуємо картки для безперервного циклу
            const firstCards = Array.from(productCards).slice(0, visibleCards);
            firstCards.forEach(card => {
                const clone = card.cloneNode(true);
                slider.appendChild(clone);
            });

            // Оновлюємо позицію слайдера
            function updateSlider() {
                slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                
                // Оновлюємо активні картки
                productCards.forEach((card, index) => {
                    const isActive = index >= currentIndex && index < currentIndex + visibleCards;
                    card.classList.toggle('active', isActive);
                    card.style.opacity = isActive ? '1' : '0.7';
                    card.style.transform = isActive ? 'scale(1)' : 'scale(0.95)';
                });
                
                // Перевірка для циклічності
                if (currentIndex >= totalCards) {
                    setTimeout(() => {
                        slider.style.transition = 'none';
                        currentIndex = 0;
                        slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                        setTimeout(() => {
                            slider.style.transition = 'transform 0.5s ease';
                        }, 20);
                    }, 500);
                }
                
                if (currentIndex < 0) {
                    setTimeout(() => {
                        slider.style.transition = 'none';
                        currentIndex = totalCards - 1;
                        slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                        setTimeout(() => {
                            slider.style.transition = 'transform 0.5s ease';
                        }, 20);
                    }, 500);
                }
            }
            
            // Обробка кнопок
            nextBtn.addEventListener('click', function() {
                currentIndex++;
                updateSlider();
            });
            
            prevBtn.addEventListener('click', function() {
                currentIndex--;
                updateSlider();
            });
            
            // Автоматичне прокручування
            let autoSlide = setInterval(() => {
                currentIndex++;
                updateSlider();
            }, 3000);
            
            // Пауза при наведенні
            slider.addEventListener('mouseenter', () => {
                clearInterval(autoSlide);
            });
            
            slider.addEventListener('mouseleave', () => {
                autoSlide = setInterval(() => {
                    currentIndex++;
                    updateSlider();
                }, 3000);
            });
            
            // Адаптація при зміні розміру
            window.addEventListener('resize', function() {
                const newCardWidth = productCards[0].offsetWidth + 20;
                slider.style.transform = `translateX(-${currentIndex * newCardWidth}px)`;
            });
        });




// Оновлений код для панелі доступності
const accessibilityToggle = document.getElementById('accessibilityToggle');
const accessibilityPanel = document.getElementById('accessibilityPanel');
const fontSizeSelect = document.getElementById('fontSize');
const highlightLinksToggle = document.getElementById('highlightLinks');
const monochromeToggle = document.getElementById('monochrome');
const stopAnimationsToggle = document.getElementById('stopAnimations');
const resetBtn = document.getElementById('resetAccessibility');
const closeBtn = document.getElementById('closeAccessibility');
const videoBackground = document.querySelector('.video-background');
const productSlider = document.querySelector('.products-slider');

// Toggle panel visibility
accessibilityToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    accessibilityPanel.style.display = accessibilityPanel.style.display === 'block' ? 'none' : 'block';
});

// Close panel when clicking outside
document.addEventListener('click', (e) => {
    if (!accessibilityPanel.contains(e.target) && e.target !== accessibilityToggle) {
        accessibilityPanel.style.display = 'none';
    }
});

// Apply font size
fontSizeSelect.addEventListener('change', () => {
    document.body.classList.remove('font-large', 'font-xlarge', 'font-xxlarge');
    if (fontSizeSelect.value !== 'normal') {
        document.body.classList.add(`font-${fontSizeSelect.value}`);
    }
    saveSettings();
});

// Toggle link highlighting
highlightLinksToggle.addEventListener('change', () => {
    document.body.classList.toggle('highlight-links', highlightLinksToggle.checked);
    saveSettings();
});

// Toggle monochrome mode
monochromeToggle.addEventListener('change', () => {
    const elements = document.querySelectorAll('body > *:not(.accessibility-panel, .form-container)');
    elements.forEach(el => {
        el.classList.toggle('monochrome', monochromeToggle.checked);
    });
    saveSettings();
});
// Toggle animations
stopAnimationsToggle.addEventListener('change', () => {
    document.body.classList.toggle('no-animations', stopAnimationsToggle.checked);
    
    if (stopAnimationsToggle.checked) {
        videoBackground.pause();
        clearInterval(window.sliderInterval);
    } else {
        videoBackground.play();
        initSlider(); // Перезапускаємо слайдер
    }
    
    saveSettings();
});

// Reset all settings
resetBtn.addEventListener('click', () => {
    document.body.className = '';
    fontSizeSelect.value = 'normal';
    highlightLinksToggle.checked = false;
    monochromeToggle.checked = false;
    stopAnimationsToggle.checked = false;
    
    // Відновлюємо анімації
    videoBackground.play();
    initSlider();
    
    localStorage.removeItem('accessibilitySettings');
});

// Close panel
closeBtn.addEventListener('click', () => {
    accessibilityPanel.style.display = 'none';
});

// Save settings to localStorage
function saveSettings() {
    const settings = {
        fontSize: fontSizeSelect.value,
        highlightLinks: highlightLinksToggle.checked,
        monochrome: monochromeToggle.checked,
        stopAnimations: stopAnimationsToggle.checked
    };
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
}

// Load saved settings
function loadSettings() {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        fontSizeSelect.value = settings.fontSize;
        if (settings.fontSize !== 'normal') {
            document.body.classList.add(`font-${settings.fontSize}`);
        }
        
        highlightLinksToggle.checked = settings.highlightLinks;
        if (settings.highlightLinks) {
            document.body.classList.add('highlight-links');
        }
        
        monochromeToggle.checked = settings.monochrome;
        if (settings.monochrome) {
            document.body.classList.add('monochrome');
        }
        
        stopAnimationsToggle.checked = settings.stopAnimations;
        if (settings.stopAnimations) {
            document.body.classList.add('no-animations');
            videoBackground.pause();
            clearInterval(window.sliderInterval);
        }
    }
}

// Функція для ініціалізації слайдера (ваш існуючий код)
function initSlider() {
    // Ваш існуючий код ініціалізації слайдера
    // ...
    
    // Зберігаємо інтервал у глобальній змінній
    window.sliderInterval = setInterval(() => {
        currentIndex++;
        updateSlider();
    }, 3000);
}

// Load settings when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    initSlider();
});


const toggleDyslexicBtn = document.getElementById('toggleDyslexic');
let isDyslexicActive = false;

// Завантаження шрифту
function loadDyslexicFont() {
    const link = document.createElement('link');
    link.href = 'https://fonts.cdnfonts.com/css/open-dyslexic';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

// Обробник кліку
toggleDyslexicBtn.addEventListener('click', () => {
    isDyslexicActive = !isDyslexicActive;
    
    if (isDyslexicActive) {
        document.body.classList.add('dyslexic-mode');
        toggleDyslexicBtn.classList.add('dyslexic-active');
    } else {
        document.body.classList.remove('dyslexic-mode');
        toggleDyslexicBtn.classList.remove('dyslexic-active');
    }
    
    saveSettings();
});

// Додайте до функції saveSettings
function saveSettings() {
    const settings = {
        // ... ваші існуючі налаштування ...
        dyslexicMode: isDyslexicActive
    };
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
}

// Додайте до функції loadSettings
function loadSettings() {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        if (settings.dyslexicMode) {
            isDyslexicActive = true;
            document.body.classList.add('dyslexic-mode');
            toggleDyslexicBtn.classList.add('dyslexic-active');
        }
    }
}

// Додайте до DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadDyslexicFont();
    // ... ваш існуючий код ...
});