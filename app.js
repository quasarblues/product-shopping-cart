// Variables for cart UI
const inCartWrapperEl = document.querySelector('.incart-wrapper');
const emptyCartWrapperEl = document.querySelector('.empty-cart-wrapper');
const confirmOrderBtn = document.querySelector('.confirm-order');
const orderTotalContainerEl = document.querySelector('.order-total-container');

// Variable for order total UI
const confirmedOverlayEl = document.querySelector('.confirmed-overlay');
const confirmedItemsWrapper = document.querySelector('.confirmed-items-wrapper');
const confirmedTotalEl = document.querySelector('.confirmed-total');
const newOrderBtn = document.querySelector('.new-order');

// Initialize array of available products
let availableProducts = [];


// Define a cart class
class Cart {
  constructor() {
    this.items = [];
  }

  // Add product to cart
  addProduct(cartItem) {
    const existingProduct = this.items.find(item => item.name === cartItem.name);

    if (!existingProduct) {
      this.items.push(cartItem)
    } else {
      // Increase quantity by 1 if product is already in cart
      existingProduct.quantity += 1;
    }
  }
  // Remove product from cart
  removeProduct(cartItem) {
    const existingProduct = this.items.find(item => item.name === cartItem.name);
    if (existingProduct) {
      this.items = this.items.filter(item => item.name !== cartItem.name)
    } else {
      console.log('Item not in cart')
    }
  }
  // Increase quantity
  increment(cartItem) {
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      console.log('This item is not in the cart');
    }
  }
  // Decrease quantity
  decrement(cartItem) {
    if (cartItem) {
      cartItem.quantity -= 1;
    } else {
      console.log('This istem is not in the cart')
    }
  }
}

// Initialize the Cart
const myCart = new Cart();

