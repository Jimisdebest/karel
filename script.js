let cart = [];
let favorites = [];

document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const product = btn.closest('.product');
    const name = product.dataset.name;
    const price = parseFloat(product.dataset.price);
    cart.push({ name, price });
    updateCart();
  });
});

document.querySelectorAll('.add-to-favorite').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.closest('.product').dataset.name;
    if (!favorites.includes(name)) {
      favorites.push(name);
      updateFavorites();
    }
  });
});

function updateCart() {
  const list = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  list.innerHTML = '';
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    const li = document.createElement('li');
    li.innerHTML = `${item.name} - €${item.price.toFixed(2).replace('.', ',')}
      <button onclick="removeFromCart(${i})">Verwijder</button>`;
    list.appendChild(li);
  });
  totalEl.textContent = `€${total.toFixed(2).replace('.', ',')}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateFavorites() {
  const list = document.getElementById('favorite-items');
  list.innerHTML = '';
  favorites.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    list.appendChild(li);
  });
}

document.getElementById('checkout').addEventListener('click', () => {
  if (cart.length === 0) return alert('Je winkelmandje is leeg!');
  document.getElementById('address-modal').style.display = 'flex';
});

document.getElementById('cancel-address').addEventListener('click', () => {
  document.getElementById('address-modal').style.display = 'none';
});

document.getElementById('address-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const street = document.getElementById('street').value;
  const postcode = document.getElementById('postcode').value;
  const city = document.getElementById('city').value;

  const order = cart.map(item => `${item.name} (€${item.price.toFixed(2)})`).join(", ");

  emailjs.send("service_cladjwo", "template_1aqs7ds", {
    name, street, postcode, city, order
  })
  .then(() => {
    alert("✅ Bestelling verzonden naar je e-mail!");
    document.getElementById('address-modal').style.display = 'none';
    cart = [];
    updateCart();
    confettiBurst();
  })
  .catch((error) => {
    console.error("❌ Fout bij verzenden:", error);
    alert("Er ging iets mis met verzenden.");
  });
});

function confettiBurst() {
  for (let i = 0; i < 20; i++) {
    const piece = document.createElement('div');
    piece.style.position = 'fixed';
    piece.style.width = '8px';
    piece.style.height = '8px';
    piece.style.background = ['#28a745', '#007bff', '#dc3545'][i % 3];
    piece.style.borderRadius = '50%';
    piece.style.top = '50%';
    piece.style.left = '50%';
    piece.style.zIndex = '9999';
    document.body.appendChild(piece);

    const angle = Math.random() * 2 * Math.PI;
    const x = Math.cos(angle) * 100;
    const y = Math.sin(angle) * 100;

    piece.animate([
      { transform: 'translate(-50%, -50%)', opacity: 1 },
      { transform: `translate(${x}px, ${y}px)`, opacity: 0 }
    ], {
      duration: 1000 +
