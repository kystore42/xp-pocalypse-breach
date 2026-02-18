import { useGameStore, type HackerState, WAVES, DIFFICULTY_CONFIG } from '../../store/gameStore';
import { getTranslation } from '../../i18n/translations';
import type { MissionModifier } from '../campaign';

function t(key: string, params?: Record<string, string | number>) {
  const lang = useGameStore.getState().language;
  return getTranslation(lang, key, params);
}

// === ADAPTIVE AI — tracks player behavior ===
interface PlayerProfile {
  patchCount: number;       // how often player patches nodes
  killCount: number;        // how often player kills processes
  blockCount: number;       // how often player blocks IPs
  emailIgnored: number;     // phishing emails not opened
  avgReactionTime: number;  // avg ticks between compromise and patch
  lastCompromiseTick: number;
  preferredTarget: 'nodes' | 'processes' | 'balanced'; // player's focus area
}

const playerProfile: PlayerProfile = {
  patchCount: 0,
  killCount: 0,
  blockCount: 0,
  emailIgnored: 0,
  avgReactionTime: 0,
  lastCompromiseTick: 0,
  preferredTarget: 'balanced',
};

// Update player profile from state changes
let lastKillCount = 0;
let lastPatchedNodes = 0;
let lastBlockedCount = 0;

// Случайные хакерские IP-адреса
const HACKER_IPS = [
  '45.33.32.156', '104.26.10.78', '185.220.101.33', '91.216.170.11',
  '37.252.96.40', '198.51.100.9', '203.0.113.42', '172.217.14.206',
];

const MALWARE_NAMES = [
  'trojan_xp.dll', 'rootkit_v3.sys', 'keylogger.dat', 'backdoor.exe',
  'worm_spread.bat', 'cryptominer.bin', 'spyware_core.dll', 'ransomware.lock',
];

const PHISHING_EMAILS = [
  {
    from: 'Microsoft Support <support@micros0ft-update.com>',
    subject: '🔴 URGENT: Your Windows license expires TODAY',
    body: `Dear Administrator,\n\nYour Windows XP license has expired. Your system will be deactivated in 24 hours.\n\nPlease download and install the attached license renewal tool to avoid service interruption.\n\nBest regards,\nMicrosoft Windows Support Team\nRef: WGA-2024-#XP3991`,
    attachment: 'WindowsLicenseRenewal_v3.1.exe',
  },
  {
    from: 'IT Department <admin@your-company.local>',
    subject: 'Critical Video Driver Update Required',
    body: `Hi,\n\nWe've detected that your workstation is running an outdated video driver that causes system instability.\n\nPlease install the attached update IMMEDIATELY to prevent hardware damage.\n\nThis is NOT optional.\n\n— IT Department`,
    attachment: 'nvidia_driver_update_v512.exe',
  },
  {
    from: 'System Administrator <root@192.168.1.1>',
    subject: 'Security Patch KB4019472 - Install Now',
    body: `ATTENTION ALL USERS:\n\nA critical vulnerability (CVE-2024-1337) has been found in Windows XP SP3.\n\nThis patch fixes a remote code execution flaw. All workstations must install this patch before end of day.\n\nDownload the patch below:\n\n[Note: this is an automated message]`,
    attachment: 'SecurityPatch_KB4019472.exe',
  },
  {
    from: 'CEO John Smith <ceo@your-company.local>',
    subject: 'RE: Confidential - Read Immediately',
    body: `I need you to review the attached document before our meeting tomorrow. It contains sensitive financial data.\n\nDo NOT share this with anyone else.\n\nOpen the attachment and confirm you've read it.\n\n- John`,
    attachment: 'Q4_Financial_Report.exe',
  },
  {
    from: 'Windows Defender <alerts@windows-security.com>',
    subject: '⚠ Virus Detected! Action Required',
    body: `Windows Defender has detected a threat on your system:\n\nThreat: Trojan:Win32/Emotet\nStatus: Active\nRisk Level: SEVERE\n\nClick below to run an emergency scan and remove the threat.\n\n[Microsoft recommends immediate action]`,
    attachment: 'EmergencyScan_Tool.exe',
  }
];

let emailCounter = 0;
let malwareCounter = 0;

// Выбрать случайный элемент из массива
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Reset all module-level AI state between missions/games
export function resetHackerAI() {
  playerProfile.patchCount = 0;
  playerProfile.killCount = 0;
  playerProfile.blockCount = 0;
  playerProfile.emailIgnored = 0;
  playerProfile.avgReactionTime = 0;
  playerProfile.lastCompromiseTick = 0;
  playerProfile.preferredTarget = 'balanced';
  lastKillCount = 0;
  lastPatchedNodes = 0;
  lastBlockedCount = 0;
  emailCounter = 0;
  malwareCounter = 0;
}

