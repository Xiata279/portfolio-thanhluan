// ========================================
// IMMERSIVE MODE TOGGLE - GUNS.LOL STYLE
// Switch between standard and immersive experience
// ========================================

class ImmersiveMode {
    constructor() {
        // Disabled - functionality moved to ThemeManager
    }

    init() {
        this.createToggle();
        this.attachEventListeners();

        // Apply saved preference
        if (this.isImmersive) {
            this.enableImmersive();
        }
    }

    createToggle() {
        this.toggle = document.createElement('button');
        this.toggle.className = 'immersive-toggle';
        this.toggle.innerHTML = `
            <div class="toggle-icon">
                <i class="fas fa-moon"></i>
            </div>
            <span class="toggle-text">Chế độ Immersive</span>
        `;
        this.toggle.title = 'Bật/tắt chế độ Immersive';

        document.body.appendChild(this.toggle);
    }

    attachEventListeners() {
        this.toggle.addEventListener('click', () => this.toggleMode());

        // Keyboard shortcut: Ctrl/Cmd + I
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault();
                this.toggleMode();
            }
        });
    }

    toggleMode() {
        if (this.isImmersive) {
            this.disableImmersive();
        } else {
            this.enableImmersive();
        }
    }

    enableImmersive() {
        this.isImmersive = true;
        document.body.classList.add('immersive-mode');

        // Update toggle UI
        this.toggle.classList.add('active');
        const icon = this.toggle.querySelector('.toggle-icon i');
        icon.className = 'fas fa-sun';

        // Add immersive overlay
        this.addImmersiveOverlay();

        // Intensify particle effects if available
        this.intensifyParticles();

        this.savePreference();
        this.showNotification('Chế độ Immersive đã bật', 'success');
    }

    disableImmersive() {
        this.isImmersive = false;
        document.body.classList.remove('immersive-mode');

        // Update toggle UI
        this.toggle.classList.remove('active');
        const icon = this.toggle.querySelector('.toggle-icon i');
        icon.className = 'fas fa-moon';

        // Remove immersive overlay
        this.removeImmersiveOverlay();

        // Reset particle effects
        this.resetParticles();

        this.savePreference();
        this.showNotification('Chế độ Immersive đã tắt', 'info');
    }

    addImmersiveOverlay() {
        if (document.querySelector('.immersive-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'immersive-overlay';
        overlay.innerHTML = `
            <div class="immersive-particles">
                ${this.generateParticles(20)}
            </div>
        `;

        document.body.prepend(overlay);

        setTimeout(() => overlay.classList.add('active'), 100);
    }

    removeImmersiveOverlay() {
        const overlay = document.querySelector('.immersive-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 600);
        }
    }

    generateParticles(count) {
        let html = '';
        for (let i = 0; i < count; i++) {
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;

            html += `<div class="particle" style="
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            "></div>`;
        }
        return html;
    }

    intensifyParticles() {
        // If particle cursor exists, increase count
        const particleCanvas = document.querySelector('canvas');
        if (particleCanvas) {
            particleCanvas.style.opacity = '1';
        }
    }

    resetParticles() {
        const particleCanvas = document.querySelector('canvas');
        if (particleCanvas) {
            particleCanvas.style.opacity = '0.6';
        }
    }

    loadPreference() {
        const saved = localStorage.getItem('immersiveMode');
        this.isImmersive = saved === 'true';
    }

    savePreference() {
        localStorage.setItem('immersiveMode', this.isImmersive.toString());
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `immersive-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }
}

// Styles for immersive mode
const immersiveStyles = document.createElement('style');
immersiveStyles.textContent = `
    /* Toggle button */
    .immersive-toggle {
        position: fixed;
        top: 100px;
        right: 30px;
        z-index: 1100;
        background: linear-gradient(135deg, 
            rgba(10, 25, 47, 0.85), 
            rgba(17, 34, 64, 0.85));
        backdrop-filter: blur(15px);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 50px;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #E6F1FF;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        opacity: 0.8;
    }

    .immersive-toggle:hover {
        opacity: 1;
        border-color: rgba(0, 212, 255, 0.4);
        box-shadow: 0 6px 24px rgba(0, 102, 255, 0.3);
        transform: translateY(-2px);
    }

    .immersive-toggle.active {
        background: linear-gradient(135deg, 
            rgba(0, 102, 255, 0.4), 
            rgba(0, 212, 255, 0.4));
        border-color: rgba(0, 212, 255, 0.5);
        box-shadow: 
            0 6px 24px rgba(0, 212, 255, 0.4),
            0 0 20px rgba(0, 212, 255, 0.2);
    }

    .toggle-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #00D4FF;
    }

    .immersive-toggle.active .toggle-icon {
        color: #FFD700;
    }

    /* Immersive overlay */
    .immersive-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(ellipse at center, 
            rgba(10, 25, 47, 0.3) 0%, 
            rgba(0, 0, 0, 0.6) 100%);
        pointer-events: none;
        z-index: 1;
        opacity: 0;
        transition: opacity 0.6s ease;
    }

    .immersive-overlay.active {
        opacity: 1;
    }

    /* Immersive particles */
    .immersive-particles {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .particle {
        position: absolute;
        background: radial-gradient(circle, 
            rgba(0, 212, 255, 0.6) 0%, 
            rgba(0, 102, 255, 0.2) 50%, 
            transparent 100%);
        border-radius: 50%;
        filter: blur(2px);
        animation: particleFloat linear infinite;
    }

    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(100px);
            opacity: 0;
        }
    }

    /* Immersive mode body adjustments */
    body.immersive-mode {
        background: #000000;
    }

    body.immersive-mode .hero {
        filter: brightness(1.1) contrast(1.1);
    }

    body.immersive-mode .project-card,
    body.immersive-mode .blog-card,
    body.immersive-mode .achievement-card {
        box-shadow: 
            0 12px 48px rgba(0, 102, 255, 0.3),
            0 0 40px rgba(0, 212, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    body.immersive-mode canvas {
        opacity: 1 !important;
    }

    /* Notification */
    .immersive-notification {
        position: fixed;
        top: 100px;
        right: 200px;
        z-index: 1150;
        background: linear-gradient(135deg, #0A192F, #112240);
        color: #E6F1FF;
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(0, 212, 255, 0.3);
        opacity: 0;
        transform: translateX(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .immersive-notification.show {
        opacity: 1;
        transform: translateX(0);
    }

    .immersive-notification i {
        color: #00FF41;
        font-size: 18px;
    }

    .immersive-notification.success {
        border-color: rgba(0, 255, 65, 0.3);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .immersive-toggle {
            top: 80px;
            right: 20px;
            padding: 8px 16px;
            font-size: 12px;
        }

        .toggle-text {
            display: none;
        }

        .toggle-icon {
            width: 20px;
            height: 20px;
            font-size: 14px;
        }

        .immersive-notification {
            top: 80px;
            right: 70px;
            left: 20px;
            font-size: 13px;
        }
    }

    /* Ensure content is above overlay */
    .navbar,
    .hero,
    section,
    footer {
        position: relative;
        z-index: 10;
    }
`;
document.head.appendChild(immersiveStyles);

// Initialize immersive mode
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ImmersiveMode();
    });
} else {
    new ImmersiveMode();
}
