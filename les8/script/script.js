let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

function saveCartData() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartIconNumber(); // Оновити цифру на іконці кошика
}

function updateCartIconNumber() {
    let badges = document.querySelectorAll('.cart-badge');
    
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
        total = total + cartItems[i].quantity;
    }
    
    badges.forEach(function(badge) {
        if (total > 0) {
            badge.innerText = total;
            badge.classList.remove('hidden');
            badge.style.display = 'flex'; 
        } else {
            badge.innerText = '0';
            badge.classList.add('hidden');
            badge.style.display = 'none'; 
        }
    });
}

let allBuyButtons = document.querySelectorAll('.product-card button');

allBuyButtons.forEach(function(button) {
    button.onclick = function() {
        let card = button.closest('.product-card');
        let title = card.querySelector('.product-title').innerText;
        let type = card.querySelector('.product-type').innerText;
        let img = card.querySelector('.product-card-img').getAttribute('src');
        let priceStr = card.querySelector('.product-price').innerText;

        let price = parseInt(priceStr.replace(/\D/g, ''));

        let found = false;
        for (let j = 0; j < cartItems.length; j++) {
            if (cartItems[j].name === title) {
                cartItems[j].quantity = cartItems[j].quantity + 1;
                found = true;
                break;
            }
        }

        if (found === false) {
            let newProduct = {
                name: title,
                type: type,
                image: img,
                price: price,
                quantity: 1
            };
            cartItems.push(newProduct);
        }

        saveCartData();
        showNotification(title);
    };
});

function deleteItem(name) {
    let newCart = [];
    for (let k = 0; k < cartItems.length; k++) {
        if (cartItems[k].name !== name) {
            newCart.push(cartItems[k]);
        }
    }
    cartItems = newCart;
    saveCartData();
    drawCart();
}

function clearAll() {
    cartItems = [];
    saveCartData();
    drawCart();
}

function showNotification(name) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    let popup = document.createElement('div');
    popup.className = 'toast-popup';
    popup.innerHTML = '<b>✓</b> ' + name + ' додано до кошика!';

    container.appendChild(popup);

    setTimeout(function() {
        popup.classList.add('show');
    }, 100);

    // Через 2.5 секунди видаляємо
    setTimeout(function() {
        popup.classList.remove('show');
        setTimeout(function() {
            popup.remove();
        }, 500);
    }, 2500);
}

function drawCart() {
    let list = document.querySelector('.cart-items-list');
    let summary = document.querySelector('.cart-summary-card');

    if (!list || !summary) {
        return;
    }

    if (cartItems.length === 0) {
        let titleH1 = document.querySelector('h1');
        if (titleH1) titleH1.style.display = 'none';
        
        list.innerHTML = `
            <div class="empty-cart-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="empty-cart-icon"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <h2 class="empty-cart-title">Ваш кошик порожній</h2>
                <p class="empty-cart-text">Додайте товари до кошика, щоб продовжити покупки</p>
                <button class="btn btn-primary" onclick="window.location.href='catalog.html'">Перейти до каталогу</button>
            </div>
        `;
        summary.style.display = 'none';
        let grid = document.querySelector('.cart-page-grid');
        if (grid) grid.classList.add('empty');
        return;
    }

    let titleH1_v2 = document.querySelector('h1');
    if (titleH1_v2) titleH1_v2.style.display = 'block';
    summary.style.display = 'block';
    let grid_v2 = document.querySelector('.cart-page-grid');
    if (grid_v2) grid_v2.classList.remove('empty');

    list.innerHTML = '';
    let totalSum = 0;
    let totalItems = 0;

    for (let m = 0; m < cartItems.length; m++) {
        let item = cartItems[m];
        let priceForOne = item.price * item.quantity;
        totalSum = totalSum + priceForOne;
        totalItems = totalItems + item.quantity;

        let html = `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-category">${item.type}</p>
                <div class="quantity-manager">
                    <button class="quantity-btn" onclick="changeCount('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeCount('${item.name}', 1)">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="remove-btn" onclick="deleteItem('${item.name}')">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="delete-icon"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>                </button>
                <p class="cart-item-price">${priceForOne} ₴</p>
            </div>
        </div>
        `;
        list.innerHTML = list.innerHTML + html;
    }

    summary.innerHTML = `
        <div class="cart-summary-content">
            <h3 class="summary-title">Підсумок замовлення</h3>
            <div class="summary-row">
                <span>Товари (${totalItems})</span>
                <span>${totalSum} ₴</span>
            </div>
            <div class="summary-row">
                <span>Доставка</span>
                <span class="free-text">Безкоштовно</span>
            </div>
            <div class="divider"></div>
            <div class="summary-total-row">
                <span>Разом</span>
                <span>${totalSum} ₴</span>
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-bottom: 12px;">Оформити замовлення</button>
            <button class="btn btn-outline-dark" style="width: 100%;" onclick="window.location.href='catalog.html'">Продовжити покупки</button>
        </div>
    `;
}

function changeCount(name, plusMinus) {
    for (let n = 0; n < cartItems.length; n++) {
        if (cartItems[n].name === name) {
            cartItems[n].quantity = cartItems[n].quantity + plusMinus;
            
            if (cartItems[n].quantity <= 0) {
                deleteItem(name);
            } else {
                saveCartData();
                drawCart();
            }
            break;
        }
    }
}

let filterButtons = document.querySelectorAll('.filters-list button');

function runFilter(category) {
    let lowerCategory = category.trim().toLowerCase();
    let productCards = document.querySelectorAll('.product-card');

    for (let x = 0; x < filterButtons.length; x++) {
        if (filterButtons[x].innerText.trim().toLowerCase() === lowerCategory) {
            filterButtons[x].classList.add('active');
        } else {
            filterButtons[x].classList.remove('active');
        }
    }

    productCards.forEach(function(card) {
        let typeElement = card.querySelector('.product-type');
        let typeText = typeElement.innerText.trim().toLowerCase();

        if (lowerCategory === 'всі товари' || lowerCategory === typeText) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartIconNumber();
    drawCart();

    let params = new URLSearchParams(window.location.search);
    let cat = params.get('category');
    
    if (cat) {
        runFilter(cat);
    }
});

filterButtons.forEach(function(btn) {
    btn.onclick = function() {
        runFilter(btn.innerText);
    };
});

let myForm = document.querySelector('.contact-send-form');

if (myForm) {
    myForm.onsubmit = function(e) {
        e.preventDefault();

        let nameVal = document.querySelector('#contact-name').value;
        let subjVal = document.querySelector('#contact-subject').value;

        alert(nameVal + ', ваше звернення за темою: ' + subjVal + ", надіслано! Ми зв'яжемося з вами.");

        myForm.reset();
    };
}