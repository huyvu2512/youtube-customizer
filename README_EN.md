<div align="center">

# YouTube Customizer

**Comprehensive Userscript for YouTube UI Customization, Performance Optimization & Intelligent Player Controls**

[🇻🇳 Tiếng Việt](README.md) · [🇺🇸 English](README_EN.md)

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Userscript-black?logo=tampermonkey&logoColor=white)](https://www.tampermonkey.net/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Vanilla%20Dark-1572B6?logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![Version](https://img.shields.io/badge/Version-3.8.2-red)](https://github.com/huyvu2512/youtube-customizer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

[![Stars](https://img.shields.io/github/stars/huyvu2512/youtube-customizer?style=flat-square&label=Stars&color=FFCC00)](https://github.com/huyvu2512/youtube-customizer/stargazers)
[![Forks](https://img.shields.io/github/forks/huyvu2512/youtube-customizer?style=flat-square&label=Forks&color=6e7681)](https://github.com/huyvu2512/youtube-customizer/forks)
[![Issues](https://img.shields.io/github/issues/huyvu2512/youtube-customizer?style=flat-square&label=Issues&color=f85149)](https://github.com/huyvu2512/youtube-customizer/issues)
[![Last Commit](https://img.shields.io/github/last-commit/huyvu2512/youtube-customizer?style=flat-square&label=Last%20Commit&color=3fb950)](https://github.com/huyvu2512/youtube-customizer/commits/main)
![Visitors](https://visitor-badge.laobi.icu/badge?page_id=huyvu2512.youtube-customizer&left_text=Visitors&left_color=6e7681&right_color=FF0000)

[Install Script](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js) · [Report Bug](https://github.com/huyvu2512/youtube-customizer/issues) · [Request Feature](https://github.com/huyvu2512/youtube-customizer/issues)

</div>

---

<div align="center">
  <img src="assets/preview.png" alt="YouTube Customizer Interface" width="480">
</div>

---

## Introduction

**YouTube Customizer** is a high-performance Userscript running on Tampermonkey / Violentmonkey, engineered to deliver a clean, distraction-free, and immersive YouTube viewing experience. Designed and developed by Huy Vu (@huyvu2512), this project serves as an in-depth exploration of advanced DOM manipulation, video player rendering pipeline optimization, and fine-tuned browser event interactions on YouTube.

Release **v3.8.2** brings a full 21-language internationalization system with a floating non-clipped dropdown, alongside robust safeguards fixing unintended Ambilight activations upon page reload (F5) or video navigation using 2-layer CSS Fail-Safe protection.

---

## Key Features

- **Ambient Lighting (Ambilight 2.0 Cinema) ⭐** - Cinema-grade real-time ambient glow matching video frames. Features automatic black-bar detection (Letterbox skip), 100% four-corner edge coverage, and a smooth 2200px vertical diffusion extending down into comments. GPU-accelerated with auto-pause during video pause or hidden background tabs.
- **Multilingual Support (21 Languages)** - Built-in floating selector with instant panel localization across all 5 tabs and fail-safe fallback to YouTube / system locale.
- **Intuitive 5-Tab Control Panel** - Clean, organized settings divided into Interface, Clean Feed Filter, Video Player, System Optimization, and About, styled in elegant translucent dark mode.
- **Zero-Lag Performance & Smooth Layout** - Solves hitbox desynchronization, eliminates expensive `:has()` hover style recalculations, and offloads CPU main thread bottlenecks.
- **Hide Tagged Products (YouTube Shopping)** - Automatically collapses and hides the right-hand shopping panel (`engagement-panel-shopping-panel`), the shopping bag player icon, and affiliate product shelves.
- **Buffer-Safe Video Quality Preference** - Select from 5 resolution modes: Auto, Maximum (Max / 4K / 8K), 2K (1440p), 1080p (Full HD), and 720p (HD). Enforces quality once upon manifest load to prevent buffer starvation.
- **On-Screen Live Chat Overlay** - Displays live stream chat comments directly overlaid on the video: Danmaku (bullet scrolling) or Draggable Translucent Streamer Box, compatible with both active streams and Live Replays.
- **Force Live DVR (Unlock Rewind)** - Unlocks the rewind timeline slider on live streams where channel owners disabled rewinding, safely intercepting stream playback.
- **Auto Live Sync** - Locks live playback to the real-time broadcast head, mitigating lag accumulation and auto-snapping back to live upon returning from background tabs.
- **Live Chat Memory Garbage Collector** - Caps live chat DOM nodes to 100 items, periodically flushing stale memory to eliminate browser slowdowns during long streams.
- **Block AV1 / Force Hardware Codec** - Disables CPU-heavy AV1 decoding on systems without hardware acceleration, enforcing lightweight H.264 / VP9 hardware codecs to keep laptops cool and save battery.
- **Prevent Auto-Pause** - Automatically dismisses the annoying *"Video paused. Continue watching?"* dialog with debounce MutationObservers.
- **Radio Mode (Audio-Only)** - Cuts video canvas rendering while maintaining the audio stream to drastically minimize CPU, GPU, and battery consumption for podcasts and music.
- **Smart Keyboard Shortcuts** - Fast forward / rewind 10s via A / D or Numpad 4 / 6, pause / play with S or Numpad 5, volume adjustment with Numpad 8 / 2 (immune to input fields and IME conflicts).
- **Comprehensive Feed Cleanup** - Progressively strips Shorts shelves, Playables games, Members-only teasers, Community posts, and Sponsored search ads without stutter.
- **Hide Watermarks & Endscreen Overlays** - Automatically strips channel watermark logos in the lower-right corner, outro endscreen recommendation cards, and intrusive info cards.
- **Auto-Dismiss Promos** - Automatically closes YouTube Premium trial banners, surveys, and interruption prompts.
- **Custom Homepage Video Grid** - Locks the homepage and channel grid layout to 3, 4, or 5 columns persistently across page reloads.

---

## Technology Stack

| Component | Technology |
| :--- | :--- |
| Platform | Userscript (Tampermonkey, Violentmonkey) |
| Language | Vanilla JavaScript (ES6+, IIFE Bundle) |
| Styling | Vanilla CSS3 (Custom Design System, Dark Mode) |
| Packaging & Build | Node.js, esbuild |
| DOM Security | Trusted Types, Safe HTML Sanitization |
| Supported Browsers | Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, Opera, Arc |

---

## Directory Structure

```text
youtube-customizer/
├── assets/                       # Image assets and preview screenshots
│   └── preview.png               # Control panel screenshot
├── scripts/                      # Build and packaging automation
│   └── build.js                  # esbuild IIFE bundler script
├── src/                          # Modular source code
│   ├── chat/                     # Live Chat Overlay (Danmaku & Streamer Box)
│   │   ├── chatObserver.js       # Chat DOM observer
│   │   ├── chatParser.js         # Message parser, avatar, and emoji handling
│   │   ├── chatState.js          # Chat queue and state management
│   │   ├── danmaku.js            # Bullet chat overlay engine
│   │   ├── index.js              # Chat module entry point
│   │   └── streamerBox.js        # Draggable streamer chat box
│   ├── core/                     # Core configs, constants, and utilities
│   │   ├── config.js             # Configuration & localStorage manager
│   │   ├── constants.js          # SVG icons, versioning, and constants
│   │   ├── i18n.js               # Localization dictionary (20+ languages)
│   │   └── utils.js              # Trusted Types & DOM helper utilities
│   ├── features/                 # Customization and cleanup features
│   │   ├── feedFilter.js         # Shorts, Playables, Members, Community filter
│   │   ├── grid.js               # Grid layout controller (3, 4, 5 columns)
│   │   ├── index.js              # Features module entry point
│   │   ├── logo.js               # YouTube Premium logo replacer
│   │   ├── mixFilter.js          # Mixes & Radio playlist filter
│   │   ├── promos.js             # Promo & survey auto-dismisser
│   │   ├── qualityManager.js     # Video resolution preference manager
│   │   └── shoppingFilter.js     # YouTube Shopping shelf & drawer remover
│   ├── optimization/             # Hardware, RAM, and GPU optimizations
│   │   ├── audioOnly.js          # Audio-only Radio mode (power saver)
│   │   ├── chatMemoryGc.js       # Chat DOM memory garbage collector
│   │   ├── codecBlocker.js       # AV1 blocker & H.264/VP9 enforcer
│   │   ├── index.js              # Optimization module entry point
│   │   └── preventAutoPause.js   # "Continue watching?" auto-confirmer
│   ├── player/                   # Player controls and video enhancements
│   │   ├── ambientLight.js       # Ambient Lighting 2.0 Cinema engine
│   │   ├── autoLive.js           # Live stream sync & lag compensator
│   │   ├── fullscreenLock.js     # Fullscreen lock and aspect ratio handler
│   │   ├── index.js              # Player module entry point
│   │   ├── liveDvr.js            # Force Live DVR (unlock rewind)
│   │   └── shortcuts.js          # Keyboard shortcut handlers
│   ├── ui/                       # Settings panel and user interface
│   │   ├── index.js              # UI module entry point
│   │   ├── notifier.js           # GitHub version checker & notifications
│   │   ├── panel.js              # 5-tab glassmorphic settings panel
│   │   └── sync.js               # UI state synchronizer
│   ├── index.js                  # Script bootstrap & lifecycle orchestrator
│   └── styles.css                # Complete custom CSS design system
├── package.json                  # npm package configuration & build scripts
├── package-lock.json             # npm lockfile
├── tampermonkey.user.js          # Userscript metadata header
├── youtube_customizer.js         # Production bundled distribution script
├── SECURITY.md                   # Security policy & vulnerability reporting
├── LICENSE                       # MIT Open Source License
├── README.md                     # Vietnamese documentation
└── README_EN.md                  # English documentation & user guide
```

### Building from Source (For Developers)

- **Install dependencies:** `npm install`
- **Build production bundle:** `npm run build` (outputs `youtube_customizer.js`)
- **Development watch mode:** `npm run dev`

---

## Keyboard Controls

| Key | Action | Active Scope |
| :--- | :--- | :--- |
| **A / D** | Rewind / Fast-forward 10s | Cursor inside player or Fullscreen mode |
| **S** | Pause / Resume playback | Cursor inside player or Fullscreen mode |
| **Numpad 4 / 6** | Rewind / Fast-forward 10s | Global (while player is active) |
| **Numpad 5** | Pause / Resume playback | Global (while player is active) |
| **Numpad 8 / 2** | Volume Up / Down (5%) | Global (supports key hold) |
| **Numpad 1, 3, 7, 9** | Suppressed (prevents % jump) | Global |

- **IME-Safe Detection:** Keys A/S/D bind directly to physical `e.code` (`KeyA`, `KeyS`, `KeyD`), completely unaffected by accented language input engines (Vietnamese IME, Japanese IME, etc.).
- **Smart Focus Protection:** Hotkeys are automatically disabled when the cursor is focused inside search inputs, comment boxes, or live chat text fields.

---

## Installation Guide

### Step 1: Install Tampermonkey Extension

Install Tampermonkey for your preferred web browser:

[![Download Tampermonkey](https://img.shields.io/badge/DOWNLOAD-TAMPERMONKEY-black?style=for-the-badge&logo=tampermonkey)](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

> Supports: Google Chrome, Microsoft Edge, Brave, Mozilla Firefox, Opera, Arc.

---

### Step 2: Enable "Allow User Scripts" (Required on Chrome / Chromium)

On recent Chromium-based browsers running Manifest V3, you **must enable user scripts execution permission** for Tampermonkey:

[![Enable User Scripts](https://img.shields.io/badge/ENABLE-USER%20SCRIPTS-1a73e8?style=for-the-badge&logo=googlechrome&logoColor=white)](chrome://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo)

1. Open the following URL in your browser address bar:
   ```text
   chrome://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo
   ```
2. Locate and toggle ON: **"Allow user scripts"**.

---

### Step 3: Install YouTube Customizer

#### Method 1: One-Click Installation (Recommended)

[![Install Script](https://img.shields.io/badge/INSTALL-SCRIPT-2ea44f?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js)

1. Click the **INSTALL SCRIPT** button above (or open the [direct script link](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js)).
2. Tampermonkey will open the installation window; click **Install** (or **Update**).
3. Open YouTube or refresh any active tab (`F5`) to enjoy!

#### Method 2: Manual Installation via Source Code

1. Open Tampermonkey Dashboard, click **Create a new script** (`+`).
2. Clear the default template content.
3. Open [`tampermonkey.user.js`](./tampermonkey.user.js), remove the `@require ...` line.
4. Copy the entire contents of [`youtube_customizer.js`](./youtube_customizer.js) and paste directly below the metadata header.
5. Press `Ctrl + S` to save, then reload YouTube.

---

## Documentation

| Document | Description |
| :--- | :--- |
| [SECURITY.md](./SECURITY.md) | Security policy, DOM data privacy, and vulnerability disclosure |
| [LICENSE](./LICENSE) | MIT Open Source License |

---

## Disclaimer

This project is an open-source Userscript created solely for educational and research purposes into client-side DOM manipulation, web performance optimization, and personalized browsing experience. It is not affiliated with, sponsored by, or endorsed by Google LLC or YouTube. "YouTube" and its associated logos and trademarks are the property of Google LLC.

Users assume full responsibility for installing and using this script in their browser. The author assumes no liability for unintended or improper usage.

---

## License

Released under the [MIT License](./LICENSE).
