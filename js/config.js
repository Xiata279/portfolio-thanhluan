// ========================================
// PORTFOLIO CONFIGURATION
// Cấu hình tổng thể cho portfolio
// ========================================

const CONFIG = {
    // Theme settings
    themes: {
        default: {
            name: 'Default',
            primary: '#0066FF',
            secondary: '#00D4FF',
            dark: '#0A192F',
            light: '#E6F1FF'
        },
        madao: {
            name: 'Ma Đạo',
            primary: '#9333EA',
            secondary: '#EC4899',
            dark: '#1E1B4B',
            light: '#F3E8FF'
        },
        hacker: {
            name: 'Hacker',
            primary: '#00FF41',
            secondary: '#00D9FF',
            dark: '#0D0208',
            light: '#39FF14'
        },
        sunset: {
            name: 'Sunset',
            primary: '#FF6B35',
            secondary: '#F7931E',
            dark: '#1A1423',
            light: '#FFE5D9'
        }
    },

    // Feature flags
    features: {
        terminalIntro: false,
        particleCursor: true,
        easterEggs: true,
        voiceCommands: false,
        matrixRain: false,
        githubStats: true,
        visitorCounter: false,
        musicPlayer: false,
        glassmorphism: true,
        visualEffects: true,
        immersiveMode: true
    },

    // API endpoints
    api: {
        github: 'https://api.github.com/users/luanem2709',
        emailjs: {
            serviceId: 'service_tbgvmpj',
            templateId: 'template_heik4ow',
            publicKey: 'oCLX80jQ7U-0e5Mgc'
        }
    },

    // Personal info
    info: {
        name: 'Nguyễn Thành Luân',
        title: 'Software Engineer & Content Creator',
        email: 'nguyenthanhluan.270924@gmail.com',
        phone: '0816042709',
        github: 'luanem2709',
        discord: 'Ma Đạo Community',
        tiktok: '@LuanEm2709'
    },

    // Animation settings
    animations: {
        terminalSpeed: 50,
        particleCount: 50,
        typingSpeed: 150,
        scrollRevealDelay: 100
    },

    // Easter eggs
    secrets: {
        konamiCode: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
        secretWord: 'madao',
        logoClickCount: 5
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
