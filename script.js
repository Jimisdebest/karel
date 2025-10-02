// Laad winkelmand uit localStorage of start met lege array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Wacht tot DOM geladen is
document.addEventListener('DOMContentLoaded', () => {
  initAddToCart();
  initQuickView();
  document.getElementById('checkout').addEventListener('click', checkout);
  updateCart();
});

// Koppel “Toevoegen” knoppen
function initAddToCart() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.closest('.product');
      const name = product.dataset.name;
      const price = parseFloat(product.dataset.price);
      addToCart({ name, price });
      btn.blur();
    });
  });
}

// Voeg item toe en sla op
function addToCart(item) {
  cart.push(item);
  saveCart();
  updateCart();
}

// Haal winkelmand op uit localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Verwijder item
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

// Toon winkelmand en totaal
function updateCart() {
  const list = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  list.innerHTML = '';
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price;
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} - €${item.price.toFixed(2)}
      <button class="remove-btn" data-index="${i}">x</button>
    `;
    list.appendChild(li);
  });

  totalEl.textContent = `€${total.toFixed(2)}`;
  document.querySelectorAll('.remove-btn').forEach(b => {
    b.addEventListener('click', () => removeFromCart(b.dataset.index));
  });
}

// Afrekenen
function checkout() {
  if (cart.length === 0) {
    alert('Je winkelmand is leeg.');
    return;
  }
  alert('Bedankt voor je bestelling! 🎉');
  cart = [];
  saveCart();
  updateCart();
}

// Quick View functionaliteit
function initQuickView() {
  document.querySelectorAll('.product img').forEach(img => {
    img.addEventListener('click', () => openQuickView(img.src));
  });
  document.getElementById('close-quick-view')
          .addEventListener('click', closeQuickView);
}

function openQuickView(src) {
  const overlay = document.getElementById('quick-view');
  document.getElementById('quick-view-img').src = src;
  overlay.style.display = 'flex';
}

function closeQuickView() {
  document.getElementById('quick-view').style.display = 'none';
}
