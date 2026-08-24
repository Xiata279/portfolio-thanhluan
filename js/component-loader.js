// ========================================
// COMPONENT LOADER
// Load navbar and footer into pages
// ========================================

class ComponentLoader {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadNavbar();
        await this.loadFooter();
        this.setActiveNavLink();
        this.initMobileMenu();
    }

    async loadNavbar() {
        try {
            const path = this.componentPath('navbar.html');
            const response = await fetch(path);
            if (!response.ok) throw new Error(response.statusText);
            const html = await response.text();
            document.body.insertAdjacentHTML('afterbegin', html);
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }

    async loadFooter() {
        try {
            const path = this.componentPath('footer.html');
            const response = await fetch(path);
            if (!response.ok) throw new Error(response.statusText);
            const html = await response.text();
            document.body.insertAdjacentHTML('beforeend', html);
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }

    componentPath(file) {
        const inPages = window.location.pathname.includes('/pages/');
        return inPages ? `../components/${file}` : `components/${file}`;
    }

    setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            // Check if current page matches link
            if (href === currentPage ||
                (currentPage === '' && href === '../index.html') ||
                (currentPage === 'index.html' && href === '../index.html')) {
                link.classList.add('active');
            }
        });
    }

    initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }
}

// Initialize component loader when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ComponentLoader();
    });
} else {
    new ComponentLoader();
}
