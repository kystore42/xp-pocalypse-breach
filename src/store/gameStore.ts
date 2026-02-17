import { create } from 'zustand';
import type { Language } from '../i18n/translations';
import { getTranslation } from '../i18n/translations';
import { playAlert, playNotification, playProcessKill, playBreachPulse, playWaveComplete, playAchievement, playBSOD, playKeyPress } from '../core/audio/soundManager';
import { saveGame as saveFn, loadGame as loadFn, exportSave as exportFn, importSave as importFn, downloadFile } from '../core/saveSystem';

// ============== ТИПЫ ==============

export type HackerState = 'RECON' | 'ATTACK' | 'HIDE';

export interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  status: 'secure' | 'probing' | 'compromised' | 'offline';
  password: string;        // текущий пароль
  difficulty: number;      // 1-5, сложность взлома
  firewalled: boolean;
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  time: string;
  isPhishing: boolean;
  read: boolean;
  clickedLink: boolean;    // игрок кликнул на фишинговую ссылку
  attachment?: string;
}

export interface RecycleBinItem {
  id: string;
  name: string;
  isMalware: boolean;
  size: string;
  deleted: boolean;        // удалено игроком
}

export interface Notification {
  id: string;
  text: string;
  type: 'info' | 'warning' | 'error' | 'success';
  time: number;            // timestamp
  dismissed: boolean;
}

export interface Process {
  pid: number;
  name: string;
  cpu: number;
  mem: string;
  isMalicious: boolean;
  hidden: boolean;         // скрыт без Deep Scan
}

export interface ErrorPopup {
  id: string;
  code: string;
  message: string;
  x: number;
  y: number;
}

export interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'warning' | 'system';
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  icon: string;
}

export interface ICQMessage {
  id: string;
  from: string;
  text: string;
  time: string;
  isAlly: boolean;
}

export interface BSODError {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  code: string;
  caught: boolean;
}

export interface DefragCell {
  type: 'empty' | 'blue' | 'red' | 'safe';
}

export interface HardwareItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;      // current level
  maxLevel: number;   // max upgrade level
  icon: string;
  stat: string;       // what it boosts
}

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface WaveConfig {
  id: number;
  name: string;
  duration: number;       // seconds
  hackerPhase: HackerState;
  aggressionBonus: number;
  breachRateMultiplier: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: number;         // SP reward
  unlocked: boolean;
  check: string;          // identifier for the check function
}

export interface ClippyMessage {
  id: string;
  text: string;
  type: 'tip' | 'warning' | 'joke';
  dismissed: boolean;
}

export interface FWTetrisPacket {
  id: string;
  col: number;
  row: number;            // fractional, increases over time
  type: 'good' | 'bad';
  label: string;
}

export type WindowId = 'network' | 'cmd' | 'outlook' | 'recycleBin' | 'taskMgr' | 'updateCenter' | 'settings' | 'cooler' | 'icq' | 'defrag' | 'hardwareShop' | 'firewallTetris' | 'achievements';

export interface WindowState {
  id: WindowId;
  isOpen: boolean;
  zIndex: number;
  position: { x: number; y: number };
  minimized: boolean;
}

// ============== СОСТОЯНИЕ ИГРЫ ==============

interface GameState {
  // --- Language ---
  language: Language;
  setLanguage: (lang: Language) => void;

  // --- Время ---
  gameTime: number;              // секунды с начала игры
  realStartTime: number;         // timestamp запуска
  isPaused: boolean;
  gameOver: boolean;

  // --- Breach Level ---
  breachLevel: number;           // 0-100
  maxBreachLevel: number;        // 100 = game over
  cpuTemp: number;               // 0-100, визуальный показатель

  // --- AI Hacker ---
  hackerState: HackerState;
  hackerAggression: number;      // 0-10, растет со временем
  hackerAdminAccess: boolean;    // получил ли ИИ админ-доступ
  attackCooldown: number;        // секунды до следующей атаки
  currentTargetNodeId: string | null;
  bruteforceProgress: number;    // 0-100

  // --- Network ---
  nodes: NetworkNode[];
  blockedIPs: string[];

  // --- Email ---
  emails: Email[];
  unreadCount: number;

  // --- Recycle Bin ---
  recycleBinItems: RecycleBinItem[];

  // --- Processes ---
  processes: Process[];

  // --- Notifications ---
  notifications: Notification[];

  // --- Error Popups (Visual Chaos) ---
  errorPopups: ErrorPopup[];

  // --- Terminal ---
  terminalHistory: TerminalLine[];

  // --- Windows ---
  windows: Record<WindowId, WindowState>;
  nextZIndex: number;

  // --- Upgrades & Stability Points ---
  stabilityPoints: number;
  upgrades: Upgrade[];

  // --- Visual Chaos ---
  screenShake: boolean;
  windowTrails: boolean;
  wallpaperCorrupted: boolean;
  startButtonRunning: boolean;   // кнопка Пуск убегает

  // --- Thermal Management ---
  minerActive: boolean;
  dustLevel: number;             // 0-100
  liquidCoolingActive: boolean;

  // --- ICQ Spam ---
  icqMessages: ICQMessage[];
  icqSpamActive: boolean;
  registryPassword: string;
  registryUsed: boolean;

  // --- BSOD Mini-game ---
  bsodMinigame: boolean;
  bsodErrors: BSODError[];
  bsodCaughtCount: number;
  bsodTotalErrors: number;
  bsodTimeLeft: number;

  // --- Defrag Mini-game ---
  defragGrid: DefragCell[][];
  defragActive: boolean;
  defragScore: number;

  // --- Autocomplete prompt ---
  autocompletePromptShown: boolean;

  // --- Hardware Shop ---
  hardware: HardwareItem[];

  // --- Waves ---
  currentWave: number;           // 0-based index
  waveTimeLeft: number;          // seconds left in current wave
  wavePaused: boolean;           // between waves (shop phase)
  wavesCompleted: number;
  totalWaves: number;
  gameWon: boolean;

  // --- Difficulty ---
  difficulty: Difficulty;

  // --- Achievements ---
  achievements: Achievement[];
  totalProcessesKilled: number;
  lowBreachTime: number;         // consecutive seconds with breach < 10

  // --- Tutorial ---
  tutorialStep: number;          // -1 = done, 0-N = current step
  tutorialActive: boolean;

  // --- Clippy ---
  clippyVisible: boolean;
  clippyMessage: ClippyMessage | null;
  clippyDisabled: boolean;

  // --- Firewall Tetris ---
  fwTetrisActive: boolean;
  fwTetrisPackets: FWTetrisPacket[];
  fwTetrisScore: number;
  fwTetrisMissed: number;
  fwTetrisSpeed: number;
  fwTetrisTimeLeft: number;

  // --- New Game+ ---
  newGamePlusLevel: number;      // 0 = first run, 1+ = NG+ level

  // --- ACTIONS ---
  tick: () => void;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, pos: { x: number; y: number }) => void;
  minimizeWindow: (id: WindowId) => void;

  executeCommand: (cmd: string) => void;
  addTerminalLine: (line: TerminalLine) => void;

  addNotification: (n: Omit<Notification, 'id' | 'time' | 'dismissed'>) => void;
  dismissNotification: (id: string) => void;

  readEmail: (id: string) => void;
  clickEmailLink: (id: string) => void;

  deleteRecycleBinItem: (id: string) => void;
  emptyRecycleBin: () => void;

  blockIP: (ip: string) => void;
  unblockIP: (ip: string) => void;

  purchaseUpgrade: (id: string) => void;

  dismissErrorPopup: (id: string) => void;
  dismissAllErrors: () => void;

  addBreachLevel: (amount: number) => void;
  removeBreachLevel: (amount: number) => void;
  addStabilityPoints: (amount: number) => void;
  
  killProcess: (pid: number) => void;
  
  // --- Thermal ---
  clickCooler: () => void;

  // --- ICQ ---
  addICQMessage: (msg: Omit<ICQMessage, 'id'>) => void;
  useRegistryPassword: (password: string) => void;

  // --- BSOD Mini-game ---
  startBSODMinigame: () => void;
  catchBSODError: (id: string) => void;
  bsodTick: () => void;

  // --- Defrag ---
  startDefrag: () => void;
  moveDefragBlock: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
  defragTick: () => void;

  // --- Hardware Shop ---
  upgradeHardware: (id: string) => void;

  // --- Waves ---
  startNextWave: () => void;
  waveTick: () => void;

  // --- Difficulty ---
  setDifficulty: (d: Difficulty) => void;

  // --- Achievements ---
  checkAchievements: () => void;

  // --- Tutorial ---
  advanceTutorial: () => void;
  skipTutorial: () => void;

  // --- Clippy ---
  showClippy: (text: string, type: ClippyMessage['type']) => void;
  dismissClippy: () => void;
  disableClippy: () => void;

  // --- Firewall Tetris ---
  startFirewallTetris: () => void;
  fwTetrisClick: (id: string) => void;
  fwTetrisTick: () => void;

  // --- Save/Load ---
  saveGame: () => boolean;
  loadSave: () => boolean;
  exportSave: () => void;
  importSave: (json: string) => boolean;

  // --- New Game+ ---
  startNewGamePlus: () => void;

  resetGame: () => void;
}

