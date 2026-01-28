// ========================================
// EASTER EGGS & HIDDEN FEATURES
// Những tính năng ẩn thú vị
// ========================================

class EasterEggs {
    constructor() {
        this.konamiCode = CONFIG.secrets.konamiCode;
        this.konamiIndex = 0;
        this.secretWord = CONFIG.secrets.secretWord;
        this.typedWord = '';
        this.logoClickCount = 0;
        this.init();
    }

    init() {
        // Konami Code listener
        document.addEventListener('keydown', (e) => this.checkKonamiCode(e));

        // Secret word listener
        document.addEventListener('keypress', (e) => this.checkSecretWord(e));

        // Logo click counter
        const logo = document.querySelector('.logo a');
        if (logo) {
            logo.addEventListener('click', (e) => this.handleLogoClick(e));
        }

        // Console easter egg
        this.consoleArt();
    }

    checkKonamiCode(e) {
        if (e.key === this.konamiCode[this.konamiIndex]) {
            this.konamiIndex++;

            if (this.konamiIndex === this.konamiCode.length) {
                this.activateKonamiCode();
                this.konamiIndex = 0;
            }
        } else {
            this.konamiIndex = 0;
        }
    }

    activateKonamiCode() {
        // Show special message
        this.showNotification('🎮 KONAMI CODE ACTIVATED! 🎮', 'success');

        // Start mini game or special effect
        this.startMiniGame();
    }

