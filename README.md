<p align="center">
  <img src="https://img.shields.io/badge/Windows-XP-0078D6?style=for-the-badge&logo=windows-xp&logoColor=white" alt="Windows XP"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6"/>
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
</p>

<h1 align="center">🖥️ XP-Pocalypse: Breach</h1>

<p align="center">
  <strong>A nostalgic Windows XP–themed hacker defense game built entirely in the browser</strong>
</p>

<p align="center">
  <em>You are the last sysadmin. The AI hacker is inside the network. Defend Windows XP — or watch it burn.</em>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-how-to-play">How to Play</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 🎮 What Is This?

**XP-Pocalypse: Breach** is a real-time strategy / tower-defense hybrid where you play as a system administrator defending a Windows XP network from an ever-evolving AI hacker. The entire UI is styled to look and feel like the classic Windows XP desktop — complete with draggable icons, XP-styled windows, a Start menu, and even a BSOD minigame.

Everything runs in your browser. No backend. No accounts. Just pure nostalgia-fueled chaos.

---

## ✨ Features

### 🖥️ Authentic Windows XP Experience
- Pixel-perfect XP window chrome, taskbar, Start menu, and system tray
- Draggable desktop icons with classic layout
- CRT scanline & vignette overlays for that retro monitor feel
- Wallpaper corruption effects as breach level rises

### 🛡️ Core Gameplay
- **Terminal (cmd.exe)** — Your command center. Type `scan`, `patch`, `taskkill`, `netstat`, `ipconfig`, and more
- **My Network Places** — Visual network map showing node status (secure / probing / compromised)
- **Outlook Express** — Incoming phishing emails that you must identify and avoid
- **Task Manager** — Monitor and kill malicious processes eating your CPU
- **Recycle Bin** — Hidden malware disguised as innocent files
- **Windows Update** — Spend Stability Points on defensive upgrades

### 🧠 Adaptive AI Hacker
- Three-phase AI: **RECON → ATTACK → HIDE**
- Spawns phishing emails, crypto miners, ICQ spam bots
- Gets more aggressive over time with escalating events
- Reacts to your defenses and adapts strategies

### 🌊 Wave System (7 Waves)
| Wave | Name | Duration | Threat |
|------|------|----------|--------|
| 1 | Reconnaissance | 2 min | 🔴⚫⚫⚫⚫ |
| 2 | First Strike | 2.5 min | 🔴🔴⚫⚫⚫ |
| 3 | Escalation | 3 min | 🔴🔴🔴⚫⚫ |
| 4 | Full Assault | 3 min | 🔴🔴🔴⚫⚫ |
| 5 | Deep Infiltration | 3.5 min | 🔴🔴🔴🔴⚫ |
| 6 | Total War | 4 min | 🔴🔴🔴🔴🔴 |
| 7 | Final Boss | 4 min | 🔴🔴🔴🔴🔴 |

Shop phase between waves — spend SP on upgrades and hardware!

### 🏆 Achievements (10 Unlockables)
Survive milestones, kill quotas, low breach records, and more — each grants bonus SP.

### 🎯 Difficulty Levels
| Difficulty | Hacker Speed | Starting SP | Nodes |
|------------|-------------|-------------|-------|
| Easy | 0.6× | 30 | 4 |
| Normal | 1× | 0 | 6 |
| Hard | 1.5× | 0 | 8 |

### 🎮 Mini-Games
- **🧱 Firewall Tetris** — Falling network packets: block red (malicious), let green (legit) pass through
- **💀 BSOD Reversal** — Catch bouncing error codes when breach hits 100% for a second chance
- **💾 Disk Defrag** — Drag blue blocks to neutralize red malware sectors
- **🖥️ System Cooler** — Click fans to cool CPU when crypto miners overheat the system

### 📎 Clippy Helper
The legendary Office paperclip is back! Appears with context-aware tips (and occasional jokes). You can disable him for 10 SP if he gets annoying.

### 🔊 Sound & Music
All audio generated via **Web Audio API** — no sound files needed:
- XP startup chime
- Terminal keypress clicks
- Alert beeps & notifications
- Ambient drone that distorts with rising breach level
- Victory fanfare & achievement sparkles
- BSOD crash noise

### 🌐 Internationalization
Full **English** 🇬🇧 and **Ukrainian** 🇺🇦 language support.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/kystore42/xp-pocalypse-breach.git
cd xp-pocalypse-breach

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) and defend your network!

---

## 🕹️ How to Play

1. **Select Difficulty** — Choose Easy, Normal, or Hard
2. **Follow the Tutorial** — 8-step intro covering the basics
3. **Open cmd.exe** — Your most important tool
4. **Type `scan`** — Discover threats on the network
5. **Patch compromised nodes** — `patch node1`
6. **Kill malicious processes** — `taskkill /pid 1234`
7. **Avoid phishing** — Don't click suspicious email attachments
8. **Spend SP wisely** — Upgrade at Windows Update & Hardware Shop
9. **Survive all 7 waves** — Win the game!

### Terminal Commands

