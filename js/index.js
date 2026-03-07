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
    try {
        const response = await fetch('https://api-supamart.onrender.com/api/products');
        const result = await response.json();

        const grid = document.querySelector('.product-grid');
        if (!grid) return;

        if (!result.success || result.products.length === 0) {
            grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;">No products available yet.</p>';
            return;
        }

        grid.innerHTML = result.products.map(product => `
            <div class="product-card">
                <img src="${product.images[0]?.url || ''}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price.currency} ${product.price.amount}</p>
                <a href="/product-detail.html?id=${product._id}" class="btn-small">View Details</a>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading products:', error);
    }
}

loadProducts();

loadProducts();

    function handleSearchEnter(event) {
        if (event.key === 'Enter') performSearch();
    }

    async function performSearch() {
        const query = document.getElementById('search-input').value.trim();
        if (!query) {
            loadProducts();
            return;
        }

        try {
            const response = await fetch(`https://api-supamart.onrender.com/api/products?search=${encodeURIComponent(query)}`);
            const result = await response.json();

            const grid = document.querySelector('.product-grid');
            if (!grid) return;

            if (!result.success || result.products.length === 0) {
                grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;">No products found.</p>';
                return;
            }

            grid.innerHTML = result.products.map(product => `
                <div class="product-card">
                    <img src="${product.images[0]?.url || ''}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price.currency} ${product.price.amount}</p>
                    <a href="/product-detail.html?id=${product._id}" class="btn-small">View Details</a>
                </div>
            `).join('');

            document.getElementById('featured-products').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Search error:', error);
        }
    }

    window.handleSearchEnter = handleSearchEnter;
    window.performSearch = performSearch;


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


    // Newsletter subscription
    document.querySelector('.newsletter-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const btn = e.target.querySelector('button');
        btn.disabled = true;
        btn.textContent = 'Subscribing...';

        try {
            const res = await fetch('https://api-supamart.onrender.com/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const result = await res.json();
            alert(result.message);
            e.target.reset();
        } catch (err) {
            alert('Failed to subscribe. Try again.');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Subscribe';
        }
    });

}); 
