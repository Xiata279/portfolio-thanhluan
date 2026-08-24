// Hiệu ứng gõ chữ ở hero (chỉ chạy khi có phần tử .typing-text)
const typingText = document.querySelector('.typing-text');
const phrases = [
    'Lập Trình Viên',
    'Discord Bot Developer',
    'Chrome Extension Dev',
    'Community Builder',
    'Content Creator'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 150;

function type() {
    if (!typingText) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 150;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
}

if (typingText) {
    document.addEventListener('DOMContentLoaded', type);
}

// Highlight mục điều hướng theo section đang xem (trang index nhiều section)
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
    if (!sections.length) return;
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href*="${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-link[href*="${sectionId}"]`)?.classList.remove('active');
        }
    });
}

if (sections.length) {
    window.addEventListener('scroll', highlightNav);
}

// Animate thanh kỹ năng khi cuộn tới (chỉ khi có #skills)
const progressBars = document.querySelectorAll('.progress');
let progressAnimated = false;

function animateProgress() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const skillsSectionTop = skillsSection.offsetTop;
    const skillsSectionHeight = skillsSection.offsetHeight;
    const scrollPosition = window.pageYOffset + window.innerHeight;

    if (scrollPosition > skillsSectionTop + skillsSectionHeight / 3 && !progressAnimated) {
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        });
        progressAnimated = true;
    }
}

if (document.getElementById('skills')) {
    window.addEventListener('scroll', animateProgress);
}

// Reveal khi cuộn (nguồn duy nhất cho các card/section chung)
const fadeObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            entry.target.classList.add('fade-in-visible');
        }
    });
}, fadeObserverOptions);

const animateElements = document.querySelectorAll('.project-card, .achievement-card, .skill-item, .stat-item, .info-card, .skill-card, .blog-card, .section-header');
animateElements.forEach(el => {
    el.classList.add('fade-in');
    fadeObserver.observe(el);
});

console.log('%c👋 Xin chào! Welcome!', 'color:#0066FF;font-size:20px;font-weight:bold');
console.log('%cNguyễn Thành Luân - Software Engineer & Content Creator', 'color:#00D4FF;font-size:14px');
