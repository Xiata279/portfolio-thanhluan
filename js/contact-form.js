// ========================================
// EMAILJS CONTACT FORM INTEGRATION
// Gửi email thật qua EmailJS
// ========================================

class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.isSubmitting = false;
        this.init();
    }

    init() {
        if (!this.form) return;

        // Initialize EmailJS (user needs to add their keys in config.js)
        if (typeof emailjs !== 'undefined') {
            emailjs.init(CONFIG.api.emailjs.publicKey);
        }

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Add real-time validation
        this.addValidation();
    }

    addValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Trường này là bắt buộc';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Email không hợp lệ';
            }
        }

        // Update UI
        if (!isValid) {
            field.classList.add('error');
            this.showFieldError(field, errorMessage);
        } else {
            field.classList.remove('error');
            this.hideFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        let errorDiv = field.parentElement.querySelector('.field-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            field.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    hideFieldError(field) {
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) return;

        // Validate all fields
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Vui lòng kiểm tra lại thông tin!', 'error');
            return;
        }

        this.isSubmitting = true;
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        submitBtn.disabled = true;

        try {
            // Get form data
            const formData = {
                from_name: this.form.name.value,
                from_email: this.form.email.value,
                subject: this.form.subject.value,
                message: this.form.message.value,
                to_name: CONFIG.info.name
            };

            // Send via EmailJS (if configured)
            if (typeof emailjs !== 'undefined' && CONFIG.api.emailjs.serviceId !== 'YOUR_SERVICE_ID') {
                await emailjs.send(
                    CONFIG.api.emailjs.serviceId,
                    CONFIG.api.emailjs.templateId,
                    formData
                );

                this.showSuccessAnimation();
                this.showNotification('✉️ Tin nhắn đã được gửi thành công!', 'success');
                this.form.reset();
            } else {
                // Fallback: simulate sending (for demo)
                await this.simulateSend(formData);
                this.showSuccessAnimation();
                this.showNotification('✉️ Tin nhắn đã được gửi! (Demo mode)', 'success');
                this.form.reset();
            }

        } catch (error) {
            console.error('Error sending email:', error);
            this.showNotification('❌ Có lỗi xảy ra. Vui lòng thử lại!', 'error');
        } finally {
            this.isSubmitting = false;
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    simulateSend(data) {
        return new Promise((resolve) => {
            console.log('Form data:', data);
            setTimeout(resolve, 1500);
        });
    }

    showSuccessAnimation() {
        // Confetti effect
        const confettiCount = 50;
        const colors = ['#0066FF', '#00D4FF', '#9333EA', '#EC4899', '#FFD700'];

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                this.createConfetti(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 30);
        }
    }

    createConfetti(color) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${color};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: 1;
            transform: rotate(${Math.random() * 360}deg);
            z-index: 99999;
            pointer-events: none;
        `;

        document.body.appendChild(confetti);

        const animation = confetti.animate([
            {
                transform: `translateY(0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0
            }
        ], {
            duration: 2000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        animation.onfinish = () => confetti.remove();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Add contact form styles
const contactFormStyles = document.createElement('style');
contactFormStyles.textContent = `
    .form-group {
        position: relative;
    }

    .form-group input.error,
    .form-group textarea.error {
        border-color: #ff4444 !important;
        box-shadow: 0 0 20px rgba(255, 68, 68, 0.3) !important;
    }

    .field-error {
        color: #ff4444;
        font-size: 12px;
        margin-top: 5px;
        display: block;
        animation: errorShake 0.3s ease;
    }

    @keyframes errorShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .form-notification {
        position: fixed;
        top: 100px;
        right: -400px;
        background: linear-gradient(135deg, rgba(17, 34, 64, 0.95), rgba(26, 47, 82, 0.95));
        backdrop-filter: blur(20px);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 99998;
        transition: right 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        border-left: 4px solid #0066FF;
        min-width: 300px;
    }

    .form-notification.success {
        border-left-color: #00FF41;
    }

    .form-notification.error {
        border-left-color: #ff4444;
    }

    .form-notification.show {
        right: 30px;
    }

    .form-notification i {
        font-size: 24px;
    }

    .form-notification.success i {
        color: #00FF41;
    }

    .form-notification.error i {
        color: #ff4444;
    }

    .form-notification span {
        font-size: 15px;
        font-weight: 500;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .form-notification {
            right: -100%;
            left: auto;
            min-width: auto;
            width: calc(100% - 40px);
        }

        .form-notification.show {
            right: 20px;
        }
    }
`;
document.head.appendChild(contactFormStyles);

// Initialize contact form
window.addEventListener('load', () => {
    new ContactFormHandler();
});

// EmailJS setup instructions (console message)
if (CONFIG.api.emailjs.serviceId === 'YOUR_SERVICE_ID') {
    console.log('%c📧 EmailJS Setup Required', 'color: #FFD700; font-size: 16px; font-weight: bold;');
    console.log('%cTo enable real email sending:', 'color: #00D4FF; font-size: 14px;');
    console.log('%c1. Sign up at https://www.emailjs.com/', 'color: #8892B0;');
    console.log('%c2. Create an email service and template', 'color: #8892B0;');
    console.log('%c3. Update CONFIG.api.emailjs in js/config.js', 'color: #8892B0;');
    console.log('%c4. Add EmailJS script to index.html:', 'color: #8892B0;');
    console.log('%c   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>', 'color: #0066FF;');
}