// ============== НАЧАЛЬНЫЕ ДАННЫЕ ==============

const initialNodes: NetworkNode[] = [
  { id: 'node1', name: 'Main Server', ip: '192.168.1.1', status: 'secure', password: 'admin123', difficulty: 2, firewalled: false },
  { id: 'node2', name: 'Database', ip: '192.168.1.10', status: 'secure', password: 'db_secure', difficulty: 3, firewalled: false },
  { id: 'node3', name: 'Mail Server', ip: '192.168.1.20', status: 'secure', password: 'mail@xp', difficulty: 2, firewalled: false },
  { id: 'node4', name: 'Backup NAS', ip: '192.168.1.50', status: 'secure', password: 'backup2024', difficulty: 1, firewalled: false },
  { id: 'node5', name: 'Firewall Gateway', ip: '10.0.0.1', status: 'secure', password: 'fw_root', difficulty: 4, firewalled: true },
  { id: 'node6', name: 'Workstation #3', ip: '192.168.1.103', status: 'secure', password: 'user', difficulty: 1, firewalled: false },
];

const initialUpgrades: Upgrade[] = [
  { id: 'cmd_autocomplete', name: 'Command Autocomplete', description: 'Tab-completion for terminal commands', cost: 10, purchased: false, icon: '⌨️' },
  { id: 'firewall_v2', name: 'Firewall v2.0', description: 'Автоматически блокирует 20% простых атак', cost: 50, purchased: false, icon: '🛡️' },
  { id: 'deep_scan', name: 'Deep Scan', description: 'Позволяет видеть скрытые процессы в Task Manager', cost: 80, purchased: false, icon: '🔬' },
  { id: 'ai_decoy', name: 'AI-Decoy', description: 'Создаёт ложную папку, на которую ИИ тратит время', cost: 100, purchased: false, icon: '🪤' },
  { id: 'auto_patch', name: 'Auto-Patcher', description: 'Автоматически восстанавливает 1 Breach Level каждые 30с', cost: 60, purchased: false, icon: '🩹' },
  { id: 'encryption', name: 'AES-256 Encryption', description: 'Увеличивает сложность взлома всех узлов на +1', cost: 120, purchased: false, icon: '🔐' },
  { id: 'liquid_cooling', name: 'Liquid Cooling', description: 'Drastically reduces CPU temperature buildup', cost: 40, purchased: false, icon: '💧' },
];

const initialProcesses: Process[] = [
  { pid: 4, name: 'System', cpu: 1, mem: '4 MB', isMalicious: false, hidden: false },
  { pid: 112, name: 'csrss.exe', cpu: 0, mem: '3 MB', isMalicious: false, hidden: false },
  { pid: 360, name: 'winlogon.exe', cpu: 0, mem: '5 MB', isMalicious: false, hidden: false },
  { pid: 512, name: 'svchost.exe', cpu: 2, mem: '12 MB', isMalicious: false, hidden: false },
  { pid: 744, name: 'explorer.exe', cpu: 3, mem: '24 MB', isMalicious: false, hidden: false },
  { pid: 820, name: 'lsass.exe', cpu: 0, mem: '8 MB', isMalicious: false, hidden: false },
  { pid: 1024, name: 'taskmgr.exe', cpu: 1, mem: '6 MB', isMalicious: false, hidden: false },
];

const initialHardware: HardwareItem[] = [
  { id: 'cpu_cooler', name: 'CPU Cooler', description: 'Reduces temperature by 5°C per level', cost: 15, level: 0, maxLevel: 4, icon: '❄️', stat: 'cooling' },
  { id: 'ram_stick', name: 'RAM Module', description: 'Allows +2 extra processes before lag per level', cost: 20, level: 0, maxLevel: 3, icon: '🧩', stat: 'memory' },
  { id: 'hdd_upgrade', name: 'HDD → SSD', description: 'Defrag runs 25% faster per level', cost: 30, level: 0, maxLevel: 2, icon: '💾', stat: 'disk' },
  { id: 'nic_card', name: 'Network Card', description: 'Scan command reveals +1 extra node per level', cost: 25, level: 0, maxLevel: 3, icon: '🌐', stat: 'network' },
  { id: 'psu_upgrade', name: 'Power Supply', description: 'Reduces breach rate by 5% per level', cost: 35, level: 0, maxLevel: 3, icon: '🔌', stat: 'power' },
  { id: 'case_fan', name: 'Case Fan', description: 'Dust accumulates 20% slower per level', cost: 10, level: 0, maxLevel: 5, icon: '🌀', stat: 'airflow' },
];

const WAVES: WaveConfig[] = [
  { id: 1, name: 'Reconnaissance',     duration: 60,  hackerPhase: 'RECON',  aggressionBonus: 1, breachRateMultiplier: 1.0 },
  { id: 2, name: 'Probing',            duration: 70,  hackerPhase: 'RECON',  aggressionBonus: 2, breachRateMultiplier: 1.3 },
  { id: 3, name: 'First Strike',       duration: 80,  hackerPhase: 'ATTACK', aggressionBonus: 3, breachRateMultiplier: 1.6 },
  { id: 4, name: 'Escalation',         duration: 80,  hackerPhase: 'ATTACK', aggressionBonus: 4, breachRateMultiplier: 1.9 },
  { id: 5, name: 'Persistent Threat',  duration: 90,  hackerPhase: 'ATTACK', aggressionBonus: 5, breachRateMultiplier: 2.2 },
  { id: 6, name: 'Full Assault',       duration: 90,  hackerPhase: 'ATTACK', aggressionBonus: 6, breachRateMultiplier: 2.5 },
  { id: 7, name: 'Zero-Day Exploit',   duration: 100, hackerPhase: 'ATTACK', aggressionBonus: 7, breachRateMultiplier: 2.8 },
  { id: 8, name: 'APT — Advanced',     duration: 100, hackerPhase: 'ATTACK', aggressionBonus: 8, breachRateMultiplier: 3.2 },
  { id: 9, name: 'Cyber Armageddon',   duration: 110, hackerPhase: 'ATTACK', aggressionBonus: 9, breachRateMultiplier: 3.6 },
  { id: 10, name: 'Final Boss',        duration: 120, hackerPhase: 'ATTACK', aggressionBonus: 10, breachRateMultiplier: 4.0 },
];

const DIFFICULTY_CONFIG: Record<Difficulty, { hackerSpeedMult: number; startingSP: number; nodeCount: number; breachMult: number }> = {
  easy:   { hackerSpeedMult: 0.7, startingSP: 25, nodeCount: 4, breachMult: 0.8 },
  normal: { hackerSpeedMult: 1.0, startingSP: 0,  nodeCount: 6, breachMult: 1.0 },
  hard:   { hackerSpeedMult: 1.4, startingSP: 0,  nodeCount: 8, breachMult: 1.4 },
};

const hardNodes: NetworkNode[] = [
  { id: 'node7', name: 'DMZ Proxy', ip: '10.0.1.5', status: 'secure', password: 'proxy_adm', difficulty: 3, firewalled: false },
  { id: 'node8', name: 'SCADA Controller', ip: '10.0.2.10', status: 'secure', password: 'scada_key', difficulty: 5, firewalled: true },
];

