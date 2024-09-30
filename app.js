const inCartWrapper = document.querySelector('.incart-wrapper');
const emptyCartWrapper = document.querySelector('.empty-cart-wrapper');

const orderTotalContainer = document.querySelector('.order-total-container');
const yourCartEl = document.querySelector('.your-cart');
const orderTotalEl = document.querySelector('.order-total');

let availableProducts = [] // push all products into an array
let cart = [] // array for items in cart


const loadProducts = async () => {
  try {
    const res = await fetch('data.json');
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

const createProductCards = (data) => {
  const { image, name, category, price } = data;
  const productCard = document.createElement('div');
  productCard.classList.add('product-card');
  productCard.innerHTML = `
    <div class="product-image-container">
      <picture>
      <source media="(min-width: 1000px)" srcset="${image.desktop}">
      <source media="(min-width: 600px)" srcset="${image.tablet}">
        <img src="${image.mobile}" alt="Product image">
      </picture>
      <button class="add-to-cart">
      <img src="assets/images/icon-add-to-cart.svg" alt="add to cart">
      Add to Cart
      </button>    
    </div>
    <div class="product-info">
      <p class="category">${category}</p>
      <h2 class="product-name">${name}</h2>
      <p class="price">$${price.toFixed(2)}</p>
    </div>
    `;
  return productCard;
}

const setupEventListeners = (productCard, product) => {
  const addToCartBtn = productCard.querySelector('.add-to-cart');
  const productImg = productCard.querySelector('.product-card img');
  const itemQuantityDisplay = productCard.querySelector('.item-quantity');
  const productImageContainerEl = productCard.querySelector('.product-image-container');
  const decrementBtn = productCard.querySelector('.decrement');
  const incrementBtn = productCard.querySelector('.increment');


  addToCartBtn.addEventListener('click', () => {
    handleAddToCart(product.name);
    updateUI(productImg, productImageContainerEl, product);
  });
};

function handleAddToCart(name) {
  // find product from availableProducts.
  const foundProduct = availableProducts.find(product => {
    return product.name === name;
  })
  // Push to cart array and add quantity key.
  cart.push({
    ...foundProduct,
    quantity: 1
  });

  const cartItem = cart.find(item => item.name === foundProduct.name);

  renderCart(cartItem);
  updateCart();
}

function updateUI(productImg, productImageContainerEl, product) {
  productImg.classList.add('selected-border');
  const addedProduct = cart.find(item => {
    return item.name === product.name;
  })
  const adjustQuantityEl = document.createElement('div');
  adjustQuantityEl.classList.add('adjust-quantity');
  adjustQuantityEl.innerHTML = `
    <button class="decrement">
    <img src="assets/images/icon-decrement-quantity.svg" alt="decrement quantity">
    </button>
    <span class="item-quantity">${addedProduct.quantity}</span>
    <button class="increment">
    <img src="assets/images/icon-increment-quantity.svg" alt="increment quantity">
    </button>
  `
  productImageContainerEl.append(adjustQuantityEl);
}

function renderCart(cartItem) {
  // Handle displays
  emptyCartWrapper.style.display = 'none';
  inCartWrapper.style.display = 'grid';
  orderTotalContainer.style.display = 'flex';

  // Display item in the shopping cart
  selectedItemEl = document.createElement('div');
  selectedItemEl.classList.add('selected-item');
  selectedItemEl.innerHTML = `
  <p class="selected-item-name">${cartItem.name}</p>
    <span class="selected-item-quantity">${cartItem.quantity}x</span>
     <span class="selected-item-price"><span>@</span> $${cartItem.price.toFixed(2)}</span>
    <span class="selected-item-total">$${(cartItem.quantity * cartItem.price).toFixed(2)}</span>
    <button class="remove-items">
      <img src="assets/images/icon-remove-item.svg" alt="remove">
    </button>
  `
  inCartWrapper.append(selectedItemEl);
}

function updateCart() {
  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    totalItems += item.quantity;
    totalPrice += item.quantity * item.price;
  })
  yourCartEl.innerText = `Your Cart (${totalItems})`;
  orderTotalEl.innerHTML = `
    <p>Order Total</p>
    <p>$${totalPrice.toFixed(2)}</p>
  `
}

document.addEventListener('DOMContentLoaded', async () => {
  const products = await loadProducts();
  const gridWrapperEl = document.querySelector('.grid-wrapper');
  if (products) {
    products.forEach(product => {
      const productCard = createProductCards(product);
      gridWrapperEl.append(productCard); // Append the created card to the grid
      setupEventListeners(productCard, product);
      availableProducts.push(product); // Push all products into an array
    });
  }
});

// click 'add-to-cart' I need the product name
// availableProducts[name] pushed to cart[]
// when item is pushed to cart, new key value. item quantity = 1

