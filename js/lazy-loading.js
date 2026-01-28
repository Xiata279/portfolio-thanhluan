// ========================================
// LAZY LOADING IMAGES
// Tối ưu hóa tải ảnh để tăng performance
// ========================================

class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.observer = null;
        this.init();
    }

    init() {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                }
            );

            this.images.forEach(img => this.observer.observe(img));
        } else {
            // Fallback for older browsers
            this.images.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        // Show loading placeholder
        img.classList.add('loading');

        // Create a new image to preload
        const tempImg = new Image();

        tempImg.onload = () => {
            // Replace placeholder with actual image
            img.src = img.dataset.src;
            img.removeAttribute('data-src');

            // Add loaded class for fade-in animation
            setTimeout(() => {
                img.classList.remove('loading');
                img.classList.add('loaded');
            }, 100);
        };

        tempImg.onerror = () => {
            console.error(`Failed to load image: ${img.dataset.src}`);
            img.classList.remove('loading');
            img.classList.add('error');
            // Set fallback image
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%230A192F" width="400" height="300"/%3E%3Ctext fill="%238892B0" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
        };

        // Start loading
        tempImg.src = img.dataset.src;
    }

    // Method to manually load all images (for print, etc.)
    loadAll() {
        this.images.forEach(img => {
            if (img.dataset.src) {
                this.loadImage(img);
            }
        });
    }
}

// Progressive image loading with blur effect
class ProgressiveImage {
    constructor(container) {
        this.container = container;
        this.lowRes = container.querySelector('.img-low-res');
        this.highRes = container.querySelector('.img-high-res');
        this.init();
    }

    init() {
        if (!this.lowRes || !this.highRes) return;

        // Load low-res first (already in HTML)
        this.lowRes.classList.add('loaded');

        // Then load high-res
        const img = new Image();
        img.onload = () => {
            this.highRes.src = this.highRes.dataset.src;
            this.highRes.classList.add('loaded');

            // Hide low-res after high-res is loaded
            setTimeout(() => {
                this.lowRes.style.opacity = '0';
            }, 300);
        };
        img.src = this.highRes.dataset.src;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize lazy loading
    const lazyLoader = new LazyLoader();

    // Initialize progressive images
    document.querySelectorAll('.progressive-image').forEach(container => {
        new ProgressiveImage(container);
    });

    // Load all images before printing
    window.addEventListener('beforeprint', () => {
        lazyLoader.loadAll();
    });
});

// Add CSS for loading states
const style = document.createElement('style');
style.textContent = `
    img[data-src] {
        background: linear-gradient(90deg, 
            rgba(0, 102, 255, 0.1) 0%, 
            rgba(0, 212, 255, 0.1) 50%, 
            rgba(0, 102, 255, 0.1) 100%);
        background-size: 200% 100%;
        min-height: 200px;
    }

    img.loading {
        animation: imageShimmer 1.5s ease-in-out infinite;
    }

    img.loaded {
        animation: fadeIn 0.5s ease-in;
    }

    img.error {
        opacity: 0.5;
        filter: grayscale(100%);
    }

    @keyframes imageShimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    /* Progressive image styles */
    .progressive-image {
        position: relative;
        overflow: hidden;
    }

    .img-low-res {
        filter: blur(10px);
        transform: scale(1.1);
        transition: opacity 0.3s ease;
    }

    .img-high-res {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 0.5s ease;
    }

    .img-high-res.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);