const initialAchievements: Achievement[] = [
  { id: 'survive_5', name: 'Survivor', description: 'Survive for 5 minutes', icon: '⏱️', reward: 15, unlocked: false, check: 'survive_5' },
  { id: 'survive_10', name: 'Veteran', description: 'Survive for 10 minutes', icon: '🎖️', reward: 30, unlocked: false, check: 'survive_10' },
  { id: 'kill_10', name: 'Exterminator', description: 'Kill 10 malicious processes', icon: '🔫', reward: 20, unlocked: false, check: 'kill_10' },
  { id: 'kill_20', name: 'Cyber Warrior', description: 'Kill 20 malicious processes', icon: '⚔️', reward: 40, unlocked: false, check: 'kill_20' },
  { id: 'low_breach_3min', name: 'Fortress', description: 'Keep breach below 10% for 3 minutes', icon: '🏰', reward: 25, unlocked: false, check: 'low_breach_3min' },
  { id: 'all_upgrades', name: 'Fully Loaded', description: 'Purchase all software upgrades', icon: '💎', reward: 50, unlocked: false, check: 'all_upgrades' },
  { id: 'patch_5', name: 'Patcher', description: 'Patch 5 compromised nodes', icon: '🩹', reward: 15, unlocked: false, check: 'patch_5' },
  { id: 'wave_3', name: 'Wave Surfer', description: 'Complete Wave 3', icon: '🌊', reward: 20, unlocked: false, check: 'wave_3' },
  { id: 'wave_7', name: 'Unbreakable', description: 'Complete all 10 waves', icon: '🏆', reward: 100, unlocked: false, check: 'wave_7' },
  { id: 'bsod_win', name: 'Blue Screen Hero', description: 'Survive a BSOD minigame', icon: '💙', reward: 15, unlocked: false, check: 'bsod_win' },
];

const TUTORIAL_STEPS = [
  { key: 'tutorial.welcome', highlight: null },
  { key: 'tutorial.scanFirst', highlight: 'cmd' },
  { key: 'tutorial.checkNetwork', highlight: 'network' },
  { key: 'tutorial.patchNodes', highlight: 'cmd' },
  { key: 'tutorial.killProcesses', highlight: 'taskMgr' },
  { key: 'tutorial.watchOutlook', highlight: 'outlook' },
  { key: 'tutorial.earnSP', highlight: 'updateCenter' },
  { key: 'tutorial.hardwareShop', highlight: 'hardwareShop' },
  { key: 'tutorial.firewallTetris', highlight: 'firewallTetris' },
  { key: 'tutorial.passiveBreach', highlight: null },
  { key: 'tutorial.saveLoad', highlight: 'settings' },
  { key: 'tutorial.goodLuck', highlight: null },
];

export { WAVES, DIFFICULTY_CONFIG, TUTORIAL_STEPS };

const initialWindows: Record<WindowId, WindowState> = {
  network: { id: 'network', isOpen: false, zIndex: 10, position: { x: 80, y: 60 }, minimized: false },
  cmd: { id: 'cmd', isOpen: false, zIndex: 10, position: { x: 200, y: 120 }, minimized: false },
  outlook: { id: 'outlook', isOpen: false, zIndex: 10, position: { x: 120, y: 80 }, minimized: false },
  recycleBin: { id: 'recycleBin', isOpen: false, zIndex: 10, position: { x: 300, y: 150 }, minimized: false },
  taskMgr: { id: 'taskMgr', isOpen: false, zIndex: 10, position: { x: 250, y: 100 }, minimized: false },
  updateCenter: { id: 'updateCenter', isOpen: false, zIndex: 10, position: { x: 150, y: 90 }, minimized: false },
  settings: { id: 'settings', isOpen: false, zIndex: 10, position: { x: 200, y: 100 }, minimized: false },
  cooler: { id: 'cooler', isOpen: false, zIndex: 10, position: { x: 180, y: 70 }, minimized: false },
  icq: { id: 'icq', isOpen: false, zIndex: 10, position: { x: 350, y: 60 }, minimized: false },
  defrag: { id: 'defrag', isOpen: false, zIndex: 10, position: { x: 100, y: 50 }, minimized: false },
  hardwareShop: { id: 'hardwareShop', isOpen: false, zIndex: 10, position: { x: 160, y: 80 }, minimized: false },
  firewallTetris: { id: 'firewallTetris', isOpen: false, zIndex: 10, position: { x: 140, y: 60 }, minimized: false },
  achievements: { id: 'achievements', isOpen: false, zIndex: 10, position: { x: 220, y: 90 }, minimized: false },
};

let notifCounter = 0;
let errorCounter = 0;

// ============== STORE ==============

