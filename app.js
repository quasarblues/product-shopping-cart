const inCartWrapperEl = document.querySelector('.incart-wrapper');
const emptyCartWrapperEl = document.querySelector('.empty-cart-wrapper');

const orderTotalContainerEl = document.querySelector('.order-total-container');


let availableProducts = [] // push all products into an array


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

// Set up event listeners
function setupEventListeners(product, productCard) {
  const addBtn = productCard.querySelector('.add-to-cart');
  const productCardImg = productCard.querySelector('.product-image-container img');
  const productImgContainerEl = productCard.querySelector('.product-image-container');

  addBtn.addEventListener('click', () => {
    addtoCart(product.name, productCardImg, productImgContainerEl);
  })
}

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

function addtoCart(name, productCardImg, productImgContainerEl) {
  const foundProduct = availableProducts.find(product => product.name === name);
  const cartItem = {
    ...foundProduct,
    quantity: 1,
  }

  myCart.addProduct(cartItem);
  setCardUI(productCardImg, cartItem, productImgContainerEl);
  renderCart(cartItem);
  updateCartTotals();
}

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

function renderCart(cartItem) {
  emptyCartWrapperEl.style.display = 'none';
  inCartWrapperEl.style.display = 'grid';
  orderTotalContainerEl.style.display = 'flex';

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
  `
}

document.addEventListener('DOMContentLoaded', async () => {
  const products = await loadProducts();
  const gridWrapperEl = document.querySelector('.grid-wrapper');
  if (products) {
    products.forEach(product => {
      const productCard = createProductCards(product);
      gridWrapperEl.append(productCard); // Append the created card to the grid
      availableProducts.push(product); // Push all products into an array
      setupEventListeners(product, productCard);
    })
  }
})