// Основной тик ИИ-хакера — вызывается каждую секунду
export function hackerTick() {
  const state = useGameStore.getState();
  if (state.isPaused || state.gameOver) return;

  const { 
    hackerState, hackerAggression, gameTime, nodes, blockedIPs, 
    currentTargetNodeId, bruteforceProgress, attackCooldown,
    hackerAdminAccess, breachLevel, campaignModifiers
  } = state;

  // Wave-based scaling: later waves make everything faster
  // Campaign-aware wave lookup  
  const tickWaves = state.campaignActive
    ? ((state as unknown as Record<string, unknown>).__campaignWaves as typeof WAVES | undefined) ?? WAVES
    : WAVES;
  const wave = tickWaves[state.currentWave] || tickWaves[tickWaves.length - 1];
  const waveScale = wave.breachRateMultiplier; // 0.8 → 3.5
  const diffConfig = DIFFICULTY_CONFIG[state.difficulty];

  // Merge campaign modifiers with base AI logic
  const mods = campaignModifiers || [];
  const hasModifier = (m: MissionModifier) => mods.includes(m);

  // === ADAPTIVE AI: update player profile ===
  updatePlayerProfile(state);

  // Stealth modifier: AI tactics are harder to detect
  const stealthMode = hasModifier('stealth_ai');

  // === СТЕЙТ-МАШИНА ===
  switch (hackerState) {
    case 'RECON':
      handleRecon(state, waveScale, diffConfig.hackerSpeedMult, mods);
      break;
    case 'ATTACK':
      handleAttack(state, waveScale, diffConfig.hackerSpeedMult, mods);
      break;
    case 'HIDE':
      handleHide(state, waveScale, stealthMode);
      break;
  }

  // === ПЕРИОДИЧЕСКИЕ СОБЫТИЯ ===

  // First-contact alert on wave start — immediate engagement
  if (gameTime === 2) {
    const lang = useGameStore.getState().language;
    useGameStore.getState().addNotification({ 
      text: lang === 'uk' 
        ? '🚨 Увага! Виявлено підозрілу мережеву активність! Перевірте cmd.exe та Мережеве оточення!' 
        : '🚨 Alert! Suspicious network activity detected! Check cmd.exe and My Network!', 
      type: 'warning' 
    });
  }

  // Early phishing at tick 4 — hook the player immediately
  if (gameTime === 4) {
    sendPhishingEmail();
  }

  // Фишинговые письма — faster in later waves
  const phishInterval = Math.max(8, Math.floor((40 - hackerAggression * 4) / waveScale));
  if (gameTime > 5 && gameTime % phishInterval === 0) {
    sendPhishingEmail();
  }

  // Легитимные системные письма
  if (gameTime === 5) {
    sendSystemEmail();
  }

  // Подброс малвари в корзину — faster in later waves
  const malwareInterval = Math.max(6, Math.floor((50 - hackerAggression * 5) / waveScale));
  if (gameTime > 8 && gameTime % malwareInterval === 0) {
    dropMalwareInBin();
  }

  // Спавн скрытых процессов — lower breach threshold in later waves
  const procBreachThreshold = Math.max(5, 15 - state.currentWave * 2);
  const procInterval = Math.max(4, Math.floor((25 - hackerAggression * 2) / waveScale));
  if (breachLevel > procBreachThreshold && gameTime % procInterval === 0) {
    spawnMaliciousProcess();
  }

  // Попапы ошибок при высоком breach level
  const errorThreshold = Math.max(15, 35 - state.currentWave * 3);
  if (breachLevel > errorThreshold && gameTime % (Math.max(2, Math.floor((12 - hackerAggression) / waveScale))) === 0) {
    spawnErrorPopup();
  }

  // Админ-доступ: двигать окна, создавать хаос
  if (hackerAdminAccess && gameTime % Math.max(3, Math.floor(10 / waveScale)) === 0 && breachLevel > 30) {
    adminChaos();
  }

  // === NEW MECHANICS ===

  // Deploy crypto miner — lower threshold in later waves
  const minerThreshold = Math.max(10, 25 - state.currentWave * 2);
  if (breachLevel > minerThreshold && !state.minerActive && gameTime % Math.max(30, Math.floor(70 / waveScale)) === 0 && Math.random() < 0.5) {
    spawnCryptoMiner();
  }

  // ICQ Spam attack — faster in later waves
  const icqInterval = Math.max(8, Math.floor((60 - hackerAggression * 5) / waveScale));
  if (gameTime > 10 && gameTime % icqInterval === 0 && Math.random() < 0.6) {
    triggerICQSpam();
  }

  // Trigger defrag need
  if (breachLevel > Math.max(20, 50 - state.currentWave * 5) && gameTime % Math.max(30, Math.floor(90 / waveScale)) === 0 && Math.random() < 0.4) {
    useGameStore.getState().addNotification({ 
      text: t('notif.defragNeeded') || '💾 Hard drive fragmentation detected! Open Disk Defragmenter!', 
      type: 'warning' 
    });
  }

  // Firewall v2 автоматически блокирует простые атаки
  // Zero-day modifier: bypass firewall
  const hasFirewall = state.upgrades.find(u => u.id === 'firewall_v2')?.purchased;
  const firewallEffective = hasFirewall && !hasModifier('zero_day');
  if (firewallEffective && hackerState === 'ATTACK' && Math.random() < 0.2) {
    useGameStore.setState({ 
      hackerState: 'HIDE' as HackerState, 
      attackCooldown: Math.max(3, Math.floor(10 / waveScale)),
      bruteforceProgress: Math.max(0, bruteforceProgress - 10),
    });
    useGameStore.getState().addNotification({ text: t('notif.firewallBlocked'), type: 'success' });
  }

  // === ADVANCED AI TACTICS ===

  // 1. Polymorphic malware — rename malicious processes to evade detection
  if ((hasModifier('polymorphic') || (state.currentWave >= 7 && Math.random() < 0.3)) && gameTime % 15 === 0) {
    polymorphicMutation();
  }

  // 2. DNS Poisoning — shuffle node IPs to confuse player
  if (hasModifier('dns_poisoning') && gameTime % 45 === 0 && gameTime > 20) {
    dnsPoisoning();
  }

  // 3. Ransomware — lock nodes when breach is high
  if ((hasModifier('ransomware') || (state.currentWave >= 8 && breachLevel > 75)) && breachLevel > 70 && gameTime % 30 === 0) {
    ransomwareAttack();
  }

  // 4. Social engineering — double phishing in campaign
  if (hasModifier('double_phishing') && gameTime > 10 && gameTime % Math.max(6, phishInterval - 5) === 0) {
    sendPhishingEmail(); // extra phishing wave
  }

  // 5. Corrupted RAM — spawn legit-looking malware
  if (hasModifier('corrupted_ram') && gameTime % 20 === 0 && breachLevel > 15) {
    spawnCamouflagedProcess();
  }

  // 6. Lateral movement — compromised nodes spread infection to neighbors
  if ((hasModifier('lateral_movement') || state.currentWave >= 6) && gameTime % 12 === 0) {
    lateralSpread(waveScale);
  }

  // 7. Adaptive counter-tactics — AI exploits player's weaknesses
  if (gameTime > 60 && gameTime % 20 === 0) {
    adaptiveCounterTactic(waveScale, diffConfig.hackerSpeedMult);
  }

  // 8. Insider threat — spawn fake "system" emails that are actually phishing
  if (hasModifier('insider_threat') && gameTime % 25 === 0 && gameTime > 15) {
    sendInsiderThreatEmail();
  }
}

