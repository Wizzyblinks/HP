const products = [
  {
    id: 1,
    image: {
      mobile: './assets/images/image-waffle-mobile.jpg',
      desktop: './assets/images/image-waffle-desktop.jpg'
    },
    name: 'Waffle with Berries',
    category: 'Waffle',
    price: 6.5
  },
  {
    id: 2,
    image: {
      mobile: './assets/images/image-creme-brulee-mobile.jpg',
      desktop: './assets/images/image-creme-brulee-desktop.jpg'
    },
    name: 'Vanilla Bean Crème Brûlée',
    category: 'Crème Brûlée',
    price: 7.0
  },
  {
    id: 3,
    image: {
      mobile: './assets/images/image-macaron-mobile.jpg',
      desktop: './assets/images/image-macaron-desktop.jpg'
    },
    name: 'Macaron Mix of Five',
    category: 'Macaron',
    price: 8.0
  },
  {
    id: 4,
    image: {
      mobile: './assets/images/image-tiramisu-mobile.jpg',
      desktop: './assets/images/image-tiramisu-desktop.jpg'
    },
    name: 'Classic Tiramisu',
    category: 'Tiramisu',
    price: 5.5
  },
  {
    id: 5,
    image: {
      mobile: './assets/images/image-baklava-mobile.jpg',
      desktop: './assets/images/image-baklava-desktop.jpg'
    },
    name: 'Pistachio Baklava',
    category: 'Baklava',
    price: 4.0
  },
  {
    id: 6,
    image: {
      mobile: './assets/images/image-meringue-mobile.jpg',
      desktop: './assets/images/image-meringue-desktop.jpg'
    },
    name: 'Lemon Meringue Pie',
    category: 'Pie',
    price: 5.0
  },
  {
    id: 7,
    image: {
      mobile: './assets/images/image-cake-mobile.jpg',
      desktop: './assets/images/image-cake-desktop.jpg'
    },
    name: 'Red Velvet Cake',
    category: 'Cake',
    price: 4.5
  },
  {
    id: 8,
    image: {
      mobile: './assets/images/image-brownie-mobile.jpg',
      desktop: './assets/images/image-brownie-desktop.jpg'
    },
    name: 'Salted Caramel Brownie',
    category: 'Brownie',
    price: 4.5
  },
  {
    id: 9,
    image: {
      mobile: './assets/images/image-panna-cotta-mobile.jpg',
      desktop: './assets/images/image-panna-cotta-desktop.jpg'
    },
    name: 'Vanilla Panna Cotta',
    category: 'Panna Cotta',
    price: 6.5
  }
];

const state = {
  cart: [],
  selectedProductId: null
};

const productGrid = document.querySelector('.product-grid');
const cartContainer = document.querySelector('.cart-content');
const cartCount = document.querySelector('[data-cart-count]');
const orderButton = document.querySelector('[data-confirm-order]');
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('[data-close-modal]');
//const quantityButtons = {};

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function updateCartCount() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

function renderCart() {
  cartContainer.innerHTML = '';
  if (!state.cart.length) {
    const empty = document.createElement('div');
    empty.className = 'cart-empty';
    empty.innerHTML = `
      <img src="./assets/images/illustration-empty-cart.svg" alt="Empty cart illustration">
      <strong>Your added items will appear here</strong>
      <p>Start adding products to your cart to see them here.</p>
    `;
    cartContainer.appendChild(empty);
    orderButton.disabled = true;
    return;
  }

  const list = document.createElement('div');
  list.className = 'cart-items';

  state.cart.forEach((item) => {
    const entry = document.createElement('div');
    entry.className = 'cart-item';
    entry.innerHTML = `
      <div class="cart-item__top">
        <div>
          <p class="cart-item__title">${item.name}</p>
          <p class="cart-item__details"><strong>${item.quantity}x</strong> ${formatPrice(item.price)} <strong>${formatPrice(item.price * item.quantity)}</strong></p>
        </div>
        <button class="cart-item__remove" aria-label="Remove ${item.name}" data-remove-id="${item.id}">
          <img src="./assets/images/icon-remove-item.svg" alt="Remove item">
        </button>
      </div>
    `;
    list.appendChild(entry);
  });

  const summary = document.createElement('div');
  summary.className = 'cart-summary';
  summary.innerHTML = `
    <div class="cart-total">
      <span>Order Total</span>
      <strong>${formatPrice(getCartTotal())}</strong>
    </div>
    <p class="cart-note">
    </p>
  `;

  cartContainer.appendChild(list);
  cartContainer.appendChild(summary);
  orderButton.disabled = false;

  cartContainer.querySelectorAll('[data-remove-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.removeId);
      state.cart = state.cart.filter((item) => item.id !== id);
      updateCartCount();
      renderCart();
      renderProducts();
    });
  });
}

function updateProductSelection(productId) {
  state.selectedProductId = productId;
  renderProducts();
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  const existing = state.cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }
  updateCartCount();
  renderCart();
  updateProductSelection(productId);
}

function changeQuantity(productId, delta) {
  const product = products.find((item) => item.id === productId);
  const existing = state.cart.find((item) => item.id === productId);
  if (!existing && delta > 0) {
    state.cart.push({ ...product, quantity: 1 });
  } else if (existing) {
    existing.quantity += delta;
    if (existing.quantity <= 0) {
      state.cart = state.cart.filter((item) => item.id !== productId);
    }
  }
  updateCartCount();
  renderCart();
  renderProducts();
}

function renderProducts() {
  productGrid.innerHTML = '';
  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    if (state.selectedProductId === product.id) {
      card.classList.add('product-card--selected');
    }

    const count = state.cart.find((item) => item.id === product.id)?.quantity || 0;

    card.innerHTML = `
      <div class="product-card__image">
        <picture>
          <source media="(min-width: 1080px)" srcset="${product.image.desktop}">
          <img src="${product.image.mobile}" alt="${product.name}">
        </picture>
      </div>
      <div class="product-card__content">
        <div class="product-card__meta">
          <span class="product-card__label">${product.category}</span>
          <h3 class="product-card__name">${product.name}</h3>
          <span class="product-card__price">${formatPrice(product.price)}</span>
        </div>
        <div class="product-card__action">
          ${count ? `
            <div class="quantity-control">
              <button type="button" class="icon-button" aria-label="Decrease quantity" data-action="decrease" data-product-id="${product.id}">-</button>
              <span>${count}</span>
              <button type="button" class="icon-button" aria-label="Increase quantity" data-action="increase" data-product-id="${product.id}">+</button>
            </div>
          ` : `
            <button type="button" class="button product-card__add" data-add-id="${product.id}">
              <img src="./assets/images/icon-add-to-cart.svg" alt="">
              Add to Cart
            </button>
          `}
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  });

  productGrid.querySelectorAll('[data-add-id]').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(Number(button.dataset.addId));
    });
  });

  productGrid.querySelectorAll('[data-action]').forEach((button) => {
    const productId = Number(button.dataset.productId);
    const action = button.dataset.action;
    button.addEventListener('click', () => {
      changeQuantity(productId, action === 'increase' ? 1 : -1);
    });
  });
}

function openModal() {
  modalOverlay.classList.remove('hidden');
}

function closeModal() {
  modalOverlay.classList.add('hidden');
}

orderButton.addEventListener('click', () => {
  openModal();
});

modalClose.addEventListener('click', () => {
  state.cart = [];
  updateCartCount();
  renderCart();
  renderProducts();
  closeModal();
});

modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

renderProducts();
renderCart();
updateCartCount();
