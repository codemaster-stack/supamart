// cart.js - Supamart Cart Management

const Cart = {
  // Get cart from localStorage
  getCart() {
    return JSON.parse(localStorage.getItem('supamart_cart') || '[]');
  },

  // Save cart to localStorage
  saveCart(cart) {
    localStorage.setItem('supamart_cart', JSON.stringify(cart));
    this.updateCartCount();
  },

  // Add item to cart
  addItem(product) {
    const cart = this.getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity += 1;
      } else {
        showCartNotification('Maximum stock reached', 'error');
        return;
      }
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        image: product.image,
        storeName: product.storeName,
        stock: product.stock,
        quantity: 1
      });
    }

    this.saveCart(cart);
    showCartNotification(`${product.name} added to cart!`, 'success');
  },

  // Remove item from cart
  removeItem(productId) {
    const cart = this.getCart().filter(item => item.id !== productId);
    this.saveCart(cart);
  },

  // Update item quantity
  updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
        return;
      }
      if (quantity > item.stock) quantity = item.stock;
      item.quantity = quantity;
      this.saveCart(cart);
    }
  },

  // Clear cart
  clearCart() {
    localStorage.removeItem('supamart_cart');
    this.updateCartCount();
  },

  // Get total items count
  getCount() {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  },

  // Get total price
  getTotal() {
    return this.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  // Update cart count badge on all pages
  updateCartCount() {
    const count = this.getCount();
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  // Build WhatsApp order message
  buildWhatsAppMessage() {
    const cart = this.getCart();
    if (cart.length === 0) return '';

    let message = 'Hello Supamart, I would like to place an order:%0A%0A';
    cart.forEach((item, i) => {
      message += `${i + 1}. ${encodeURIComponent(item.name)}%0A`;
      message += `   Store: ${encodeURIComponent(item.storeName)}%0A`;
      message += `   Price: ${item.currency} ${item.price} x ${item.quantity}%0A`;
      message += `   Subtotal: ${item.currency} ${(item.price * item.quantity).toLocaleString()}%0A%0A`;
    });

    const total = this.getTotal();
    const currency = cart[0]?.currency || 'NGN';
    message += `Total: ${currency} ${total.toLocaleString()}%0A%0APlease assist me to complete this order.`;

    return message;
  }
};

// Show notification toast
function showCartNotification(message, type = 'success') {
  const existing = document.querySelector('.cart-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: ${type === 'success' ? '#25D366' : '#e8491d'};
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Add to cart button helper (call from product pages)
function addToCart(productId, name, price, currency, image, storeName, stock) {
  Cart.addItem({ id: productId, name, price, currency, image, storeName, stock });
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateCartCount();
});

// Make globally available
window.Cart = Cart;
window.addToCart = addToCart;
window.showCartNotification = showCartNotification;