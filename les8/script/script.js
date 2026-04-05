let productsInCartCounted = 0
let productsInCart = []

const buyButtons = document.querySelectorAll('.product-card button')

buyButtons.forEach(button => {
    button.addEventListener('click', function() {
        productsInCartCounted++
        productsInCart.push(button.parentElement)
        const productName = button.parentElement.querySelector('h3').innerText
        showPopToAddToCart(productName)
        }
    )
})

function removeFromCart(product) {
    productsInCartCounted--
    productsInCart.splice(productsInCart.indexOf(product), 1)
}

function clearCart() {
    productsInCartCounted = 0
    productsInCart = []
}

function showPopToAddToCart(productName) {
    let container = document.querySelector('.toast-container')
    if (!container) {
        container = document.createElement('div')
        container.className = 'toast-container'
        document.body.appendChild(container)
    }

    const popups = container.querySelectorAll('.toast-popup')
    if (popups.length >= 3) {
        popups[0].remove()
    }

    const popup = document.createElement('div')
    popup.className = 'toast-popup'
    popup.innerHTML = `
        <div class="toast-popup-icon">✓</div>
        <div class="toast-popup-text">${productName} додано до кошика!</div>
    `

    container.appendChild(popup)

    requestAnimationFrame(() => {
        popup.classList.add('show')
    })

    const timeout = 2500

    setTimeout(() => {
        popup.classList.remove('show')
        setTimeout(() => popup.remove(), 300)
    }, timeout)
}

function showCart() {
    const cartContainer = document.querySelector('.cart-items-list');
    const summaryContainer = document.querySelector('.cart-summary-card');

    const cartItemHTML = `
        <div class="cart-item">
            <img src="img/1.png" alt="Декоративна подушка" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">Декоративна подушка</h3>
                <p class="cart-item-category">Текстиль</p>
                <div class="quantity-manager">
                    <button class="quantity-btn">-</button>
                    <span>2</span>
                    <button class="quantity-btn">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="remove-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="delete-icon"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
                <p class="cart-item-price">898 ₴</p>
            </div>
        </div>
    `;

    const summaryHTML = `
        <div class="cart-summary-content">
            <h3 class="summary-title">Підсумок замовлення</h3>
            <div class="summary-row">
                <span>Товари (7)</span>
                <span>2393 ₴</span>
            </div>
            <div class="summary-row">
                <span>Доставка</span>
                <span class="free-text">Безкоштовно</span>
            </div>
            <div class="divider"></div>
            <div class="summary-total-row">
                <span>Разом</span>
                <span>2393 ₴</span>
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-bottom: 12px;">Оформити замовлення</button>
            <button class="btn btn-outline-dark" style="width: 100%;">Продовжити покупки</button>
        </div>
    `;

    if (cartContainer) cartContainer.innerHTML = cartItemHTML;
    if (summaryContainer) summaryContainer.innerHTML = summaryHTML;
}


const buttons = document.querySelectorAll('.filters-list button');

buttons.forEach(button => {
    button.addEventListener('click', function() {
        buttons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const selectedCategory = button.innerText.trim().toLowerCase();
        const cards = document.querySelectorAll('.product-card');

        cards.forEach(card => {
            const productType = card.querySelector('.product-type').innerText.trim().toLowerCase();

            if (selectedCategory === 'всі товари' || selectedCategory === productType) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});