// Fetch product data from data.json
const loadProducts = async () => {
  try {
    const res = await fetch('data.json');
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

// Create product cards
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
      <img src="assets/images/icon-add-to-cart.svg" alt="">
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

// Set up event listener for add to cart button
function setupEventListeners(product, productCard) {
  const addBtn = productCard.querySelector('.add-to-cart');
  const productCardImg = productCard.querySelector('.product-image-container img');
  const productImgContainerEl = productCard.querySelector('.product-image-container');

  addBtn.addEventListener('click', () => {
    addToCart(product.name, productCardImg, productImgContainerEl);
  })
}

// Set up event listeners for buttons that increae and descrease quantity
function setupQuantityEventListeners(adjustQuantityEl, cartItem, productCardImg, productImgContainerEl) {
  const incrementBtn = adjustQuantityEl.querySelector('.increment');
  const decrementBtn = adjustQuantityEl.querySelector('.decrement');
  const productCardQty = adjustQuantityEl.querySelector('.item-quantity');

  incrementBtn.addEventListener('click', () => {
    handleIncrement(cartItem, productCardQty);
  })

  decrementBtn.addEventListener('click', () => {
    handleDecrement(cartItem, productCardQty, productCardImg, productImgContainerEl);
  })
}

////////// Functions for adding items to cart and rendering cart UI ///////////

function addToCart(name, productCardImg, productImgContainerEl) {
  const foundProduct = availableProducts.find(product => product.name === name);
  const cartItem = {
    ...foundProduct,
    quantity: 1,
  }

  myCart.addProduct(cartItem);
  setCardUI(productCardImg, cartItem, productImgContainerEl);
  renderCart(cartItem, productCardImg);
  updateCartTotals();
}

function setCardUI(productCardImg, cartItem, productImgContainerEl) {
  productCardImg.classList.add('selected-border');
  const adjustQuantityEl = document.createElement('div');
  adjustQuantityEl.classList.add('adjust-quantity');
  adjustQuantityEl.innerHTML = `
    <button class="decrement">
      <img src="assets/images/icon-decrement-quantity.svg" alt="decrement quantity">
    </button>
      <span class="item-quantity">${cartItem.quantity}</span>
    <button class="increment">
      <img src="assets/images/icon-increment-quantity.svg" alt="increment quantity">
    </button>
  `
  productImgContainerEl.append(adjustQuantityEl);

  setupQuantityEventListeners(adjustQuantityEl, cartItem, productCardImg, productImgContainerEl);
}

function renderCart(cartItem, productCardImg) {
  // Set cart display
  emptyCartWrapperEl.style.display = 'none';
  inCartWrapperEl.style.display = 'grid';
  orderTotalContainerEl.style.display = 'flex';

  // Create element and append to DOM
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  selectedItem.innerHTML = `
    <p class="selected-item-name" data-item-name="${cartItem.name}">${cartItem.name}</p>
      <span class="selected-item-quantity">${cartItem.quantity}x</span>
      <span class="selected-item-price"><span>@</span> $${cartItem.price.toFixed(2)}</span>
      <span class="selected-item-total">$${(cartItem.price * cartItem.quantity).toFixed(2)}</span>
      <button class="remove-items">
        <img src="assets/images/icon-remove-item.svg" alt="remove">
      </button>
  `
  inCartWrapperEl.append(selectedItem);

  // Add event listener to the remove btn
  const removeItemBtn = selectedItem.querySelector('.remove-items');
  const adjustQuantityEl = document.querySelector('.adjust-quantity');
  removeItemBtn.addEventListener('click', () => {
    myCart.removeProduct(cartItem);
    removeCardUI(productCardImg, adjustQuantityEl);
    removeFromCartUI(cartItem);
    updateCartTotals();
  })
}

function updateCart(cartItem) {
  const selectedItems = document.querySelectorAll('.selected-item'); // NodeList of divs

  // Convert NodeList to an array
  const matchingItem = Array.from(selectedItems).find(item => {
    const itemName = item.querySelector('.selected-item-name').dataset.itemName;
    return itemName === cartItem.name;
  });

  if (matchingItem) {
    matchingItem.innerHTML = `
    <p class="selected-item-name" data-item-name="${cartItem.name}">${cartItem.name}</p>
      <span class="selected-item-quantity">${cartItem.quantity}x</span>
      <span class="selected-item-price"><span>@</span> $${cartItem.price.toFixed(2)}</span>
      <span class="selected-item-total">$${(cartItem.price * cartItem.quantity).toFixed(2)}</span>
      <button class="remove-items">
        <img src="assets/images/icon-remove-item.svg" alt="remove">
      </button>
  `
  } else {
    console.log('No match found.');
  }
}

function updateCartTotals() {
  const yourCartEl = document.querySelector('.your-cart');
  const orderTotalEl = document.querySelector('.order-total');

  let totalQTY = 0;
  let totalPrice = 0;
  myCart.items.forEach(item => {
    totalQTY += item.quantity;
    totalPrice += (item.quantity * item.price);
  });
  yourCartEl.innerText = `Your Cart (${totalQTY})`;
  orderTotalEl.innerHTML = `
      <p>Order Total</p>
      <p>$${totalPrice.toFixed(2)}</p>
  `;

  return totalPrice;
}

////////// Functions for removing items from cart ///////////

function removeCardUI(productCardImg, adjustQuantityEl) {
  productCardImg.classList.remove('selected-border');
  adjustQuantityEl.remove();
}

function removeFromCartUI(cartItem) {
  const selectedItems = document.querySelectorAll('.selected-item');
  const matchingItem = Array.from(selectedItems).find(item => {
    const itemName = item.querySelector('.selected-item-name').dataset.itemName;
    return itemName === cartItem.name;
  });

  if (matchingItem) {
    matchingItem.remove(); // Remove the item from the cart UI
    if (myCart.items.length === 0) {
      emptyCartWrapperEl.style.display = 'block';
      inCartWrapperEl.style.display = 'none';
      orderTotalContainerEl.style.display = 'none';
    }
  }
}

////////// Functions for handling cart quantities ///////////

function handleIncrement(cartItem, productCardQty) {
  //increae quantity of item in myCart
  myCart.increment(cartItem);

  // update UI
  productCardQty.innerText = cartItem.quantity;

  updateCartTotals();

  //update cart UI with information in myCart object
  const selectedItem = document.querySelector('.selected-item');

  if (selectedItem) {
    updateCart(cartItem);
  }
}

function handleDecrement(cartItem, productCardQty, productCardImg, productImgContainerEl) {
  if (cartItem.quantity > 1) {
    //decrese quantity of item in myCart
    myCart.decrement(cartItem);

    // update UI
    productCardQty.innerText = cartItem.quantity;
    updateCartTotals();

    //update cart UI with information in myCart object
    const selectedItem = document.querySelector('.selected-item');
    if (selectedItem) {
      updateCart(cartItem);
    }
  } else {
    myCart.removeProduct(cartItem);

    // Remove UI updates from product card
    const adjustQuantityEl = productImgContainerEl.querySelector('.adjust-quantity');
    removeCardUI(productCardImg, adjustQuantityEl);
    removeFromCartUI(cartItem);
    updateCartTotals();
  }
}

////////// Append product cards on page load ///////////

document.addEventListener('DOMContentLoaded', async () => {
  const products = await loadProducts();
  const gridWrapperEl = document.querySelector('.grid-wrapper');
  if (products) {
    products.forEach(product => {
      const productCard = createProductCards(product);
      // Append the created card to the grid
      gridWrapperEl.append(productCard);
      // Push all products into an array
      availableProducts.push(product);
      // // product contains the product data, while productCard is the UI component representing that product
      setupEventListeners(product, productCard);
    })
  }
})

////////// Handle order confirmed card ///////////

confirmOrderBtn.addEventListener('click', () => {
  confirmedOverlayEl.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Disable body scroll
  myCart.items.forEach(item => {
    const confiremdItem = showConfirmedItems(item);
    confirmedItemsWrapper.append(confiremdItem);
  })

  showConfirmedPrice();
})

function showConfirmedItems(item) {
  const confirmedItem = document.createElement('div');
  confirmedItem.classList.add('confirmed-item');
  confirmedItem.innerHTML = `
    <img src="${item.image.thumbnail}" alt="">
    <div class="confirmed-name-price-wrapper">
        <p class="confirmed-item-name">${item.name}</p>
        <p>
          <span class="confirmed-item-quantity">${item.quantity}x</span>
          <span class="confirmed-item-price"><span>@</span> $${item.price.toFixed(2)}</span>
        </p>
    </div>
    <div class="confirmed-total-price">
      <p>$${(item.quantity + item.price).toFixed(2)}</p>
    </div>
  `
  return confirmedItem;
}

function showConfirmedPrice() {
  totalPrice = updateCartTotals();
  confirmedTotalEl.innerHTML = `
    <p>Order Total</p>
    <p>$${totalPrice.toFixed(2)}</p>
`
}

// Refresh when new order btn is clicked
newOrderBtn.addEventListener('click', () => {
  location.reload();
})

