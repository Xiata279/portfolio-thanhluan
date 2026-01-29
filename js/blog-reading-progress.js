// ========================================
// BLOG READING PROGRESS & ENHANCEMENTS
// Adds reading progress bar, time estimate, and mark-as-read features
// ========================================

class BlogReadingProgress {
    constructor() {
        this.progressBar = null;
        this.progressContainer = null;
        this.timeEstimate = null;
        this.articleBody = null;
        this.readingSpeed = 200; // words per minute (average Vietnamese reading speed)
        this.totalWords = 0;
        this.readArticles = this.loadReadArticles();

        this.init();
    }

    init() {
        // Only initialize on blog post pages (check if article content exists)
        this.articleBody = document.querySelector('.blog-post-content, .post-content, article.blog-post');

        if (!this.articleBody) {
            // If not on a blog post page, just mark read articles in the blog list
            this.markReadArticlesInList();
            return;
        }

        this.createProgressBar();
        this.calculateReadingTime();
        this.attachScrollListener();
        this.createBackToTop();
        this.markCurrentAsRead();
    }

    createProgressBar() {
        // Create progress container
        this.progressContainer = document.createElement('div');
        this.progressContainer.className = 'reading-progress-container';
        this.progressContainer.innerHTML = `
            <div class="reading-progress-bar"></div>
            <div class="reading-stats">
                <span class="time-remaining">
                    <i class="fas fa-clock"></i>
                    <span class="time-text">Tính toán...</span>
                </span>
                <span class="progress-percentage">0%</span>
            </div>
        `;

        document.body.prepend(this.progressContainer);
        this.progressBar = this.progressContainer.querySelector('.reading-progress-bar');
        this.timeEstimate = this.progressContainer.querySelector('.time-text');
    }

    calculateReadingTime() {
        // Count words in article
        const text = this.articleBody.innerText || this.articleBody.textContent;
        this.totalWords = text.trim().split(/\s+/).length;

        // Calculate estimated reading time
        const minutes = Math.ceil(this.totalWords / this.readingSpeed);
        const timeText = minutes < 60
            ? `${minutes} phút đọc`
            : `${Math.floor(minutes / 60)}h ${minutes % 60}m đọc`;

        this.timeEstimate.textContent = timeText;
        this.totalReadingMinutes = minutes;
    }

