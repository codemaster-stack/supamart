document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('header nav ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }

 async function loadProducts() {
    const main = document.querySelector('main');
    if (!main) return;

    try {
        const response = await fetch('https://api-supamart.onrender.com/api/products');
        const result = await response.json();

        let section = document.querySelector('.product-list');
        if (!section) {
            section = document.createElement('section');
            section.className = 'product-list';
            main.appendChild(section);
        }

        if (!result.success || result.products.length === 0) {
            section.innerHTML = '<p style="text-align:center;">No products available yet.</p>';
            return;
        }

        section.innerHTML = result.products.map(product => `
            <div class="product">
                <img src="${product.images[0]?.url || ''}" alt="${product.name}" style="width:100%;height:200px;object-fit:cover;">
                <h3>${product.name}</h3>
                <p>${product.price.currency} ${product.price.amount}</p>
                <p>${product.sellerId?.storeName || ''}</p>
                <button onclick="window.location.href='/product-detail.html?id=${product._id}'">View Details</button>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading products:', error);
    }
}

loadProducts();

    // Shop Now button scroll
    const shopNowBtn = document.getElementById('shopNowBtn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', () => {
            const productSection = document.querySelector('.product-list');
            if(productSection) {
                window.scrollTo({ top: productSection.offsetTop, behavior:'smooth' });
            }
        });
    }
});