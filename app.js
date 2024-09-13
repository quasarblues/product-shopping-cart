const gridWrapperEl = document.querySelector('.grid-wrapper');
const addToCartBtn = document.querySelector('.add-to-cart');
const productImg = document.querySelector('.product-card img');

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
        let imgSrc;
        if (window.innerWidth < 600) {
            imgSrc = image.mobile;
        } else if (window.innerWidth >= 1000) {
            imgSrc = image.desktop;
        } else {
            imgSrc = image.tablet;
        }
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
        <div class="product-card">
        <div class="product-image-container">
          <img src="${imgSrc}" alt="product image">
          <button class="add-to-cart">
            <img src="assets/images/icon-add-to-cart.svg" alt="add to cart">
            Add to Cart</button>
        </div>
        <div class="product-info">
          <p class="category">${category}</p>
          <h2 class="product-name">${name}</h2>
          <p class="price">$${price.toFixed(2)}</p>
        </div>
      </div>
        `
        gridWrapperEl.append(productCard);

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

window.addEventListener('resize', () => {
    let imgSrc;
    if (window.innerWidth < 600) {
        imgSrc = image.mobile;
    } else if (window.innerWidth >= 1000) {
        imgSrc = image.desktop;
    } else {
        imgSrc = image.tablet;
    }
})

// addToCartBtn.addEventListener('click', () => {
//     addToCartBtn.style.backgroundColor = 'red';
//     addToCartBtn.style.color = '#fff';
// })