    attachScrollListener() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial update
        this.updateProgress();
    }

    updateProgress() {
        // Calculate scroll progress
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Progress percentage
        const totalScroll = documentHeight - windowHeight;
        const currentProgress = (scrollTop / totalScroll) * 100;
        const progressPercent = Math.min(100, Math.max(0, currentProgress));

        // Update progress bar
        this.progressBar.style.width = `${progressPercent}%`;

        // Update percentage display
        const percentageDisplay = this.progressContainer.querySelector('.progress-percentage');
        percentageDisplay.textContent = `${Math.round(progressPercent)}%`;

        // Update time remaining
        if (this.totalReadingMinutes) {
            const remainingPercent = 100 - progressPercent;
            const remainingMinutes = Math.ceil((this.totalReadingMinutes * remainingPercent) / 100);

            if (remainingMinutes > 0) {
                this.timeEstimate.textContent = `Còn ${remainingMinutes} phút`;
            } else {
                this.timeEstimate.textContent = 'Hoàn thành!';
            }
        }

        // Show/hide progress container based on scroll
        if (scrollTop > 100) {
            this.progressContainer.classList.add('visible');
        } else {
            this.progressContainer.classList.remove('visible');
        }
    }

    createBackToTop() {
        // Enhanced back to top button for blog posts
        const backToTop = document.createElement('button');
        backToTop.className = 'blog-back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.title = 'Về đầu trang';

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        document.body.appendChild(backToTop);

        // Show/hide based on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
    }

    markCurrentAsRead() {
        // Get article ID from URL or data attribute
        const articleId = this.getArticleId();

        if (articleId && !this.readArticles.includes(articleId)) {
            // Mark as read after user scrolls at least 50% of the article
            let marked = false;

            window.addEventListener('scroll', () => {
                if (marked) return;

                const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

                if (scrollPercent > 50) {
                    this.readArticles.push(articleId);
                    this.saveReadArticles();
                    marked = true;

                    // Show subtle notification
                    this.showNotification('Đã đánh dấu bài viết là đã đọc', 'success');
                }
            });
        }
    }

    getArticleId() {
        // Try to get ID from URL, data attribute, or article title
        const urlParams = new URLSearchParams(window.location.search);
        const idFromUrl = urlParams.get('id');

        if (idFromUrl) return idFromUrl;

        const idFromData = this.articleBody?.getAttribute('data-article-id');
        if (idFromData) return idFromData;

        // Fallback: use article title as ID
        const title = document.querySelector('h1')?.textContent;
        return title ? this.slugify(title) : null;
    }

    slugify(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    loadReadArticles() {
        const saved = localStorage.getItem('readArticles');
        return saved ? JSON.parse(saved) : [];
    }

    saveReadArticles() {
        localStorage.setItem('readArticles', JSON.stringify(this.readArticles));
    }

    markReadArticlesInList() {
        // Find all blog cards in the blog listing page
        const blogCards = document.querySelectorAll('.blog-card');

        blogCards.forEach(card => {
            const link = card.querySelector('.blog-link');
            const title = card.querySelector('h3')?.textContent;

            if (title) {
                const articleId = this.slugify(title);

                if (this.readArticles.includes(articleId)) {
                    card.classList.add('read-article');

                    // Add read indicator
                    if (!card.querySelector('.read-indicator')) {
                        const indicator = document.createElement('div');
                        indicator.className = 'read-indicator';
                        indicator.innerHTML = '<i class="fas fa-check-circle"></i> Đã đọc';
                        card.querySelector('.blog-content').prepend(indicator);
                    }
                }
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `blog-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add styles for reading progress
const progressStyles = document.createElement('style');
progressStyles.textContent = `
    .reading-progress-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: rgba(10, 25, 47, 0.95);
        z-index: 9998;
        opacity: 0;
        transform: translateY(-100%);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .reading-progress-container.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .reading-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #0066FF, #00D4FF);
        width: 0%;
        transition: width 0.1s ease-out;
        box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
    }

    .reading-stats {
        position: absolute;
        top: 100%;
        right: 20px;
        display: flex;
        gap: 15px;
        align-items: center;
        background: linear-gradient(135deg, #0A192F, #112240);
        padding: 8px 16px;
        border-radius: 0 0 8px 8px;
        font-size: 12px;
        font-weight: 600;
        color: #E6F1FF;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-top: none;
    }

    .time-remaining {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #00D4FF;
    }

    .time-remaining i {
        font-size: 14px;
    }

    .progress-percentage {
        color: #0066FF;
        font-weight: 700;
        min-width: 40px;
        text-align: right;
    }

    .blog-back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #0066FF, #00D4FF);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        transform: translateY(20px) scale(0.8);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 9997;
        box-shadow: 0 4px 20px rgba(0, 102, 255, 0.4);
        font-size: 18px;
    }

    .blog-back-to-top.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    .blog-back-to-top:hover {
        transform: translateY(-5px) scale(1.1);
        box-shadow: 0 8px 30px rgba(0, 212, 255, 0.6);
    }

    .blog-back-to-top:active {
        transform: translateY(-2px) scale(1.05);
    }

    /* Read article indicator */
    .blog-card.read-article {
        opacity: 0.8;
        position: relative;
    }

    .blog-card.read-article::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), transparent);
        pointer-events: none;
        border-radius: inherit;
    }

    .read-indicator {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        background: rgba(0, 212, 255, 0.15);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 20px;
        color: #00D4FF;
        font-size: 11px;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .read-indicator i {
        font-size: 12px;
    }

    /* Notification */
    .blog-notification {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: linear-gradient(135deg, #0A192F, #112240);
        color: #E6F1FF;
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(0, 212, 255, 0.3);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .blog-notification.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }

    .blog-notification.success {
        border-color: rgba(0, 255, 65, 0.3);
    }

    .blog-notification i {
        color: #00FF41;
        font-size: 18px;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .reading-stats {
            right: 10px;
            padding: 6px 12px;
            gap: 10px;
            font-size: 11px;
        }

        .blog-back-to-top {
            width: 45px;
            height: 45px;
            bottom: 20px;
            right: 20px;
            font-size: 16px;
        }

        .blog-notification {
            bottom: 20px;
            max-width: 90%;
            padding: 10px 16px;
            font-size: 13px;
        }
    }
`;
document.head.appendChild(progressStyles);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BlogReadingProgress();
    });
} else {
    new BlogReadingProgress();
}
