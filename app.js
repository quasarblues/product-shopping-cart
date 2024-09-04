const menuContainerEl = document.querySelector('.menu-container');

const addToCartBtn = document.querySelector('.add-to-cart');

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
        productCard.classList.add('product-card')
        productCard.innerHTML = `
        <div class="product-card">
        <div class="product-image-container">
          <img class="mobile-img" src="${image.mobile}" alt="product image">
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
        menuContainerEl.append(productCard);

    } catch (err) {
        console.log(err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const products = await loadProducts();
    products.forEach(product => {
        createProductCards(product);
    });
})

addToCartBtn.addEventListener('click', () => {
    addToCartBtn.style.backgroundColor = 'red';
    addToCartBtn.style.color = '#fff';
})