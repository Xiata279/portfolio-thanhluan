/**
 * Performance Monitor - Real-time FPS & Load Stats
 * Helps you track site performance during development
 * Toggle with Ctrl+Shift+P
 */

class PerformanceMonitor {
    constructor() {
        this.isVisible = false;
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.widget = null;
        this.isInitialized = false;
        
        // Check if user wants it on by default
        this.isVisible = localStorage.getItem('perfMonitor') === 'true';
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // Create widget HTML
        this.createWidget();
        
        // Keyboard shortcut: Ctrl+Shift+P
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.toggle();
            }
        });

        // Start monitoring if visible
        if (this.isVisible) {
            this.show();
            this.startMonitoring();
        }

        this.isInitialized = true;
    }

    createWidget() {
        this.widget = document.createElement('div');
        this.widget.className = 'perf-monitor';
        this.widget.innerHTML = `
            <div class="perf-header">
                <span class="perf-title">⚡ Performance</span>
                <button class="perf-close" title="Close (Ctrl+Shift+P)">×</button>
            </div>
            <div class="perf-stats">
                <div class="perf-stat">
                    <span class="perf-label">FPS:</span>
                    <span class="perf-value fps-value">--</span>
                </div>
                <div class="perf-stat">
                    <span class="perf-label">Load:</span>
                    <span class="perf-value load-value">--</span>
                </div>
                <div class="perf-stat">
                    <span class="perf-label">DOM:</span>
                    <span class="perf-value dom-value">--</span>
                </div>
            </div>
        `;

        document.body.appendChild(this.widget);

        // Close button
        this.widget.querySelector('.perf-close').addEventListener('click', () => {
            this.hide();
        });

        // Make draggable
        this.makeDraggable();
    }

    makeDraggable() {
        const header = this.widget.querySelector('.perf-header');
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('perf-close')) return;
            isDragging = true;
            initialX = e.clientX - this.widget.offsetLeft;
            initialY = e.clientY - this.widget.offsetTop;
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            this.widget.style.left = currentX + 'px';
            this.widget.style.top = currentY + 'px';
            this.widget.style.right = 'auto';
            this.widget.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'grab';
        });
    }

    startMonitoring() {
        // FPS Counter
        const updateFPS = () => {
            const now = performance.now();
            this.frameCount++;

            if (now >= this.lastTime + 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
                this.frameCount = 0;
                this.lastTime = now;
                this.updateDisplay();
            }

            if (this.isVisible) {
                requestAnimationFrame(updateFPS);
            }
        };

        requestAnimationFrame(updateFPS);
        this.updateLoadTime();
        this.updateDOMNodes();
    }

    updateDisplay() {
        if (!this.widget) return;

        const fpsValue = this.widget.querySelector('.fps-value');
        const fpsColor = this.fps >= 55 ? '#00ff88' : this.fps >= 30 ? '#ffa500' : '#ff4444';
        
        fpsValue.textContent = this.fps;
        fpsValue.style.color = fpsColor;
    }

    updateLoadTime() {
        if (performance.timing) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            const loadValue = this.widget.querySelector('.load-value');
            
            if (loadTime > 0) {
                loadValue.textContent = `${(loadTime / 1000).toFixed(2)}s`;
                loadValue.style.color = loadTime < 3000 ? '#00ff88' : '#ffa500';
            }
        }
    }

    updateDOMNodes() {
        const domValue = this.widget.querySelector('.dom-value');
        const nodeCount = document.getElementsByTagName('*').length;
        domValue.textContent = nodeCount;
        domValue.style.color = nodeCount < 1500 ? '#00ff88' : '#ffa500';
    }

    show() {
        if (!this.widget) this.createWidget();
        this.widget.classList.add('visible');
        this.isVisible = true;
        localStorage.setItem('perfMonitor', 'true');
        this.startMonitoring();
    }

    hide() {
        if (this.widget) {
            this.widget.classList.remove('visible');
        }
        this.isVisible = false;
        localStorage.setItem('perfMonitor', 'false');
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.perfMonitor = new PerformanceMonitor();
    });
} else {
    window.perfMonitor = new PerformanceMonitor();
}
