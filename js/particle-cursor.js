// ========================================
// PARTICLE CURSOR EFFECT
// Custom cursor với particle trail effect
// ========================================

class ParticleCursor {
    constructor() {
        this.particles = [];
        this.maxParticles = 30;
        this.canvas = null;
        this.ctx = null;
        this.mouse = { x: 0, y: 0 };
        this.colors = ['#0066FF', '#00D4FF', '#9333EA', '#EC4899'];
        this.init();
    }

    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-cursor';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        `;
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        // Event listeners
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Start animation
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    onMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        // Create new particle
        this.createParticle(e.clientX, e.clientY);
    }

    createParticle(x, y) {
        if (this.particles.length >= this.maxParticles) {
            this.particles.shift(); // Remove oldest particle
        }

        const particle = {
            x: x,
            y: y,
            size: Math.random() * 5 + 2,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            alpha: 1,
            decay: Math.random() * 0.02 + 0.02
        };

        this.particles.push(particle);
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            p.alpha -= p.decay;

            // Remove dead particles
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            // Add glow effect
            this.ctx.save();
            this.ctx.globalAlpha = p.alpha * 0.5;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.canvas) {
            this.canvas.remove();
        }
    }
}

// Custom cursor styles
class CustomCursor {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.init();
    }

    init() {
        // Create cursor elements
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';

        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'custom-cursor-dot';

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorDot);

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';

            this.cursorDot.style.left = e.clientX + 'px';
            this.cursorDot.style.top = e.clientY + 'px';
        });

        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .filter-btn');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                this.cursorDot.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.cursorDot.classList.remove('hover');
            });
        });

        // Hide default cursor
        document.body.style.cursor = 'none';
        document.querySelectorAll('a, button, input, textarea').forEach(el => {
            el.style.cursor = 'none';
        });
    }
}

// Add cursor styles
const cursorStyles = document.createElement('style');
cursorStyles.textContent = `
    .custom-cursor {
        position: fixed;
        width: 40px;
        height: 40px;
        border: 2px solid rgba(0, 102, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
        mix-blend-mode: difference;
    }

    .custom-cursor.hover {
        width: 60px;
        height: 60px;
        border-color: rgba(0, 212, 255, 0.8);
    }

    .custom-cursor-dot {
        position: fixed;
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #0066FF, #00D4FF);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
        transition: transform 0.2s ease;
        box-shadow: 0 0 10px rgba(0, 102, 255, 0.5);
    }

    .custom-cursor-dot.hover {
        transform: translate(-50%, -50%) scale(1.5);
    }

    /* Hide custom cursor on mobile */
    @media (max-width: 768px), (hover: none) {
        .custom-cursor,
        .custom-cursor-dot,
        #particle-cursor {
            display: none !important;
        }
        
        body, a, button, input, textarea {
            cursor: auto !important;
        }
    }
`;
document.head.appendChild(cursorStyles);

// Initialize cursor effects
if (window.innerWidth > 768 && CONFIG.features.particleCursor) {
    window.addEventListener('load', () => {
        new ParticleCursor();
        new CustomCursor();
    });
}
