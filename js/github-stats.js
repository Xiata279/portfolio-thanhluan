// ========================================
// GITHUB STATS WIDGET
// Hiển thị stats real-time từ GitHub API
// ========================================

class GitHubStats {
    constructor() {
        this.username = CONFIG.info.github;
        this.apiUrl = CONFIG.api.github;
        this.stats = null;
        this.refreshInterval = null;
        this.animationTimers = {};
        this.init();
    }

    async init() {
        await this.fetchStats();
        this.createWidget();
        this.updateWidget();

        // Cập nhật mỗi 5 phút; xoá interval cũ nếu có để tránh rò rỉ
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        this.refreshInterval = setInterval(async () => {
            await this.fetchStats();
            this.updateWidget();
        }, 300000);
    }

    async fetchStats() {
        try {
            // Fetch user data
            const userResponse = await fetch(this.apiUrl);
            if (userResponse.status === 403) {
                throw new Error('GitHub API rate limit exceeded (60 req/h chưa xác thực)');
            }
            if (!userResponse.ok) {
                throw new Error(`GitHub user API lỗi: ${userResponse.status}`);
            }
            const userData = await userResponse.json();

            // Fetch repos
            const reposResponse = await fetch(`${this.apiUrl}/repos?sort=updated&per_page=100`);
            if (!reposResponse.ok) {
                throw new Error(`GitHub repos API lỗi: ${reposResponse.status}`);
            }
            const reposData = await reposResponse.json();
            if (!Array.isArray(reposData)) {
                throw new Error('GitHub repos API trả về dữ liệu không hợp lệ');
            }

            // Calculate stats
            const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
            const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);
            const languages = {};

            reposData.forEach(repo => {
                if (repo.language) {
                    languages[repo.language] = (languages[repo.language] || 0) + 1;
                }
            });

            const topLanguages = Object.entries(languages)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([lang]) => lang);

            this.stats = {
                repos: userData.public_repos,
                followers: userData.followers,
                following: userData.following,
                stars: totalStars,
                forks: totalForks,
                topLanguages: topLanguages,
                latestRepo: reposData[0],
                avatar: userData.avatar_url,
                bio: userData.bio
            };

        } catch (error) {
            console.error('Error fetching GitHub stats:', error);
            // Use fallback data
            this.stats = {
                repos: 15,
                followers: 50,
                following: 30,
                stars: 100,
                forks: 25,
                topLanguages: ['JavaScript', 'Python', 'HTML'],
                latestRepo: { name: 'portfolio-thanhluan', updated_at: new Date().toISOString() }
            };
        }
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'github-stats-widget';
        widget.id = 'github-stats';
        widget.innerHTML = `
            <div class="github-widget-header">
                <i class="fab fa-github"></i>
                <span>GitHub Stats</span>
                <button class="widget-toggle" title="Toggle Widget">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="github-widget-content">
                <div class="github-stat-grid">
                    <div class="github-stat-item">
                        <i class="fas fa-code-branch"></i>
                        <div class="stat-value" id="gh-repos">--</div>
                        <div class="stat-label">Repositories</div>
                    </div>
                    <div class="github-stat-item">
                        <i class="fas fa-star"></i>
                        <div class="stat-value" id="gh-stars">--</div>
                        <div class="stat-label">Stars</div>
                    </div>
                    <div class="github-stat-item">
                        <i class="fas fa-users"></i>
                        <div class="stat-value" id="gh-followers">--</div>
                        <div class="stat-label">Followers</div>
                    </div>
                    <div class="github-stat-item">
                        <i class="fas fa-code"></i>
                        <div class="stat-value" id="gh-languages">--</div>
                        <div class="stat-label">Top Languages</div>
                    </div>
                </div>
                <div class="github-latest-repo">
                    <div class="repo-label">Latest Update:</div>
                    <div class="repo-name" id="gh-latest-repo">--</div>
                    <div class="repo-time" id="gh-latest-time">--</div>
                </div>
                <a href="https://github.com/${this.username}" target="_blank" rel="noopener noreferrer" class="github-profile-link">
                    <i class="fab fa-github"></i> View Full Profile
                </a>
            </div>
        `;

        document.body.appendChild(widget);

        // Toggle functionality
        widget.querySelector('.widget-toggle').addEventListener('click', () => {
            widget.classList.toggle('collapsed');
        });
    }

    updateWidget() {
        if (!this.stats) return;

        // Animate counter
        this.animateValue('gh-repos', 0, this.stats.repos, 1000);
        this.animateValue('gh-stars', 0, this.stats.stars, 1000);
        this.animateValue('gh-followers', 0, this.stats.followers, 1000);

        // Update languages
        const languagesEl = document.getElementById('gh-languages');
        if (languagesEl) {
            languagesEl.textContent = this.stats.topLanguages.join(', ');
        }

        // Update latest repo
        const repoNameEl = document.getElementById('gh-latest-repo');
        const repoTimeEl = document.getElementById('gh-latest-time');

        if (repoNameEl && this.stats.latestRepo) {
            repoNameEl.textContent = this.stats.latestRepo.name;
            repoTimeEl.textContent = this.getTimeAgo(this.stats.latestRepo.updated_at);
        }
    }

    animateValue(id, start, end, duration) {
        const element = document.getElementById(id);
        if (!element) return;

        // Xoá timer cũ của chính phần tử này trước khi chạy timer mới
        if (this.animationTimers[id]) {
            clearInterval(this.animationTimers[id]);
        }

        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        this.animationTimers[id] = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = end;
                clearInterval(this.animationTimers[id]);
                this.animationTimers[id] = null;
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
            }
        }

        return 'Just now';
    }
}

