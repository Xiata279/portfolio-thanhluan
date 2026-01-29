// Ambient Music Player
// Background music with controls

class MusicPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.volume = 0.3;
        this.currentTrack = 0;
        this.player = null;

        // Playlist - you can add your own tracks here
        this.playlist = [
            {
                name: 'Lo-fi Chill',
                artist: 'Ambient',
                url: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3'
            }
        ];

        this.loadPreferences();
        this.init();
    }

    init() {
        this.createPlayer();
        this.createAudioElement();
        this.attachEventListeners();

        // Auto-restore previous state if user had music on
        if (this.isPlaying) {
            this.play();
        }
    }

    createPlayer() {
        this.player = document.createElement('div');
        this.player.className = 'music-player';
        this.player.innerHTML = `
            <div class="music-player-container">
                <div class="music-visualizer">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
                
                <div class="music-controls">
                    <button class="music-toggle" title="Phát / Tạm dừng">
                        <i class="fas fa-play"></i>
                    </button>
                    
                    <div class="music-info">
                        <div class="track-name">Nhạc nền</div>
                        <div class="track-status">Tạm dừng</div>
                    </div>
                </div>
                
                <div class="music-volume">
                    <i class="fas fa-volume-up"></i>
                    <input type="range" min="0" max="100" value="30" class="volume-slider">
                </div>
                
                <button class="music-close" title="Đóng">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(this.player);
    }

    createAudioElement() {
        this.audio = new Audio();
        this.audio.volume = this.volume;
        this.audio.loop = true;

        // Load first track
        if (this.playlist.length > 0) {
            this.audio.src = this.playlist[this.currentTrack].url;
        }

        // Handle audio events
        this.audio.addEventListener('play', () => this.onPlay());
        this.audio.addEventListener('pause', () => this.onPause());
        this.audio.addEventListener('error', (e) => this.onError(e));
    }

    attachEventListeners() {
        const toggleBtn = this.player.querySelector('.music-toggle');
        const volumeSlider = this.player.querySelector('.volume-slider');
        const closeBtn = this.player.querySelector('.music-close');

        toggleBtn.addEventListener('click', () => this.toggle());
        volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
        closeBtn.addEventListener('click', () => this.hide());
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (!this.audio) return;

        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateUI();
            this.savePreferences();
        }).catch(err => {
            console.log('Không thể phát nhạc:', err);
            this.showNotification('Không thể phát nhạc. Vui lòng thử lại.', 'error');
        });
    }

    pause() {
        if (!this.audio) return;

        this.audio.pause();
        this.isPlaying = false;
        this.updateUI();
        this.savePreferences();
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
        this.savePreferences();
    }

    onPlay() {
        const toggleBtn = this.player.querySelector('.music-toggle i');
        const status = this.player.querySelector('.track-status');
        const visualizer = this.player.querySelector('.music-visualizer');

        toggleBtn.className = 'fas fa-pause';
        status.textContent = 'Đang phát';
        visualizer.classList.add('active');
    }

    onPause() {
        const toggleBtn = this.player.querySelector('.music-toggle i');
        const status = this.player.querySelector('.track-status');
        const visualizer = this.player.querySelector('.music-visualizer');

        toggleBtn.className = 'fas fa-play';
        status.textContent = 'Tạm dừng';
        visualizer.classList.remove('active');
    }

    onError(e) {
        console.error('Lỗi phát nhạc:', e);
        this.showNotification('Không thể tải nhạc. Kiểm tra kết nối internet.', 'error');
        this.pause();
    }

    updateUI() {
        const track = this.playlist[this.currentTrack];
        if (track) {
            const trackName = this.player.querySelector('.track-name');
            trackName.textContent = track.name;
        }
    }

    hide() {
        this.pause();
        this.player.classList.add('hidden');
        setTimeout(() => {
            this.player.style.display = 'none';
        }, 300);
    }

    show() {
        this.player.style.display = 'block';
        setTimeout(() => {
            this.player.classList.remove('hidden');
        }, 10);
    }

    loadPreferences() {
        const saved = localStorage.getItem('musicPlayerPrefs');
        if (saved) {
            try {
                const prefs = JSON.parse(saved);
                this.isPlaying = prefs.isPlaying || false;
                this.volume = prefs.volume || 0.3;
                this.currentTrack = prefs.currentTrack || 0;
            } catch (e) {
                console.error('Không thể tải preferences:', e);
            }
        }
    }

    savePreferences() {
        const prefs = {
            isPlaying: this.isPlaying,
            volume: this.volume,
            currentTrack: this.currentTrack
        };
        localStorage.setItem('musicPlayerPrefs', JSON.stringify(prefs));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `music-notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Styles for music player
const musicStyles = document.createElement('style');
musicStyles.textContent = `
    .music-player {
        position: fixed;
        bottom: 30px;
        left: 30px;
        z-index: 800;
        opacity: 0;
        transform: translateY(20px);
        animation: musicPlayerSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards;
    }

    @keyframes musicPlayerSlideIn {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .music-player.hidden {
        opacity: 0;
        transform: translateY(20px);
        pointer-events: none;
    }

    .music-player-container {
        background: linear-gradient(135deg, 
            rgba(10, 25, 47, 0.85), 
            rgba(17, 34, 64, 0.85));
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 16px;
        padding: 16px 20px;
        min-width: 280px;
        box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        gap: 12px;
        position: relative;
    }

    .music-visualizer {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 3px;
        height: 30px;
        padding: 5px 0;
    }

    .music-visualizer .bar {
        width: 3px;
        height: 10px;
        background: linear-gradient(180deg, #0066FF, #00D4FF);
        border-radius: 3px;
        transform-origin: bottom;
        transition: height 0.1s ease;
    }

    .music-visualizer.active .bar {
        animation: visualizerBounce 0.8s ease-in-out infinite;
    }

    .music-visualizer.active .bar:nth-child(1) { animation-delay: 0s; }
    .music-visualizer.active .bar:nth-child(2) { animation-delay: 0.1s; }
    .music-visualizer.active .bar:nth-child(3) { animation-delay: 0.2s; }
    .music-visualizer.active .bar:nth-child(4) { animation-delay: 0.3s; }
    .music-visualizer.active .bar:nth-child(5) { animation-delay: 0.4s; }

    @keyframes visualizerBounce {
        0%, 100% { height: 10px; }
        50% { height: 25px; }
    }

    .music-controls {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .music-toggle {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0066FF, #00D4FF);
        border: none;
        color: white;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(0, 102, 255, 0.4);
        flex-shrink: 0;
    }

    .music-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 212, 255, 0.6);
    }

    .music-toggle:active {
        transform: scale(0.95);
    }

    .music-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .track-name {
        color: #E6F1FF;
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .track-status {
        color: #8892B0;
        font-size: 12px;
    }

    .music-volume {
        display: flex;
        align-items: center;
        gap: 10px;
        padding-top: 8px;
        border-top: 1px solid rgba(0, 212, 255, 0.1);
    }

    .music-volume i {
        color: #00D4FF;
        font-size: 14px;
    }

    .volume-slider {
        flex: 1;
        height: 4px;
        border-radius: 2px;
        background: rgba(136, 146, 176, 0.2);
        outline: none;
        -webkit-appearance: none;
    }

    .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0066FF, #00D4FF);
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 102, 255, 0.4);
        transition: all 0.2s ease;
    }

    .volume-slider::-webkit-slider-thumb:hover {
        transform: scale(1.2);
        box-shadow: 0 4px 12px rgba(0, 212, 255, 0.6);
    }

    .volume-slider::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0066FF, #00D4FF);
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 6px rgba(0, 102, 255, 0.4);
    }

    .music-close {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(255, 68, 68, 0.1);
        border: 1px solid rgba(255, 68, 68, 0.3);
        color: #ff4444;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .music-close:hover {
        background: rgba(255, 68, 68, 0.2);
        transform: scale(1.1);
    }

    .music-notification {
        position: fixed;
        bottom: 100px;
        left: 30px;
        background: linear-gradient(135deg, #0A192F, #112240);
        color: #E6F1FF;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        z-index: 850;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(0, 212, 255, 0.3);
        opacity: 0;
        transform: translateX(-20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .music-notification.show {
        opacity: 1;
        transform: translateX(0);
    }

    .music-notification.error {
        border-color: rgba(255, 68, 68, 0.3);
        background: linear-gradient(135deg, #2D1515, #3D1A1A);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .music-player {
            bottom: 20px;
            left: 20px;
            right: 20px;
        }

        .music-player-container {
            min-width: auto;
            padding: 14px 16px;
        }

        .track-name {
            font-size: 13px;
        }

        .music-notification {
            left: 20px;
            right: 20px;
            bottom: 90px;
        }
    }
`;
document.head.appendChild(musicStyles);

// Initialize music player when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (CONFIG && CONFIG.features && CONFIG.features.musicPlayer !== false) {
            new MusicPlayer();
        }
    });
} else {
    if (typeof CONFIG === 'undefined' || !CONFIG.features || CONFIG.features.musicPlayer !== false) {
        new MusicPlayer();
    }
}
