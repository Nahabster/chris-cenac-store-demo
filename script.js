const toast = document.querySelector(".toast");
const cartDrawer = document.querySelector(".cart-drawer");
const cartScrim = document.querySelector(".cart-scrim");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total");
const cart = [];
let toastTimer;

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

function renderCart() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartCount.textContent = cart.length;
  cartTotal.textContent = `$${total}`;

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
          </div>
          <em>$${item.price}</em>
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
    const item = {
      name: button.dataset.product,
      price: Number(button.dataset.price),
      image: button.dataset.image,
      size: getSelectedSize(card),
    };

    cart.push(item);
    renderCart();
    openCart();
    showToast(`${item.name} added to cart`);
  });
});

document.querySelector(".cart-toggle").addEventListener("click", openCart);
document.querySelector(".cart-close").addEventListener("click", closeCart);
cartScrim.addEventListener("click", closeCart);

document.querySelector(".signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.querySelector("input").value.trim();

  if (!email) return;

  showToast("You're on the drop list");
  form.reset();
});

renderCart();
