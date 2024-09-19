const gridWrapperEl = document.querySelector('.grid-wrapper');
const productImg = document.querySelector('.product-card img');


const decrementBtn = document.querySelector('.decrement');
const incrementBtn = document.querySelector('.increment');
const itemQuantityDisplay = document.querySelector('.item-quantity');
let itemQuantity;

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
    try {
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
            <div class="adjust-quantity">
              <button class="decrement">
                <img src="assets/images/icon-decrement-quantity.svg" alt="decrement quantity">
              </button>
              <span class="item-quantity">0</span>
              <button class="increment">
                <img src="assets/images/icon-increment-quantity.svg" alt="increment quantity">
              </button>
            </div>
        </div>
        <div class="product-info">
          <p class="category">${category}</p>
          <h2 class="product-name">${name}</h2>
          <p class="price">$${price.toFixed(2)}</p>
        </div>
        `
        gridWrapperEl.append(productCard);

        const addToCartBtns = productCard.querySelectorAll('.add-to-cart');
        const adjustQuantityDivs = productCard.querySelectorAll('.adjust-quantity')


        addToCartBtns.forEach(addBtn => {
            addBtn.addEventListener('click', () => {
                addBtn.style.display = 'none';

                adjustQuantityDivs.forEach(adjustDiv => {
                    adjustDiv.style.display = 'flex';
                })
            });
        })

    } catch (err) {
        console.log(err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const products = await loadProducts();
    products.forEach(product => {
        createProductCards(product);
    });
});

// addToCartBtnHard.addEventListener('click', () => {
//     addToCartBtn.style.display = 'none';
//     adjustQuantityBtn.style.display = 'flex';
//     productImg.classList.add('selected-border');
//     itemQuantity = 1;
//     itemQuantityDisplay.innerText = itemQuantity;
// });

// incrementBtn.addEventListener('click', () => {
//     itemQuantity += 1;
//     itemQuantityDisplay.innerText = itemQuantity;
// })

// decrementBtn.addEventListener('click', () => {
//     if (itemQuantity > + 1) {
//         itemQuantity -= 1;
//         itemQuantityDisplay.innerText = itemQuantity;
//     } else {
//         addToCartBtn.style.display = 'flex';
//         adjustQuantityBtn.style.display = 'none';
//         productImg.classList.remove('selected-border');
//         itemQuantity = 0;
//         itemQuantityDisplay.innerText = itemQuantity;
//     }
// })