function handleRecon(state: ReturnType<typeof useGameStore.getState>, waveScale: number, speedMult: number, mods: MissionModifier[]) {
  const { gameTime, hackerAggression, nodes, blockedIPs } = state;

  // Разведка: выбор цели — faster scanning in later waves
  const reconInterval = Math.max(2, Math.floor((8 - hackerAggression) / (waveScale * speedMult)));
  if (gameTime % reconInterval === 0) {
    // === SMART TARGET SELECTION ===
    // Adaptive AI: prioritize targets based on player behavior
    let targets = nodes.filter(n => 
      n.status === 'secure' && !blockedIPs.includes(n.ip)
    );

    // Zero-day: bypass IP blocks — all secure nodes are fair game
    if (mods.includes('zero_day')) {
      targets = nodes.filter(n => n.status === 'secure');
    }
    
    if (targets.length > 0) {
      let target;
      
      // Adaptive: choose the node the player is least likely defending
      if (playerProfile.patchCount > 5 && Math.random() < 0.6) {
        // Player patches a lot — target the hardest nodes (player tends to patch easy ones)
        targets.sort((a, b) => b.difficulty - a.difficulty);
        target = targets[0];
      } else if (playerProfile.blockCount > 3 && Math.random() < 0.5) {
        // Player blocks IPs — target the node with least visibility (lowest difficulty, easy to miss)
        targets.sort((a, b) => a.difficulty - b.difficulty);
        target = targets[0];
      } else {
        // Standard random pick
        target = pick(targets);
      }
      
      useGameStore.setState({ 
        currentTargetNodeId: target.id,
        hackerState: 'ATTACK' as HackerState,
        nodes: nodes.map(n => n.id === target.id ? { ...n, status: 'probing' as const } : n),
        bruteforceProgress: 0,
      });
      
      useGameStore.getState().addNotification({ 
        text: t('notif.accessAttempt', { name: target.name, ip: target.ip }), 
        type: 'warning' 
      });

      useGameStore.getState().addTerminalLine({ 
        text: t('notif.intrusionDetected', { ip: target.ip, name: target.name }), 
        type: 'warning' 
      });
    }
  }
}

