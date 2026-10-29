const cart = [];
const productLimit = (86 % 4) + 2; // 4

const bagIcon = document.querySelector(".bag-icon");
const rightSide = document.querySelector(".right-side");
const addButtons = document.querySelectorAll(".add-to-cart");

const badge = document.createElement("span");
badge.className = "cart-badge";
badge.textContent = "0";
bagIcon.appendChild(badge);

const miniCart = document.createElement("div");
miniCart.className = "mini-cart";
miniCart.hidden = true;
rightSide.appendChild(miniCart);

function getProductFromCard(card) {
    const paragraphs = card.querySelectorAll("p");
    const name = paragraphs[0].textContent.trim();
    const priceText = paragraphs[1].textContent.trim();
    const price = Number(priceText.replace(/[^\d]/g, ""));

    return {
        name,
        price,
        priceText
    };
}

function getProductKey(product) {
    return `${product.name}|${product.price}`;
}

function updateCart() {
    badge.textContent = cart.length;
    miniCart.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = "Cart";
    miniCart.appendChild(heading);

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Your cart is empty.";
        miniCart.appendChild(emptyMessage);
    }

    cart.forEach((product, index) => {
        const item = document.createElement("div");
        item.className = "mini-cart-item";

        const details = document.createElement("span");
        details.textContent = `${product.name} - ${product.priceText}`;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {
            cart.splice(index, 1);
            updateCart();
        });

        item.append(details, removeButton);
        miniCart.appendChild(item);
    });

    const total = cart.reduce((sum, product) => sum + product.price, 0);

    const totalElement = document.createElement("strong");
    totalElement.textContent = `Total: Rs. ${total.toLocaleString()}`;
    miniCart.appendChild(totalElement);

    updateButtonStates();
}

function updateButtonStates() {
    addButtons.forEach((button) => {
        const card = button.closest(".product-card");
        const product = getProductFromCard(card);
        const productKey = getProductKey(product);

        const quantity = cart.filter(
            (item) => getProductKey(item) === productKey
        ).length;

        button.disabled = quantity >= productLimit;
        button.textContent = quantity >= productLimit
            ? "Limit reached"
            : "Add to Cart";
    });
}

addButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        const product = getProductFromCard(card);
        const productKey = getProductKey(product);

        const quantity = cart.filter(
            (item) => getProductKey(item) === productKey
        ).length;

        if (quantity < productLimit) {
            cart.push(product);
            updateCart();
        }
    });
});

bagIcon.addEventListener("click", (event) => {
    event.preventDefault();
    miniCart.hidden = !miniCart.hidden;
});

updateCart();