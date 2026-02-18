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

### 🌊 Wave System (10 Waves)
| Wave | Name | Duration | Breach Rate | Threat |
|------|------|----------|-------------|--------|
| 1 | Reconnaissance | 1 min | 1.0× | 🔴⚫⚫⚫⚫ |
| 2 | Probing | 1:10 | 1.3× | 🔴🔴⚫⚫⚫ |
| 3 | First Strike | 1:20 | 1.6× | 🔴🔴⚫⚫⚫ |
| 4 | Escalation | 1:20 | 1.9× | 🔴🔴🔴⚫⚫ |
| 5 | Persistent Threat | 1:30 | 2.2× | 🔴🔴🔴⚫⚫ |
| 6 | Full Assault | 1:30 | 2.5× | 🔴🔴🔴🔴⚫ |
| 7 | Zero-Day Exploit | 1:40 | 2.8× | 🔴🔴🔴🔴⚫ |
| 8 | APT — Advanced | 1:40 | 3.2× | 🔴🔴🔴🔴🔴 |
| 9 | Cyber Armageddon | 1:50 | 3.6× | 🔴🔴🔴🔴🔴 |
| 10 | Final Boss | 2 min | 4.0× | 🔴🔴🔴🔴🔴 |

Shop phase between waves — spend SP on upgrades and hardware!

> ⚠️ **Passive breach** rises automatically each tick — even doing nothing will cost you!

### 🏆 Achievements (10 Unlockables)
Survive milestones, kill quotas, low breach records, and more — each grants bonus SP.

### 🎯 Difficulty Levels
| Difficulty | Hacker Speed | Breach Mult | Starting SP | Nodes |
|------------|-------------|-------------|-------------|-------|
| Easy | 0.7× | 0.8× | 25 | 4 |
| Normal | 1× | 1× | 0 | 6 |
| Hard | 1.4× | 1.4× | 0 | 8 |

### 🎮 Mini-Games
- **🧱 Firewall Tetris** — Falling network packets: block red (malicious), let green (legit) pass through
- **💀 BSOD Reversal** — Catch bouncing error codes when breach hits 100% for a second chance
- **💾 Disk Defrag** — Drag blue blocks to neutralize red malware sectors
- **🖥️ System Cooler** — Click fans to cool CPU when crypto miners overheat the system

### 📎 Animated Clippy Helper
The legendary Office paperclip is back as an **animated SVG** with 6 expressions! Appears with context-aware tips, sarcastic humor, and bilingual jokes (EN/UK). You can disable him for 10 SP if he gets annoying.

### 💾 Save/Load & New Game+
- **Save/Load** — Persist progress to localStorage, or export/import JSON save files
- **New Game+** — Beat the game to unlock NG+ with +15% breach scaling per level

### 🖥️ CRT Shader
WebGL post-processing with scanlines, vignette, and curvature for that authentic retro monitor feel.

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

1. **Select Language & Difficulty** — English or Ukrainian; Easy, Normal, or Hard
2. **Follow the Tutorial** — 12-step intro covering all mechanics
3. **Open cmd.exe** — Your most important tool
4. **Type `scan`** — Discover threats on the network
5. **Patch compromised nodes** — `patch node1`
6. **Kill malicious processes** — `taskkill /pid 1234`
7. **Avoid phishing** — Don't click suspicious email attachments
8. **Play Firewall Tetris** — Block red packets, let green ones pass
9. **Spend SP wisely** — Upgrade at Windows Update & Hardware Shop
10. **Stay active!** — Breach rises passively, even if you do nothing
11. **Save your progress** — Use Settings to save/load/export
12. **Survive all 10 waves** — Win and unlock New Game+!

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
| [Zustand 4.5](https://zustand.docs.pmnd.rs/) | State management (single store, ~1730 lines) |
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
│   ├── AchievementsApp.tsx    # Achievements — 10 unlockables
│   ├── SettingsApp.tsx        # Settings — language, difficulty, sound, save/load
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
│   ├── TutorialOverlay.tsx    # 12-step tutorial
│   ├── DifficultySelect.tsx   # Pre-game difficulty picker
│   ├── LanguageSelect.tsx     # Language picker (EN/UK)
│   ├── ClippyHelper.tsx       # Clippy assistant
│   ├── AnimatedClippySVG.tsx  # SVG Clippy with 6 expressions
│   ├── CRTShader.tsx          # WebGL CRT post-processing
│   └── NetworkMiniMap.tsx     # SVG network topology map
├── core/
│   ├── ai/
│   │   └── hackerAI.ts        # AI state machine (~520 lines)
│   ├── audio/
│   │   └── soundManager.ts    # Web Audio API sound generation
│   └── saveSystem.ts          # Save/Load + JSON export/import
├── store/
│   └── gameStore.ts           # Zustand store (~1730 lines)
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

### v0.2 — ✅ Completed
- [x] **Save/Load system** — localStorage persistence with JSON import/export
- [x] **New Game+ mode** — Restart with achievements & +15% breach scaling per level
- [x] **Network topology mini-map** — SVG real-time visual embedded in My Network Places
- [x] **Advanced CRT shader** — WebGL post-processing with scanlines, vignette & curvature
- [x] **Animated Clippy** — SVG sprite with 6 expressions + bilingual humor tips
- [x] **10-wave system** — Expanded from 7 to 10 waves with passive breach mechanic
- [x] **Floating-point precision** — All timers, scores, and values display cleanly

### v0.3 — Next Up
- [ ] **Leaderboard** — Local high scores with stats (time, kills, breach %)
- [ ] **3 new mini-games:**
  - 🔐 *Password Cracker Duel* — Type faster than the AI to win the hash race
  - 📡 *Signal Interceptor* — Tune radio frequencies to decode hacker comms
  - 🕸️ *Honeypot Builder* — Lay traps that slow down the AI
- [ ] **Boss events** — Unique scripted encounters at waves 5 and 10
- [ ] **Rare loot drops** — Random powerful one-time use items
- [ ] **Dynamic events** — Power outages, server room floods, insider threats

### v0.4 — Multiplayer & Social
- [ ] **Co-op mode** — 2 players defend the same network
- [ ] **PvP mode** — One plays hacker, one plays sysadmin
- [ ] **Daily challenges** — Seeded scenarios with global leaderboard
- [ ] **Replay system** — Watch & share your best runs

### v0.5 — Polish & Immersion
- [ ] **Full soundtrack** — Generated chiptune / synthwave tracks
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
