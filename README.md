# Portfolio Website

Website cá nhân giới thiệu các dự án và kinh nghiệm của tôi.

## Giới thiệu

Xin chào, mình là Thành Luân - developer và quản lý cộng đồng. Website này showcase:
- Phát triển web (Node.js, JavaScript)
- Discord bot development
- Tạo nội dung (TikTok, 50K+ followers)
- Quản lý cộng đồng Ma Đạo (3000+ members)

## Tech Stack

- HTML5, CSS3, JavaScript
- Hiệu ứng nền cosmic theme với animations
- Responsive design
- Music player tự động phát nhạc

## Tính năng

- Nền vũ trụ animated (nebula, aurora, shooting stars)
- Danh sách dự án có bộ lọc theo category
- Blog với thanh progress đọc
- Music player tự động
- Dark mode
- Tương thích mobile

## Chạy local

```bash
git clone https://github.com/Xiata279/portfolio-thanhluan.git
cd portfolio-thanhluan
```

Mở file `index.html` trực tiếp trong browser, hoặc dùng server:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

Truy cập `http://localhost:8000`

## Cấu trúc

```
portfolio-thanhluan/
├── index.html
├── pages/              # Các trang
├── js/                 # JavaScript modules
├── css/                # Stylesheets
├── assets/             # Hình ảnh, media
└── components/         # Reusable components
```

## Tùy chỉnh

### Background
Sửa `js/background-effects.js` để thay đổi:
- Số lượng sao và màu sắc
- Nebula clouds
- Aurora waves
- Particles

### Nhạc nền
Thêm file nhạc vào `assets/` và update playlist trong `js/music-player.js`:

```javascript
this.playlist = [
    {
        name: 'Tên bài hát',
        artist: 'Nghệ sĩ',
        url: 'assets/nhac.mp4'
    }
];
```

### Màu sắc
Màu chủ đạo trong `styles.css`:
- Primary: #0066FF
- Secondary: #00D4FF
- Dark: #0A192F

## Deploy

Live site: [xiata279.github.io/portfolio-thanhluan](https://xiata279.github.io/portfolio-thanhluan/)

Để deploy fork của bạn:
1. Settings > Pages
2. Source: Deploy from a branch
3. Branch: master, folder: / (root)
4. Đợi 2-3 phút

## Liên hệ

- GitHub: [@Xiata279](https://github.com/Xiata279)
- Discord: Ma Đạo Community
- TikTok: @madaotz

## License

MIT License

---

Coded with vanilla JavaScript - không dùng framework.