function handleAttack(state: ReturnType<typeof useGameStore.getState>, waveScale: number, speedMult: number, mods: MissionModifier[]) {
  const { 
    currentTargetNodeId, bruteforceProgress, nodes, hackerAggression, 
    blockedIPs 
  } = state;

  if (!currentTargetNodeId) {
    useGameStore.setState({ hackerState: 'RECON' as HackerState });
    return;
  }

  const targetNode = nodes.find(n => n.id === currentTargetNodeId);
  if (!targetNode) return;

  // Если IP заблокирован — отступить
  if (blockedIPs.includes(targetNode.ip)) {
    useGameStore.setState({ 
      hackerState: 'HIDE' as HackerState, 
      attackCooldown: Math.max(5, Math.floor(15 / waveScale)),
      currentTargetNodeId: null,
      bruteforceProgress: 0,
      nodes: nodes.map(n => n.id === currentTargetNodeId ? { ...n, status: 'secure' as const } : n),
    });
    return;
  }

  // Прогресс брутфорса зависит от сложности узла — scales with wave & difficulty
  const hasDecoy = state.upgrades.find(u => u.id === 'ai_decoy')?.purchased;
  const fragileBonus = mods.includes('fragile_nodes') ? 1.5 : 1;
  const bruteSpeed = (hackerAggression * 0.8) / targetNode.difficulty * (hasDecoy ? 0.5 : 1) * waveScale * speedMult * fragileBonus;
  const newProgress = Math.round(Math.min(100, bruteforceProgress + bruteSpeed) * 100) / 100;

  // Логи в терминал
  if (Math.random() < 0.3) {
    useGameStore.getState().addTerminalLine({ 
      text: t('notif.bruteForceLog', { time: new Date().toLocaleTimeString(), ip: targetNode.ip, progress: newProgress.toFixed(0) }), 
      type: 'warning' 
    });
  }

  if (newProgress >= 100) {
    // Узел взломан!
    useGameStore.setState({
      nodes: nodes.map(n => n.id === currentTargetNodeId ? { ...n, status: 'compromised' as const } : n),
      hackerState: 'HIDE' as HackerState,
      currentTargetNodeId: null,
      bruteforceProgress: 0,
      attackCooldown: Math.max(8, Math.floor(20 / waveScale)),
    });

    useGameStore.getState().addBreachLevel(15 + state.currentWave * 2);
    useGameStore.getState().addNotification({ 
      text: t('notif.nodeCompromised', { name: targetNode.name, ip: targetNode.ip }), 
      type: 'error' 
    });
    useGameStore.getState().addTerminalLine({ 
      text: t('notif.nodeCompromisedTerminal', { name: targetNode.name, id: targetNode.id }), 
      type: 'error' 
    });
  } else {
    useGameStore.setState({ bruteforceProgress: newProgress });
    useGameStore.getState().addBreachLevel(0.3 + state.currentWave * 0.1);
  }
}

function handleHide(state: ReturnType<typeof useGameStore.getState>, waveScale: number, stealthMode: boolean) {
  const { attackCooldown } = state;
  
  // Stealth AI: longer hide phase, but less detectable
  // The AI "rests" longer, making the player think it's gone, then strikes harder
  const cooldownSpeed = stealthMode
    ? Math.max(1, Math.ceil(waveScale * 0.5))  // slower recovery but...
    : Math.max(1, Math.ceil(waveScale));
  
  if (attackCooldown > 0) {
    useGameStore.setState({ attackCooldown: Math.max(0, attackCooldown - cooldownSpeed) });
  } else {
    // Stealth AI: higher aggression after hide phase
    if (stealthMode) {
      useGameStore.setState({ 
        hackerState: 'RECON' as HackerState,
        hackerAggression: Math.min(10, state.hackerAggression + 0.5),
      });
    } else {
      useGameStore.setState({ hackerState: 'RECON' as HackerState });
    }
  }
}

function sendPhishingEmail() {
  emailCounter++;
  const template = pick(PHISHING_EMAILS);
  const email = {
    id: `email_${emailCounter}`,
    from: template.from,
    subject: template.subject,
    body: template.body,
    time: new Date().toLocaleTimeString(),
    isPhishing: true,
    read: false,
    clickedLink: false,
    attachment: template.attachment,
  };

  useGameStore.setState(s => ({
    emails: [email, ...s.emails],
    unreadCount: s.unreadCount + 1,
  }));

  useGameStore.getState().addNotification({ text: t('notif.newEmail', { subject: template.subject }), type: 'info' });
}

