// Project Filter Functionality
// Filter projects by category when clicking filter buttons

class ProjectFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        if (this.filterBtns.length === 0 || this.projectCards.length === 0) return;

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filterProjects(btn));
        });
    }

    filterProjects(btn) {
        // Update active button
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Get filter category
        const filter = btn.getAttribute('data-filter');

        // Filter projects with smooth animation
        this.projectCards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                // Show card
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                card.style.display = 'block';

                setTimeout(() => {
                    card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                // Hide card
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';

                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Initialize project filter
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ProjectFilter();
    });
} else {
    new ProjectFilter();
}
