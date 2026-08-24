// Contact form với EmailJS integration
// Gửi email khi user submit form

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = null;
        this.init();
    }

    init() {
        if (!this.form) return;
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS chưa tải. Form sẽ mở mailto fallback.');
        } else {
            emailjs.init((typeof CONFIG !== 'undefined' && CONFIG.api?.emailjs?.publicKey) || 'oCLX80jQ7U-0e5Mgc');
        }

        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        this.setLoading(true);

        const serviceId = (typeof CONFIG !== 'undefined' && CONFIG.api?.emailjs?.serviceId) || 'service_tbgvmpj';
        const templateId = (typeof CONFIG !== 'undefined' && CONFIG.api?.emailjs?.templateId) || 'template_heik4ow';

        try {
            if (typeof emailjs === 'undefined') {
                const name = this.form.querySelector('#name').value.trim();
                const email = this.form.querySelector('#email').value.trim();
                const subject = this.form.querySelector('#subject').value.trim();
                const message = this.form.querySelector('#message').value.trim();
                const body = encodeURIComponent(`Từ: ${name} <${email}>\n\n${message}`);
                const toEmail = (typeof CONFIG !== 'undefined' && CONFIG.info?.email) || 'nguyenthanhluan.270924@gmail.com';
                window.location.href = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;
                this.showNotification('Đã mở ứng dụng email của bạn.', 'info');
                return;
            }

            await emailjs.sendForm(serviceId, templateId, this.form);
            this.showNotification('Gửi thành công! Tôi sẽ phản hồi sớm nhất.', 'success');
            this.form.reset();
        } catch (error) {
            console.error('Email error:', error);
            this.showNotification('Gửi thất bại. Vui lòng thử lại hoặc email trực tiếp.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    validateForm() {
        const name = this.form.querySelector('#name').value.trim();
        const email = this.form.querySelector('#email').value.trim();
        const subject = this.form.querySelector('#subject').value.trim();
        const message = this.form.querySelector('#message').value.trim();

        if (!name || !email || !subject || !message) {
            this.showNotification('Vui lòng điền đầy đủ thông tin!', 'warning');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Email không hợp lệ!', 'warning');
            return false;
        }

        return true;
    }

    setLoading(isLoading) {
        if (!this.submitBtn) return;

        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi Tin Nhắn';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `contact-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Append to body
        document.body.appendChild(notification);

        // Show animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ContactForm();
    });
} else {
    new ContactForm();
}