function sendSystemEmail() {
  emailCounter++;
  useGameStore.setState(s => ({
    emails: [
      {
        id: `email_${emailCounter}`,
        from: t('email.systemFrom'),
        subject: t('email.systemSubject'),
        body: t('email.systemBody'),
        time: new Date().toLocaleTimeString(),
        isPhishing: false,
        read: false,
        clickedLink: false,
      },
      ...s.emails,
    ],
    unreadCount: s.unreadCount + 1,
  }));
}

function dropMalwareInBin() {
  malwareCounter++;
  const name = pick(MALWARE_NAMES);
  const isMalware = Math.random() > 0.3; // 70% шанс что это малварь

  useGameStore.setState(s => ({
    recycleBinItems: [
      ...s.recycleBinItems,
      {
        id: `bin_${malwareCounter}`,
        name: isMalware ? name : `readme_${malwareCounter}.txt`,
        isMalware,
        size: isMalware ? `${(Math.random() * 500 + 100).toFixed(0)} KB` : '2 KB',
        deleted: false,
      },
    ],
  }));

  if (isMalware) {
    useGameStore.getState().addBreachLevel(2);
    if (Math.random() > 0.5) {
      useGameStore.getState().addNotification({ 
        text: t('notif.suspiciousFile'), 
        type: 'warning' 
      });
    }
  }
}

function spawnMaliciousProcess() {
  const state = useGameStore.getState();
  const existingMalware = state.processes.filter(p => p.isMalicious);
  if (existingMalware.length >= 5) return; // Макс 5 вредоносных процессов

  const names = ['svchost32.exe', 'csrss32.exe', 'winupdate.exe', 'netsvcs.exe', 'lsass32.exe', 'smss2.exe'];
  const pid = 5000 + Math.floor(Math.random() * 4000);
  
  useGameStore.setState(s => ({
    processes: [...s.processes, {
      pid,
      name: pick(names),
      cpu: Math.floor(Math.random() * 40 + 10),
      mem: `${Math.floor(Math.random() * 200 + 50)} MB`,
      isMalicious: true,
      hidden: state.breachLevel < 60, // Скрыт при низком breach level
    }],
  }));

  useGameStore.getState().addBreachLevel(3);
}

function spawnErrorPopup() {
  const errors = [
    { code: '0x0000007E', message: 'SYSTEM_THREAD_EXCEPTION_NOT_HANDLED' },
    { code: '0x0000001A', message: 'MEMORY_MANAGEMENT' },
    { code: '0x0000003B', message: 'SYSTEM_SERVICE_EXCEPTION' },
    { code: '0x00000050', message: 'PAGE_FAULT_IN_NONPAGED_AREA' },
    { code: '0x000000D1', message: 'DRIVER_IRQL_NOT_LESS_OR_EQUAL' },
    { code: '0x0000000A', message: 'IRQL_NOT_LESS_OR_EQUAL' },
    { code: '0x000000EF', message: 'CRITICAL_PROCESS_DIED' },
    { code: '0x00000024', message: 'NTFS_FILE_SYSTEM' },
  ];

  const err = pick(errors);
  const id = `error_${Date.now()}_${Math.random()}`;

  useGameStore.setState(s => ({
    errorPopups: [...s.errorPopups, {
      id,
      code: err.code,
      message: err.message,
      x: 100 + Math.random() * (window.innerWidth - 400),
      y: 50 + Math.random() * (window.innerHeight - 250),
    }],
  }));
}

function adminChaos() {
  const state = useGameStore.getState();
  
  // Случайно двигать открытое окно
  const openWindows = Object.values(state.windows).filter(w => w.isOpen);
  if (openWindows.length > 0) {
    const w = pick(openWindows);
    const newPos = {
      x: w.position.x + (Math.random() - 0.5) * 100,
      y: w.position.y + (Math.random() - 0.5) * 60,
    };
    useGameStore.getState().moveWindow(w.id, newPos);
  }
}

// === NEW MECHANICS FUNCTIONS ===

function spawnCryptoMiner() {
  const state = useGameStore.getState();
  if (state.minerActive) return;

  const pid = 7000 + Math.floor(Math.random() * 2000);
  useGameStore.setState(s => ({
    minerActive: true,
    processes: [...s.processes, {
      pid,
      name: 'xmrig_miner.exe',
      cpu: 85,
      mem: '256 MB',
      isMalicious: true,
      hidden: state.breachLevel < 40,
    }],
  }));

  useGameStore.getState().addNotification({ text: t('notif.minerDetected'), type: 'error' });
  useGameStore.getState().addTerminalLine({ 
    text: `[ALERT] Unauthorized crypto miner process detected! PID: ${pid}`, 
    type: 'error' 
  });

  // Open cooler window automatically
  useGameStore.getState().openWindow('cooler');
}

