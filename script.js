// Winkelmand in localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
  initProducts();
  initQuickView();
  initCheckout();
  updateCart();
});

// Producten koppelen
function initProducts() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.closest('.product');
      const name = product.dataset.name;
      const price = parseFloat(product.dataset.price);
      addToCart({ name, price });

      // pulse animatie op cart
      const cartEl = document.getElementById('cart');
      cartEl.classList.add('updated');
      setTimeout(() => cartEl.classList.remove('updated'), 600);
    });
  });

  // Quick view openen
  document.querySelectorAll('.product img').forEach(img => {
    img.addEventListener('click', () => openQuickView(img.src));
  });
}

// Quick View
function initQuickView() {
  const overlay = document.getElementById('quick-view');
  const closeBtn = document.getElementById('close-quick-view');

  closeBtn.addEventListener('click', closeQuickView);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeQuickView();
  });
}

function openQuickView(src) {
  const overlay = document.getElementById('quick-view');
  const img = document.getElementById('quick-view-img');
  img.src = src;
  overlay.style.display = 'flex';
  overlay.classList.remove('closing');
}

function closeQuickView() {
  const overlay = document.getElementById('quick-view');
  overlay.classList.add('closing');
  setTimeout(() => {
    overlay.style.display = 'none';
    overlay.classList.remove('closing');
  }, 300);
}

// Cart operations
function addToCart(item) {
  cart.push(item);
  saveCart();
  updateCart();
}

function removeFromCart(index) {
  const li = document.querySelector(`#cart-items li[data-index="${index}"]`);
  if (li) {
    li.classList.add('cart-item', 'removing');
    li.addEventListener('animationend', () => {
      cart.splice(index, 1);
      saveCart();
      updateCart();
    }, { once: true });
  } else {
    cart.splice(index, 1);
    saveCart();
    updateCart();
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart() {
  const list = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');

  list.innerHTML = '';
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price;
    const li = document.createElement('li');
    li.setAttribute('data-index', i);
    li.innerHTML = `
      <span>${item.name} - €${formatPrice(item.price)}</span>
      <button class="remove-btn">Verwijder</button>
    `;
    list.appendChild(li);
  });

  totalEl.textContent = `€${formatPrice(total)}`;

  document.querySelectorAll('#cart .remove-btn').forEach((btn, idx) => {
    btn.addEventListener('click', () => removeFromCart(idx));
  });
}

function formatPrice(value) {
  return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Checkout + adres modal
function initCheckout() {
  const checkoutBtn = document.getElementById('checkout');
  const modal = document.getElementById('address-modal');
  const cancelBtn = document.getElementById('cancel-address');
  const form = document.getElementById('address-form');

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Je winkelmand is leeg.');
      return;
    }
    modal.style.display = 'flex';
  });

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const street = document.getElementById('street').value.trim();
    const postcode = document.getElementById('postcode').value.trim();
    const city = document.getElementById('city').value.trim();

    if (!name || !street || !postcode || !city) {
      showToast('Vul alle velden in.');
      return;
    }

    const pcOk = /^[0-9]{4}\s?[A-Za-z]{2}$/.test(postcode);
    if (!pcOk) {
      showToast('Postcode lijkt niet geldig (bijv. 1234 AB).');
      return;
    }

    const bestemming = `${street}, ${postcode} ${city}`;
    showToast(`Bedankt ${name}! Uw producten zijn onderweg naar ${bestemming}.`);

    cart = [];
    saveCart();
    updateCart();

    modal.style.display = 'none';
    confettiBurst();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
}

// Toast
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    toast.textContent = '';
  }, 3000);
}

// Confetti burst
function confettiBurst() {
  const colors = ['#28a745', '#007bff', '#dc3545', '#f0ad4e', '#6f42c1'];
  for (let i = 0; i < 18; i++) {
    const piece = document.createElement('div');
    piece.style.position = 'fixed';
    piece.style.width = '8px';
    piece.style.height = '8px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = '2px';
    piece.style.top = '50%';
    piece.style.left = '50%';
    piece.style.transform = 'translate(-50%, -50%)';
    piece.style.zIndex = '1300';
    document.body.appendChild(piece);

    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 80;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    piece.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${Math.random()*360}deg)`, opacity: 0 }
    ], {
      duration: 900 + Math.random() * 600,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards'
    });

    setTimeout(() => piece.remove(), 1600);
  }
}