| Command | Description |
|---------|-------------|
| `scan` | Scan network for threats |
| `patch <nodeId>` | Repair a compromised node |
| `taskkill /pid <pid>` | Kill a process |
| `netstat` | Show network connections |
| `ipconfig` | Show IP configuration |
| `cls` | Clear terminal |
| `help` | Show all commands |
| `color <hex>` | Change terminal text color |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| [React 19](https://react.dev/) | UI framework |
| [TypeScript 5.2](https://www.typescriptlang.org/) | Type safety |
| [Vite 6](https://vite.dev/) | Build tool & dev server |
| [Zustand 4.5](https://zustand.docs.pmnd.rs/) | State management (single store, ~1600 lines) |
| [Tailwind CSS 3.4](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion 11](https://www.framer.com/motion/) | Animations |
| [Lucide React](https://lucide.dev/) | Icons |
| [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Procedural sound generation |

### Project Structure

```
src/
├── App.tsx                    # Main game shell — desktop, HUD, overlays
├── main.tsx                   # Entry point
├── index.css                  # Tailwind base + custom animations
├── apps/                      # XP-style "applications"
│   ├── TerminalApp.tsx        # cmd.exe — command interface
│   ├── NetworkMapApp.tsx      # My Network Places — node status
│   ├── OutlookApp.tsx         # Outlook Express — phishing emails
│   ├── TaskManagerApp.tsx     # Task Manager — process monitor
│   ├── RecycleBinApp.tsx      # Recycle Bin — hidden malware
│   ├── UpdateCenterApp.tsx    # Windows Update — SP upgrades
│   ├── HardwareShopApp.tsx    # Hardware shop — system upgrades
│   ├── SettingsApp.tsx        # Settings — language, difficulty, sound
│   ├── CoolerApp.tsx          # System Case — CPU cooling
│   ├── ICQApp.tsx             # ICQ — spam bot mini-game
│   ├── DefragApp.tsx          # Disk Defrag — block puzzle
│   └── FirewallTetrisApp.tsx  # Firewall Tetris — packet filter
├── components/                # Shared UI components
│   ├── XPWindow.tsx           # Draggable XP window chrome
│   ├── DesktopIcon.tsx        # Draggable desktop icon
│   ├── Taskbar.tsx            # XP taskbar + Start menu
│   ├── SystemTray.tsx         # Notification area
│   ├── ErrorPopups.tsx        # Chaotic error pop-ups
│   ├── GameOverScreen.tsx     # BSOD + reversal minigame
│   ├── WaveHUD.tsx            # Wave progress display
│   ├── WaveShopOverlay.tsx    # Between-wave shop + victory
│   ├── TutorialOverlay.tsx    # 8-step tutorial
│   ├── DifficultySelect.tsx   # Pre-game difficulty picker
│   └── ClippyHelper.tsx       # Clippy assistant
├── core/
│   ├── ai/
│   │   └── hackerAI.ts        # AI state machine (~490 lines)
│   └── audio/
│       └── soundManager.ts    # Web Audio API sound generation
├── store/
│   └── gameStore.ts           # Zustand store (~1600 lines)
├── hooks/
│   └── useTranslation.ts      # i18n hook
├── i18n/
│   └── translations.ts        # EN/UK translation dictionaries
└── assets/
    └── images/
        └── bliss.jpg           # Classic XP wallpaper
```

---

## 🗺️ Roadmap

### v0.2 — Next Up
- [ ] **Save/Load system** — localStorage persistence with import/export
- [ ] **New Game+ mode** — Restart with achievements & harder modifiers
- [ ] **Leaderboard** — Local high scores with stats (time, kills, breach %)
- [ ] **Network topology mini-map** — Real-time visual of node connections

### v0.3 — Content Expansion
- [ ] **3 new mini-games:**
  - 🔐 *Password Cracker Duel* — Type faster than the AI to win the hash race
  - 📡 *Signal Interceptor* — Tune radio frequencies to decode hacker comms
  - 🕸️ *Honeypot Builder* — Lay traps that slow down the AI
- [ ] **Boss events** — Unique scripted encounters at waves 4 and 7
- [ ] **Rare loot drops** — Random powerful one-time use items
- [ ] **Dynamic events** — Power outages, server room floods, insider threats

### v0.4 — Multiplayer & Social
- [ ] **Co-op mode** — 2 players defend the same network
- [ ] **PvP mode** — One plays hacker, one plays sysadmin
- [ ] **Daily challenges** — Seeded scenarios with global leaderboard
- [ ] **Replay system** — Watch & share your best runs

### v0.5 — Polish & Immersion
- [ ] **Full soundtrack** — Generated chiptune / synthwave tracks
- [ ] **Advanced CRT shader** — WebGL post-processing with curvature & bloom
- [ ] **Animated Clippy** — SVG sprite animation with expressions
- [ ] **Desktop themes** — Luna, Royale, Zune, Classic skins
- [ ] **Custom wallpapers** — Upload your own or use corruption-reactive ones

### v0.6 — Platform & Accessibility
- [ ] **PWA support** — Install as desktop app, play offline
- [ ] **Mobile responsive** — Touch-friendly layout for phones/tablets
- [ ] **Gamepad support** — Navigate menus and play with controller
- [ ] **Screen reader support** — ARIA labels & keyboard navigation
- [ ] **Additional languages** — DE, FR, ES, PL, JA

### 🌟 Dream Features (v1.0+)
- [ ] **Campaign mode** — Story-driven missions across different "decades" of Windows
- [ ] **Mod support** — Custom waves, AI scripts, and themes via JSON configs
- [ ] **Speedrun timer** — Built-in splits & submission to speedrun.com
- [ ] **Streaming integration** — Twitch chat votes on events

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development

```bash
npm install      # Install dependencies
npm run dev      # Start dev server with HMR
npm run build    # Type-check + production build
npm run preview  # Preview production build
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <strong>Built with 💙 and nostalgia for the greatest OS ever made</strong>
</p>

<p align="center">
  <em>Windows XP (2001–2014) — never forgotten</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-☕%20%26%20Nostalgia-yellow?style=flat-square" alt="Made with coffee and nostalgia"/>
</p>
