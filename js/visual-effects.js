// ========================================
// CUSTOM VISUAL EFFECTS - GUNS.LOL STYLE
// Click ripples, parallax, and smooth interactions
// ========================================

class VisualEffects {
    constructor() {
        this.init();
    }

    init() {
        this.addClickRipples();
        this.addSmoothScroll();
        this.addParallaxEffect();
        this.addHoverGlow();
    }

    // Click ripple effect
    addClickRipples() {
        document.addEventListener('click', (e) => {
            this.createRipple(e.pageX, e.pageY);
        });
    }

    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        document.body.appendChild(ripple);

        setTimeout(() => ripple.remove(), 1000);
    }

    // Smooth momentum scrolling
    addSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Parallax scroll effect for hero section
    addParallaxEffect() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateParallax(heroSection);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateParallax(element) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;

        // Only apply parallax when hero is visible
        if (scrolled < window.innerHeight) {
            element.style.transform = `translateY(${rate}px)`;
            element.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    }

    // Hover glow effect for interactive elements
    addHoverGlow() {
        const glowElements = document.querySelectorAll('.project-card, .blog-card, .achievement-card, .btn');

        glowElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.updateGlow(element, e);
            });

            element.addEventListener('mouseleave', () => {
                this.removeGlow(element);
            });
        });
    }

    updateGlow(element, e) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        element.style.setProperty('--mouse-x', `${x}px`);
        element.style.setProperty('--mouse-y', `${y}px`);
    }

    removeGlow(element) {
        element.style.removeProperty('--mouse-x');
        element.style.removeProperty('--mouse-y');
    }
}

// Add visual effects styles
const effectsStyles = document.createElement('style');
effectsStyles.textContent = `
    /* Click ripple effect */
    .click-ripple {
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, 
            rgba(0, 212, 255, 0.6) 0%, 
            rgba(0, 102, 255, 0.3) 50%, 
            transparent 100%);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9998;
        animation: rippleExpand 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes rippleExpand {
        0% {
            width: 20px;
            height: 20px;
            opacity: 1;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }

    /* Smooth scroll indicator */
    html {
        scroll-behavior: smooth;
    }

    /* Parallax container */
    .hero {
        will-change: transform, opacity;
        transition: transform 0.1s ease-out, opacity 0.1s ease-out;
    }

    /* Hover glow effect using CSS variables */
    .project-card,
    .blog-card,
    .achievement-card {
        position: relative;
    }

    .project-card::before,
    .blog-card::before,
    .achievement-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        background: radial-gradient(
            600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(0, 212, 255, 0.15) 0%,
            transparent 40%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 1;
    }

    .project-card:hover::before,
    .blog-card:hover::before,
    .achievement-card:hover::before {
        opacity: 1;
    }

    /* Ensure content is above the glow */
    .project-card > *,
    .blog-card > *,
    .achievement-card > * {
        position: relative;
        z-index: 2;
    }

    /* Scroll progress indicator */
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #0066FF, #00D4FF);
        z-index: 900;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
    }

    /* Floating animation for elements */
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    .float-animation {
        animation: float 3s ease-in-out infinite;
    }

    /* Fade in on scroll */
    .fade-in-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .fade-in-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* Magnetic button effect */
    .magnetic-btn {
        transition: transform 0.2s ease;
    }

    /* Glitch effect on hover (optional, subtle) */
    @keyframes glitch {
        0%, 100% {
            transform: translate(0);
        }
        20% {
            transform: translate(-2px, 2px);
        }
        40% {
            transform: translate(-2px, -2px);
        }
        60% {
            transform: translate(2px, 2px);
        }
        80% {
            transform: translate(2px, -2px);
        }
    }

    /* Neon glow pulse */
    @keyframes neonPulse {
        0%, 100% {
            box-shadow: 
                0 0 5px rgba(0, 212, 255, 0.5),
                0 0 10px rgba(0, 212, 255, 0.3);
        }
        50% {
            box-shadow: 
                0 0 10px rgba(0, 212, 255, 0.8),
                0 0 20px rgba(0, 212, 255, 0.5),
                0 0 30px rgba(0, 102, 255, 0.3);
        }
    }

    .neon-pulse {
        animation: neonPulse 2s ease-in-out infinite;
    }

    /* Performance optimizations */
    .project-card,
    .blog-card,
    .achievement-card,
    .hero {
        will-change: transform;
    }

    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        .click-ripple,
        .float-animation,
        .neon-pulse {
            animation: none !important;
        }
        
        html {
            scroll-behavior: auto;
        }
    }
`;
document.head.appendChild(effectsStyles);

// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Fade in on scroll observer
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe elements for fade-in
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.project-card, .blog-card, .achievement-card, .skill-item')
        .forEach(el => {
            el.classList.add('fade-in-scroll');
            fadeObserver.observe(el);
        });
});

// Initialize visual effects
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new VisualEffects();
    });
} else {
    new VisualEffects();
}
