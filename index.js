const CLIENTS_DB = [
    {
        id: 1,
        fullName: "Иван Иванов",
        login: "ivan",
        password: "123",
        card: {
            number: "5282 3456 7890 1289",
            balance: "5,750,20",
            currency: "₽",
            expiryDate: "12/28"
        }
    },
    {
        id: 2,
        fullName: "Елена Петрова",
        login: "elena",
        password: "123",
        card: {
            number: "2222 4444 6666 7891",
            balance: "10,650,10",
            currency: "₽",
            expiryDate: "08/27"
        }
    },
    {
        id: 3,
        fullName: "Петр Морозов",
        login: "petr",
        password: "123",
        card: {
            number: "3579 1234 8520 2468",
            balance: "1,100,750,20",
            currency: "₽",
            expiryDate: "03/27"
        }
    }
];

window.currentUser = null;

window.login = function(loginValue, passwordValue, rememberMe = false) {
    console.log('Попытка входа:', loginValue, passwordValue); 
    const user = CLIENTS_DB.find(u => u.login === loginValue && u.password === passwordValue);   
    if (user) {
        console.log('Пользователь найден:', user.fullName);
        window.currentUser = user;
        localStorage.setItem('savedUser', JSON.stringify({
            id: user.id,
            fullName: user.fullName,
            login: user.login,
            card: user.card
        }));
        window.updateAuthUI();
        window.updateCardDisplay();
        return true;
    } else {
        console.log('Пользователь НЕ найден');
        return false;
    }
};

window.logout = function() {
    window.currentUser = null;
    localStorage.removeItem('savedUser');
    window.updateAuthUI();
    window.updateCardDisplay();
};

window.checkAuth = function() {
    const savedUser = localStorage.getItem('savedUser');
    if (savedUser) {
        try {
            const userData = JSON.parse(savedUser);
            const fullUser = CLIENTS_DB.find(u => u.id === userData.id);
            if (fullUser) {
                window.currentUser = fullUser;
                console.log('Восстановлен пользователь:', fullUser.fullName);
                window.updateCardDisplay();
                return fullUser;
            }
        } catch(e) {
            console.error('Ошибка загрузки:', e);
        }
    }
    return null;
};

window.updateCardDisplay = function() {
    const cardDetails = document.getElementById('cardDetails');
    const cardBalance = document.getElementById('cardBalance');
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    
    if (!cardDetails) return;
    
    if (window.currentUser && window.currentUser.card) {
        if (cardBalance) cardBalance.textContent = `${window.currentUser.card.balance.toLocaleString()} ${window.currentUser.card.currency}`;
        if (cardNumber) cardNumber.textContent = window.currentUser.card.number;
        if (cardExpiry) cardExpiry.textContent = window.currentUser.card.expiryDate;
        cardDetails.style.display = 'flex';
        console.log('Карта отображена');
    } else {
        cardDetails.style.display = 'none';
        console.log('Карта скрыта');
    }
};

window.updateAuthUI = function() {
    const userNameSpan = document.querySelector('.user-name');
    const authButton = document.querySelector('.auth-button');
    
    console.log('updateAuthUI вызван, currentUser:', window.currentUser); 
    
    if (userNameSpan && authButton) {
        if (window.currentUser) {
            userNameSpan.textContent = window.currentUser.fullName;
            userNameSpan.classList.add('authorized');
            authButton.textContent = 'Выйти';
            console.log('UI обновлен: показан пользователь', window.currentUser.fullName);
        } else {
            userNameSpan.textContent = 'Имя Фамилия';
            userNameSpan.classList.remove('authorized');
            authButton.textContent = 'Вход';
            console.log('UI обновлен: гость');
        }
    } else {
        console.log('Элементы .user-name или .auth-button не найдены');
    }
};

window.openLoginModal = function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
        
        const loginInput = document.getElementById('loginInput');
        const passwordInput = document.getElementById('passwordInput');
        
        if (loginInput) loginInput.value = '';
        if (passwordInput) passwordInput.value = '';
        
        console.log('Модальное окно открыто');
    } else {
        console.log('Модальное окно не найдено на странице');
    }
};

window.closeLoginModal = function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('show');
        console.log('Модальное окно закрыто');
    }
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация index.js');
    window.checkAuth();
    window.updateAuthUI();
    
    const authButton = document.querySelector('.auth-button');
    
    if (authButton) {
        console.log('Кнопка авторизации найдена');
        const newAuthButton = authButton.cloneNode(true);
        authButton.parentNode.replaceChild(newAuthButton, authButton);    
        newAuthButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по кнопке, currentUser:', window.currentUser);
            
            if (window.currentUser) {
                window.logout();
                alert('Вы вышли из аккаунта');
            } else {
                window.openLoginModal();
            }
        });
    } else {
        console.log('Кнопка .auth-button НЕ найдена на странице');
    }
    
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    
    if (loginModal && loginForm) {
        console.log('Модальное окно и форма найдены');
        const newLoginForm = loginForm.cloneNode(true);
        loginForm.parentNode.replaceChild(newLoginForm, loginForm);
        
        newLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Форма отправлена');            
            const loginInput = document.getElementById('loginInput');
            const passwordInput = document.getElementById('passwordInput');
            
            const loginValue = loginInput ? loginInput.value.trim() : '';
            const passwordValue = passwordInput ? passwordInput.value.trim() : '';
            
            console.log('Введенные данные:', loginValue, passwordValue);
            
            if (loginValue && passwordValue) {
                const success = window.login(loginValue, passwordValue, false);
                
                if (success) {
                    window.closeLoginModal();
                    alert(`Добро пожаловать, ${window.currentUser.fullName}!`);
                } else {
                    alert('Неверный логин или пароль');
                }
            } else {
                alert('Пожалуйста, заполните все поля');
            }
        });

        const closeModalBtn = document.querySelector('.close-modal');
        if (closeModalBtn) {
            const newCloseBtn = closeModalBtn.cloneNode(true);
            closeModalBtn.parentNode.replaceChild(newCloseBtn, closeModalBtn);
            
            newCloseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.closeLoginModal();
            });
        }
        
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                window.closeLoginModal();
            }
        });
    } else {
        console.log('Модальное окно или форма не найдены на странице');
    }
});