// Add GitHub widget styles
const githubStyles = document.createElement('style');
githubStyles.textContent = `
    .github-stats-widget {
        position: fixed;
        bottom: 30px;
        left: 30px;
        width: 320px;
        background: linear-gradient(135deg, rgba(17, 34, 64, 0.95), rgba(26, 47, 82, 0.95));
        backdrop-filter: blur(20px);
        border-radius: 16px;
        border: 1px solid rgba(0, 212, 255, 0.2);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 9996;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .github-stats-widget.collapsed .github-widget-content {
        max-height: 0;
        opacity: 0;
    }

    .github-stats-widget.collapsed .widget-toggle i {
        transform: rotate(-90deg);
    }

    .github-widget-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px 20px;
        background: rgba(0, 102, 255, 0.1);
        border-bottom: 1px solid rgba(0, 212, 255, 0.1);
        cursor: pointer;
    }

    .github-widget-header i.fa-github {
        font-size: 20px;
        color: #00D4FF;
    }

    .github-widget-header span {
        flex: 1;
        color: #E6F1FF;
        font-weight: 600;
        font-size: 14px;
    }

    .widget-toggle {
        background: none;
        border: none;
        color: #8892B0;
        cursor: pointer;
        padding: 5px;
        transition: all 0.3s ease;
    }

    .widget-toggle:hover {
        color: #00D4FF;
    }

    .widget-toggle i {
        transition: transform 0.3s ease;
    }

    .github-widget-content {
        padding: 20px;
        max-height: 600px;
        opacity: 1;
        transition: all 0.3s ease;
        overflow-y: auto;
        overflow-x: hidden;
    }

    /* Custom scrollbar for widget */
    .github-widget-content::-webkit-scrollbar {
        width: 6px;
    }

    .github-widget-content::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
    }

    .github-widget-content::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #0066FF, #00D4FF);
        border-radius: 10px;
    }

    .github-widget-content::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #0080FF, #00E4FF);
    }

    .github-stat-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-bottom: 20px;
    }

    .github-stat-item {
        text-align: center;
        padding: 15px;
        background: rgba(0, 102, 255, 0.05);
        border-radius: 10px;
        border: 1px solid rgba(0, 212, 255, 0.1);
        transition: all 0.3s ease;
    }

    .github-stat-item:hover {
        background: rgba(0, 102, 255, 0.1);
        border-color: rgba(0, 212, 255, 0.3);
        transform: translateY(-3px);
    }

    .github-stat-item i {
        font-size: 20px;
        color: #0066FF;
        margin-bottom: 8px;
    }

    .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: #E6F1FF;
        margin-bottom: 5px;
    }

    .stat-label {
        font-size: 11px;
        color: #8892B0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .github-latest-repo {
        background: rgba(0, 212, 255, 0.05);
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 15px;
        border-left: 3px solid #0066FF;
    }

    .repo-label {
        font-size: 11px;
        color: #8892B0;
        text-transform: uppercase;
        margin-bottom: 5px;
    }

    .repo-name {
        font-size: 14px;
        color: #00D4FF;
        font-weight: 600;
        margin-bottom: 3px;
    }

    .repo-time {
        font-size: 12px;
        color: #8892B0;
    }

    .github-profile-link {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px;
        background: linear-gradient(135deg, #0066FF, #00D4FF);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 13px;
        transition: all 0.3s ease;
    }

    .github-profile-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(0, 102, 255, 0.4);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .github-stats-widget {
            left: 10px;
            right: 10px;
            width: auto;
            bottom: 150px;
            max-height: 70vh;
        }

        .github-widget-content {
            max-height: calc(70vh - 60px);
            padding: 15px;
        }

        .github-stat-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }

        .github-stat-item {
            padding: 10px;
        }

        .stat-value {
            font-size: 20px;
        }
    }
`;
document.head.appendChild(githubStyles);

// Initialize GitHub stats
if (CONFIG.features.githubStats) {
    window.addEventListener('load', () => {
        new GitHubStats();
    });
}
