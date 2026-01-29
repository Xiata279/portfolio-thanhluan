# Blog Reading Progress Feature

## What's New?

Added a professional reading progress indicator to all blog posts. This feature enhances the user experience by showing visual reading progress and estimated time remaining.

## Features

### 📊 Reading Progress Bar
- Sleek progress bar at the top of the page
- Smooth animations that follow scroll position
- Shows percentage completion (0-100%)

### ⏱️ Time Estimates
- Calculates reading time based on article length (200 words/min Vietnamese speed)
- Updates remaining time as you scroll
- Shows "Hoàn thành!" when finished

### ✅ Mark as Read
- Automatically marks articles as "read" when user scrolls past 50%
- Stores read status in localStorage
- Read articles are highlighted in the blog listing page with a "Đã đọc" badge

### 🔝 Enhanced Back-to-Top Button
- Smooth scroll-to-top functionality
- Only appears after scrolling 300px
- Stylish hover effects

## Files Modified

### New Files:
- `js/blog-reading-progress.js` - Main feature module

### Updated Files:
- `pages/blog.html` - Added script reference
- `blog-discord-bot.html` - Added script reference  
- `blog-cskh-game.html` - Added script reference
- `blog-dev-tips.html` - Added script reference
- `blog-nodejs-tips.html` - Added script reference
- `blog-tiktok.html` - Added script reference

## How It Works

1. **On Blog Listing Page**: 
   - Shows which articles you've already read with a "Đã đọc" indicator
   - Read articles have slightly faded appearance

2. **On Blog Post Page**:
   - Progress bar appears after scrolling 100px
   - Shows real-time reading progress percentage
   - Calculates and displays estimated time remaining
   - Marks article as "read" when you scroll past 50%

3. **Smart Detection**:
   - Uses article ID from data attribute, URL parameter, or slugified title
   - Persists read status across sessions using localStorage

## Design

The feature uses the portfolio's existing color scheme:
- Primary Blue: `#0066FF`
- Secondary Blue: `#00D4FF`
- Dark Background: `#0A192F` / `#112240`
- Text: `#E6F1FF`

Fully responsive and works seamlessly on mobile devices.

## Browser Support

Works on all modern browsers that support:
- ES6 JavaScript
- localStorage API
- IntersectionObserver API (for smooth scrolling detection)

## Future Enhancements (Optional)

Potential additions that can be made without touching existing code:
- Reading streak tracking
- Reading history page
- Social sharing with "I just read X" message
- Article bookmarking system
- Reading statistics dashboard
