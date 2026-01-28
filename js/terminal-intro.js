// ========================================
// TERMINAL INTRO ANIMATION - PREMIUM VERSION
// Hiệu ứng terminal boot chuyên nghiệp với tiếng Việt tự nhiên
// ========================================

class TerminalIntro {
    constructor() {
        this.terminal = null;
        this.output = null;
        this.commands = [
            { text: '◆ Đang khởi động hệ thống portfolio...', delay: 100, icon: '◆' },
            { text: '◆ Đang tải thông tin cá nhân của Luân...', delay: 300, icon: '◆' },
            { text: '  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%', delay: 500, progress: true },
            { text: '', delay: 200 },
            { text: '◈ Đang kết nối với GitHub...', delay: 200, icon: '◈' },
            { text: '  ✦ Kết nối thành công!', delay: 300, success: true },
            { text: '', delay: 200 },
            { text: '◈ Đang tải kỹ năng lập trình...', delay: 200, icon: '◈' },
            { text: '  ⬢ Node.js & Discord.js ━━━━━ 95%', delay: 150, skill: true },
            { text: '  ⬢ JavaScript & TypeScript ━━━━━ 92%', delay: 150, skill: true },
            { text: '  ⬢ HTML/CSS & React ━━━━━ 88%', delay: 150, skill: true },
            { text: '', delay: 200 },
            { text: '◈ Đang quét các dự án...', delay: 200, icon: '◈' },
            { text: '  ✦ Tìm thấy 8 dự án đang hoạt động', delay: 300, success: true },
            { text: '', delay: 200 },
            { text: '◈ Đang tải thông tin Ma Đạo Community...', delay: 200, icon: '◈' },
            { text: '  ⚡ 3000+ thành viên đang online', delay: 200, success: true },
            { text: '  ⚡ 50K+ người theo dõi trên TikTok', delay: 200, success: true },
            { text: '', delay: 300 },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', delay: 200, divider: true },
            { text: '✨ Hệ thống đã sẵn sàng! Chào mừng bạn đến với portfolio của Luân', delay: 400, highlight: true },
            { text: '💡 Tip: Nhấn SPACE hoặc click để bỏ qua animation', delay: 200, hint: true }
        ];
        this.currentIndex = 0;
        this.isSkipped = false;
    }

