let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
    li.innerHTML = `${item.name} - €${item.price.toFixed(2)} <button onclick="removeFromCart(${index})">Verwijder</button>`;
    cartItems.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = total.toFixed(2);
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
  document.getElementById('quick-img').src = src;
  document.getElementById('quick-view').style.display = 'flex';
}

function closeQuickView() {
  document.getElementById('quick-view').style.display = 'none';
}

updateCart();