export const useGameStore = create<GameState>((set, get) => ({
  // --- Language ---
  language: 'en' as Language,
  setLanguage: (lang: Language) => set({ language: lang }),

  // --- Время ---
  gameTime: 0,
  realStartTime: Date.now(),
  isPaused: false,
  gameOver: false,

  // --- Breach ---
  breachLevel: 0,
  maxBreachLevel: 100,
  cpuTemp: 25,

  // --- Hacker ---
  hackerState: 'RECON',
  hackerAggression: 1,
  hackerAdminAccess: false,
  attackCooldown: 30,
  currentTargetNodeId: null,
  bruteforceProgress: 0,

  // --- Data ---
  nodes: [...initialNodes],
  blockedIPs: [],
  emails: [],
  unreadCount: 0,
  recycleBinItems: [],
  processes: [...initialProcesses],
  notifications: [],
  errorPopups: [],
  terminalHistory: [
    { text: 'Microsoft Windows XP [Version 5.1.2600]', type: 'system' },
    { text: '(C) Copyright 1985-2001 Microsoft Corp.', type: 'system' },
    { text: '', type: 'system' },
  ],

  // --- Windows ---
  windows: { ...initialWindows },
  nextZIndex: 20,

  // --- Upgrades ---
  stabilityPoints: 0,
  upgrades: [...initialUpgrades],

  // --- Visual Chaos ---
  screenShake: false,
  windowTrails: false,
  wallpaperCorrupted: false,
  startButtonRunning: false,

  // --- Thermal ---
  minerActive: false,
  dustLevel: 0,
  liquidCoolingActive: false,

  // --- ICQ ---
  icqMessages: [],
  icqSpamActive: false,
  registryPassword: 'XP-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
  registryUsed: false,

  // --- BSOD Mini-game ---
  bsodMinigame: false,
  bsodErrors: [],
  bsodCaughtCount: 0,
  bsodTotalErrors: 8,
  bsodTimeLeft: 0,

  // --- Defrag ---
  defragGrid: [],
  defragActive: false,
  defragScore: 0,

  // --- Autocomplete ---
  autocompletePromptShown: false,

  // --- Hardware ---
  hardware: [...initialHardware],

  // --- Waves ---
  currentWave: 0,
  waveTimeLeft: WAVES[0].duration,
  wavePaused: false,
  wavesCompleted: 0,
  totalWaves: WAVES.length,
  gameWon: false,

  // --- Difficulty ---
  difficulty: 'normal' as Difficulty,

  // --- Achievements ---
  achievements: initialAchievements.map(a => ({ ...a })),
  totalProcessesKilled: 0,
  lowBreachTime: 0,

  // --- Tutorial ---
  tutorialStep: 0,
  tutorialActive: true,

  // --- Clippy ---
  clippyVisible: false,
  clippyMessage: null,
  clippyDisabled: false,

  // --- Firewall Tetris ---
  fwTetrisActive: false,
  fwTetrisPackets: [],
  fwTetrisScore: 0,
  fwTetrisMissed: 0,
  fwTetrisSpeed: 1,
  fwTetrisTimeLeft: 0,

  // --- New Game+ ---
  newGamePlusLevel: 0,

  // ============== ACTIONS ==============

  tick: () => {
    const state = get();
    if (state.isPaused || state.gameOver || state.wavePaused || state.gameWon) return;

    const newGameTime = state.gameTime + 1;
    
    // Wave-based aggression
    const wave = WAVES[state.currentWave] || WAVES[WAVES.length - 1];
    const diffConfig = DIFFICULTY_CONFIG[state.difficulty];
    const baseAggression = Math.min(10, 1 + Math.floor(newGameTime / 60));
    const aggression = Math.min(10, baseAggression + wave.aggressionBonus);

    // Hardware bonuses
    const cpuCoolerLevel = state.hardware.find(h => h.id === 'cpu_cooler')?.level ?? 0;
    const caseFanLevel = state.hardware.find(h => h.id === 'case_fan')?.level ?? 0;

    // CPU temp follows breach level + miner heat
    const minerHeat = state.minerActive ? 15 : 0;
    const dustPenalty = state.dustLevel * 0.3;
    const coolingBonus = state.liquidCoolingActive ? 20 : 0;
    const hwCoolingBonus = cpuCoolerLevel * 5;
    const targetTemp = 25 + (state.breachLevel * 0.7) + minerHeat + dustPenalty - coolingBonus - hwCoolingBonus;
    const newTemp = state.cpuTemp + (targetTemp - state.cpuTemp) * 0.1;

    // Dust accumulates slowly — case fan reduces rate
    const dustRate = state.minerActive ? 0.3 : 0.05;
    const dustMultiplier = Math.max(0.1, 1 - caseFanLevel * 0.2);
    const newDust = Math.round(Math.min(100, state.dustLevel + dustRate * dustMultiplier) * 100) / 100;

    // Visual chaos thresholds
    const shake = state.breachLevel > 40;
    const trails = state.breachLevel > 60;
    const wallpaper = state.breachLevel > 75;
    const startRun = state.breachLevel > 80;

    // Auto patcher
    const hasAutoPatch = state.upgrades.find(u => u.id === 'auto_patch')?.purchased;
    let breachReduction = 0;
    if (hasAutoPatch && newGameTime % 30 === 0 && state.breachLevel > 0) {
      breachReduction = 1;
    }

    // Passive breach — the network is under constant pressure
    const passiveBreachRate = 0.15 * wave.breachRateMultiplier * diffConfig.breachMult;
    const psuLevel = state.hardware.find(h => h.id === 'psu_upgrade')?.level ?? 0;
    const passiveResistance = Math.max(0.3, 1 - psuLevel * 0.05);
    const passiveBreach = passiveBreachRate * passiveResistance;

    // AI decoy slows down brute
    const hasDecoy = state.upgrades.find(u => u.id === 'ai_decoy')?.purchased;
    const bruteMultiplier = hasDecoy ? 0.5 : 1;

    // Game over check — trigger BSOD minigame instead of instant death
    const breachAfterReduction = Math.round(Math.max(0, state.breachLevel + passiveBreach - breachReduction) * 100) / 100;
    const shouldTriggerBSOD = breachAfterReduction >= state.maxBreachLevel && !state.bsodMinigame;

    // Autocomplete prompt: when player earns 10+ SP and hasn't bought/been prompted
    let promptShown = state.autocompletePromptShown;
    const hasAutocomplete = state.upgrades.find(u => u.id === 'cmd_autocomplete')?.purchased;
    if (!promptShown && !hasAutocomplete && state.stabilityPoints >= 10 && newGameTime > 15) {
      promptShown = true;
      // Will trigger notification in next block
    }

    // Wave timer
    let newWaveTimeLeft = state.waveTimeLeft - 1;
    let wavePaused = false;
    let currentWave = state.currentWave;
    let wavesCompleted = state.wavesCompleted;
    let gameWon = false;

    if (newWaveTimeLeft <= 0) {
      wavesCompleted = state.currentWave + 1;
      if (wavesCompleted >= WAVES.length) {
        // All waves completed — victory!
        gameWon = true;
      } else {
        // Enter shop phase between waves
        wavePaused = true;
        currentWave = wavesCompleted;
        newWaveTimeLeft = WAVES[currentWave].duration;
      }
    }

    // Low-breach time tracking for achievements
    const newLowBreachTime = breachAfterReduction < 10 ? state.lowBreachTime + 1 : 0;

    set({
      gameTime: newGameTime,
      hackerAggression: aggression,
      cpuTemp: Math.round(newTemp * 10) / 10,
      dustLevel: Math.round(newDust * 100) / 100,
      screenShake: shake,
      windowTrails: trails,
      wallpaperCorrupted: wallpaper,
      startButtonRunning: startRun,
      breachLevel: breachAfterReduction,
      autocompletePromptShown: promptShown,
      waveTimeLeft: newWaveTimeLeft,
      wavePaused,
      currentWave,
      wavesCompleted,
      gameWon,
      lowBreachTime: newLowBreachTime,
    });

    // Trigger autocomplete prompt notification
    if (promptShown && !state.autocompletePromptShown && !hasAutocomplete) {
      const lang = get().language;
      get().addNotification({ 
        text: getTranslation(lang, 'notif.autocompleteHint'), 
        type: 'info' 
      });
    }

    // Trigger BSOD mini-game
    if (shouldTriggerBSOD) {
      get().startBSODMinigame();
    }

    // Check achievements every 5 seconds
    if (newGameTime % 5 === 0) {
      get().checkAchievements();
    }

    // Clippy tips (every 25s if not disabled)
    if (!state.clippyDisabled && newGameTime % 25 === 12 && !state.clippyVisible) {
      const lang = get().language;
      const tips = [
        { cond: state.breachLevel > 25, text: getTranslation(lang, 'clippy.beingHacked'), type: 'tip' as const },
        { cond: state.minerActive, text: getTranslation(lang, 'clippy.cpuHot'), type: 'warning' as const },
        { cond: state.dustLevel > 50, text: getTranslation(lang, 'clippy.dusty'), type: 'tip' as const },
        { cond: state.stabilityPoints > 30 && state.upgrades.some(u => !u.purchased), text: getTranslation(lang, 'clippy.spendSP'), type: 'tip' as const },
        { cond: newGameTime > 60, text: getTranslation(lang, 'clippy.blockIP'), type: 'joke' as const },
        { cond: state.breachLevel > 50, text: getTranslation(lang, 'clippy.halfDead'), type: 'warning' as const },
        { cond: state.currentWave >= 3, text: getTranslation(lang, 'clippy.gettingSerious'), type: 'warning' as const },
        { cond: state.processes.filter(p => p.isMalicious).length > 2, text: getTranslation(lang, 'clippy.tooManyProcs'), type: 'tip' as const },
        { cond: state.unreadCount > 3, text: getTranslation(lang, 'clippy.checkMail'), type: 'tip' as const },
        { cond: newGameTime < 20, text: getTranslation(lang, 'clippy.welcome'), type: 'joke' as const },
        { cond: true, text: getTranslation(lang, 'clippy.classic'), type: 'joke' as const },
      ];
      const applicable = tips.filter(t => t.cond);
      if (applicable.length > 0) {
        const tip = applicable[Math.floor(Math.random() * applicable.length)];
        get().showClippy(tip.text, tip.type);
      }
    }

    // Wave completed notification
    if (wavePaused && !state.wavePaused) {
      const lang = get().language;
      get().addNotification({ text: getTranslation(lang, 'notif.waveComplete', { wave: state.currentWave + 1 }), type: 'success' });
      get().addStabilityPoints(15 + state.currentWave * 5);
      playWaveComplete();
    }

    // Breach pulse sound — every 10s when breach > 60%
    if (newGameTime % 10 === 0 && get().breachLevel > 60) {
      playBreachPulse();
    }
  },

  openWindow: (id) => {
    const state = get();
    const nz = state.nextZIndex + 1;
    set({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isOpen: true, minimized: false, zIndex: nz },
      },
      nextZIndex: nz,
    });
  },

  closeWindow: (id) => {
    const state = get();
    set({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isOpen: false },
      },
    });
  },

  focusWindow: (id) => {
    const state = get();
    const nz = state.nextZIndex + 1;
    set({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], zIndex: nz },
      },
      nextZIndex: nz,
    });
  },

  moveWindow: (id, pos) => {
    const state = get();
    set({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], position: pos },
      },
    });
  },

  minimizeWindow: (id) => {
    const state = get();
    set({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], minimized: true },
      },
    });
  },

  // --- Terminal ---
  executeCommand: (cmd: string) => {
    const state = get();
    const lang = state.language;
    const t = (key: string, params?: Record<string, string | number>) => getTranslation(lang, key, params);
    const parts = cmd.trim().toLowerCase().split(/\s+/);
    const command = parts[0];

    const lines: TerminalLine[] = [{ text: `C:\\> ${cmd}`, type: 'input' }];

    switch (command) {
      case 'help': {
        lines.push(
          { text: t('cmd.help.title'), type: 'system' },
          { text: t('cmd.help.help'), type: 'output' },
          { text: t('cmd.help.ipconfig'), type: 'output' },
          { text: t('cmd.help.ipconfigBlock'), type: 'output' },
          { text: t('cmd.help.ipconfigUnblock'), type: 'output' },
          { text: t('cmd.help.netstat'), type: 'output' },
          { text: t('cmd.help.tasklist'), type: 'output' },
          { text: t('cmd.help.taskkill'), type: 'output' },
          { text: t('cmd.help.scan'), type: 'output' },
          { text: t('cmd.help.patch'), type: 'output' },
          { text: t('cmd.help.systeminfo'), type: 'output' },
          { text: t('cmd.help.regedit'), type: 'output' },
          { text: t('cmd.help.cls'), type: 'output' },
        );
        break;
      }

      case 'cls': {
        set({ terminalHistory: [] });
        return;
      }

      case 'ipconfig': {
        if (parts[1] === '/block' && parts[2]) {
          const ip = parts[2];
          if (state.blockedIPs.includes(ip)) {
            lines.push({ text: t('cmd.ipAlreadyBlocked', { ip }), type: 'warning' });
          } else {
            get().blockIP(ip);
            lines.push({ text: t('cmd.ipBlocked', { ip }), type: 'system' });

            // Если блокируем IP целевого узла — сбрасываем bruteforce
            const targetNode = state.nodes.find(n => n.id === state.currentTargetNodeId);
            if (targetNode && targetNode.ip === ip) {
              set({ 
                bruteforceProgress: 0, 
                currentTargetNodeId: null,
                hackerState: 'HIDE' as HackerState,
                attackCooldown: 15,
              });
              lines.push({ text: t('cmd.hackerDisrupted'), type: 'system' });
              get().addStabilityPoints(10);
            }
          }
        } else if (parts[1] === '/unblock' && parts[2]) {
          get().unblockIP(parts[2]);
          lines.push({ text: t('cmd.ipUnblocked', { ip: parts[2] }), type: 'output' });
        } else {
          lines.push(
            { text: t('cmd.ipConfig'), type: 'system' },
            { text: '', type: 'output' },
            { text: t('cmd.localArea'), type: 'output' },
            { text: '    IPv4 Address . . . : 192.168.1.100', type: 'output' },
            { text: '    Subnet Mask  . . . : 255.255.255.0', type: 'output' },
            { text: '    Default Gateway  . : 10.0.0.1', type: 'output' },
            { text: '', type: 'output' },
            { text: t('cmd.blockedIPs', { ips: state.blockedIPs.length > 0 ? state.blockedIPs.join(', ') : t('cmd.blockedNone') }), type: 'output' },
          );
        }
        break;
      }

      case 'netstat': {
        lines.push(
          { text: t('cmd.activeConnections'), type: 'system' },
          { text: t('cmd.connHeader'), type: 'output' },
        );
        state.nodes.forEach(n => {
          const statusLabel = n.status === 'compromised' ? 'ESTABLISHED ⚠️' :
            n.status === 'probing' ? 'SYN_SENT ⚡' : 'LISTENING';
          lines.push({ text: `  TCP    192.168.1.100:${1024 + Math.floor(Math.random() * 9000)}  ${n.ip}:${80 + Math.floor(Math.random() * 400)}      ${statusLabel}`, type: n.status === 'compromised' ? 'error' : 'output' });
        });
        if (state.currentTargetNodeId) {
          lines.push({ text: `  TCP    ???.???.???.???:666  192.168.1.100:445  INTRUSION !!!`, type: 'error' });
        }
        break;
      }

      case 'tasklist': {
        const deepScan = state.upgrades.find(u => u.id === 'deep_scan')?.purchased;
        lines.push(
          { text: t('cmd.processHeaders'), type: 'system' },
          { text: t('cmd.processSeparator'), type: 'output' },
        );
        state.processes.forEach(p => {
          if (p.hidden && !deepScan) return;
          const marker = p.isMalicious ? ' [!!! MALICIOUS]' : '';
          lines.push({ 
            text: `${p.name.padEnd(26)}${String(p.pid).padEnd(8)}${String(p.cpu + '%').padEnd(7)} ${p.mem}${marker}`, 
            type: p.isMalicious ? 'error' : 'output' 
          });
        });
        break;
      }

      case 'taskkill': {
        if (parts[1] === '/pid' && parts[2]) {
          const pid = parseInt(parts[2]);
          const proc = state.processes.find(p => p.pid === pid);
          if (!proc) {
            lines.push({ text: t('cmd.processNotFound', { pid }), type: 'error' });
          } else if (proc.isMalicious) {
            get().killProcess(pid);
            lines.push({ text: t('cmd.processKilled', { name: proc.name, pid }), type: 'system' });
            get().removeBreachLevel(5);
            get().addStabilityPoints(5);
          } else {
            lines.push({ text: t('cmd.processSystem', { name: proc.name }), type: 'warning' });
          }
        } else {
          lines.push({ text: t('cmd.taskkillUsage'), type: 'output' });
        }
        break;
      }

      case 'scan': {
        lines.push({ text: t('cmd.scanRunning'), type: 'system' });
        const compromised = state.nodes.filter(n => n.status === 'compromised');
        const probing = state.nodes.filter(n => n.status === 'probing');
        const malware = state.processes.filter(p => p.isMalicious);
        const binMalware = state.recycleBinItems.filter(i => i.isMalware && !i.deleted);

        if (compromised.length === 0 && probing.length === 0 && malware.length === 0 && binMalware.length === 0) {
          lines.push({ text: t('cmd.scanOk'), type: 'system' });
        } else {
          if (probing.length > 0) lines.push({ text: t('cmd.scanProbing', { count: probing.length }), type: 'warning' });
          if (compromised.length > 0) lines.push({ text: t('cmd.scanCompromised', { count: compromised.length }), type: 'error' });
          if (malware.length > 0) lines.push({ text: t('cmd.scanMalware', { count: malware.length }), type: 'error' });
          if (binMalware.length > 0) lines.push({ text: t('cmd.scanBinMalware', { count: binMalware.length }), type: 'warning' });
        }
        lines.push({ text: t('cmd.scanBreachLevel', { level: state.breachLevel.toFixed(1) }), type: state.breachLevel > 50 ? 'error' : 'output' });
        break;
      }

      case 'patch': {
        if (parts[1]) {
          const node = state.nodes.find(n => n.id === parts[1] || n.name.toLowerCase().replace(/\s+/g, '_') === parts[1]);
          if (!node) {
            lines.push({ text: t('cmd.nodeNotFound', { id: parts[1], ids: state.nodes.map(n => n.id).join(', ') }), type: 'error' });
          } else if (node.status === 'compromised') {
            set({
              nodes: state.nodes.map(n => n.id === node.id ? { ...n, status: 'secure' as const } : n),
            });
            lines.push({ text: t('cmd.nodePatched', { name: node.name }), type: 'system' });
            get().removeBreachLevel(10);
            get().addStabilityPoints(15);
          } else {
            lines.push({ text: t('cmd.nodeNotCompromised', { name: node.name, status: node.status }), type: 'output' });
          }
        } else {
          lines.push({ text: t('cmd.patchUsage'), type: 'output' });
        }
        break;
      }

      case 'systeminfo': {
        lines.push(
          { text: 'Host Name:           XP-POCALYPSE', type: 'output' },
          { text: 'OS Name:             Microsoft Windows XP Professional', type: 'output' },
          { text: 'OS Version:          5.1.2600 Service Pack 3', type: 'output' },
          { text: `CPU Temperature:     ${state.cpuTemp.toFixed(1)}°C`, type: state.cpuTemp > 70 ? 'error' : 'output' },
          { text: `Breach Level:        ${state.breachLevel.toFixed(1)}%`, type: state.breachLevel > 50 ? 'error' : 'output' },
          { text: `Hacker State:        ${state.hackerState}`, type: 'warning' },
          { text: `Stability Points:    ${state.stabilityPoints}`, type: 'output' },
          { text: `Blocked IPs:         ${state.blockedIPs.length}`, type: 'output' },
          { text: `Miner Active:        ${state.minerActive ? 'YES ⚠️' : 'No'}`, type: state.minerActive ? 'error' : 'output' },
          { text: `Dust Level:          ${state.dustLevel.toFixed(0)}%`, type: state.dustLevel > 60 ? 'warning' : 'output' },
          { text: `Uptime:              ${Math.floor(state.gameTime / 60)}m ${state.gameTime % 60}s`, type: 'output' },
        );
        break;
      }

      case 'regedit': {
        if (parts[1]) {
          const password = parts.slice(1).join(' ');
          if (password === state.registryPassword && !state.registryUsed) {
            set({ registryUsed: true });
            get().removeBreachLevel(25);
            get().addStabilityPoints(30);
            lines.push(
              { text: t('cmd.regeditSuccess'), type: 'system' },
              { text: t('cmd.regeditBreachReduced'), type: 'system' },
            );
          } else if (state.registryUsed) {
            lines.push({ text: t('cmd.regeditAlreadyUsed'), type: 'warning' });
          } else {
            lines.push({ text: t('cmd.regeditWrongKey'), type: 'error' });
          }
        } else {
          lines.push({ text: t('cmd.regeditUsage'), type: 'output' });
        }
        break;
      }

      default: {
        lines.push({ text: t('cmd.notRecognized', { cmd: command }), type: 'error' });
        lines.push({ text: t('cmd.typeHelp'), type: 'output' });
      }
    }

    set({ terminalHistory: [...state.terminalHistory, ...lines] });
  },

  addTerminalLine: (line) => set(s => ({ terminalHistory: [...s.terminalHistory, line] })),

  // --- Notifications ---
  addNotification: (n) => {
    notifCounter++;
    set(s => ({
      notifications: [...s.notifications, { ...n, id: `notif_${notifCounter}`, time: Date.now(), dismissed: false }],
    }));
    if (n.type === 'error' || n.type === 'warning') {
      playAlert();
    } else {
      playNotification();
    }
  },
  dismissNotification: (id) => set(s => ({
    notifications: s.notifications.map(n => n.id === id ? { ...n, dismissed: true } : n),
  })),

  // --- Email ---
  readEmail: (id) => set(s => ({
    emails: s.emails.map(e => e.id === id ? { ...e, read: true } : e),
    unreadCount: s.emails.filter(e => !e.read && e.id !== id).length,
  })),

  clickEmailLink: (id) => {
    const state = get();
    const email = state.emails.find(e => e.id === id);
    if (!email || !email.isPhishing) return;

    set(s => ({
      emails: s.emails.map(e => e.id === id ? { ...e, clickedLink: true } : e),
      hackerAdminAccess: true,
      breachLevel: Math.min(100, s.breachLevel + 15),
    }));

    // Запуск вредоносного процесса
    const virusPid = 6000 + Math.floor(Math.random() * 3000);
    set(s => ({
      processes: [...s.processes, { pid: virusPid, name: 'virus.exe', cpu: 45, mem: '128 MB', isMalicious: true, hidden: false }],
    }));

    const lang = get().language;
    const t = (key: string, params?: Record<string, string | number>) => getTranslation(lang, key, params);
    get().addNotification({ text: t('notif.securityBreach'), type: 'error' });
    get().addTerminalLine({ text: t('notif.virusStarted', { pid: virusPid }), type: 'error' });
  },

  // --- Recycle Bin ---
  deleteRecycleBinItem: (id) => {
    const state = get();
    const item = state.recycleBinItems.find(i => i.id === id);
    set(s => ({
      recycleBinItems: s.recycleBinItems.map(i => i.id === id ? { ...i, deleted: true } : i),
    }));
    if (item?.isMalware) {
      get().removeBreachLevel(3);
      get().addStabilityPoints(5);
      const lang = get().language;
      get().addNotification({ text: getTranslation(lang, 'notif.malwareRemoved', { name: item.name }), type: 'success' });
    }
  },
  emptyRecycleBin: () => {
    const state = get();
    const malwareCount = state.recycleBinItems.filter(i => i.isMalware && !i.deleted).length;
    set({ recycleBinItems: [] });
    if (malwareCount > 0) {
      get().removeBreachLevel(malwareCount * 3);
      get().addStabilityPoints(malwareCount * 5);
    }
  },

  // --- Network ---
  blockIP: (ip) => set(s => ({ blockedIPs: [...s.blockedIPs, ip] })),
  unblockIP: (ip) => set(s => ({ blockedIPs: s.blockedIPs.filter(i => i !== ip) })),

  // --- Upgrades ---
  purchaseUpgrade: (id) => {
    const state = get();
    const upgrade = state.upgrades.find(u => u.id === id);
    if (!upgrade || upgrade.purchased || state.stabilityPoints < upgrade.cost) return;

    set(s => ({
      stabilityPoints: s.stabilityPoints - upgrade.cost,
      upgrades: s.upgrades.map(u => u.id === id ? { ...u, purchased: true } : u),
    }));

    // Применить эффект encryption
    if (id === 'encryption') {
      set(s => ({
        nodes: s.nodes.map(n => ({ ...n, difficulty: n.difficulty + 1 })),
      }));
    }

    // Liquid cooling effect
    if (id === 'liquid_cooling') {
      set({ liquidCoolingActive: true });
    }

    get().addNotification({ text: getTranslation(get().language, 'notif.upgradeInstalled', { name: upgrade.name }), type: 'success' });
  },

  // --- Error popups ---
  dismissErrorPopup: (id) => set(s => ({
    errorPopups: s.errorPopups.filter(e => e.id !== id),
  })),
  dismissAllErrors: () => set({ errorPopups: [] }),

  // --- Breach/Points ---
  addBreachLevel: (amount) => set(s => {
    const psuLevel = s.hardware.find(h => h.id === 'psu_upgrade')?.level ?? 0;
    const resistance = 1 - psuLevel * 0.05; // 5% reduction per level
    const wave = WAVES[s.currentWave] || WAVES[WAVES.length - 1];
    const diffConfig = DIFFICULTY_CONFIG[s.difficulty];
    const ngMult = 1 + (s.newGamePlusLevel || 0) * 0.15; // +15% per NG+ level
    const reduced = amount * Math.max(0.5, resistance) * wave.breachRateMultiplier * diffConfig.breachMult * ngMult;
    return { breachLevel: Math.round(Math.min(s.maxBreachLevel, s.breachLevel + reduced) * 100) / 100 };
  }),
  removeBreachLevel: (amount) => set(s => ({
    breachLevel: Math.round(Math.max(0, s.breachLevel - amount) * 100) / 100,
  })),
  addStabilityPoints: (amount) => set(s => ({
    stabilityPoints: s.stabilityPoints + amount,
  })),

  killProcess: (pid) => {
    const state = get();
    const proc = state.processes.find(p => p.pid === pid);
    const isMiner = proc?.name === 'xmrig_miner.exe';
    const wasMalicious = proc?.isMalicious ?? false;
    set(s => ({
      processes: s.processes.filter(p => p.pid !== pid),
      minerActive: isMiner ? false : s.minerActive,
      totalProcessesKilled: wasMalicious ? s.totalProcessesKilled + 1 : s.totalProcessesKilled,
    }));
    if (wasMalicious) {
      playProcessKill();
    }
    if (isMiner) {
      get().addNotification({ 
        text: getTranslation(get().language, 'notif.minerKilled'), 
        type: 'success' 
      });
    }
  },

  // --- Thermal ---
  clickCooler: () => {
    const state = get();
    const newDust = Math.max(0, state.dustLevel - 8);
    const newTemp = Math.max(20, state.cpuTemp - 3);
    set({ dustLevel: newDust, cpuTemp: newTemp });
  },

  // --- ICQ ---
  addICQMessage: (msg) => {
    set(s => ({
      icqMessages: [...s.icqMessages, { ...msg, id: `icq_${Date.now()}_${Math.random()}` }],
    }));
  },

  useRegistryPassword: (password) => {
    const state = get();
    if (password === state.registryPassword && !state.registryUsed) {
      set({ registryUsed: true });
      get().removeBreachLevel(25);
      get().addStabilityPoints(30);
    }
  },

  // --- BSOD Mini-game ---
  startBSODMinigame: () => {
    playBSOD();
    const errors: BSODError[] = [];
    const codes = [
      'IRQL_NOT_LESS_OR_EQUAL', 'PAGE_FAULT', 'KERNEL_PANIC',
      'MEMORY_CORRUPT', 'DRIVER_FAULT', 'CRITICAL_DIED',
      'SYSTEM_EXCEPTION', 'NTFS_ERROR',
    ];
    for (let i = 0; i < 6; i++) {
      errors.push({
        id: `bsod_err_${i}`,
        x: 50 + Math.random() * (window.innerWidth - 200),
        y: 80 + Math.random() * (window.innerHeight - 250),
        dx: (Math.random() - 0.5) * 6,
        dy: (Math.random() - 0.5) * 6,
        code: codes[i],
        caught: false,
      });
    }
    set({
      bsodMinigame: true,
      bsodErrors: errors,
      bsodCaughtCount: 0,
      bsodTotalErrors: 6,
      bsodTimeLeft: 20,
      isPaused: true,
    });
  },

  catchBSODError: (id) => {
    const state = get();
    const errors = state.bsodErrors.map(e => e.id === id ? { ...e, caught: true } : e);
    const caughtCount = errors.filter(e => e.caught).length;
    set({ bsodErrors: errors, bsodCaughtCount: caughtCount });

    // Win condition: caught all errors
    if (caughtCount >= state.bsodTotalErrors) {
      set({
        bsodMinigame: false,
        bsodErrors: [],
        breachLevel: 50,
        isPaused: false,
        gameOver: false,
      });
      const lang = get().language;
      get().addNotification({ text: getTranslation(lang, 'notif.bsodRecovered'), type: 'success' });
      get().addStabilityPoints(20);
    }
  },

  bsodTick: () => {
    const state = get();
    if (!state.bsodMinigame) return;

    const timeLeft = Math.round((state.bsodTimeLeft - 0.05) * 100) / 100; // called at ~20fps → 1s = 20 ticks

    if (timeLeft <= 0) {
      // Failed — real game over
      set({ bsodMinigame: false, gameOver: true, isPaused: false });
      return;
    }

    // Move errors around
    const errors = state.bsodErrors.map(e => {
      if (e.caught) return e;
      let nx = e.x + e.dx;
      let ny = e.y + e.dy;
      let ndx = e.dx;
      let ndy = e.dy;
      if (nx < 0 || nx > window.innerWidth - 100) ndx = -ndx;
      if (ny < 0 || ny > window.innerHeight - 80) ndy = -ndy;
      return { ...e, x: nx, y: ny, dx: ndx, dy: ndy };
    });

    set({ bsodErrors: errors, bsodTimeLeft: timeLeft });
  },

  // --- Defrag ---
  startDefrag: () => {
    const grid: DefragCell[][] = [];
    for (let r = 0; r < 8; r++) {
      const row: DefragCell[] = [];
      for (let c = 0; c < 10; c++) {
        // Right 2 columns are "safe zone"
        if (c >= 8) {
          row.push({ type: 'safe' });
        } else {
          const rand = Math.random();
          if (rand < 0.25) row.push({ type: 'blue' });
          else if (rand < 0.4) row.push({ type: 'red' });
          else row.push({ type: 'empty' });
        }
      }
      grid.push(row);
    }
    set({ defragGrid: grid, defragActive: true, defragScore: 0 });
  },

  moveDefragBlock: (fromRow, fromCol, toRow, toCol) => {
    const state = get();
    const grid = state.defragGrid.map(r => r.map(c => ({ ...c })));
    if (!grid[fromRow] || !grid[toRow]) return;
    const from = grid[fromRow][fromCol];
    const to = grid[toRow][toCol];
    if (from.type !== 'blue') return;
    if (to.type !== 'empty' && to.type !== 'safe') return;

    // Move blue block
    grid[fromRow][fromCol] = { type: 'empty' };
    grid[toRow][toCol] = { type: 'blue' };

    // Check score: count blue blocks in safe zone (cols 8-9)
    let score = 0;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 8; c < 10; c++) {
        if (grid[r][c].type === 'blue') score++;
      }
    }

    // Count total blue blocks
    let totalBlue = 0;
    for (const row of grid) for (const cell of row) if (cell.type === 'blue') totalBlue++;

    set({ defragGrid: grid, defragScore: score });

    // Win: all blue blocks in safe zone
    if (score === totalBlue && totalBlue > 0) {
      set({ defragActive: false });
      get().removeBreachLevel(15);
      get().addStabilityPoints(20);
      const lang = get().language;
      get().addNotification({ text: getTranslation(lang, 'notif.defragComplete'), type: 'success' });
    }
  },

  defragTick: () => {
    const state = get();
    if (!state.defragActive) return;

    // Red blocks expand faster
    if (Math.random() < 0.18) {
      const grid = state.defragGrid.map(r => r.map(c => ({ ...c })));
      // Find a red block and try to spread
      const redCells: [number, number][] = [];
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < 8; c++) { // don't spread into safe zone
          if (grid[r][c].type === 'red') redCells.push([r, c]);
        }
      }
      if (redCells.length > 0) {
        const [rr, rc] = redCells[Math.floor(Math.random() * redCells.length)];
        const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
        const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
        const nr = rr + dr;
        const nc = rc + dc;
        if (nr >= 0 && nr < grid.length && nc >= 0 && nc < 8 && grid[nr][nc].type === 'empty') {
          grid[nr][nc] = { type: 'red' };
          set({ defragGrid: grid });
        }
      }
    }
  },

  // --- Hardware Shop ---
  upgradeHardware: (id: string) => {
    const state = get();
    const hw = state.hardware.find(h => h.id === id);
    if (!hw) return;
    if (hw.level >= hw.maxLevel) return;
    const cost = hw.cost * (hw.level + 1); // Price increases per level
    if (state.stabilityPoints < cost) return;
    set({
      stabilityPoints: state.stabilityPoints - cost,
      hardware: state.hardware.map(h =>
        h.id === id ? { ...h, level: h.level + 1 } : h
      ),
    });
  },

  // --- Waves ---
  startNextWave: () => {
    const state = get();
    if (!state.wavePaused) return;
    set({ wavePaused: false });
  },

  waveTick: () => {
    // Wave tick is integrated into main tick()
  },

  // --- Difficulty ---
  setDifficulty: (d: Difficulty) => {
    const config = DIFFICULTY_CONFIG[d];
    const nodes = d === 'hard' ? [...initialNodes, ...hardNodes] : 
                  d === 'easy' ? initialNodes.slice(0, config.nodeCount) : [...initialNodes];
    set({
      difficulty: d,
      stabilityPoints: config.startingSP,
      nodes: nodes.map(n => ({ ...n })),
    });
  },

  // --- Achievements ---
  checkAchievements: () => {
    const state = get();
    const updated = state.achievements.map(a => {
      if (a.unlocked) return a;
      let earned = false;
      switch (a.check) {
        case 'survive_5': earned = state.gameTime >= 300; break;
        case 'survive_10': earned = state.gameTime >= 600; break;
        case 'kill_10': earned = state.totalProcessesKilled >= 10; break;
        case 'kill_20': earned = state.totalProcessesKilled >= 20; break;
        case 'low_breach_3min': earned = state.lowBreachTime >= 180; break;
        case 'all_upgrades': earned = state.upgrades.every(u => u.purchased); break;
        case 'patch_5': earned = false; break; // tracked separately
        case 'wave_3': earned = state.wavesCompleted >= 3; break;
        case 'wave_7': earned = state.wavesCompleted >= WAVES.length; break;
        case 'bsod_win': earned = false; break; // triggered on BSOD success
      }
      return earned ? { ...a, unlocked: true } : a;
    });

    // Award SP for newly unlocked
    const newlyUnlocked = updated.filter((a, i) => a.unlocked && !state.achievements[i].unlocked);
    if (newlyUnlocked.length > 0) {
      const totalReward = newlyUnlocked.reduce((sum, a) => sum + a.reward, 0);
      set({
        achievements: updated,
        stabilityPoints: state.stabilityPoints + totalReward,
      });
      newlyUnlocked.forEach(a => {
        get().addNotification({
          text: `🏆 Achievement: "${a.name}"! +${a.reward} SP`,
          type: 'success',
        });
        playAchievement();
      });
    }
  },

  // --- Tutorial ---
  advanceTutorial: () => {
    const state = get();
    if (state.tutorialStep >= TUTORIAL_STEPS.length - 1) {
      set({ tutorialStep: -1, tutorialActive: false });
    } else {
      set({ tutorialStep: state.tutorialStep + 1 });
    }
  },

  skipTutorial: () => {
    set({ tutorialStep: -1, tutorialActive: false });
  },

  // --- Clippy ---
  showClippy: (text, type) => {
    set({
      clippyVisible: true,
      clippyMessage: { id: `clippy_${Date.now()}`, text, type, dismissed: false },
    });
  },

  dismissClippy: () => {
    set({ clippyVisible: false, clippyMessage: null });
  },

  disableClippy: () => {
    set({ clippyVisible: false, clippyMessage: null, clippyDisabled: true });
  },

  // --- Firewall Tetris ---
  startFirewallTetris: () => {
    const state = get();
    const speed = 1 + state.hackerAggression * 0.15;
    set({
      fwTetrisActive: true,
      fwTetrisPackets: [],
      fwTetrisScore: 0,
      fwTetrisMissed: 0,
      fwTetrisSpeed: speed,
      fwTetrisTimeLeft: 30,
    });
  },

  fwTetrisClick: (id) => {
    const state = get();
    const packet = state.fwTetrisPackets.find(p => p.id === id);
    if (!packet) return;

    if (packet.type === 'bad') {
      // Correctly blocked! +points
      playProcessKill();
      set(s => ({
        fwTetrisPackets: s.fwTetrisPackets.filter(p => p.id !== id),
        fwTetrisScore: s.fwTetrisScore + 10,
      }));
    } else {
      // Blocked a good packet — penalty
      playAlert();
      set(s => ({
        fwTetrisPackets: s.fwTetrisPackets.filter(p => p.id !== id),
        fwTetrisMissed: s.fwTetrisMissed + 1,
      }));
    }
  },

  fwTetrisTick: () => {
    const state = get();
    if (!state.fwTetrisActive) return;

    const dt = 0.05; // ~20fps
    let timeLeft = Math.round((state.fwTetrisTimeLeft - dt) * 100) / 100;

    if (timeLeft <= 0) {
      // End game
      const bonus = Math.max(0, state.fwTetrisScore - state.fwTetrisMissed * 5);
      set({ fwTetrisActive: false });
      if (bonus > 0) {
        get().addStabilityPoints(Math.floor(bonus / 5));
        get().removeBreachLevel(Math.floor(bonus / 10));
      }
      get().addNotification({
        text: `🧱 Firewall defense complete! Score: ${state.fwTetrisScore}, Blocked: +${Math.floor(bonus / 5)} SP`,
        type: 'success',
      });
      return;
    }

    // Move packets down
    let packets = state.fwTetrisPackets.map(p => ({
      ...p,
      row: p.row + state.fwTetrisSpeed * dt,
    }));

    // Remove packets that fell through (row > 10)
    const fell = packets.filter(p => p.row > 10);
    const missedBad = fell.filter(p => p.type === 'bad').length; // bad packets that got through
    packets = packets.filter(p => p.row <= 10);

    // Spawn new packets randomly
    if (Math.random() < 0.15 * state.fwTetrisSpeed) {
      const isBad = Math.random() < 0.5;
      const labels = isBad
        ? ['MALWARE', 'EXPLOIT', 'WORM', 'TROJAN', 'DDOS', 'ROOTKIT']
        : ['HTTP 200', 'DNS OK', 'PING', 'SMTP', 'DATA', 'ACK'];
      packets.push({
        id: `pkt_${Date.now()}_${Math.random()}`,
        col: Math.floor(Math.random() * 6),
        row: 0,
        type: isBad ? 'bad' : 'good',
        label: labels[Math.floor(Math.random() * labels.length)],
      });
    }

    set({
      fwTetrisPackets: packets,
      fwTetrisTimeLeft: timeLeft,
      fwTetrisMissed: state.fwTetrisMissed + missedBad,
    });
  },

  // --- Save/Load ---
  saveGame: () => {
    const state = get() as unknown as Record<string, unknown>;
    const success = saveFn(state);
    if (success) {
      const lang = get().language;
      get().addNotification({ text: lang === 'uk' ? '💾 Гру збережено!' : '💾 Game saved!', type: 'success' });
    }
    return success;
  },

  loadSave: () => {
    const data = loadFn();
    if (!data) return false;
    set(data.state as Partial<GameState>);
    return true;
  },

  exportSave: () => {
    const state = get() as unknown as Record<string, unknown>;
    const json = exportFn(state);
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    downloadFile(json, `xp-pocalypse-save-${ts}.json`);
    const lang = get().language;
    get().addNotification({ text: lang === 'uk' ? '📤 Збереження експортовано' : '📤 Save exported', type: 'info' });
  },

  importSave: (json: string) => {
    const data = importFn(json);
    if (!data) return false;
    set(data.state as Partial<GameState>);
    const lang = get().language;
    get().addNotification({ text: lang === 'uk' ? '📥 Збереження імпортовано!' : '📥 Save imported!', type: 'success' });
    return true;
  },

  // --- New Game+ ---
  startNewGamePlus: () => {
    const state = get();
    const ngLevel = (state.newGamePlusLevel || 0) + 1;
    const keptAchievements = state.achievements.map(a => ({ ...a }));
    const keptLang = state.language;
    const keptDiff = state.difficulty;
    const keptClippyDisabled = state.clippyDisabled;
    // Bonus SP from NG+: 10 * level
    const bonusSP = ngLevel * 10;

    // Reset game first
    get().resetGame();

    // Apply NG+ modifiers
    set({
      newGamePlusLevel: ngLevel,
      achievements: keptAchievements,
      language: keptLang,
      difficulty: keptDiff,
      clippyDisabled: keptClippyDisabled,
      stabilityPoints: bonusSP,
      tutorialStep: -1,
      tutorialActive: false,
    });

    // Re-apply difficulty with NG+ scaling
    get().setDifficulty(keptDiff);
  },

  resetGame: () => {
    notifCounter = 0;
    errorCounter = 0;
    const currentLang = get().language;
    set({
      language: currentLang,
      gameTime: 0,
      realStartTime: Date.now(),
      isPaused: false,
      gameOver: false,
      breachLevel: 0,
      cpuTemp: 25,
      hackerState: 'RECON',
      hackerAggression: 1,
      hackerAdminAccess: false,
      attackCooldown: 30,
      currentTargetNodeId: null,
      bruteforceProgress: 0,
      nodes: [...initialNodes],
      blockedIPs: [],
      emails: [],
      unreadCount: 0,
      recycleBinItems: [],
      processes: [...initialProcesses],
      notifications: [],
      errorPopups: [],
      terminalHistory: [
        { text: 'Microsoft Windows XP [Version 5.1.2600]', type: 'system' },
        { text: '(C) Copyright 1985-2001 Microsoft Corp.', type: 'system' },
        { text: '', type: 'system' },
      ],
      windows: { ...initialWindows },
      nextZIndex: 20,
      stabilityPoints: 0,
      upgrades: [...initialUpgrades],
      screenShake: false,
      windowTrails: false,
      wallpaperCorrupted: false,
      startButtonRunning: false,
      // New features reset
      minerActive: false,
      dustLevel: 0,
      liquidCoolingActive: false,
      icqMessages: [],
      icqSpamActive: false,
      registryPassword: 'XP-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      registryUsed: false,
      bsodMinigame: false,
      bsodErrors: [],
      bsodCaughtCount: 0,
      bsodTotalErrors: 8,
      bsodTimeLeft: 0,
      defragGrid: [],
      defragActive: false,
      defragScore: 0,
      autocompletePromptShown: false,
      hardware: [...initialHardware],
      // Waves
      currentWave: 0,
      waveTimeLeft: WAVES[0].duration,
      wavePaused: false,
      wavesCompleted: 0,
      totalWaves: WAVES.length,
      gameWon: false,
      // Difficulty (preserve selection)
      // difficulty: keep current
      // Achievements (preserve unlocked status)
      // achievements: keep current
      totalProcessesKilled: 0,
      lowBreachTime: 0,
      // Tutorial
      tutorialStep: 0,
      tutorialActive: true,
      // Clippy
      clippyVisible: false,
      clippyMessage: null,
      // clippyDisabled: keep current
      // Firewall Tetris
      fwTetrisActive: false,
      fwTetrisPackets: [],
      fwTetrisScore: 0,
      fwTetrisMissed: 0,
      fwTetrisSpeed: 1,
      fwTetrisTimeLeft: 0,
      // New Game+ reset
      newGamePlusLevel: 0,
    });
    // Apply difficulty settings
    const diff = get().difficulty;
    get().setDifficulty(diff);
  },
}));
