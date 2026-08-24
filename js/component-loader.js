// ========================================
// COMPONENT LOADER
// Nạp navbar/footer dùng chung và gắn hành vi UI sau khi inject
// Dùng cho index.html (root), pages/*.html và blog-*.html (root)
// ========================================

class ComponentLoader {
    constructor() {
        this.inPages = window.location.pathname.includes('/pages/');
        this.init();
    }

    async init() {
        await this.loadNavbar();
        await this.loadFooter();
        this.fixInternalLinks();
        this.setActiveNavLink();
        this.initMobileMenu();
        this.initNavbarScroll();
        this.initScrollTop();
    }

    async loadNavbar() {
        try {
            const response = await fetch(this.componentPath('navbar.html'));
            if (!response.ok) throw new Error(response.statusText);
            document.body.insertAdjacentHTML('afterbegin', await response.text());
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }

    async loadFooter() {
        try {
            const response = await fetch(this.componentPath('footer.html'));
            if (!response.ok) throw new Error(response.statusText);
            document.body.insertAdjacentHTML('beforeend', await response.text());
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }

    componentPath(file) {
        return this.inPages ? `../components/${file}` : `components/${file}`;
    }

    // Link trong component viết theo gốc repo (index.html, pages/xxx.html).
    // Khi trang đang ở /pages/, thêm ../ để trỏ đúng.
    fixInternalLinks() {
        if (!this.inPages) return;

        document.querySelectorAll('.navbar a[href], .footer a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            if (/^(https?:|mailto:|tel:|#)/i.test(href)) return;
            if (href.startsWith('../')) return;
            link.setAttribute('href', '../' + href);
        });
    }

    // Xác định trang hiện tại để bật trạng thái active đúng mục điều hướng.
    setActiveNavLink() {
        const page = window.location.pathname.split('/').pop() || 'index.html';

        let currentKey = 'index.html';
        if (page.startsWith('blog')) {
            currentKey = 'blog.html';
        } else if (page && page !== '' && page !== 'index.html') {
            currentKey = page;
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const target = (link.getAttribute('href') || '').split('/').pop();
            if (target === currentKey) {
                link.classList.add('active');
            }
        });
    }

    initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        const onScroll = () => {
            navbar.classList.toggle('scrolled', window.pageYOffset > 50);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    initScrollTop() {
        const btn = document.getElementById('scroll-top');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.classList.toggle('show', window.pageYOffset > 300);
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ComponentLoader());
} else {
    new ComponentLoader();
}
