const toast = document.querySelector(".toast");
const cartDrawer = document.querySelector(".cart-drawer");
const cartScrim = document.querySelector(".cart-scrim");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total");
const checkoutButton = document.querySelector(".checkout-button");
const dropModal = document.querySelector(".drop-modal");
const dropForm = document.querySelector(".drop-form");
const dropName = document.querySelector("#drop-name");
const modalClose = document.querySelector(".modal-close");
const cart = [];
let toastTimer;

function formatMoney(value) {
  return `$${value}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function getSelectedSize(card) {
  const selected = card.querySelector(".size-options .is-selected");
  return selected ? selected.textContent.trim() : "One Size";
}

function openCart() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartScrim.hidden = false;
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartScrim.hidden = true;
}

function openDropModal() {
  if (!cart.length) {
    showToast("Add a piece to request first access");
    return;
  }

  dropModal.hidden = false;
  closeCart();
  dropName.focus();
}

function closeDropModal() {
  dropModal.hidden = true;
}

function getCartItem(product, size) {
  return cart.find((item) => item.name === product && item.size === size);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function renderCart() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = getCartCount();
  cartCount.textContent = itemCount;
  cartTotal.textContent = formatMoney(total);
  checkoutButton.disabled = !cart.length;

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Add a product to start your order.</p>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <article class="cart-line">
          <img src="${item.image}" alt="${item.name} thumbnail" />
          <div>
            <strong>${item.name}</strong>
            <span>${item.size}</span>
            <div class="cart-line-meta">
              <div class="cart-controls" aria-label="Update ${item.name} quantity">
                <button type="button" data-action="decrease" data-key="${item.key}" aria-label="Decrease ${item.name} quantity">-</button>
                <span>${item.quantity}</span>
                <button type="button" data-action="increase" data-key="${item.key}" aria-label="Increase ${item.name} quantity">+</button>
              </div>
              <strong class="cart-line-price">${formatMoney(item.price * item.quantity)}</strong>
            </div>
            <button class="remove-line" type="button" data-action="remove" data-key="${item.key}">Remove</button>
          </div>
        </article>
      `,
    )
    .join("");
}

document.querySelectorAll(".size-options").forEach((group) => {
  group.addEventListener("click", (event) => {
    if (!event.target.matches("button")) return;
    group.querySelectorAll("button").forEach((button) => button.classList.remove("is-selected"));
    event.target.classList.add("is-selected");
  });
});

document.querySelectorAll(".quick-add").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const size = getSelectedSize(card);
    const existing = getCartItem(button.dataset.product, size);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        key: crypto.randomUUID(),
        name: button.dataset.product,
        price: Number(button.dataset.price),
        image: button.dataset.image,
        quantity: 1,
        size,
      });
    }

    const itemName = button.dataset.product;
    renderCart();
    openCart();
    showToast(`${itemName} added to cart`);
  });
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const item = cart.find((cartItem) => cartItem.key === button.dataset.key);
  if (!item) return;

  if (button.dataset.action === "increase") {
    item.quantity += 1;
  }

  if (button.dataset.action === "decrease") {
    item.quantity -= 1;
  }

  if (button.dataset.action === "remove" || item.quantity < 1) {
    cart.splice(cart.indexOf(item), 1);
  }

  renderCart();
});

document.querySelectorAll(".filters button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".filters button").forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("is-selected", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });

    document.querySelectorAll(".product-card").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

checkoutButton.addEventListener("click", openDropModal);
modalClose.addEventListener("click", closeDropModal);

dropModal.addEventListener("click", (event) => {
  if (event.target === dropModal) closeDropModal();
});

dropForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.querySelector("#drop-name").value.trim().split(" ")[0] || "You're";

  showToast(`${name}, you're on the first access list`);
  form.reset();
  closeDropModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeDropModal();
  }
});

document.querySelector(".cart-toggle").addEventListener("click", openCart);
document.querySelector(".cart-close").addEventListener("click", closeCart);
cartScrim.addEventListener("click", closeCart);

document.querySelector(".signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.querySelector("input").value.trim();

  if (!email) return;

  showToast("You're on the first access list");
  form.reset();
});

renderCart();
