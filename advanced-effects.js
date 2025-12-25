function updateScrollProgress() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    
    let progressBar = document.getElementById('scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: ${scrolled}%;
            height: 3px;
            background: linear-gradient(90deg, #0066FF, #00D4FF);
            z-index: 10000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    } else {
        progressBar.style.width = scrolled + '%';
    }
}

window.addEventListener('scroll', updateScrollProgress);

// ========== Parallax Effect ==========
if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        const heroText = document.querySelector('.hero-text');
        
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        if (heroText) {
            heroText.style.transform = `translateY(${scrolled * 0.15}px)`;
        }
    });
}

// ========== Button Ripple Effect ==========
document.querySelectorAll('.btn, .filter-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ========== Animated Stats Counter ==========
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('h4');
            if (statNumber && !statNumber.dataset.animated) {
                const text = statNumber.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                
                if (number) {
                    statNumber.dataset.animated = 'true';
                    statNumber.textContent = '0';
                    animateCounter(statNumber, number);
                    
                    setTimeout(() => {
                        if (text.includes('+')) statNumber.textContent += '+';
                        if (text.includes('K')) statNumber.textContent += 'K';
                    }, 2000);
                }
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statObserver.observe(stat);
});

// ========== Console Art ==========
console.log('%c╔═══════════════════════════════════════════════════════╗', 'color: #0066FF; font-weight: bold;');
console.log('%c║   🚀 NGUYỄN THÀNH LUÂN - SOFTWARE ENGINEER 🚀        ║', 'color: #00D4FF; font-weight: bold;');
console.log('%c║                                                       ║', 'color: #0066FF;');
console.log('%c║   📧 nguyenthanhluan.270924@gmail.com               ║', 'color: #E6F1FF;');
console.log('%c║   🔗 github.com/Xiata279                            ║', 'color: #E6F1FF;');
console.log('%c║   💬 discord.gg/NUh6Mf22                            ║', 'color: #E6F1FF;');
console.log('%c║                                                       ║', 'color: #0066FF;');
console.log('%c╚═══════════════════════════════════════════════════════╝', 'color: #0066FF; font-weight: bold;');