const ICQ_SPAM_MESSAGES = [
  'Hey babe! Check my pics at totally-not-a-virus.com 💋',
  'YOU WON $1,000,000! Click here to claim!!!',
  'Free ringtones! Download now at spamsite.ru',
  'Hot singles in your area! Click now!',
  'URGENT: Your account is compromised! Login at fake-bank.com',
  'Buy cheap V1@GR@ now!!! Best prices!',
  'Congratulations! You are our 1000th visitor!',
  'nigerian prince needs your help urgent reply',
  'MAKE $$$ FROM HOME! NO EXPERIENCE NEEDED!',
  'Free iPhone giveaway!!! Limited time only!!!',
  'Your Windows license expired! Call 1-800-SCAM',
  'Earn $500/day with this ONE simple trick!',
  'CLICK HERE for free V-Bucks!!!!',
  'Hey its me ur cousin. Send me money pls',
  'WARNING: Your PC has 47 viruses! Download antivirus NOW!',
];

const ICQ_SPAM_NAMES = [
  'HotBabe99', 'W1nner2024', 'FreeStuff4U', 'Prince_Nigeria', 
  'M0ney_Maker', 'TotallyReal', 'Admin_Support', 'L0tteryW1n',
  'Sexy_Girl_18', 'CashKing', 'PharmaDeal', 'Lucky_U', 'BotUser3847',
];

function triggerICQSpam() {
  const state = useGameStore.getState();
  
  useGameStore.setState({ icqSpamActive: true });
  
  // Send 8-15 spam messages rapidly 
  const spamCount = 8 + Math.floor(Math.random() * 8);
  const registryPassword = state.registryPassword;
  const allyIndex = Math.floor(Math.random() * spamCount);
  
  for (let i = 0; i < spamCount; i++) {
    const delay = i * 300 + Math.random() * 200; // staggered delivery
    
    setTimeout(() => {
      if (i === allyIndex && !state.registryUsed) {
        // This is the ally message with the real password
        useGameStore.getState().addICQMessage({
          from: '🔑 X_Defender',
          text: `Psst! I'm on your side. Use this registry key to harden the system: ${registryPassword} — Type "regedit ${registryPassword}" in cmd.exe. Hurry!`,
          time: new Date().toLocaleTimeString(),
          isAlly: true,
        });
      } else {
        // Spam message
        useGameStore.getState().addICQMessage({
          from: pick(ICQ_SPAM_NAMES),
          text: pick(ICQ_SPAM_MESSAGES),
          time: new Date().toLocaleTimeString(),
          isAlly: false,
        });
      }
    }, delay);
  }

  // Open ICQ window and notify
  useGameStore.getState().openWindow('icq');
  useGameStore.getState().addNotification({ text: t('notif.icqSpamAttack'), type: 'warning' });
  useGameStore.getState().addBreachLevel(3);

  // Reset spam flag after wave
  setTimeout(() => {
    useGameStore.setState({ icqSpamActive: false });
  }, spamCount * 400 + 2000);
}

// ============== ADVANCED AI TACTICS ==============

// Update adaptive player profile from state
function updatePlayerProfile(state: ReturnType<typeof useGameStore.getState>) {
  const currentKills = state.totalProcessesKilled || 0;
  const currentBlocked = state.blockedIPs.length;
  const currentPatched = state.nodes.filter(n => n.status === 'secure').length;

  if (currentKills > lastKillCount) {
    playerProfile.killCount += (currentKills - lastKillCount);
    lastKillCount = currentKills;
  }
  if (currentBlocked > lastBlockedCount) {
    playerProfile.blockCount += (currentBlocked - lastBlockedCount);
    lastBlockedCount = currentBlocked;
  }
  if (currentPatched > lastPatchedNodes) {
    playerProfile.patchCount += (currentPatched - lastPatchedNodes);
    lastPatchedNodes = currentPatched;
  }

  // Determine player's focus area
  const total = playerProfile.patchCount + playerProfile.killCount + playerProfile.blockCount;
  if (total > 5) {
    if (playerProfile.killCount > playerProfile.patchCount * 1.5) {
      playerProfile.preferredTarget = 'processes';
    } else if (playerProfile.patchCount > playerProfile.killCount * 1.5) {
      playerProfile.preferredTarget = 'nodes';
    } else {
      playerProfile.preferredTarget = 'balanced';
    }
  }
}

