import { useGameStore, type HackerState, WAVES, DIFFICULTY_CONFIG } from '../../store/gameStore';
import { getTranslation } from '../../i18n/translations';

function t(key: string, params?: Record<string, string | number>) {
  const lang = useGameStore.getState().language;
  return getTranslation(lang, key, params);
}

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

// Основной тик ИИ-хакера — вызывается каждую секунду
export function hackerTick() {
  const state = useGameStore.getState();
  if (state.isPaused || state.gameOver) return;

  const { 
    hackerState, hackerAggression, gameTime, nodes, blockedIPs, 
    currentTargetNodeId, bruteforceProgress, attackCooldown,
    hackerAdminAccess, breachLevel
  } = state;

  // Wave-based scaling: later waves make everything faster
  const wave = WAVES[state.currentWave] || WAVES[WAVES.length - 1];
  const waveScale = wave.breachRateMultiplier; // 0.8 → 3.5
  const diffConfig = DIFFICULTY_CONFIG[state.difficulty];

  // === СТЕЙТ-МАШИНА ===
  switch (hackerState) {
    case 'RECON':
      handleRecon(state, waveScale, diffConfig.hackerSpeedMult);
      break;
    case 'ATTACK':
      handleAttack(state, waveScale, diffConfig.hackerSpeedMult);
      break;
    case 'HIDE':
      handleHide(state, waveScale);
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
  const hasFirewall = state.upgrades.find(u => u.id === 'firewall_v2')?.purchased;
  if (hasFirewall && hackerState === 'ATTACK' && Math.random() < 0.2) {
    useGameStore.setState({ 
      hackerState: 'HIDE' as HackerState, 
      attackCooldown: Math.max(3, Math.floor(10 / waveScale)),
      bruteforceProgress: Math.max(0, bruteforceProgress - 10),
    });
    useGameStore.getState().addNotification({ text: t('notif.firewallBlocked'), type: 'success' });
  }
}

function handleRecon(state: ReturnType<typeof useGameStore.getState>, waveScale: number, speedMult: number) {
  const { gameTime, hackerAggression, nodes, blockedIPs } = state;

  // Разведка: выбор цели — faster scanning in later waves
  const reconInterval = Math.max(2, Math.floor((8 - hackerAggression) / (waveScale * speedMult)));
  if (gameTime % reconInterval === 0) {
    // Найти незаблокированный, незахваченный узел для атаки
    const targets = nodes.filter(n => 
      n.status === 'secure' && !blockedIPs.includes(n.ip)
    );
    
    if (targets.length > 0) {
      const target = pick(targets);
      
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

function handleAttack(state: ReturnType<typeof useGameStore.getState>, waveScale: number, speedMult: number) {
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
  const bruteSpeed = (hackerAggression * 0.8) / targetNode.difficulty * (hasDecoy ? 0.5 : 1) * waveScale * speedMult;
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

function handleHide(state: ReturnType<typeof useGameStore.getState>, waveScale: number) {
  const { attackCooldown } = state;
  
  // Cooldown decreases faster in later waves
  const cooldownSpeed = Math.max(1, Math.ceil(waveScale));
  if (attackCooldown > 0) {
    useGameStore.setState({ attackCooldown: Math.max(0, attackCooldown - cooldownSpeed) });
  } else {
    useGameStore.setState({ hackerState: 'RECON' as HackerState });
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
