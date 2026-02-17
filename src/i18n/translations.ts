export type Language = 'en' | 'uk';

export interface Translations {
  [key: string]: string;
}

const en: Translations = {
  // === Desktop Icons ===
  'desktop.myNetwork': 'My Network',
  'desktop.cmd': 'cmd.exe',
  'desktop.outlook': 'Outlook Express',
  'desktop.recycleBin': 'Recycle Bin',
  'desktop.taskManager': 'Task Manager',
  'desktop.windowsUpdate': 'Windows Update',
  'desktop.settings': 'Settings',

  // === Taskbar ===
  'taskbar.start': 'start',
  'taskbar.myNetwork': 'My Network',
  'taskbar.cmd': 'cmd.exe',
  'taskbar.outlook': 'Outlook',
  'taskbar.recycleBin': 'Recycle Bin',
  'taskbar.taskManager': 'Task Manager',
  'taskbar.updates': 'Updates',
  'taskbar.settings': 'Settings',

  // === Start Menu ===
  'startMenu.administrator': 'Administrator',
  'startMenu.defense': 'XP-Pocalypse Defense',
  'startMenu.breach': 'Breach',
  'startMenu.sp': 'SP',
  'startMenu.turnOff': 'Turn Off',

  // === Breach HUD ===
  'hud.breachLevel': 'BREACH LEVEL',

  // === Network Map ===
  'network.title': 'My Network Places',
  'network.topologyNodes': 'Network Topology — {count} nodes',
  'network.blockedIPs': 'Blocked IPs',
  'network.secure': '✅ Secure',
  'network.probing': '⚡ Under Probe',
  'network.compromised': '💀 COMPROMISED',
  'network.offline': '⬛ Offline',
  'network.status': 'Status',
  'network.security': 'Security',
  'network.firewalled': '🛡️ Firewalled',
  'network.bruteForce': '⚠ BRUTE FORCE IN PROGRESS',
  'network.menuFile': 'File',
  'network.menuView': 'View',
  'network.menuTools': 'Tools',

  // === Terminal ===
  'terminal.title': 'C:\\WINDOWS\\system32\\cmd.exe',

  // === Outlook ===
  'outlook.title': 'Outlook Express',
  'outlook.inbox': 'Inbox',
  'outlook.noMessages': 'No messages',
  'outlook.from': 'From:',
  'outlook.subject': 'Subject:',
  'outlook.date': 'Date:',
  'outlook.downloadUpdate': 'Download Update',
  'outlook.phishingWarning': '⚠️ YOU CLICKED A PHISHING LINK! Malware has been installed.',
  'outlook.selectMessage': 'Select a message to read',
  'outlook.menuFile': 'File',
  'outlook.menuEdit': 'Edit',
  'outlook.menuView': 'View',
  'outlook.menuTools': 'Tools',

  // === Recycle Bin ===
  'recycleBin.title': 'Recycle Bin',
  'recycleBin.emptyBin': 'Empty Recycle Bin',
  'recycleBin.name': 'Name',
  'recycleBin.size': 'Size',
  'recycleBin.type': 'Type',
  'recycleBin.action': 'Action',
  'recycleBin.empty': 'Recycle Bin is empty',
  'recycleBin.virus': 'VIRUS',
  'recycleBin.file': 'File',
  'recycleBin.del': '✕ Del',
  'recycleBin.items': '{count} item(s)',
  'recycleBin.malwareWarning': '⚠ Contains malware! Delete suspicious files immediately!',
  'recycleBin.menuFile': 'File',
  'recycleBin.menuEdit': 'Edit',

  // === Task Manager ===
  'taskMgr.title': 'Windows Task Manager',
  'taskMgr.processes': 'Processes',
  'taskMgr.performance': 'Performance',
  'taskMgr.imageName': 'Image Name',
  'taskMgr.pid': 'PID',
  'taskMgr.cpu': 'CPU',
  'taskMgr.mem': 'Mem',
  'taskMgr.hidden': '[HIDDEN]',
  'taskMgr.end': 'END',
  'taskMgr.processCount': 'Processes',
  'taskMgr.temp': 'Temp',
  'taskMgr.breach': 'Breach',
  'taskMgr.ai': 'AI',

  // === Update Center ===
  'updateCenter.title': 'Windows Update',
  'updateCenter.header': '🛡️ Windows Update Center',
  'updateCenter.subtitle': 'Install security updates to protect against the AI hacker',
  'updateCenter.stabilityPoints': 'Stability Points',
  'updateCenter.installed': '✅ Installed',
  'updateCenter.infoTip': '💡 Earn stability points by blocking hacker attacks, removing malicious processes, and recovering compromised nodes.',

  // === Upgrade names & descriptions ===
  'upgrade.firewall_v2.name': 'Firewall v2.0',
  'upgrade.firewall_v2.desc': 'Automatically blocks 20% of basic attacks',
  'upgrade.deep_scan.name': 'Deep Scan',
  'upgrade.deep_scan.desc': 'Reveals hidden processes in Task Manager',
  'upgrade.ai_decoy.name': 'AI-Decoy',
  'upgrade.ai_decoy.desc': 'Creates a fake folder that wastes the AI\'s time',
  'upgrade.auto_patch.name': 'Auto-Patcher',
  'upgrade.auto_patch.desc': 'Automatically recovers 1 Breach Level every 30s',
  'upgrade.encryption.name': 'AES-256 Encryption',
  'upgrade.encryption.desc': 'Increases hack difficulty for all nodes by +1',

  // === Error Popups ===
  'error.title': '⚠ Windows Error',
  'error.fatalError': 'A fatal error has occurred:',
  'error.ok': 'OK',

  // === Game Over (BSOD) ===
  'gameOver.fatalException': 'A fatal exception 0E has occurred at 0028:C0034B03 in VXD SYSTEM_CORE_AI.',
  'gameOver.fullBreach': 'The AI hacker has achieved full system breach.',
  'gameOver.breachStatus': 'BREACH_LEVEL: 100% | SYSTEM_COMPROMISED',
  'gameOver.survivalTime': 'Survival time: {time}',
  'gameOver.pointsEarned': 'Stability Points earned: {points}',
  'gameOver.pressRestart': 'Press any key to restart the system...',
  'gameOver.restartButton': 'RESTART SYSTEM',
  'gameOver.ctrlAltDel': 'Press Ctrl+Alt+Del to restart your computer. You will lose any unsaved information in all programs.',

  // === System Tray ===
  'tray.breachLevel': 'Breach Level: {level}%',
  'tray.unreadEmails': '{count} unread emails',
  'tray.cpu': 'CPU: {temp}°C',

  // === XP Window ===
  'window.ready': 'Ready',

  // === Terminal Commands ===
  'cmd.help.title': 'Available commands:',
  'cmd.help.help': '  help              - Show this help',
  'cmd.help.ipconfig': '  ipconfig          - Show network configuration',
  'cmd.help.ipconfigBlock': '  ipconfig /block [IP] - Block an IP address',
  'cmd.help.ipconfigUnblock': '  ipconfig /unblock [IP] - Unblock an IP',
  'cmd.help.netstat': '  netstat           - Show network status',
  'cmd.help.tasklist': '  tasklist          - Show running processes',
  'cmd.help.taskkill': '  taskkill /pid [PID] - Kill a process',
  'cmd.help.scan': '  scan              - Quick security scan',
  'cmd.help.patch': '  patch [node_id]   - Patch a compromised node',
  'cmd.help.systeminfo': '  systeminfo        - Show system info',
  'cmd.help.cls': '  cls               - Clear screen',
  'cmd.ipAlreadyBlocked': 'IP {ip} is already blocked.',
  'cmd.ipBlocked': '[OK] IP {ip} has been blocked.',
  'cmd.hackerDisrupted': '[!] Hacker connection disrupted! Attack halted.',
  'cmd.ipUnblocked': 'IP {ip} has been unblocked.',
  'cmd.ipConfig': 'Windows IP Configuration',
  'cmd.localArea': '  Local Area Connection:',
  'cmd.blockedIPs': '  Blocked IPs: {ips}',
  'cmd.blockedNone': 'none',
  'cmd.activeConnections': 'Active Connections:',
  'cmd.connHeader': '  Proto  Local Address       Foreign Address     State',
  'cmd.scanRunning': 'Running security scan...',
  'cmd.scanOk': '[OK] No threats detected.',
  'cmd.scanProbing': '[!] {count} node(s) under probe attack',
  'cmd.scanCompromised': '[!!!] {count} node(s) COMPROMISED',
  'cmd.scanMalware': '[!!!] {count} malicious process(es) detected',
  'cmd.scanBinMalware': '[!] {count} malware file(s) in Recycle Bin',
  'cmd.scanBreachLevel': 'Breach Level: {level}%',
  'cmd.processHeaders': 'Image Name                PID     CPU    Mem Usage',
  'cmd.processSeparator': '========================= ====== ====== ==========',
  'cmd.processNotFound': 'ERROR: The process with PID {pid} was not found.',
  'cmd.processKilled': 'SUCCESS: The process "{name}" with PID {pid} has been terminated.',
  'cmd.processSystem': 'WARNING: "{name}" is a system process. Cannot terminate.',
  'cmd.taskkillUsage': 'Usage: taskkill /pid [PID]',
  'cmd.nodeNotFound': 'Node "{id}" not found. Use node IDs: {ids}',
  'cmd.nodePatched': '[OK] Node "{name}" has been patched and secured.',
  'cmd.nodeNotCompromised': 'Node "{name}" is not compromised. Status: {status}',
  'cmd.patchUsage': 'Usage: patch [node_id]',
  'cmd.notRecognized': '\'{cmd}\' is not recognized as an internal or external command.',
  'cmd.typeHelp': 'Type "help" for available commands.',

  // === Notifications (from hackerAI) ===
  'notif.securityBreach': '⚠️ Security breach! virus.exe is running!',
  'notif.virusStarted': '[ALERT] Unauthorized process virus.exe (PID: {pid}) started!',
  'notif.malwareRemoved': 'Malware "{name}" removed!',
  'notif.upgradeInstalled': '✅ Upgrade "{name}" installed!',
  'notif.firewallBlocked': '🛡️ Firewall v2.0 blocked an attack!',
  'notif.accessAttempt': '⚡ Unauthorized access attempt on {name} ({ip})',
  'notif.intrusionDetected': '[ALERT] Intrusion detected: probing {ip} ({name})',
  'notif.nodeCompromised': '💀 NODE COMPROMISED: {name} ({ip})!',
  'notif.nodeCompromisedTerminal': '[CRITICAL] {name} has been COMPROMISED! Use "patch {id}" to recover.',
  'notif.bruteForceLog': '[{time}] Brute force attempt on {ip}: {progress}%',
  'notif.newEmail': '📧 New email: "{subject}"',
  'notif.suspiciousFile': '🗑️ Suspicious file detected in Recycle Bin!',

  // === System Email ===
  'email.systemFrom': 'SYSTEM <system@localhost>',
  'email.systemSubject': 'Welcome to XP-Pocalypse Defense System',
  'email.systemBody': 'DEFENSE SYSTEM ONLINE\n\nYour mission: defend the network against an adaptive AI hacker.\n\nTools available:\n- My Network: Monitor node status\n- cmd.exe: Type "help" for commands\n- Outlook: Watch for phishing attempts\n- Recycle Bin: Check for hidden malware\n\nSTAY VIGILANT. The AI learns and adapts.\n\n— System',

  // === Settings ===
  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.languageDesc': 'Select interface language',
  'settings.english': 'English',
  'settings.ukrainian': 'Українська',
  'settings.general': 'General',

  // === Desktop Icons (new) ===
  'desktop.cooler': 'System Case',
  'desktop.icq': 'ICQ',
  'desktop.defrag': 'Disk Defrag',
  'desktop.topology': 'Network Map',

  // === Taskbar (new) ===
  'taskbar.cooler': 'System Case',
  'taskbar.icq': 'ICQ',
  'taskbar.defrag': 'Defrag',
  'taskbar.hardwareShop': 'Hardware Shop',
  'taskbar.firewallTetris': 'Firewall Tetris',
  'desktop.firewallTetris': 'Firewall Tetris',
  'taskbar.achievements': 'Achievements',
  'desktop.achievements': 'Achievements',

  // === Cooler / Thermal ===
  'cooler.title': 'System Case — Cooling',
  'cooler.cpuTemp': 'CPU Temperature',
  'cooler.dustLevel': 'Dust Level',
  'cooler.clickFan': '🌀 Click fans to clean dust & cool CPU',
  'cooler.fan': '🌀',
  'cooler.minerWarning': '⚠ Crypto miner detected! CPU overheating!',
  'cooler.status': 'Status',
  'cooler.normal': '✅ Normal',
  'cooler.hot': '🔥 HOT',
  'cooler.critical': '🌡️ CRITICAL',
  'cooler.liquidCooling': '💧 Liquid Cooling: ACTIVE',

  // === ICQ ===
  'icq.title': 'ICQ Messenger',
  'icq.spamWarning': '⚠ SPAM ATTACK! Find the real message from your ally!',
  'icq.messagesCount': '{count} messages',
  'icq.allyHint': '💡 The ally message contains a Registry password. Use: regedit [password]',

  // === Defrag ===
  'defrag.title': 'Disk Defragmenter',
  'defrag.instruction': 'Drag 🟦 blue blocks to the ✅ safe zone (right). Avoid 🟥 red virus blocks!',
  'defrag.blueInSafe': 'Blocks saved: {count}',
  'defrag.start': 'Start Defrag',
  'defrag.running': 'Defragmentation in progress...',

  // === BSOD Mini-game ===
  'bsod.catchErrors': 'CATCH THE ERRORS! Click on moving error codes to fix them!',
  'bsod.caught': 'Fixed: {caught}/{total}',
  'bsod.timeLeft': 'Time: {time}s',
  'bsod.success': 'System recovered! Rebooting...',
  'bsod.fail': 'Too slow! System crashed.',

  // === New Upgrade names ===
  'upgrade.cmd_autocomplete.name': 'Command Autocomplete',
  'upgrade.cmd_autocomplete.desc': 'Tab-completion for terminal commands (press Tab)',
  'upgrade.liquid_cooling.name': 'Liquid Cooling',
  'upgrade.liquid_cooling.desc': 'Drastically reduces CPU temperature buildup',

  // === New Terminal Commands ===
  'cmd.help.regedit': '  regedit [key]     - Apply registry security key',
  'cmd.regeditSuccess': '[OK] Registry key applied! System hardened.',
  'cmd.regeditBreachReduced': '[OK] Breach level reduced by 25%!',
  'cmd.regeditAlreadyUsed': 'Registry key has already been applied.',
  'cmd.regeditWrongKey': 'ERROR: Invalid registry key.',
  'cmd.regeditUsage': 'Usage: regedit [registry_key] — obtain key from allies.',

  // === New Notifications ===
  'notif.autocompleteHint': '💡 Tip: You have enough SP to buy Command Autocomplete (10 SP) in Windows Update!',
  'notif.minerDetected': '⚠️ Crypto miner detected! CPU temperature rising! Open System Case!',
  'notif.bsodRecovered': '🔄 System recovered from BSOD! Breach level reduced to 50%.',
  'notif.defragComplete': '💾 Defragmentation complete! Data secured! Breach reduced.',
  'notif.icqSpamAttack': '💬 ICQ Spam attack incoming! Check ICQ for an ally message!',
  'notif.minerKilled': '✅ Crypto miner process terminated! Temperature normalizing.',

  // === Network node names ===
  'node.mainServer': 'Main Server',
  'node.database': 'Database',
  'node.mailServer': 'Mail Server',
  'node.backupNAS': 'Backup NAS',
  'node.firewallGateway': 'Firewall Gateway',
  'node.workstation3': 'Workstation #3',

  // === Clippy Tips ===
  'clippy.beingHacked': 'Looks like you\'re being hacked! Try "scan" in cmd.exe to find threats. Or, you know, just panic. That works too.',
  'clippy.cpuHot': '🔥 Your CPU is on fire! Well, almost. Open System Case and blow on the fans! Just kidding, click them.',
  'clippy.dusty': 'Wow, when\'s the last time you cleaned this thing? Open System Case and deal with the dust bunnies!',
  'clippy.spendSP': 'You\'re hoarding SP like a dragon hoards gold! Visit Windows Update and buy something useful!',
  'clippy.blockIP': 'Pro tip: "ipconfig /block [IP]" blocks hackers. It\'s like a restraining order, but for nerds.',
  'clippy.halfDead': '🚨 Breach at 50%+! The hackers are having a party in your system! Do something!!',
  'clippy.gettingSerious': 'The hackers brought reinforcements. This is fine. Everything is fine. 🔥',
  'clippy.tooManyProcs': 'Your Task Manager looks like a malware convention. Kill some processes, chief!',
  'clippy.checkMail': '📧 You have unread emails! Some might be phishing though. Choose wisely...',
  'clippy.welcome': 'It looks like you\'re defending a Windows XP system. Would you like help? (You probably need it.)',
  'clippy.classic': 'Remember: in 2003, this was state-of-the-art security. 😌',
};

