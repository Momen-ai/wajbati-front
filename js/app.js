
const demoMeals = [
  { id: 1, name_en: 'Chicken Shawarma', name_ar: 'شاورما دجاج', desc_en: 'Homemade chicken shawarma', desc_ar: 'شاورما دجاج منزلية', price: 8.5, image: 'assets/images/meal1.jpg' },
  { id: 2, name_en: 'Fattet Makdous', name_ar: 'فتّة مكدوس', desc_en: 'Traditional delicious dish', desc_ar: 'طبق تقليدي لذيذ', price: 10, image: 'assets/images/meal2.jpg' },
  { id: 3, name_en: 'Molokhia', name_ar: 'ملوخية', desc_en: 'Classic molokhia from home', desc_ar: 'ملوخية منزلية', price: 7.25, image: 'assets/images/meal3.jpg' }
];

function renderMealsGrid(targetId) {
  const container = document.getElementById(targetId);
  if (!container) return;
  container.innerHTML = '';
  demoMeals.forEach(m => {
    const title = (document.documentElement.lang === 'ar') ? m.name_ar : m.name_en;
    const desc = (document.documentElement.lang === 'ar') ? m.desc_ar : m.desc_en;
    const col = document.createElement('div'); col.className = 'col-sm-6 col-md-4';
    col.innerHTML = `
      <div class="card meal-card h-100">
        <img src="${m.image}" class="card-img-top" alt="${title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-1">${title}</h5>
          <p class="card-text text-muted small mb-2">${desc}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <div class="price fw-bold">${m.price} <small>$</small></div>
            <a href="meal.html?id=${m.id}" class="btn btn-sm btn-outline-primary view-btn" data-id="${m.id}">View</a>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

function initMealDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id') || '1');
  const meal = demoMeals.find(x => x.id === id) || demoMeals[0];
  if (!meal) return;
  document.getElementById('mealImage').src = meal.image;
  document.getElementById('mealName').innerText = (document.documentElement.lang === 'ar') ? meal.name_ar : meal.name_en;
  document.getElementById('mealDesc').innerText = (document.documentElement.lang === 'ar') ? meal.desc_ar : meal.desc_en;
  document.getElementById('mealPrice').innerText = meal.price + ' $';
  document.getElementById('mealCategory').innerText = 'Home-cooked • 2 persons';
}

function addToCartDemo(mealId, qty) {
  const cart = JSON.parse(localStorage.getItem('wajbati_cart') || '[]');
  const existing = cart.find(i => i.id === mealId);
  if (existing) existing.qty += qty;
  else cart.push({ id: mealId, qty: qty });
  localStorage.setItem('wajbati_cart', JSON.stringify(cart));
  localStorage.setItem('wajbati_cart_count', cart.reduce((s, i) => s + i.qty, 0));
  alert('Added to cart');
  updateCartBadge();
}

function updateCartBadge() {
  const cnt = localStorage.getItem('wajbati_cart_count') || 0;
  const el = document.querySelector('.cart-count');
  if (el) { el.textContent = cnt; el.style.display = (cnt == 0) ? 'none' : 'inline-block'; }
}

function renderCartPage() {
  const area = document.getElementById('cartArea');
  const cart = JSON.parse(localStorage.getItem('wajbati_cart') || '[]');
  if (!area) return;
  if (cart.length === 0) {
    area.innerHTML = '<div class="alert alert-info" data-key="cart_empty">Your cart is empty</div>';
    return;
  }
  let html = '<div class="table-responsive"><table class="table align-middle"><thead><tr><th>Meal</th><th>Qty</th><th>Price</th><th></th></tr></thead><tbody>';
  let total = 0;
  cart.forEach(item => {
    const m = demoMeals.find(x => x.id === item.id);
    const title = (document.documentElement.lang === 'ar') ? m.name_ar : m.name_en;
    const price = (m.price * item.qty).toFixed(2);
    total += parseFloat(price);
    html += `<tr><td><div class="d-flex align-items-center"><img src="${m.image}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;margin-right:12px"><div><div class="fw-bold">${title}</div></div></div></td><td>${item.qty}</td><td>${price} $</td><td><button class="btn btn-sm btn-outline-danger remove-btn" data-id="${item.id}">Remove</button></td></tr>`;
  });
  html += `</tbody></table></div><div class="card p-3"><h5 data-key="checkout">Checkout</h5><p class="fw-bold">Total: ${total.toFixed(2)} $</p><button class="btn btn-success" id="checkoutBtn">Place Order</button></div>`;
  area.innerHTML = html;
  document.querySelectorAll('.remove-btn').forEach(b => b.addEventListener('click', function () { const id = parseInt(this.dataset.id); removeFromCart(id); }));
  document.getElementById('checkoutBtn').addEventListener('click', function () { alert('Order placed (demo)'); localStorage.removeItem('wajbati_cart'); localStorage.removeItem('wajbati_cart_count'); updateCartBadge(); renderCartPage(); });
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem('wajbati_cart') || '[]');
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem('wajbati_cart', JSON.stringify(cart));
  localStorage.setItem('wajbati_cart_count', cart.reduce((s, i) => s + i.qty, 0));
  updateCartBadge();
  renderCartPage();
}

document.addEventListener('DOMContentLoaded', function () {
  updateCartBadge();
  renderMealsGrid('mealsGrid');
  renderMealsGrid('mealsList');
  renderMealsGrid('familyMeals');
  initMealDetail();
  renderCartPage();

  const addForm = document.getElementById('addToCartForm');
  if (addForm) {
    addForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const qty = parseInt(document.getElementById('quantity').value || '1');
      const mealId = parseInt(document.getElementById('mealId').value || '1');
      addToCartDemo(mealId, qty);
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', function (e) { e.preventDefault(); alert('Demo login (no backend)'); });

  const registerForm = document.getElementById('registerForm');
  if (registerForm) registerForm.addEventListener('submit', function (e) { e.preventDefault(); alert('Demo register (no backend)'); });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) contactForm.addEventListener('submit', function (e) { e.preventDefault(); alert('Message sent (demo)'); });
});
