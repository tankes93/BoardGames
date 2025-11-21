# Board Games Collection

A modern, fully responsive collection of 8 classic board games built with vanilla JavaScript, optimized for all devices.

![Board Games Preview](https://img.shields.io/badge/Games-8-00d4ff) ![Platform](https://img.shields.io/badge/Platform-Web-brightgreen) ![Responsive](https://img.shields.io/badge/Responsive-Yes-success) ![License](https://img.shields.io/badge/License-MIT-blue)

## Project Overview

Board Games Collection is a comprehensive web-based gaming platform featuring 8 beautifully designed classic games. Built with pure JavaScript, HTML5, and CSS3, this project showcases modern web development practices with a focus on cross-device compatibility and responsive design.

Each game features:
• Touch and mouse input support
• Responsive layouts (320px to 4K displays)
• Dark theme with neon cyan accents
• Smooth animations and transitions
• LocalStorage for score persistence

## Features

• **8 Classic Games** — Minesweeper, Connect 4, 2048, Sudoku, Tetris, Snake, Snake & Ladder, Ludo
• **100% Responsive** — Optimized for mobile, tablet, and desktop
• **Touch-Friendly** — Unified input handling for touch, mouse, and keyboard
• **Cross-Device** — Works seamlessly on iOS, Android, and Desktop browsers
• **Scroll Lock** — Lock page scrolling during mobile gameplay (Tetris, 2048, Snake)
• **Swipe Controls** — Native swipe gestures for mobile games
• **Dark Theme** — Sleek black background with cyan neon accents
• **Smooth Animations** — Scroll animations and interactive transitions

## Games Included

| Game | Description | Controls |
|------|-------------|----------|
| 💣 Minesweeper | Classic mine detection puzzle | Click/Tap, Long-press to mark |
| 🔴 Connect 4 | Strategic disc-drop game | Touch/Click columns |
| 🔢 2048 | Number merging puzzle | Swipe/Arrow keys |
| 🧩 Sudoku | Logic-based number placement | Touch/Click cells |
| 🎮 Tetris | Falling block puzzle | Swipe/Arrow keys |
| 🐍 Snake | Classic snake growing game | Swipe/Arrow keys |
| 🎲 Snake & Ladder | Board dice game (1-4 players) | Touch/Click dice |
| 🎯 Ludo | Strategic multiplayer board game | Touch/Click |

## Requirements

• Python 3.x (for local server, optional)
• Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation and Usage

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tankes93/BoardGames.git
   cd BoardGames
   ```

2. Serve the folder locally (recommended):
   ```bash
   python3 -m http.server 8000
   # then open http://localhost:8000 in your browser
   ```

   Or simply open `index.html` directly in your browser.

### Usage

• Open the landing page and browse the game collection
• Click/tap any game to start playing
• On mobile: Use the **Lock Scroll** button for better gameplay
• All games support both touch and keyboard controls

## Project Structure

```
BoardGames/
├── index.html                  # Landing page
├── index.css                   # Landing page styles
│
├── scripts/                    # Shared utilities
│   ├── inputHandler.js        # Universal input handling
│   ├── responsiveUtils.js     # Responsive helpers
│   ├── responsive.css         # Shared responsive styles
│   ├── importNavbar.js        # Navigation component
│   ├── utils.js               # Theme utilities
│   └── BoardGames.js          # Landing page logic
│
├── Minesweeper/               # Mine detection game
├── Connect4/                  # Connect Four game
├── 2048/                      # 2048 puzzle game
├── Sudoku/                    # Sudoku puzzle game
├── Tetris/                    # Tetris block game
├── Snake/                     # Snake growing game
├── SnakeNLadder/             # Board dice game
└── Ludo/                      # Ludo board game
```

## Technologies Used

• **HTML5 & CSS3** — Semantic markup, Flexbox, Grid, Animations
• **JavaScript (ES6+)** — Vanilla JS with modern syntax
• **jQuery 3.4.1** — DOM manipulation
• **Bootstrap 3.4.1** — Grid system foundation
• **Font Awesome 4.7** — Icon library
• **SweetAlert2** — Beautiful notifications
• **Vue.js 2** — Used in Snake and Ludo games

### Custom Utilities

• **inputHandler.js** — Unified touch/mouse/keyboard input
• **responsiveUtils.js** — Device detection and responsive helpers
• **responsive.css** — Reusable responsive components

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Safari iOS | 14+ | ✅ Fully Supported |
| Chrome Mobile | Latest | ✅ Fully Supported |

## Key Features

### Cross-Device Input Handling
Automatically handles touch, mouse, and keyboard:
```javascript
InputHandler.onClick(element, callback, {
    onLongPress: callback,
    onDoubleTap: callback
});
```

### Responsive Design System
• Breakpoints: xs (< 768px), sm (768-991px), md (992-1199px), lg (≥ 1200px)
• Touch Targets: Minimum 44x44px for mobile accessibility
• Performance: Optimized animations and reduced motion support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License
Copyright (c) 2025 Tejas Lanke
```

## Contact

**Tejas Lanke**

• GitHub: [@tankes93](https://github.com/tankes93)
• LinkedIn: [tejas-lanke](https://www.linkedin.com/in/tejas-lanke)
• Email: tejaslanke.work@gmail.com