// 1. Polymorphic malware — rename malicious processes to look legit
function polymorphicMutation() {
  const state = useGameStore.getState();
  const legitimateNames = [
    'svchost.exe', 'csrss.exe', 'lsass.exe', 'services.exe', 'winlogon.exe',
    'smss.exe', 'wininit.exe', 'taskhost.exe', 'dwm.exe', 'conhost.exe',
    'spoolsv.exe', 'msiexec.exe', 'dllhost.exe', 'RuntimeBroker.exe',
  ];

  const malicious = state.processes.filter(p => p.isMalicious);
  if (malicious.length === 0) return;

  // Pick a random malicious process and rename it
  const target = pick(malicious);
  const newName = pick(legitimateNames);
  
  useGameStore.setState(s => ({
    processes: s.processes.map(p => 
      p.pid === target.pid ? { ...p, name: newName, hidden: true } : p
    ),
  }));
}

// 2. DNS Poisoning — shuffle node IPs to confuse the player
function dnsPoisoning() {
  const state = useGameStore.getState();
  const nodes = [...state.nodes];
  
  // Shuffle IPs of 2-3 random secure nodes
  const secureNodes = nodes.filter(n => n.status === 'secure');
  if (secureNodes.length < 2) return;

  const count = Math.min(secureNodes.length, 2 + Math.floor(Math.random() * 2));
  const shuffled = secureNodes.slice(0, count);
  const ips = shuffled.map(n => n.ip);
  
  // Rotate IPs
  const rotated = [ips[ips.length - 1], ...ips.slice(0, -1)];
  
  const updatedNodes = nodes.map(n => {
    const idx = shuffled.findIndex(s => s.id === n.id);
    if (idx >= 0) return { ...n, ip: rotated[idx] };
    return n;
  });

  useGameStore.setState({ nodes: updatedNodes });

  const lang = state.language;
  useGameStore.getState().addNotification({
    text: lang === 'uk'
      ? '⚠️ DNS аномалія виявлена! IP-адреси вузлів змінилися!'
      : '⚠️ DNS anomaly detected! Node IP addresses have changed!',
    type: 'warning',
  });
  useGameStore.getState().addTerminalLine({
    text: `[ALERT] DNS cache poisoning detected — IP mappings may be unreliable`,
    type: 'error',
  });
}

// 3. Ransomware — lock down nodes when breach is critical
function ransomwareAttack() {
  const state = useGameStore.getState();
  const secureNodes = state.nodes.filter(n => n.status === 'secure');
  if (secureNodes.length === 0) return;

  // Lock 1-2 nodes
  const target = pick(secureNodes);
  
  useGameStore.setState(s => ({
    nodes: s.nodes.map(n => 
      n.id === target.id ? { ...n, status: 'compromised' as const } : n
    ),
  }));

  useGameStore.getState().addBreachLevel(10);

  const lang = state.language;
  useGameStore.getState().addNotification({
    text: lang === 'uk'
      ? `🔒 РАНСОМВАРЬ! Вузол ${target.name} зашифровано! Використайте patch щоб відновити!`
      : `🔒 RANSOMWARE! Node ${target.name} encrypted! Use patch to recover!`,
    type: 'error',
  });
  useGameStore.getState().addTerminalLine({
    text: `[CRITICAL] Ransomware payload executed on ${target.name} (${target.ip}) — files encrypted`,
    type: 'error',
  });
}

// 4. Spawn camouflaged processes (corrupted RAM modifier)
function spawnCamouflagedProcess() {
  const state = useGameStore.getState();
  const existing = state.processes.filter(p => p.isMalicious);
  if (existing.length >= 6) return;

  // These look EXACTLY like system processes, but they're malware
  const camoNames = ['svchost.exe', 'csrss.exe', 'lsass.exe', 'services.exe', 'explorer.exe'];
  const pid = 1000 + Math.floor(Math.random() * 3000);
  
  useGameStore.setState(s => ({
    processes: [...s.processes, {
      pid,
      name: pick(camoNames),
      cpu: Math.floor(Math.random() * 5 + 1), // low CPU to avoid suspicion
      mem: `${Math.floor(Math.random() * 15 + 3)} MB`, // low memory
      isMalicious: true,
      hidden: true, // hidden from normal view
    }],
  }));

  useGameStore.getState().addBreachLevel(1);
}

