// Background effects - cosmic theme

class BackgroundEffects {
    constructor() {
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        this.createStars();
        this.createGradientOrbs();
        this.createVignette();

        // Bỏ các lớp nặng/động khi người dùng muốn giảm chuyển động
        if (this.reducedMotion) return;

        this.createNebulaClouds();
        this.createAuroraWaves();
        this.createLightBeams();
        this.createCosmicDust();
        this.createGridLines();
        this.createNoiseOverlay();
        this.createFloatingParticles();
        this.initSpotlight();
        this.initShootingStars();
    }

    createStars() {
        const container = document.createElement('div');
        container.className = 'stars-background';

        const starSizes = ['small', 'medium', 'large'];
        const starColors = ['', 'cosmic-cyan', 'cosmic-purple', 'cosmic-pink'];
        const count = this.reducedMotion ? 30 : 60;

        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            const size = starSizes[Math.floor(Math.random() * starSizes.length)];
            const color = starColors[Math.floor(Math.random() * starColors.length)];
            star.className = `star ${size} ${color}`.trim();
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
            { class: 'orb-3' },
            { class: 'orb-4' },
            { class: 'orb-5' }
        ];

        orbs.forEach(orbData => {
            const orb = document.createElement('div');
            orb.className = `gradient-orb ${orbData.class}`;
            document.body.appendChild(orb);
        });
    }

    createNebulaClouds() {
        for (let i = 1; i <= 4; i++) {
            const nebula = document.createElement('div');
            nebula.className = `nebula-cloud nebula-${i}`;
            document.body.appendChild(nebula);
        }
    }

    createAuroraWaves() {
        for (let i = 1; i <= 3; i++) {
            const aurora = document.createElement('div');
            aurora.className = `aurora-wave aurora-${i}`;
            document.body.appendChild(aurora);
        }
    }

    createLightBeams() {
        for (let i = 1; i <= 4; i++) {
            const beam = document.createElement('div');
            beam.className = `light-beam beam-${i}`;
            document.body.appendChild(beam);
        }
    }

    createCosmicDust() {
        for (let i = 1; i <= 3; i++) {
            const dust = document.createElement('div');
            dust.className = `cosmic-dust dust-${i}`;
            document.body.appendChild(dust);
        }
    }

    initShootingStars() {
        // Spawn shooting stars randomly
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every interval
                this.createShootingStar();
            }
        }, 3000); // Check every 3 seconds
    }

    createShootingStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';

        // Random starting position (top area)
        star.style.top = Math.random() * 30 + '%';
        star.style.left = Math.random() * 100 + '%';

        // Random animation duration
        const duration = 1 + Math.random() * 1; // 1-2 seconds
        star.style.animation = `shootingStar ${duration}s ease-out`;

        document.body.appendChild(star);

        // Remove after animation
        setTimeout(() => {
            star.remove();
        }, duration * 1000);
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

    createNoiseOverlay() {
        const noise = document.createElement('div');
        noise.className = 'noise-overlay';
        document.body.appendChild(noise);
    }

    createFloatingParticles() {
        const container = document.createElement('div');
        container.className = 'floating-particles';

        for (let i = 0; i < 14; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            container.appendChild(particle);
        }

        document.body.appendChild(container);
    }

    initSpotlight() {
        const spotlight = document.createElement('div');
        spotlight.className = 'spotlight';
        document.body.appendChild(spotlight);

        // Throttle bằng requestAnimationFrame để tránh cập nhật quá nhiều lần/frame
        let pending = false;
        let lastX = 50, lastY = 50;
        document.addEventListener('mousemove', (e) => {
            lastX = (e.clientX / window.innerWidth) * 100;
            lastY = (e.clientY / window.innerHeight) * 100;
            if (pending) return;
            pending = true;
            requestAnimationFrame(() => {
                spotlight.style.setProperty('--mouse-x', lastX + '%');
                spotlight.style.setProperty('--mouse-y', lastY + '%');
                pending = false;
            });
        }, { passive: true });
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