    create() {
        // Create terminal overlay
        this.terminal = document.createElement('div');
        this.terminal.className = 'terminal-intro';
        this.terminal.innerHTML = `
            <div class="terminal-window">
                <div class="terminal-header">
                    <div class="terminal-buttons">
                        <span class="btn-close" title="Đóng"></span>
                        <span class="btn-minimize" title="Thu nhỏ"></span>
                        <span class="btn-maximize" title="Phóng to"></span>
                    </div>
                    <div class="terminal-title">
                        <span class="terminal-icon">◆</span>
                        <span class="terminal-user">luanem</span>
                        <span class="terminal-separator">@</span>
                        <span class="terminal-host">portfolio</span>
                        <span class="terminal-path">:~$</span>
                    </div>
                    <div class="terminal-status">
                        <span class="status-dot"></span>
                        <span class="status-text">Đang chạy...</span>
                    </div>
                </div>
                <div class="terminal-body">
                    <div class="terminal-welcome">
                        <div class="ascii-art">
╔═══════════════════════════════════════════════════════╗
║  ██╗     ██╗   ██╗ █████╗ ███╗   ██╗    ███████╗███╗   ███╗ ║
║  ██║     ██║   ██║██╔══██╗████╗  ██║    ██╔════╝████╗ ████║ ║
║  ██║     ██║   ██║███████║██╔██╗ ██║    █████╗  ██╔████╔██║ ║
║  ██║     ██║   ██║██╔══██║██║╚██╗██║    ██╔══╝  ██║╚██╔╝██║ ║
║  ███████╗╚██████╔╝██║  ██║██║ ╚████║    ███████╗██║ ╚═╝ ██║ ║
║  ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝    ╚══════╝╚═╝     ╚═╝ ║
╚═══════════════════════════════════════════════════════╝
                    </div>
                    <div class="terminal-output"></div>
                    <div class="terminal-skip">
                        <span class="skip-icon">⚡</span>
                        <span>Nhấn SPACE hoặc click để bỏ qua</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.terminal);
        this.output = this.terminal.querySelector('.terminal-output');

        // Add skip functionality
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isSkipped) {
                this.skip();
            }
        });

        this.terminal.addEventListener('click', () => {
            if (!this.isSkipped) this.skip();
        });

        // Start animation
        setTimeout(() => this.animate(), 500);
    }

    async animate() {
        for (let i = 0; i < this.commands.length; i++) {
            if (this.isSkipped) break;

            this.currentIndex = i;
            const cmd = this.commands[i];

            await this.typeLine(cmd);
            await this.wait(cmd.delay);
        }

        if (!this.isSkipped) {
            await this.wait(1000);
            this.close();
        }
    }

    typeLine(cmd) {
        return new Promise(resolve => {
            const line = document.createElement('div');
            line.className = 'terminal-line';

            if (cmd.success) line.classList.add('success');
            if (cmd.skill) line.classList.add('skill');
            if (cmd.highlight) line.classList.add('highlight');
            if (cmd.hint) line.classList.add('hint');
            if (cmd.progress) line.classList.add('progress');
            if (cmd.divider) line.classList.add('divider');
            if (cmd.icon) line.classList.add('has-icon');

            this.output.appendChild(line);

            // Typing effect
            let charIndex = 0;
            const typeChar = () => {
                if (charIndex < cmd.text.length && !this.isSkipped) {
                    line.textContent += cmd.text[charIndex];
                    charIndex++;

                    // Scroll to bottom
                    this.output.scrollTop = this.output.scrollHeight;

                    // Faster typing for progress bars and dividers
                    const speed = (cmd.progress || cmd.divider) ? 10 : 20;
                    setTimeout(typeChar, speed);
                } else {
                    line.textContent = cmd.text;
                    resolve();
                }
            };

            typeChar();
        });
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    skip() {
        this.isSkipped = true;

        // Show all remaining commands instantly
        for (let i = this.currentIndex; i < this.commands.length; i++) {
            const cmd = this.commands[i];
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.textContent = cmd.text;

            if (cmd.success) line.classList.add('success');
            if (cmd.skill) line.classList.add('skill');
            if (cmd.highlight) line.classList.add('highlight');
            if (cmd.hint) line.classList.add('hint');
            if (cmd.divider) line.classList.add('divider');
            if (cmd.icon) line.classList.add('has-icon');

            this.output.appendChild(line);
        }

        setTimeout(() => this.close(), 500);
    }

    close() {
        this.terminal.classList.add('closing');
        setTimeout(() => {
            this.terminal.remove();
            document.body.classList.add('terminal-complete');
        }, 600);
    }
}

// Add premium terminal styles
const terminalStyles = document.createElement('style');
terminalStyles.textContent = `
    .terminal-intro {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, 
            rgba(10, 25, 47, 0.98) 0%, 
            rgba(17, 34, 64, 0.98) 50%, 
            rgba(10, 25, 47, 0.98) 100%);
        backdrop-filter: blur(15px);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: terminalFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes terminalFadeIn {
        from { 
            opacity: 0;
            backdrop-filter: blur(0px);
        }
        to { 
            opacity: 1;
            backdrop-filter: blur(15px);
        }
    }

    .terminal-intro.closing {
        animation: terminalFadeOut 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes terminalFadeOut {
        to { 
            opacity: 0;
            transform: scale(0.98);
            filter: blur(5px);
        }
    }

    .terminal-window {
        width: 92%;
        max-width: 900px;
        background: linear-gradient(135deg, #0A192F 0%, #112240 100%);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 
            0 25px 80px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(0, 212, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        animation: windowSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes windowSlideIn {
        from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .terminal-header {
        background: linear-gradient(135deg, #112240 0%, #1A2F52 100%);
        padding: 14px 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        border-bottom: 1px solid rgba(0, 212, 255, 0.15);
        position: relative;
        overflow: hidden;
    }

    .terminal-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(0, 212, 255, 0.5) 50%, 
            transparent 100%);
    }

    .terminal-buttons {
        display: flex;
        gap: 8px;
        z-index: 1;
    }

    .terminal-buttons span {
        width: 13px;
        height: 13px;
        border-radius: 50%;
        display: block;
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .terminal-buttons span:hover {
        transform: scale(1.15);
        filter: brightness(1.2);
    }

    .btn-close { 
        background: linear-gradient(135deg, #FF5F56, #FF3B30);
    }
    
    .btn-minimize { 
        background: linear-gradient(135deg, #FFBD2E, #FFA500);
    }
    
    .btn-maximize { 
        background: linear-gradient(135deg, #27C93F, #00D084);
    }

    .terminal-title {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 6px;
        font-family: 'Courier New', 'Consolas', monospace;
        font-size: 14px;
        font-weight: 600;
        z-index: 1;
    }

    .terminal-icon {
        color: #0066FF;
        font-size: 16px;
        animation: iconPulse 2s ease-in-out infinite;
    }

    @keyframes iconPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
    }

    .terminal-user {
        color: #00D4FF;
        font-weight: 700;
    }

    .terminal-separator {
        color: #8892B0;
    }

    .terminal-host {
        color: #9333EA;
        font-weight: 700;
    }

    .terminal-path {
        color: #8892B0;
    }

    .terminal-status {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background: rgba(0, 212, 255, 0.1);
        border-radius: 20px;
        border: 1px solid rgba(0, 212, 255, 0.2);
        z-index: 1;
    }

    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #00FF41;
        box-shadow: 0 0 10px rgba(0, 255, 65, 0.6);
        animation: statusBlink 1.5s ease-in-out infinite;
    }

    @keyframes statusBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
    }

    .status-text {
        color: #00D4FF;
        font-size: 12px;
        font-weight: 600;
        font-family: 'Inter', sans-serif;
    }

    .terminal-body {
        padding: 25px;
        min-height: 450px;
        max-height: 550px;
        overflow-y: auto;
        position: relative;
        background: linear-gradient(180deg, 
            rgba(0, 0, 0, 0.2) 0%, 
            transparent 100%);
    }

    .terminal-welcome {
        margin-bottom: 20px;
        animation: welcomeFadeIn 0.8s ease-out;
    }

    @keyframes welcomeFadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .ascii-art {
        font-family: 'Courier New', monospace;
        font-size: 9px;
        line-height: 1.2;
        color: #0066FF;
        text-shadow: 0 0 10px rgba(0, 102, 255, 0.5);
        white-space: pre;
        margin-bottom: 15px;
        padding: 15px;
        background: rgba(0, 102, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(0, 102, 255, 0.1);
        overflow-x: auto;
    }

    .terminal-output {
        font-family: 'Courier New', 'Consolas', monospace;
        font-size: 14px;
        line-height: 1.8;
        color: #E6F1FF;
        letter-spacing: 0.3px;
    }

    .terminal-line {
        margin-bottom: 6px;
        animation: lineSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        padding-left: 4px;
    }

    @keyframes lineSlideIn {
        from {
            opacity: 0;
            transform: translateX(-15px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .terminal-line.has-icon::before {
        content: '';
        position: absolute;
        left: -8px;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 3px;
        background: currentColor;
        border-radius: 50%;
        opacity: 0.5;
    }

    .terminal-line.success {
        color: #00FF41;
        text-shadow: 0 0 8px rgba(0, 255, 65, 0.3);
    }

    .terminal-line.skill {
        color: #00D4FF;
        text-shadow: 0 0 8px rgba(0, 212, 255, 0.3);
        font-weight: 500;
    }

    .terminal-line.highlight {
        color: #FFD700;
        font-weight: 700;
        text-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
        padding: 8px 12px;
        background: linear-gradient(90deg, 
            rgba(255, 215, 0, 0.1) 0%, 
            rgba(255, 215, 0, 0.05) 100%);
        border-left: 3px solid #FFD700;
        border-radius: 4px;
        margin: 10px 0;
    }

    .terminal-line.hint {
        color: #8892B0;
        font-style: italic;
        opacity: 0.8;
    }

    .terminal-line.progress {
        color: #0066FF;
        font-weight: 600;
        text-shadow: 0 0 10px rgba(0, 102, 255, 0.4);
        letter-spacing: 1px;
    }

    .terminal-line.divider {
        color: rgba(0, 212, 255, 0.3);
        margin: 12px 0;
        text-shadow: 0 0 5px rgba(0, 212, 255, 0.2);
    }

    .terminal-skip {
        position: absolute;
        bottom: 25px;
        right: 25px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: linear-gradient(135deg, 
            rgba(0, 102, 255, 0.15), 
            rgba(0, 212, 255, 0.15));
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 25px;
        color: #00D4FF;
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        font-weight: 600;
        animation: skipPulse 2s ease-in-out infinite;
        box-shadow: 0 4px 15px rgba(0, 102, 255, 0.2);
    }

    @keyframes skipPulse {
        0%, 100% { 
            opacity: 0.7;
            transform: translateY(0);
        }
        50% { 
            opacity: 1;
            transform: translateY(-2px);
        }
    }

    .skip-icon {
        font-size: 14px;
        animation: iconSpin 3s linear infinite;
    }

    @keyframes iconSpin {
        0%, 90% { transform: rotate(0deg); }
        95% { transform: rotate(15deg); }
        100% { transform: rotate(0deg); }
    }

    /* Hide page content until terminal is done */
    body:not(.terminal-complete) .navbar,
    body:not(.terminal-complete) .hero,
    body:not(.terminal-complete) section {
        opacity: 0;
    }

    body.terminal-complete .navbar,
    body.terminal-complete .hero,
    body.terminal-complete section {
        animation: contentFadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes contentFadeIn {
        from { 
            opacity: 0; 
            transform: translateY(30px);
            filter: blur(5px);
        }
        to { 
            opacity: 1; 
            transform: translateY(0);
            filter: blur(0);
        }
    }

    /* Custom scrollbar */
    .terminal-body::-webkit-scrollbar {
        width: 10px;
    }

    .terminal-body::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
    }

    .terminal-body::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #0066FF, #00D4FF);
        border-radius: 10px;
        border: 2px solid rgba(0, 0, 0, 0.2);
    }

    .terminal-body::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #0080FF, #00E4FF);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .terminal-window {
            width: 96%;
            max-width: none;
        }

        .terminal-header {
            padding: 12px 15px;
        }

        .terminal-body {
            padding: 20px 15px;
            min-height: 350px;
            max-height: 450px;
        }

        .ascii-art {
            font-size: 7px;
            padding: 10px;
        }

        .terminal-output {
            font-size: 12px;
        }

        .terminal-skip {
            bottom: 15px;
            right: 15px;
            padding: 8px 12px;
            font-size: 11px;
        }

        .terminal-status {
            display: none;
        }

        .terminal-title {
            font-size: 12px;
        }
    }

    /* Tablet */
    @media (max-width: 1024px) and (min-width: 769px) {
        .terminal-window {
            width: 90%;
        }
    }
`;
document.head.appendChild(terminalStyles);

// Initialize terminal intro when page loads
window.addEventListener('load', () => {
    // Check if user has seen intro before (optional)
    const hasSeenIntro = sessionStorage.getItem('terminalIntroSeen');

    if (!hasSeenIntro && CONFIG.features.terminalIntro) {
        const terminal = new TerminalIntro();
        terminal.create();
        sessionStorage.setItem('terminalIntroSeen', 'true');
    } else {
        document.body.classList.add('terminal-complete');
    }
});