// 5. Lateral movement — compromised nodes spread infection
function lateralSpread(waveScale: number) {
  const state = useGameStore.getState();
  const compromised = state.nodes.filter(n => n.status === 'compromised');
  const secure = state.nodes.filter(n => n.status === 'secure');
  
  if (compromised.length === 0 || secure.length === 0) return;
  if (Math.random() > 0.35 * Math.min(2, waveScale)) return; // chance scales with wave

  // Pick a random secure node adjacent to a compromised one
  // "Adjacent" = next in the node list (simplified topology)
  const nodeIds = state.nodes.map(n => n.id);
  for (const comp of compromised) {
    const compIdx = nodeIds.indexOf(comp.id);
    const neighbors = [compIdx - 1, compIdx + 1]
      .filter(i => i >= 0 && i < state.nodes.length)
      .map(i => state.nodes[i])
      .filter(n => n.status === 'secure');
    
    if (neighbors.length > 0) {
      const victim = pick(neighbors);
      // Start probing the neighbor — don't compromise instantly
      useGameStore.setState(s => ({
        nodes: s.nodes.map(n => 
          n.id === victim.id ? { ...n, status: 'probing' as const } : n
        ),
      }));

      const lang = state.language;
      useGameStore.getState().addNotification({
        text: lang === 'uk'
          ? `🕸️ Lateral movement: ${comp.name} заражає сусідній ${victim.name}!`
          : `🕸️ Lateral movement: ${comp.name} spreading to ${victim.name}!`,
        type: 'warning',
      });

      useGameStore.getState().addBreachLevel(3);
      break; // Only one spread per tick
    }
  }
}

// 6. Adaptive counter-tactics — AI reads player behavior and counters it
function adaptiveCounterTactic(waveScale: number, speedMult: number) {
  const state = useGameStore.getState();
  
  if (playerProfile.preferredTarget === 'processes') {
    // Player focuses on killing processes → AI spawns more stealthily
    if (Math.random() < 0.4) {
      spawnCamouflagedProcess();
      useGameStore.getState().addTerminalLine({
        text: `[AI] Hacker adapted: deploying stealth processes to evade task manager`,
        type: 'warning',
      });
    }
  } else if (playerProfile.preferredTarget === 'nodes') {
    // Player focuses on patching → AI increases brute force speed temporarily
    if (Math.random() < 0.4 && state.hackerState === 'ATTACK') {
      useGameStore.setState(s => ({
        bruteforceProgress: Math.round(Math.min(100, s.bruteforceProgress + 15) * 100) / 100,
      }));
      useGameStore.getState().addTerminalLine({
        text: `[AI] Hacker adapted: brute-force acceleration detected`,
        type: 'warning',
      });
    }
  }

  // If player blocks IPs frequently, hacker rotates IPs
  if (playerProfile.blockCount > 5 && Math.random() < 0.3) {
    // "Rotate" — unblock oldest IP and re-attack
    const blocked = state.blockedIPs;
    if (blocked.length > 2) {
      const released = blocked[0]; // oldest blocked IP
      useGameStore.setState(s => ({
        blockedIPs: s.blockedIPs.filter(ip => ip !== released),
      }));
      
      const lang = state.language;
      useGameStore.getState().addNotification({
        text: lang === 'uk'
          ? `🔄 Хакер змінив IP! ${released} знову активний!`
          : `🔄 Hacker rotated IP! ${released} is active again!`,
        type: 'warning',
      });
    }
  }
}

// 7. Insider threat email — looks like system email but is phishing
function sendInsiderThreatEmail() {
  emailCounter++;
  const insiderTemplates = [
    {
      from: 'HR Department <hr@your-company.local>',
      subject: 'Updated Employee Handbook — Please Review',
      body: `All employees,\n\nThe updated employee handbook has been attached for your review. Please download and sign the acknowledgment form.\n\nThis is mandatory for all staff by end of week.\n\n— Human Resources`,
      attachment: 'Employee_Handbook_2024.exe',
    },
    {
      from: 'IT Helpdesk <helpdesk@your-company.local>',
      subject: 'Password Reset Required — Security Audit',
      body: `Dear User,\n\nAs part of our quarterly security audit, all passwords must be reset.\n\nPlease run the attached tool to update your credentials automatically.\n\nFailure to comply will result in account suspension.\n\n— IT Security Team`,
      attachment: 'PasswordReset_Tool.exe',
    },
    {
      from: 'Accounting <accounting@your-company.local>',
      subject: 'Expense Report — Q4 Summary Attached',
      body: `Hi,\n\nPlease find attached the Q4 expense summary for your department.\n\nNote: The file requires macros to be enabled for proper formatting.\n\n— Accounting Department`,
      attachment: 'Q4_Expense_Report.xlsm.exe',
    },
  ];

  const template = pick(insiderTemplates);
  const email = {
    id: `email_${emailCounter}`,
    from: template.from,
    subject: template.subject,
    body: template.body,
    time: new Date().toLocaleTimeString(),
    isPhishing: true, // stealth phishing
    read: false,
    clickedLink: false,
    attachment: template.attachment,
  };

  useGameStore.setState(s => ({
    emails: [email, ...s.emails],
    unreadCount: s.unreadCount + 1,
  }));

  useGameStore.getState().addNotification({ 
    text: t('notif.newEmail', { subject: template.subject }), 
    type: 'info', // appears as regular info, not warning
  });
}
