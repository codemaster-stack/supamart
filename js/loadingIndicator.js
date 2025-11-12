// js/loadingIndicator.js - Reusable Loading Indicator

class LoadingIndicator {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        // Create overlay element
        this.overlay = document.createElement('div');
        this.overlay.className = 'loading-overlay';
        this.overlay.innerHTML = `
            <div class="loading-spinner">
             <img src="../assets/images/logo.png" class="spinner-logo" alt="Supamart Logo">
             <p class="loading-text">Loading...</p>
           </div>
        `;
        
        // Add styles
        this.addStyles();
        
        // Append to body
        document.body.appendChild(this.overlay);
    }

    addStyles() {
        if (document.getElementById('loading-indicator-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'loading-indicator-styles';
        style.textContent = `
            .loading-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 9999;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(5px);
            }

            .loading-overlay.active {
                display: flex;
            }

            .loading-spinner {
                text-align: center;
                background: white;
                padding: 30px 40px;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            }
           
            .spinner-logo {
             width: 60px;           /* adjust to your logo size */
             height: auto;          /* keeps aspect ratio */
             margin: 0 auto 15px;
             display: block;
             animation: pulse 1s ease-in-out infinite;
            }

            @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
             }

            .loading-text {
                margin: 0;
                color: #333;
                font-size: 16px;
                font-weight: 500;
            }

            /* Button loading state */
            .btn-loading {
                position: relative;
                pointer-events: none;
                opacity: 0.7;
            }

            .btn-loading::after {
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                top: 50%;
                left: 50%;
                margin-left: -8px;
                margin-top: -8px;
                border: 2px solid #ffffff;
                border-top-color: transparent;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }
        `;
        document.head.appendChild(style);
    }

    show(message = 'Loading...') {
        const textElement = this.overlay.querySelector('.loading-text');
        if (textElement) {
            textElement.textContent = message;
        }
        this.overlay.classList.add('active');
    }

    hide() {
        this.overlay.classList.remove('active');
    }

    // Button-specific loading
    setButtonLoading(button, loading = true, originalText = null) {
        if (loading) {
            button.dataset.originalText = button.textContent;
            button.disabled = true;
            button.classList.add('btn-loading');
            button.textContent = originalText || 'Processing...';
        } else {
            button.disabled = false;
            button.classList.remove('btn-loading');
            button.textContent = button.dataset.originalText || originalText || 'Submit';
        }
    }
}

// Create global instance
const loadingIndicator = new LoadingIndicator();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoadingIndicator;
}