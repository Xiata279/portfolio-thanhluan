// ========================================
// BACKGROUND EFFECTS INITIALIZER
// Khởi tạo các hiệu ứng nền động
// ========================================

class BackgroundEffects {
    constructor() {
        this.init();
    }

    init() {
        this.createStars();
        this.createGradientOrbs();
        this.createGridLines();
        this.createVignette();
        this.initSpotlight();
    }

    createStars() {
        const container = document.createElement('div');
        container.className = 'stars-background';

        // Create 50 random stars
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(star);
        }

        document.body.appendChild(container);
    }

    createGradientOrbs() {
        const orbs = [
            { class: 'orb-1' },
            { class: 'orb-2' },
            { class: 'orb-3' }
        ];

        orbs.forEach(orbData => {
            const orb = document.createElement('div');
            orb.className = `gradient-orb ${orbData.class}`;
            document.body.appendChild(orb);
        });
    }

    createGridLines() {
        const grid = document.createElement('div');
        grid.className = 'grid-lines';
        document.body.appendChild(grid);
    }

    createVignette() {
        const vignette = document.createElement('div');
        vignette.className = 'vignette';
        document.body.appendChild(vignette);
    }

    initSpotlight() {
        const spotlight = document.createElement('div');
        spotlight.className = 'spotlight';
        document.body.appendChild(spotlight);

        // Track mouse position for spotlight
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            spotlight.style.setProperty('--mouse-x', x + '%');
            spotlight.style.setProperty('--mouse-y', y + '%');
        });
    }
}

// Initialize background effects when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BackgroundEffects();
    });
} else {
    new BackgroundEffects();
}
