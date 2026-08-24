// Hiệu ứng trang chủ: đếm số liệu + reveal khi scroll
(function () {
    function animateCounter(el, target, suffix) {
        const duration = 1400;
        const start = performance.now();
        const from = 0;

        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(from + (target - from) * eased);
            el.textContent = value.toLocaleString('vi-VN') + (suffix || '');
            if (progress < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }

    function parseCount(value) {
        const match = String(value).match(/([\d.,]+)\s*(.*)/);
        if (!match) return null;
        const num = parseInt(match[1].replace(/[.,]/g, ''), 10);
        return { num, suffix: match[2] || '' };
    }

    const statObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                if (el.dataset.animated === 'true') return;

                const parsed = parseCount(el.dataset.count);
                if (parsed && !Number.isNaN(parsed.num)) {
                    animateCounter(el, parsed.num, parsed.suffix);
                }

                el.dataset.animated = 'true';
                el.closest('.home-stat')?.classList.add('is-visible');
                statObserver.unobserve(el);
            });
        },
        { threshold: 0.35 }
    );

    document.querySelectorAll('[data-count]').forEach((el) => statObserver.observe(el));

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document
        .querySelectorAll('.home-service, .home-featured .project-card, .home-skill-group, .home-about')
        .forEach((el) => revealObserver.observe(el));
})();