    startMiniGame() {
        const gameContainer = document.createElement('div');
        gameContainer.className = 'easter-egg-game';
        gameContainer.innerHTML = `
            <div class="game-window">
                <div class="game-header">
                    <h3>🎮 Ma Đạo Mini Game</h3>
                    <button class="game-close">×</button>
                </div>
                <div class="game-content">
                    <div class="game-score">Score: <span id="game-score">0</span></div>
                    <canvas id="game-canvas" width="400" height="400"></canvas>
                    <div class="game-instructions">
                        Use Arrow Keys to move<br>
                        Collect the blue orbs!
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(gameContainer);

        // Close button
        gameContainer.querySelector('.game-close').addEventListener('click', () => {
            gameContainer.remove();
        });

        // Initialize simple game
        this.initSimpleGame(gameContainer.querySelector('#game-canvas'));
    }

    initSimpleGame(canvas) {
        const ctx = canvas.getContext('2d');
        let score = 0;
        let player = { x: 200, y: 200, size: 20, speed: 5 };
        let orbs = [];
        let keys = {};

        // Generate orbs
        for (let i = 0; i < 5; i++) {
            orbs.push({
                x: Math.random() * 360 + 20,
                y: Math.random() * 360 + 20,
                size: 10
            });
        }

        // Key listeners
        document.addEventListener('keydown', (e) => keys[e.key] = true);
        document.addEventListener('keyup', (e) => keys[e.key] = false);

        // Game loop
        function gameLoop() {
            // Clear canvas
            ctx.fillStyle = '#0A192F';
            ctx.fillRect(0, 0, 400, 400);

            // Move player
            if (keys['ArrowUp']) player.y -= player.speed;
            if (keys['ArrowDown']) player.y += player.speed;
            if (keys['ArrowLeft']) player.x -= player.speed;
            if (keys['ArrowRight']) player.x += player.speed;

            // Keep player in bounds
            player.x = Math.max(player.size, Math.min(400 - player.size, player.x));
            player.y = Math.max(player.size, Math.min(400 - player.size, player.y));

            // Draw player
            ctx.fillStyle = '#0066FF';
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
            ctx.fill();

            // Draw and check orbs
            for (let i = orbs.length - 1; i >= 0; i--) {
                const orb = orbs[i];

                // Draw orb
                ctx.fillStyle = '#00D4FF';
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
                ctx.fill();

                // Check collision
                const dx = player.x - orb.x;
                const dy = player.y - orb.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < player.size + orb.size) {
                    orbs.splice(i, 1);
                    score += 10;
                    document.getElementById('game-score').textContent = score;

                    // Add new orb
                    orbs.push({
                        x: Math.random() * 360 + 20,
                        y: Math.random() * 360 + 20,
                        size: 10
                    });
                }
            }

            requestAnimationFrame(gameLoop);
        }

        gameLoop();
    }

    checkSecretWord(e) {
        this.typedWord += e.key.toLowerCase();

        if (this.typedWord.length > this.secretWord.length) {
            this.typedWord = this.typedWord.slice(-this.secretWord.length);
        }

        if (this.typedWord === this.secretWord) {
            this.activateSecretWord();
            this.typedWord = '';
        }
    }

    activateSecretWord() {
        this.showNotification('🎉 Secret word discovered! Ma Đạo Power! 🎉', 'success');

        // Special animation
        document.body.classList.add('madao-power');

        setTimeout(() => {
            document.body.classList.remove('madao-power');
        }, 5000);
    }

    handleLogoClick(e) {
        e.preventDefault();
        this.logoClickCount++;

        if (this.logoClickCount >= CONFIG.secrets.logoClickCount) {
            this.activateMatrixRain();
            this.logoClickCount = 0;
        }
    }

    activateMatrixRain() {
        if (document.querySelector('.matrix-rain')) return;

        this.showNotification('🌧️ Matrix Mode Activated! 🌧️', 'success');

        const canvas = document.createElement('canvas');
        canvas.className = 'matrix-rain';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const chars = 'MADAO0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
            ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00FF41';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        const interval = setInterval(draw, 33);

        // Remove after 10 seconds
        setTimeout(() => {
            clearInterval(interval);
            canvas.remove();
        }, 10000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `easter-egg-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    consoleArt() {
        const art = `
%c
███╗   ███╗ █████╗     ██████╗  █████╗  ██████╗ 
████╗ ████║██╔══██╗    ██╔══██╗██╔══██╗██╔═══██╗
██╔████╔██║███████║    ██║  ██║███████║██║   ██║
██║╚██╔╝██║██╔══██║    ██║  ██║██╔══██║██║   ██║
██║ ╚═╝ ██║██║  ██║    ██████╔╝██║  ██║╚██████╔╝
╚═╝     ╚═╝╚═╝  ╚═╝    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ 
                                                  
%cWelcome to Ma Đạo Portfolio! 🚀
%cTry these easter eggs:
%c1. Konami Code: ↑↑↓↓←→←→BA
%c2. Type "madao" anywhere
%c3. Click logo 5 times
%c4. Check out the source code 😉
        `;

        console.log(art,
            'color: #0066FF; font-weight: bold;',
            'color: #00D4FF; font-size: 16px; font-weight: bold;',
            'color: #E6F1FF; font-size: 14px;',
            'color: #8892B0;',
            'color: #8892B0;',
            'color: #8892B0;',
            'color: #8892B0;'
        );
    }
}

// Add easter egg styles
const easterEggStyles = document.createElement('style');
easterEggStyles.textContent = `
    .easter-egg-game {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    }

    .game-window {
        background: linear-gradient(135deg, #0A192F, #112240);
        border-radius: 20px;
        padding: 20px;
        border: 2px solid #0066FF;
        box-shadow: 0 20px 60px rgba(0, 102, 255, 0.3);
    }

    .game-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .game-header h3 {
        color: #E6F1FF;
        margin: 0;
    }

    .game-close {
        background: #FF5F56;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        color: white;
        font-size: 20px;
        cursor: pointer;
        transition: transform 0.2s;
    }

    .game-close:hover {
        transform: scale(1.1);
    }

    .game-content {
        text-align: center;
    }

    .game-score {
        color: #00D4FF;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    #game-canvas {
        border: 2px solid #0066FF;
        border-radius: 10px;
        display: block;
        margin: 0 auto;
    }

    .game-instructions {
        color: #8892B0;
        margin-top: 15px;
        font-size: 14px;
    }

    .easter-egg-notification {
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: linear-gradient(135deg, #0066FF, #00D4FF);
        color: white;
        padding: 20px 40px;
        border-radius: 50px;
        font-weight: bold;
        font-size: 18px;
        box-shadow: 0 10px 40px rgba(0, 102, 255, 0.5);
        z-index: 99998;
        opacity: 0;
        transition: all 0.3s ease;
    }

    .easter-egg-notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }

    .matrix-rain {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99997;
        pointer-events: none;
    }

    @keyframes madaoPower {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(360deg); }
    }

    body.madao-power {
        animation: madaoPower 2s ease-in-out;
    }

    body.madao-power * {
        animation: madaoPower 2s ease-in-out;
    }
`;
document.head.appendChild(easterEggStyles);

// Initialize easter eggs
if (CONFIG.features.easterEggs) {
    window.addEventListener('load', () => {
        new EasterEggs();
    });
}
