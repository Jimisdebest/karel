let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Producten toevoegen via data-attributen
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const product = button.closest(".product");
      const name = product.dataset.name;
      const price = parseFloat(product.dataset.price);
      addToCart(name, price);
    });
  });

  // Quick view
  document.querySelectorAll(".product img").forEach(img => {
    img.addEventListener("click", () => openQuickView(img.src));
  });

  document.getElementById("close-quick-view").addEventListener("click", closeQuickView);
  document.getElementById("checkout").addEventListener("click", checkout);

  updateCart();
});

function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} - €${item.price.toFixed(2)}
      <button class="remove-btn" data-index="${index}">Verwijder</button>
    `;
    cartItems.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = total.toFixed(2);

  // verwijderknoppen koppelen
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.index));
  });
}

function checkout() {
  if (cart.length === 0) {
    alert("Uw winkelmandje is leeg.");
    return;
  }
  alert("Bedankt voor uw bestelling! Uw producten zijn onderweg.");
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

function openQuickView(src) {
  document.getElementById('quick-view-img').src = src;
  document.getElementById('quick-view').style.display = 'flex';
}

function closeQuickView() {
  document.getElementById('quick-view').style.display = 'none';
}