const uk: Translations = {
  // === Desktop Icons ===
  'desktop.myNetwork': 'Мережеве оточення',
  'desktop.cmd': 'cmd.exe',
  'desktop.outlook': 'Outlook Express',
  'desktop.recycleBin': 'Кошик',
  'desktop.taskManager': 'Диспетчер завдань',
  'desktop.windowsUpdate': 'Оновлення Windows',
  'desktop.settings': 'Налаштування',

  // === Taskbar ===
  'taskbar.start': 'пуск',
  'taskbar.myNetwork': 'Мережа',
  'taskbar.cmd': 'cmd.exe',
  'taskbar.outlook': 'Outlook',
  'taskbar.recycleBin': 'Кошик',
  'taskbar.taskManager': 'Диспетчер',
  'taskbar.updates': 'Оновлення',
  'taskbar.settings': 'Налаштування',

  // === Start Menu ===
  'startMenu.administrator': 'Адміністратор',
  'startMenu.defense': 'XP-Pocalypse Захист',
  'startMenu.breach': 'Злам',
  'startMenu.sp': 'ОС',
  'startMenu.turnOff': 'Завершення роботи',

  // === Breach HUD ===
  'hud.breachLevel': 'РІВЕНЬ ЗЛАМУ',

  // === Network Map ===
  'network.title': 'Мережеве оточення',
  'network.topologyNodes': 'Топологія мережі — {count} вузлів',
  'network.blockedIPs': 'Заблоковані IP',
  'network.secure': '✅ Захищено',
  'network.probing': '⚡ Сканується',
  'network.compromised': '💀 СКОМПРОМЕТОВАНО',
  'network.offline': '⬛ Офлайн',
  'network.status': 'Статус',
  'network.security': 'Безпека',
  'network.firewalled': '🛡️ Файрвол',
  'network.bruteForce': '⚠ БРУТФОРС В ПРОЦЕСІ',
  'network.menuFile': 'Файл',
  'network.menuView': 'Вигляд',
  'network.menuTools': 'Сервіс',

  // === Terminal ===
  'terminal.title': 'C:\\WINDOWS\\system32\\cmd.exe',

  // === Outlook ===
  'outlook.title': 'Outlook Express',
  'outlook.inbox': 'Вхідні',
  'outlook.noMessages': 'Немає повідомлень',
  'outlook.from': 'Від:',
  'outlook.subject': 'Тема:',
  'outlook.date': 'Дата:',
  'outlook.downloadUpdate': 'Завантажити оновлення',
  'outlook.phishingWarning': '⚠️ ВИ НАТИСНУЛИ НА ФІШИНГОВЕ ПОСИЛАННЯ! Шкідливе ПЗ було встановлено.',
  'outlook.selectMessage': 'Оберіть повідомлення для читання',
  'outlook.menuFile': 'Файл',
  'outlook.menuEdit': 'Редагувати',
  'outlook.menuView': 'Вигляд',
  'outlook.menuTools': 'Сервіс',

  // === Recycle Bin ===
  'recycleBin.title': 'Кошик',
  'recycleBin.emptyBin': 'Очистити кошик',
  'recycleBin.name': 'Ім\'я',
  'recycleBin.size': 'Розмір',
  'recycleBin.type': 'Тип',
  'recycleBin.action': 'Дія',
  'recycleBin.empty': 'Кошик порожній',
  'recycleBin.virus': 'ВІРУС',
  'recycleBin.file': 'Файл',
  'recycleBin.del': '✕ Вид.',
  'recycleBin.items': '{count} елемент(ів)',
  'recycleBin.malwareWarning': '⚠ Містить шкідливе ПЗ! Негайно видаліть підозрілі файли!',
  'recycleBin.menuFile': 'Файл',
  'recycleBin.menuEdit': 'Редагувати',

  // === Task Manager ===
  'taskMgr.title': 'Диспетчер завдань Windows',
  'taskMgr.processes': 'Процеси',
  'taskMgr.performance': 'Продуктивність',
  'taskMgr.imageName': 'Ім\'я процесу',
  'taskMgr.pid': 'PID',
  'taskMgr.cpu': 'ЦП',
  'taskMgr.mem': 'Пам\'ять',
  'taskMgr.hidden': '[ПРИХОВАНИЙ]',
  'taskMgr.end': 'ЗАВЕРШИТИ',
  'taskMgr.processCount': 'Процесів',
  'taskMgr.temp': 'Темп.',
  'taskMgr.breach': 'Злам',
  'taskMgr.ai': 'ШІ',

  // === Update Center ===
  'updateCenter.title': 'Оновлення Windows',
  'updateCenter.header': '🛡️ Центр оновлення Windows',
  'updateCenter.subtitle': 'Встановіть оновлення безпеки для захисту від ШІ-хакера',
  'updateCenter.stabilityPoints': 'Очки стабільності',
  'updateCenter.installed': '✅ Встановлено',
  'updateCenter.infoTip': '💡 Заробляйте очки стабільності, блокуючи атаки хакера, видаляючи шкідливі процеси та відновлюючи скомпрометовані вузли.',

  // === Upgrade names & descriptions ===
  'upgrade.firewall_v2.name': 'Файрвол v2.0',
  'upgrade.firewall_v2.desc': 'Автоматично блокує 20% простих атак',
  'upgrade.deep_scan.name': 'Глибоке сканування',
  'upgrade.deep_scan.desc': 'Дозволяє бачити приховані процеси у Диспетчері завдань',
  'upgrade.ai_decoy.name': 'ШІ-Приманка',
  'upgrade.ai_decoy.desc': 'Створює фальшиву папку, на яку ШІ витрачає час',
  'upgrade.auto_patch.name': 'Авто-Патчер',
  'upgrade.auto_patch.desc': 'Автоматично відновлює 1 рівень зламу кожні 30с',
  'upgrade.encryption.name': 'Шифрування AES-256',
  'upgrade.encryption.desc': 'Збільшує складність зламу всіх вузлів на +1',

  // === Error Popups ===
  'error.title': '⚠ Помилка Windows',
  'error.fatalError': 'Виникла критична помилка:',
  'error.ok': 'ОК',

  // === Game Over (BSOD) ===
  'gameOver.fatalException': 'Сталася критична помилка 0E за адресою 0028:C0034B03 в VXD SYSTEM_CORE_AI.',
  'gameOver.fullBreach': 'ШІ-хакер досяг повного зламу системи.',
  'gameOver.breachStatus': 'РІВЕНЬ_ЗЛАМУ: 100% | СИСТЕМА_СКОМПРОМЕТОВАНА',
  'gameOver.survivalTime': 'Час виживання: {time}',
  'gameOver.pointsEarned': 'Зароблено очків стабільності: {points}',
  'gameOver.pressRestart': 'Натисніть будь-яку клавішу для перезавантаження...',
  'gameOver.restartButton': 'ПЕРЕЗАВАНТАЖИТИ',
  'gameOver.ctrlAltDel': 'Натисніть Ctrl+Alt+Del для перезавантаження комп\'ютера. Ви втратите всі незбережені дані.',

  // === System Tray ===
  'tray.breachLevel': 'Рівень зламу: {level}%',
  'tray.unreadEmails': '{count} непрочитаних листів',
  'tray.cpu': 'ЦП: {temp}°C',

  // === XP Window ===
  'window.ready': 'Готово',

  // === Terminal Commands ===
  'cmd.help.title': 'Доступні команди:',
  'cmd.help.help': '  help              - Показати цю довідку',
  'cmd.help.ipconfig': '  ipconfig          - Конфігурація мережі',
  'cmd.help.ipconfigBlock': '  ipconfig /block [IP] - Заблокувати IP-адресу',
  'cmd.help.ipconfigUnblock': '  ipconfig /unblock [IP] - Розблокувати IP',
  'cmd.help.netstat': '  netstat           - Стан мережі',
  'cmd.help.tasklist': '  tasklist          - Список процесів',
  'cmd.help.taskkill': '  taskkill /pid [PID] - Завершити процес',
  'cmd.help.scan': '  scan              - Швидке сканування безпеки',
  'cmd.help.patch': '  patch [node_id]   - Відновити скомпрометований вузол',
  'cmd.help.systeminfo': '  systeminfo        - Інформація про систему',
  'cmd.help.cls': '  cls               - Очистити екран',
  'cmd.ipAlreadyBlocked': 'IP {ip} вже заблоковано.',
  'cmd.ipBlocked': '[OK] IP {ip} заблоковано.',
  'cmd.hackerDisrupted': '[!] З\'єднання хакера перервано! Атаку зупинено.',
  'cmd.ipUnblocked': 'IP {ip} розблоковано.',
  'cmd.ipConfig': 'Конфігурація IP Windows',
  'cmd.localArea': '  Підключення по локальній мережі:',
  'cmd.blockedIPs': '  Заблоковані IP: {ips}',
  'cmd.blockedNone': 'немає',
  'cmd.activeConnections': 'Активні підключення:',
  'cmd.connHeader': '  Прото Локальна адреса       Зовнішня адреса     Стан',
  'cmd.scanRunning': 'Запуск сканування безпеки...',
  'cmd.scanOk': '[OK] Загроз не виявлено.',
  'cmd.scanProbing': '[!] {count} вузол(ів) під атакою сканування',
  'cmd.scanCompromised': '[!!!] {count} вузол(ів) СКОМПРОМЕТОВАНО',
  'cmd.scanMalware': '[!!!] {count} шкідливий(их) процес(ів) виявлено',
  'cmd.scanBinMalware': '[!] {count} файл(ів) шкідливого ПЗ у Кошику',
  'cmd.scanBreachLevel': 'Рівень зламу: {level}%',
  'cmd.processHeaders': 'Ім\'я процесу            PID     ЦП     Пам\'ять',
  'cmd.processSeparator': '========================= ====== ====== ==========',
  'cmd.processNotFound': 'ПОМИЛКА: Процес з PID {pid} не знайдено.',
  'cmd.processKilled': 'УСПІШНО: Процес "{name}" з PID {pid} завершено.',
  'cmd.processSystem': 'УВАГА: "{name}" — системний процес. Неможливо завершити.',
  'cmd.taskkillUsage': 'Використання: taskkill /pid [PID]',
  'cmd.nodeNotFound': 'Вузол "{id}" не знайдено. Використовуйте ID вузлів: {ids}',
  'cmd.nodePatched': '[OK] Вузол "{name}" відновлено і захищено.',
  'cmd.nodeNotCompromised': 'Вузол "{name}" не скомпрометований. Статус: {status}',
  'cmd.patchUsage': 'Використання: patch [node_id]',
  'cmd.notRecognized': '\'{cmd}\' не розпізнано як внутрішню або зовнішню команду.',
  'cmd.typeHelp': 'Введіть "help" для списку доступних команд.',

  // === Notifications (from hackerAI) ===
  'notif.securityBreach': '⚠️ Порушення безпеки! virus.exe запущено!',
  'notif.virusStarted': '[УВАГА] Несанкціонований процес virus.exe (PID: {pid}) запущено!',
  'notif.malwareRemoved': 'Шкідливе ПЗ "{name}" видалено!',
  'notif.upgradeInstalled': '✅ Оновлення "{name}" встановлено!',
  'notif.firewallBlocked': '🛡️ Файрвол v2.0 заблокував атаку!',
  'notif.accessAttempt': '⚡ Несанкціонована спроба доступу до {name} ({ip})',
  'notif.intrusionDetected': '[УВАГА] Виявлено вторгнення: сканування {ip} ({name})',
  'notif.nodeCompromised': '💀 ВУЗОЛ СКОМПРОМЕТОВАНО: {name} ({ip})!',
  'notif.nodeCompromisedTerminal': '[КРИТИЧНО] {name} СКОМПРОМЕТОВАНО! Використайте "patch {id}" для відновлення.',
  'notif.bruteForceLog': '[{time}] Спроба брутфорсу {ip}: {progress}%',
  'notif.newEmail': '📧 Новий лист: "{subject}"',
  'notif.suspiciousFile': '🗑️ Підозрілий файл виявлено у Кошику!',

  // === System Email ===
  'email.systemFrom': 'СИСТЕМА <system@localhost>',
  'email.systemSubject': 'Ласкаво просимо до системи захисту XP-Pocalypse',
  'email.systemBody': 'СИСТЕМУ ЗАХИСТУ АКТИВОВАНО\n\nВаша місія: захистити мережу від адаптивного ШІ-хакера.\n\nДоступні інструменти:\n- Мережеве оточення: Моніторинг стану вузлів\n- cmd.exe: Введіть "help" для команд\n- Outlook: Стежте за фішинговими атаками\n- Кошик: Перевіряйте на приховане шкідливе ПЗ\n\nБУДЬТЕ ПИЛЬНІ. ШІ вчиться та адаптується.\n\n— Система',

  // === Settings ===
  'settings.title': 'Налаштування',
  'settings.language': 'Мова',
  'settings.languageDesc': 'Оберіть мову інтерфейсу',
  'settings.english': 'English',
  'settings.ukrainian': 'Українська',
  'settings.general': 'Загальне',

  // === Desktop Icons (new) ===
  'desktop.cooler': 'Системний блок',
  'desktop.icq': 'ICQ',
  'desktop.defrag': 'Дефрагментація',
  'desktop.topology': 'Карта мережі',

  // === Taskbar (new) ===
  'taskbar.cooler': 'Сист. блок',
  'taskbar.icq': 'ICQ',
  'taskbar.defrag': 'Дефраг',
  'taskbar.hardwareShop': 'Магазин деталей',
  'taskbar.firewallTetris': 'Firewall Тетріс',
  'desktop.firewallTetris': 'Firewall Тетріс',
  'taskbar.achievements': 'Досягнення',
  'desktop.achievements': 'Досягнення',

  // === Cooler / Thermal ===
  'cooler.title': 'Системний блок — Охолодження',
  'cooler.cpuTemp': 'Температура ЦП',
  'cooler.dustLevel': 'Рівень пилу',
  'cooler.clickFan': '🌀 Натискайте на вентилятори, щоб очистити пил та охолодити ЦП',
  'cooler.fan': '🌀',
  'cooler.minerWarning': '⚠ Виявлено крипто-майнер! ЦП перегрівається!',
  'cooler.status': 'Статус',
  'cooler.normal': '✅ Нормально',
  'cooler.hot': '🔥 ГАРЯЧЕ',
  'cooler.critical': '🌡️ КРИТИЧНО',
  'cooler.liquidCooling': '💧 Рідинне охолодження: АКТИВНЕ',

  // === ICQ ===
  'icq.title': 'ICQ Месенджер',
  'icq.spamWarning': '⚠ СПАМ-АТАКА! Знайдіть справжнє повідомлення від союзника!',
  'icq.messagesCount': '{count} повідомлень',
  'icq.allyHint': '💡 Повідомлення союзника містить ключ реєстру. Використайте: regedit [ключ]',

  // === Defrag ===
  'defrag.title': 'Дефрагментація диска',
  'defrag.instruction': 'Перетягніть 🟦 сині блоки у ✅ безпечну зону (праворуч). Уникайте 🟥 червоних вірусних блоків!',
  'defrag.blueInSafe': 'Блоків збережено: {count}',
  'defrag.start': 'Почати дефрагментацію',
  'defrag.running': 'Дефрагментація в процесі...',

  // === BSOD Mini-game ===
  'bsod.catchErrors': 'ЗЛОВІТЬ ПОМИЛКИ! Клікайте на рухомі коди помилок, щоб виправити їх!',
  'bsod.caught': 'Виправлено: {caught}/{total}',
  'bsod.timeLeft': 'Час: {time}с',
  'bsod.success': 'Систему відновлено! Перезавантаження...',
  'bsod.fail': 'Занадто повільно! Система впала.',

  // === New Upgrade names ===
  'upgrade.cmd_autocomplete.name': 'Автодоповнення команд',
  'upgrade.cmd_autocomplete.desc': 'Автодоповнення для терміналу (натисніть Tab)',
  'upgrade.liquid_cooling.name': 'Рідинне охолодження',
  'upgrade.liquid_cooling.desc': 'Значно зменшує нагрів процесора',

  // === New Terminal Commands ===
  'cmd.help.regedit': '  regedit [ключ]    - Застосувати ключ безпеки реєстру',
  'cmd.regeditSuccess': '[OK] Ключ реєстру застосовано! Система зміцнена.',
  'cmd.regeditBreachReduced': '[OK] Рівень зламу зменшено на 25%!',
  'cmd.regeditAlreadyUsed': 'Ключ реєстру вже було застосовано.',
  'cmd.regeditWrongKey': 'ПОМИЛКА: Невірний ключ реєстру.',
  'cmd.regeditUsage': 'Використання: regedit [ключ_реєстру] — отримайте ключ від союзників.',

  // === New Notifications ===
  'notif.autocompleteHint': '💡 Порада: У вас достатньо ОС для покупки Автодоповнення команд (10 ОС) в Оновленнях Windows!',
  'notif.minerDetected': '⚠️ Виявлено крипто-майнер! Температура ЦП зростає! Відкрийте Системний блок!',
  'notif.bsodRecovered': '🔄 Систему відновлено після синього екрану! Рівень зламу зменшено до 50%.',
  'notif.defragComplete': '💾 Дефрагментацію завершено! Дані захищено! Злам зменшено.',
  'notif.icqSpamAttack': '💬 Спам-атака ICQ! Перевірте ICQ на повідомлення від союзника!',
  'notif.minerKilled': '✅ Процес крипто-майнера завершено! Температура нормалізується.',

  // === Network node names ===
  'node.mainServer': 'Головний сервер',
  'node.database': 'База даних',
  'node.mailServer': 'Поштовий сервер',
  'node.backupNAS': 'Резервний NAS',
  'node.firewallGateway': 'Шлюз файрвола',
  'node.workstation3': 'Робоча станція #3',

  // === Поради Кліппі ===
  'clippy.beingHacked': 'Схоже, вас зламують! Спробуйте "scan" в cmd.exe щоб знайти загрози. Або просто панікуйте. Теж варіант.',
  'clippy.cpuHot': '🔥 Ваш процесор горить! Ну, майже. Відкрийте Системний блок і подуйте на вентилятори! Жарт, клікніть.',
  'clippy.dusty': 'Ого, коли ви останній раз чистили це? Відкрийте Системний блок і розберіться з пилом!',
  'clippy.spendSP': 'Ви накопичуєте ОС як дракон золото! Завітайте в Оновлення Windows і купіть щось корисне!',
  'clippy.blockIP': 'Порада: "ipconfig /block [IP]" блокує хакерів. Це як заборона наближатися, але для нердів.',
  'clippy.halfDead': '🚨 Злам 50%+! Хакери влаштували вечірку у вашій системі! Зробіть щось!!',
  'clippy.gettingSerious': 'Хакери привели підкріплення. Все нормально. Взагалі все ок. 🔥',
  'clippy.tooManyProcs': 'Диспетчер завдань виглядає як конвенція малварі. Вбийте кілька процесів, шефе!',
  'clippy.checkMail': '📧 У вас непрочитані листи! Деякі можуть бути фішингом. Обирайте мудро...',
  'clippy.welcome': 'Схоже, ви захищаєте систему Windows XP. Потрібна допомога? (Мабуть вам вона потрібна.)',
  'clippy.classic': 'Пам\'ятайте: у 2003-му це була найновіша система безпеки. 😌',
};

export const translations: Record<Language, Translations> = { en, uk };

/**
 * Get a translated string with optional parameter substitution.
 * Usage: t('en', 'cmd.ipBlocked', { ip: '1.2.3.4' }) => '[OK] IP 1.2.3.4 has been blocked.'
 */
export function getTranslation(lang: Language, key: string, params?: Record<string, string | number>): string {
  let text = translations[lang]?.[key] ?? translations['en']?.[key] ?? key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  return text;
}
