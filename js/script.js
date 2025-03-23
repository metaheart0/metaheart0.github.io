console.log("Корзина очищена.");

// Кнопки добавления в корзину
const addToCartButtons = document.querySelectorAll(".add-to-cart");
addToCartButtons.forEach(button => {
    button.addEventListener("click", function () {
        addToCart(this);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", function(event) {
            event.preventDefault();
            console.log("Товар выбран:", this);
        });
    });
});

// Выбор размера товара и разблокировка кнопки "В корзину"
document.querySelectorAll(".size-options button").forEach(button => {
    button.addEventListener("click", function () {
        let sizeContainer = this.closest(".size-container");
        let sizeButtons = sizeContainer.querySelectorAll("button");
        let addToCartButton = sizeContainer.querySelector(".add-to-cart");

        // Убираем выделение с других кнопок
        sizeButtons.forEach(btn => btn.classList.remove("selected"));
        this.classList.add("selected");

        // Разблокируем кнопку "В корзину"
        if (addToCartButton) {
            addToCartButton.removeAttribute("disabled");
        }
    });
});

// Отображение товаров в корзине
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("cart.html")) {
        loadCart();
    }
});

// Функция добавления товара в корзину (localStorage)
function addToCart(button) {
    let productCard = button.closest(".product-card");
    let productTitle = productCard.querySelector(".product-title").innerText;
    let selectedSize = productCard.querySelector(".size-options button.selected");

    if (!selectedSize) {
        alert("Выберите размер перед добавлением в корзину!");
        return;
    }

    let size = selectedSize.innerText;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({ title: productTitle, size: size });
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`Добавлено в корзину: ${productTitle} (${size})`);
    updateCartCount();
}

// Функция загрузки товаров в корзину
function loadCart() {
    console.log("Загрузка корзины...");

    const cartContainer = document.getElementById("cart-items");
    if (!cartContainer) {
        console.warn("Элемент #cart-items не найден! Убедитесь, что он есть в HTML.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Содержимое корзины из localStorage:", cart);

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Корзина пуста</p>";
        return;
    }

    cartContainer.innerHTML = "";
    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <p>${item.title} - Размер: ${item.size}</p>
            <button class="remove-item" data-index="${index}">❌ Удалить</button>
        `;
        cartContainer.appendChild(cartItem);
    });

    document.querySelectorAll(".remove-item").forEach(button => {
        button.onclick = function () {
            let index = parseInt(this.getAttribute("data-index"), 10);
            removeFromCart(index);
        };
    });
}

// Функция удаления товара из корзины
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    setTimeout(() => {
        loadCart(); // Перезагружаем корзину после удаления товара
        updateCartCount(); // Обновляем количество товаров в корзине
    }, 50);
}

// Функция обновления количества товаров в корзине
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartIcon = document.querySelector(".cart-icon span");
    if (cartIcon) {
        cartIcon.innerText = cart.length ? `(${cart.length})` : "";
    }
}

// Функция подтверждения очистки корзины
function confirmClearCart() {
    if (confirm("Вы уверены, что хотите очистить корзину?")) {
        clearCart();
    }
}

// Очистка корзины
function clearCart() {
    localStorage.removeItem("cart");
    loadCart();
    updateCartCount();
}

document.addEventListener("DOMContentLoaded", function () {
    const introVideoContainer = document.getElementById("intro-video-container");
    const introVideo = document.getElementById("intro-video");
    const content = document.getElementById("content");

    function showContent() {
        introVideoContainer.style.opacity = "0";
        setTimeout(() => {
            introVideoContainer.style.display = "none";
            content.style.opacity = "0";
            content.style.display = "block";
            setTimeout(() => {
                content.style.opacity = "1";
            }, 500);
        }, 500);
        sessionStorage.setItem("videoPlayed", "true");
    }

    if (sessionStorage.getItem("videoPlayed")) {
        console.log("Видео уже проигрывалось, загружаем контент без него.");
        showContent();
    } else {
        content.style.display = "none";
        introVideoContainer.style.display = "flex";

        introVideo.addEventListener("ended", function () {
            console.log("Видео завершено, показываем контент.");
            showContent();
        });

        setTimeout(function () {
            if (introVideoContainer.style.display !== "none") {
                console.warn("Таймер сработал — показываем контент принудительно.");
                showContent();
            }
        }, 10000);
    }
})
