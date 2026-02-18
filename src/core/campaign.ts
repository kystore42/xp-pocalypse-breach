// ============================================================================
// CAMPAIGN MODE — FULL STORY
// ============================================================================
// A ~2-hour story-driven campaign:
//   From garage startup → global enterprise
//   From Computer Enthusiast → CISO
//   From 286 PC → Core i7
//   From 3 nodes → 10+ with SCADA
//   21 missions across 7 chapters (Windows 3.1 → Windows 7)
// ============================================================================

export type CampaignEra = 'win31' | 'win95' | 'win98' | 'winME' | 'winXP' | 'vista' | 'win7';

// ── Modifier system ─────────────────────────────────────────────────────────
export type MissionModifier =
  | 'no_firewall'         // firewall upgrades disabled
  | 'double_phishing'     // 2x phishing emails
  | 'stealth_ai'          // AI hides more, harder to detect
  | 'fast_breach'         // passive breach rate × 2
  | 'fragile_nodes'       // nodes compromised faster
  | 'no_shop'             // no between-wave shop
  | 'limited_cmds'        // only scan/patch/taskkill commands available
  | 'corrupted_ram'       // random processes spawn as legit-looking
  | 'polymorphic'         // malware changes PID names each tick
  | 'lateral_movement'    // compromised nodes spread to neighbors
  | 'zero_day'            // AI can bypass firewalled nodes
  | 'insider_threat'      // random "legit" emails are actually phishing
  | 'dns_poisoning'       // node IPs shuffle periodically
  | 'ransomware'          // if breach > 80%, nodes lock and need special unlock
  | 'social_engineering'; // more convincing phishing templates

// ── Sub-interfaces ──────────────────────────────────────────────────────────
export interface SpecialNode {
  id: string;
  name: string;
  ip: string;
  difficulty: number;
  firewalled: boolean;
}

export interface CampaignReward {
  sp: number;
  title: string;
  titleUk: string;
}

// ── Company / Player / PC progression snapshots ─────────────────────────────
export interface CompanySnapshot {
  name: string;
  employees: number;
  revenue: string;
  dataRecords: string;
  servers: number;
  office: string;
  officeUk: string;
  icon: string;
}

export interface PlayerSnapshot {
  role: string;
  roleUk: string;
  skillLevel: number;       // 1-7
  salary: string;
  icon: string;
}

export interface PCSnapshot {
  name: string;
  cpu: string;
  ram: string;
  storage: string;
  connection: string;
  icon: string;
}

// ── Chapter (one per era) ───────────────────────────────────────────────────
export interface Chapter {
  id: CampaignEra;
  number: number;
  title: string;
  titleUk: string;
  yearRange: string;
  storyIntro: string;
  storyIntroUk: string;
  company: CompanySnapshot;
  player: PlayerSnapshot;
  pc: PCSnapshot;
}

// ── Mission ─────────────────────────────────────────────────────────────────
export interface CampaignMission {
  id: string;
  era: CampaignEra;
  chapter: number;                   // 1-7
  eraYear: number;
  eraName: string;
  title: string;
  titleUk: string;
  briefing: string;
  briefingUk: string;
  completionText: string;
  completionTextUk: string;
  waves: number;
  waveDurationBase: number;
  breachMultiplier: number;
  aiSpeedMultiplier: number;
  startingSP: number;
  nodeCount: number;
  specialNodes?: SpecialNode[];
  modifiers: MissionModifier[];
  reward: CampaignReward;
  unlockCondition: string | null;
  wallpaperHue: number;
  accentColor: string;
}

// ── Campaign state (persisted in the store) ─────────────────────────────────
export interface CampaignState {
  currentMissionId: string | null;
  completedMissions: string[];
  unlockedEras: CampaignEra[];
  totalStars: number;
  missionStars: Record<string, number>;
}

// ============================================================================
// CHAPTERS
// ============================================================================

export const CHAPTERS: Chapter[] = [
  // ═══ CHAPTER 1 ═══
  {
    id: 'win31',
    number: 1,
    title: 'Genesis',
    titleUk: 'Початок',
    yearRange: '1992 – 1993',
    storyIntro:
      'The year is 1992. You\'re 19, fresh out of a vocational school, and you know more about computers than anyone in your small town. Your neighbor, Viktor, runs a tiny trading company out of his garage — three desks, a fax machine, and an old coffee maker. He bought three 286 PCs and strung them together with coaxial cable. "You know computers, right? Make them work," he said.\n\nYou didn\'t know it then, but that moment changed everything.\n\nThe salary is terrible. The PCs are slower than molasses. But when you first saw that blinking cursor on the command line... you felt something. Power. Control. Purpose.\n\nToday is your first day. The modem is humming. And somewhere out there, someone is already trying to get in.',
    storyIntroUk:
      'Рік 1992. Тобі 19, ти щойно закінчив ПТУ, і ти розбираєшся в комп\'ютерах краще за всіх у своєму містечку. Твій сусід Віктор тримає маленьку торгову фірму в гаражі — три столи, факс і стара кавоварка. Він купив три 286-х і з\'єднав їх коаксіальним кабелем. "Ти ж шариш в компах? Зроби, щоб працювало," — сказав він.\n\nТи тоді не знав, але цей момент змінив все.\n\nЗарплата — мізер. Комп\'ютери повільніші за равлика. Але коли ти вперше побачив миготливий курсор на командному рядку... ти відчув щось. Силу. Контроль. Мету.\n\nСьогодні — твій перший день. Модем гуде. І десь там, хтось вже намагається пробратися всередину.',
    company: { name: 'ViktorTrade', employees: 3, revenue: '$12K/рік', dataRecords: '200 файлів', servers: 0, office: 'Garage', officeUk: 'Гараж', icon: '🏚️' },
    player: { role: 'Computer Enthusiast', roleUk: 'Комп\'ютерний ентузіаст', skillLevel: 1, salary: '$200/міс', icon: '👦' },
    pc: { name: 'IBM PC 286', cpu: '286 @ 12 MHz', ram: '1 MB', storage: '40 MB HDD', connection: '2400 baud modem', icon: '🖥️' },
  },
  // ═══ CHAPTER 2 ═══
  {
    id: 'win95',
    number: 2,
    title: 'Going Online',
    titleUk: 'Вихід у мережу',
    yearRange: '1995 – 1997',
    storyIntro:
      'Three years passed. Viktor\'s garage became a real office — a small room above a pharmacy. Eight people now, a secretary, two salespeople, and three more PCs. Revenue tripled. Viktor bought everyone Windows 95 and a 56k modem.\n\n"We need a website," Viktor said at Monday\'s meeting. "Everyone has a website now."\n\nYou set up Internet Explorer, configured the modem, and connected to the World Wide Web for the first time. The sound of the dial-up modem became the soundtrack of your nights. You were a Junior System Administrator now — with a real title and a slightly less terrible salary.\n\nBut the internet brought more than just Netscape Navigator. It brought people who wanted in.',
    storyIntroUk:
      'Три роки минуло. Гараж Віктора перетворився на справжній офіс — кімнату над аптекою. Вісім людей, секретарка, два менеджери з продажу і ще три комп\'ютери. Дохід потроївся. Віктор купив усім Windows 95 і модем на 56k.\n\n"Нам треба сайт," — сказав Віктор на планьорці. — "Зараз у всіх є сайт."\n\nТи налаштував Internet Explorer, підключив модем і вперше зайшов у World Wide Web. Звук dial-up модему став саундтреком твоїх ночей. Тепер ти Молодший Системний Адміністратор — з реальною посадою і трохи менш жахливою зарплатою.\n\nАле інтернет приніс не тільки Netscape Navigator. Він приніс тих, хто хотів пробратися всередину.',
    company: { name: 'ViktorTrade Inc.', employees: 8, revenue: '$85K/рік', dataRecords: '1,200 файлів', servers: 1, office: 'Small office', officeUk: 'Невеликий офіс', icon: '🏢' },
    player: { role: 'Junior Sysadmin', roleUk: 'Молодший сисадмін', skillLevel: 2, salary: '$450/міс', icon: '🧑‍💻' },
    pc: { name: 'Pentium 75', cpu: 'Pentium @ 75 MHz', ram: '16 MB', storage: '850 MB HDD', connection: '56k modem', icon: '💻' },
  },
  // ═══ CHAPTER 3 ═══
  {
    id: 'win98',
    number: 3,
    title: 'The Dot-Com Boom',
    titleUk: 'Бум доткомів',
    yearRange: '1998 – 2000',
    storyIntro:
      'The dot-com boom changed everything. ViktorTrade became ViktorTrade Corp — 25 employees, two floors in a business center, and a real server room (well, a closet with an AC unit). Viktor hired a sales team. Revenue exploded.\n\nThe company launched a web store. Credit card numbers started flowing through your network. Customer databases grew. Private data.\n\nYou were the System Administrator now. The only one standing between thousands of customer records and the hackers who wanted them. Viktor gave you a budget for a real server and a DSL line.\n\n"Protect the data," Viktor said. "If we lose the clients\' credit cards, we\'re done."\n\nThe dot-com bubble was inflating. Money was everywhere. And so were the people who wanted to steal it.',
    storyIntroUk:
      'Доткомівський бум змінив все. ViktorTrade стала ViktorTrade Corp — 25 працівників, два поверхи в бізнес-центрі і справжня серверна (ну, шафа з кондиціонером). Віктор найняв відділ продажів. Дохід вибухнув.\n\nКомпанія запустила інтернет-магазин. Номери кредитних карток потекли через твою мережу. Бази клієнтів зростали. Приватні дані.\n\nТепер ти — Системний Адміністратор. Єдиний, хто стоїть між тисячами записів клієнтів і хакерами, які хочуть їх заволодіти. Віктор дав тобі бюджет на справжній сервер та DSL-лінію.\n\n"Захисти дані," — сказав Віктор. — "Якщо ми втратимо кредитки клієнтів — нам кінець."\n\nДоткомівська бульбашка надувалася. Гроші були скрізь. І ті, хто хотів їх вкрасти — теж.',
    company: { name: 'ViktorTrade Corp', employees: 25, revenue: '$420K/рік', dataRecords: '12,000 клієнтів', servers: 3, office: 'Business center', officeUk: 'Бізнес-центр', icon: '🏬' },
    player: { role: 'System Administrator', roleUk: 'Системний адміністратор', skillLevel: 3, salary: '$900/міс', icon: '🔧' },
    pc: { name: 'Pentium II', cpu: 'Pentium II @ 300 MHz', ram: '64 MB', storage: '8 GB HDD', connection: 'DSL 256 kbps', icon: '🖥️' },
  },
  // ═══ CHAPTER 4 ═══
  {
    id: 'winME',
    number: 4,
    title: 'Dark Times',
    titleUk: 'Темні часи',
    yearRange: '2000 – 2001',
    storyIntro:
      'The bubble burst. Stocks crashed. Clients cancelled contracts. Viktor had to fire five people in one week.\n\n"Cut costs everywhere," the accountant said. IT budget slashed by 40%. Someone brilliant in management decided to upgrade to Windows ME to "save on licenses." You tried to explain that ME is the worst operating system ever made. Nobody listened.\n\nNow you\'re running the most unstable OS in history while defending against attackers who know you\'re weak. Your best developer was laid off. The coffee machine is broken. The AC in the server closet died.\n\nAnd someone inside the company is leaking passwords.\n\nThese are the dark times. Survive them, and you\'ll emerge stronger. Fail, and ViktorTrade Corp dies.',
    storyIntroUk:
      'Бульбашка лопнула. Акції впали. Клієнти розірвали контракти. Віктор звільнив п\'ятьох за тиждень.\n\n"Ріжте витрати скрізь," — сказав бухгалтер. ІТ-бюджет зрізали на 40%. Хтось геніальний у менеджменті вирішив оновитися до Windows ME, щоб "зекономити на ліцензіях." Ти намагався пояснити, що ME — найгірша ОС в історії. Ніхто не слухав.\n\nТепер ти працюєш на найнестабільнішій ОС в історії, захищаючись від атакуючих, які знають, що ти слабкий. Твого найкращого розробника скоротили. Кавоварка зламалася. Кондиціонер у серверній помер.\n\nІ хтось усередині компанії зливає паролі.\n\nЦе — темні часи. Переживи їх — і ти станеш сильнішим. Провалишся — і ViktorTrade Corp помре.',
    company: { name: 'ViktorTrade Corp', employees: 20, revenue: '$180K/рік', dataRecords: '8,000 клієнтів', servers: 2, office: 'Half-empty office', officeUk: 'Напівпорожній офіс', icon: '🏚️' },
    player: { role: 'Senior Sysadmin', roleUk: 'Старший сисадмін', skillLevel: 4, salary: '$700/міс', icon: '🛡️' },
    pc: { name: 'Pentium III', cpu: 'Pentium III @ 500 MHz', ram: '128 MB', storage: '20 GB HDD', connection: 'DSL 512 kbps', icon: '💻' },
  },
  // ═══ CHAPTER 5 ═══
  {
    id: 'winXP',
    number: 5,
    title: 'Renaissance',
    titleUk: 'Відродження',
    yearRange: '2002 – 2006',
    storyIntro:
      'The company survived. Barely. Viktor refinanced, found new investors, and rebranded: DataPlex Systems.\n\nNew name. New office — a proper floor in a modern building. 50 employees. A real server room with cooling. A logo on the door. You\'re the IT Manager now, with two junior admins under you.\n\nWindows XP SP2 brought the Security Center. For the first time, the OS cares about security. Broadband replaced dial-up. The network is fast and professional.\n\nBut out there, the hackers evolved too. The Blaster worm is tearing through the internet. Corporate espionage is now a multi-billion dollar industry. APT groups target companies like DataPlex.\n\nYou have better tools. But the enemies have better weapons.',
    storyIntroUk:
      'Компанія вижила. Ледь-ледь. Віктор рефінансував, знайшов нових інвесторів і перейменував: DataPlex Systems.\n\nНова назва. Новий офіс — цілий поверх у сучасній будівлі. 50 працівників. Справжня серверна з охолодженням. Логотип на дверях. Тепер ти — ІТ-менеджер, у тебе двоє молодших адмінів.\n\nWindows XP SP2 принесла Security Center. Вперше ОС піклується про безпеку. Широкосмуговий інтернет замінив dial-up. Мережа швидка і професійна.\n\nАле там, назовні, хакери теж еволюціонували. Черв\'як Blaster рве інтернет на шматки. Корпоративне шпигунство — це тепер мільярдна індустрія. APT-групи атакують компанії на кшталт DataPlex.\n\nУ тебе кращі інструменти. Але у ворогів — кращі зброї.',
    company: { name: 'DataPlex Systems', employees: 50, revenue: '$1.2M/рік', dataRecords: '85,000 клієнтів', servers: 6, office: 'Modern office', officeUk: 'Сучасний офіс', icon: '🏢' },
    player: { role: 'IT Manager', roleUk: 'ІТ-менеджер', skillLevel: 5, salary: '$2,500/міс', icon: '👔' },
    pc: { name: 'Pentium 4 HT', cpu: 'Pentium 4 HT @ 3 GHz', ram: '512 MB', storage: '80 GB HDD', connection: 'Broadband 2 Mbps', icon: '🖥️' },
  },
  // ═══ CHAPTER 6 ═══
  {
    id: 'vista',
    number: 6,
    title: 'Enterprise',
    titleUk: 'Підприємство',
    yearRange: '2007 – 2009',
    storyIntro:
      'DataPlex grew into DataPlex Enterprise. 200 employees across three offices. Major contracts with government and banking sectors. Millions of dollars flow through your systems daily.\n\nThe board hired you as Head of IT Security. You have a team of eight. A SOC (Security Operations Center). A dedicated fiber connection. A Core 2 Duo workstation with 4 GB of RAM — you\'ve never had this much power.\n\nBut then management ordered a company-wide Vista deployment. "Microsoft says it\'s the future." You begged them to wait. They didn\'t.\n\nDrivers crash. UAC popups drive everyone insane. Compatibility issues everywhere. And a SOX compliance audit is next month — pass it or the IPO dies.\n\nYour career. Your company. Your team. Everything rides on the next few months.',
    storyIntroUk:
      'DataPlex виросла в DataPlex Enterprise. 200 працівників у трьох офісах. Великі контракти з урядом і банками. Мільйони доларів проходять через твої системи щодня.\n\nПравління найняло тебе як Керівника ІТ-безпеки. У тебе команда з восьми. SOC (Центр операцій безпеки). Виділена оптоволоконна лінія. Робоча станція Core 2 Duo з 4 ГБ ОЗП — стільки потужності у тебе ще не було.\n\nАле потім менеджмент наказав впровадити Vista по всій компанії. "Microsoft каже, це — майбутнє." Ти благав почекати. Не послухали.\n\nДрайвери падають. UAC-попапи зводять усіх з розуму. Проблеми сумісності скрізь. А аудит SOX — через місяць. Пройди його, або IPO помре.\n\nТвоя кар\'єра. Твоя компанія. Твоя команда. Все залежить від найближчих місяців.',
    company: { name: 'DataPlex Enterprise', employees: 200, revenue: '$8M/рік', dataRecords: '1.2M записів', servers: 14, office: '3 offices', officeUk: '3 офіси', icon: '🏙️' },
    player: { role: 'Head of IT Security', roleUk: 'Керівник ІТ-безпеки', skillLevel: 6, salary: '$5,500/міс', icon: '🎖️' },
    pc: { name: 'Core 2 Duo', cpu: 'Core 2 Duo @ 2.4 GHz', ram: '4 GB DDR2', storage: '500 GB HDD', connection: 'Fiber 100 Mbps', icon: '💻' },
  },
  // ═══ CHAPTER 7 ═══
  {
    id: 'win7',
    number: 7,
    title: 'The Final Stand',
    titleUk: 'Остання битва',
    yearRange: '2009 – 2012',
    storyIntro:
      'DataPlex Global. That\'s the name now. 500+ employees. International offices. Government contracts. Critical infrastructure. Ten million client records.\n\nYou\'re the Chief Information Security Officer. A C-level executive. You report directly to the CEO — Viktor, who still remembers the garage. Your team is 15 people strong. Your budget is $2 million a year. Windows 7 finally gave you a stable, secure platform.\n\nBut the threats... the threats are no longer kids from BBS boards. State-sponsored APT groups. Industrial espionage at a national level. Ransomware gangs who encrypt hospitals. Zero-day brokers who sell exploits to the highest bidder.\n\nEverything you\'ve built over 20 years. Every skill you\'ve learned. Every scar from every breach. It all comes down to this.\n\nThey\'re coming. And this time, they brought everything.',
    storyIntroUk:
      'DataPlex Global. Так тепер називається. 500+ працівників. Міжнародні офіси. Урядові контракти. Критична інфраструктура. Десять мільйонів записів клієнтів.\n\nТи — Chief Information Security Officer. Топ-менеджер. Підпорядковуєшся безпосередньо CEO — Віктору, який все ще пам\'ятає гараж. Твоя команда — 15 людей. Бюджет — $2 мільйони на рік. Windows 7 нарешті дала стабільну, безпечну платформу.\n\nАле загрози... загрози — це вже не діти з BBS-форумів. Державні APT-групи. Промислове шпигунство на національному рівні. Рансомварь-банди, що шифрують лікарні. Брокери zero-day, що продають експлойти тому, хто більше заплатить.\n\nВсе, що ти будував 20 років. Кожен навик, якому навчився. Кожен шрам від кожного зламу. Все зводиться до цього.\n\nВони йдуть. І цього разу вони принесли все.',
    company: { name: 'DataPlex Global', employees: 500, revenue: '$35M/рік', dataRecords: '10M записів', servers: 30, office: 'HQ Tower', officeUk: 'Головний офіс', icon: '🌍' },
    player: { role: 'CISO', roleUk: 'CISO', skillLevel: 7, salary: '$12,000/міс', icon: '👑' },
    pc: { name: 'Core i7', cpu: 'Core i7 @ 3.4 GHz', ram: '16 GB DDR3', storage: '1 TB SSD', connection: 'Redundant fiber 1 Gbps', icon: '🖥️' },
  },
];

// ============================================================================
// MISSIONS — 21 missions, 3 per chapter
// ============================================================================

export const CAMPAIGN_MISSIONS: CampaignMission[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 1 — GENESIS (Windows 3.1, 1992-1993)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'ch1_first_day',
    era: 'win31', chapter: 1,
    eraYear: 1992, eraName: 'Windows 3.1',
    title: 'First Day on the Job',
    titleUk: 'Перший робочий день',
    briefing: 'Your first day at ViktorTrade. Three ancient 286 PCs connected by coaxial cable. No firewall, no antivirus, not even proper passwords. Viktor left for a meeting and said "Just keep them running."\n\nThen the modem started blinking on its own. Someone is dialing in. You don\'t have many tools — just the command line. But you have instinct.\n\nScan the network. Patch what you can. Welcome to cybersecurity.',
    briefingUk: 'Перший день у ViktorTrade. Три давні 286-х комп\'ютери, з\'єднані коаксіалом. Без файрвола, без антивірусу, навіть без нормальних паролів. Віктор поїхав на зустріч і сказав: "Просто зроби, щоб працювало."\n\nА потім модем почав мигати сам по собі. Хтось набирає номер. У тебе мало інструментів — тільки командний рядок. Але є інтуїція.\n\nПроскануй мережу. Залатай, що можеш. Ласкаво просимо в кібербезпеку.',
    completionText: 'You stopped the intrusion. Viktor came back and didn\'t even notice anything happened. But YOU know. And you want more.',
    completionTextUk: 'Ти зупинив вторгнення. Віктор повернувся і навіть не помітив. Але ТИ знаєш. І хочеш більше.',
    waves: 3, waveDurationBase: 45, breachMultiplier: 0.5, aiSpeedMultiplier: 0.4,
    startingSP: 15, nodeCount: 3,
    modifiers: ['no_firewall', 'limited_cmds'],
    reward: { sp: 25, title: 'First Responder', titleUk: 'Перший відгук' },
    unlockCondition: null,
    wallpaperHue: 0, accentColor: '#808080',
  },
  {
    id: 'ch1_bbs_raider',
    era: 'win31', chapter: 1,
    eraYear: 1992, eraName: 'Windows 3.1',
    title: 'The BBS Raider',
    titleUk: 'Рейдер з BBS',
    briefing: 'Word got out on the local BBS boards: "ViktorTrade has an unprotected modem." A teenager who calls himself "DarkLord_92" is systematically probing your defenses. He\'s not dangerous — yet. But he\'s persistent.\n\nViktor bought a 4th PC for the new sales guy. More machines, more exposure. You\'re starting to receive suspicious emails too.\n\nThis time, you know what to expect.',
    briefingUk: 'На місцевих BBS-форумах пішла чутка: "У ViktorTrade незахищений модем." Підліток на ім\'я "DarkLord_92" систематично зондує твій захист. Він не небезпечний — поки що. Але наполегливий.\n\nВіктор купив 4-й комп для нового менеджера з продажу. Більше машин — більше загроз. Ти починаєш отримувати підозрілі листи теж.\n\nЦього разу ти знаєш, чого очікувати.',
    completionText: '"DarkLord_92" gave up and moved to an easier target. Viktor is impressed. "Maybe you should be in charge of the computers full-time," he says. Your first real job offer.',
    completionTextUk: '"DarkLord_92" здався і переключився на легшу ціль. Віктор вражений. "Може, ти повинен повністю займатися комп\'ютерами," — каже він. Перша справжня пропозиція роботи.',
    waves: 3, waveDurationBase: 48, breachMultiplier: 0.6, aiSpeedMultiplier: 0.5,
    startingSP: 10, nodeCount: 4,
    modifiers: ['no_firewall', 'double_phishing'],
    reward: { sp: 30, title: 'BBS Veteran', titleUk: 'Ветеран BBS' },
    unlockCondition: 'ch1_first_day',
    wallpaperHue: 0, accentColor: '#808080',
  },
  {
    id: 'ch1_warez_wars',
    era: 'win31', chapter: 1,
    eraYear: 1993, eraName: 'Windows 3.1',
    title: 'Warez Wars',
    titleUk: 'Війна Warez',
    briefing: 'A warez group called "PhantomBytes" discovered your file server has free disk space. They\'re using it as a distribution node for pirated software. Malware-laden files are flooding in.\n\nViktor is furious — the file server is full of garbage. "What is all this?! Delete it! And make sure it doesn\'t happen again!"\n\nYou need to clean the system and hold off the group for four waves. No firewall. Just you against a crew of angry pirates.',
    briefingUk: 'Warez-група "PhantomBytes" виявила, що на вашому файл-сервері є вільне місце. Вони використовують його як вузол розповсюдження піратського ПЗ. Файли з малварою заливають систему.\n\nВіктор у люті — файл-сервер забитий сміттям. "Що це все?! Видали! І зроби, щоб більше не повторилось!"\n\nТобі потрібно очистити систему і витримати натиск групи протягом чотирьох хвиль. Без файрвола. Тільки ти проти команди злих піратів.',
    completionText: 'PhantomBytes moved on. Viktor promoted you to full-time IT. $200/month — not great, but it\'s a start. You\'re officially the company\'s first IT employee.',
    completionTextUk: 'PhantomBytes переключились на іншу ціль. Віктор взяв тебе на повну ставку. $200/місяць — не багато, але це початок. Ти — офіційно перший ІТ-працівник компанії.',
    waves: 4, waveDurationBase: 50, breachMultiplier: 0.7, aiSpeedMultiplier: 0.5,
    startingSP: 5, nodeCount: 4,
    modifiers: ['no_firewall', 'double_phishing'],
    reward: { sp: 40, title: 'Anti-Pirate', titleUk: 'Анти-Пірат' },
    unlockCondition: 'ch1_bbs_raider',
    wallpaperHue: 0, accentColor: '#808080',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 2 — GOING ONLINE (Windows 95, 1995-1997)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'ch2_www',
    era: 'win95', chapter: 2,
    eraYear: 1995, eraName: 'Windows 95',
    title: 'World Wide Web',
    titleUk: 'Світова павутина',
    briefing: 'The company upgraded to Windows 95. You just installed Internet Explorer 2.0 and connected the 56k modem. The World Wide Web — in all its glory — is now accessible from every workstation.\n\nBut within hours, the port scanner logs lit up like a Christmas tree. Script kiddies from all over the world are testing your defenses. The internet doesn\'t care that you\'re a small company — you\'re a target now.\n\nViktor wants a website. You need to survive the internet first.',
    briefingUk: 'Компанія оновилась до Windows 95. Ти щойно встановив Internet Explorer 2.0 і підключив модем 56k. World Wide Web — у всій красі — тепер доступна з кожної робочої станції.\n\nАле за кілька годин логи сканера портів засвітилися як ялинка. Скріпт-кіді з усього світу тестують твій захист. Інтернету байдуже, що ви маленька компанія — тепер ви ціль.\n\nВіктор хоче сайт. Тобі потрібно спочатку пережити інтернет.',
    completionText: 'The website is live. ViktorTrade.com. It\'s ugly, but it works. And you kept the hackers out. Viktor gives you a raise and a new title: Junior System Administrator.',
    completionTextUk: 'Сайт запущено. ViktorTrade.com. Він потворний, але працює. І ти не пустив хакерів. Віктор підвищує зарплату і дає нову посаду: Молодший Системний Адміністратор.',
    waves: 4, waveDurationBase: 50, breachMultiplier: 0.7, aiSpeedMultiplier: 0.6,
    startingSP: 15, nodeCount: 4,
    modifiers: ['stealth_ai'],
    reward: { sp: 40, title: 'Webmaster', titleUk: 'Вебмастер' },
    unlockCondition: 'ch1_warez_wars',
    wallpaperHue: 180, accentColor: '#008080',
  },
  {
    id: 'ch2_love_bug',
    era: 'win95', chapter: 2,
    eraYear: 1996, eraName: 'Windows 95',
    title: 'The Love Bug',
    titleUk: 'Вірус кохання',
    briefing: 'Monday morning. The secretary opens an email: "I LOVE YOU — check this out!" She clicks the attachment. Then the sales manager does the same. Then the accountant.\n\nWithin an hour, half the office has clicked a phishing link disguised as a love letter. Malware is everywhere. Your inbox is flooded with emails that all look legitimate — some from people inside the company. Can you tell the real from the fake?\n\nThis is social engineering. And your users are the weakest link.',
    briefingUk: 'Понеділок вранці. Секретарка відкриває лист: "I LOVE YOU — глянь це!" Клікає на вкладення. Потім менеджер з продажу. Потім бухгалтер.\n\nЗа годину половина офісу клікнула на фішинговий лінк, замаскований під любовного листа. Малварь скрізь. Твоя пошта завалена листами, що виглядають легітимно — деякі від людей всередині компанії. Зможеш відрізнити справжнє від фейку?\n\nЦе — соціальна інженерія. І твої користувачі — найслабша ланка.',
    completionText: 'You cleaned up the mess and wrote the company\'s first email security policy. Nobody reads it, but at least it exists.',
    completionTextUk: 'Ти прибрав бардак і написав першу політику безпеки електронної пошти. Ніхто її не читає, але хоча б вона існує.',
    waves: 4, waveDurationBase: 55, breachMultiplier: 0.8, aiSpeedMultiplier: 0.65,
    startingSP: 10, nodeCount: 5,
    modifiers: ['double_phishing', 'social_engineering', 'insider_threat'],
    reward: { sp: 50, title: 'Phishing Expert', titleUk: 'Експерт з фішингу' },
    unlockCondition: 'ch2_www',
    wallpaperHue: 180, accentColor: '#008080',
  },
  {
    id: 'ch2_spy',
    era: 'win95', chapter: 2,
    eraYear: 1997, eraName: 'Windows 95',
    title: 'The Industrial Spy',
    titleUk: 'Промисловий шпигун',
    briefing: 'A competitor — GlobalTrade LLC — hired hackers to steal your client database. The attack is sophisticated: stealth processes that look like system files, careful probing, and a hacker who hides after each strike.\n\nViktor is panicking. "They\'re stealing our clients! If they get the full list, we\'re finished!"\n\nThis is your chance to prove you\'re more than just "the computer guy." Stop them, and Viktor will make it worth your while.',
    briefingUk: 'Конкурент — GlobalTrade LLC — найняв хакерів вкрасти вашу базу клієнтів. Атака витончена: скриті процеси, що виглядають як системні файли, обережне зондування, і хакер, що ховається після кожного удару.\n\nВіктор панікує. "Вони крадуть наших клієнтів! Якщо вони отримають повний список — нам кінець!"\n\nЦе твій шанс довести, що ти — більше, ніж просто "комп\'ютерник." Зупини їх, і Віктор це оцінить.',
    completionText: 'You traced the attack back to GlobalTrade\'s IP range. Viktor\'s lawyer sent a cease-and-desist letter. You got promoted and a raise. The company is growing fast.',
    completionTextUk: 'Ти відстежив атаку до IP-діапазону GlobalTrade. Юрист Віктора відправив лист із вимогою припинити. Тебе підвищили і дали збільшення зарплати. Компанія росте швидко.',
    waves: 5, waveDurationBase: 55, breachMultiplier: 0.85, aiSpeedMultiplier: 0.7,
    startingSP: 10, nodeCount: 5,
    modifiers: ['stealth_ai', 'corrupted_ram'],
    reward: { sp: 55, title: 'Corporate Shield', titleUk: 'Корпоративний щит' },
    unlockCondition: 'ch2_love_bug',
    wallpaperHue: 180, accentColor: '#008080',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 3 — DOT-COM BOOM (Windows 98, 1998-2000)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'ch3_y2k',
    era: 'win98', chapter: 3,
    eraYear: 1999, eraName: 'Windows 98',
    title: 'Y2K Panic',
    titleUk: 'Паніка Y2K',
    briefing: 'December 31, 1999. 11 PM. The entire office is here, watching the clock. Will the computers crash at midnight? Will dates reset to 1900? Will civilization end?\n\nNo. But while everyone stares at the clock, real hackers are exploiting the chaos. They know every sysadmin is distracted tonight. Your DSL line is hot with scanning traffic. The web store is under attack. Credit card data is at risk.\n\nHappy New Year. Time to work.',
    briefingUk: 'Грудень 31, 1999. 23:00. Весь офіс тут, дивляться на годинник. Чи впадуть комп\'ютери опівночі? Чи скинуться дати на 1900? Чи настане кінець світу?\n\nНі. Але поки всі витріщаються на годинник, справжні хакери використовують хаос. Вони знають, що кожен сисадмін відволікся цієї ночі. DSL-лінія палає від сканувального трафіку. Інтернет-магазин під атакою. Дані кредиток під загрозою.\n\nЗ Новим Роком. Час працювати.',
    completionText: 'Midnight passed. Nothing crashed. But you stopped three intrusion attempts while everyone celebrated. Viktor found you asleep at your desk at 3 AM. "Double bonus this month," he said.',
    completionTextUk: 'Опівніч минула. Нічого не впало. Але ти зупинив три спроби вторгнення, поки всі святкували. Віктор знайшов тебе заснулим за столом о 3 ночі. "Подвійний бонус цього місяця," — сказав він.',
    waves: 5, waveDurationBase: 55, breachMultiplier: 0.9, aiSpeedMultiplier: 0.8,
    startingSP: 15, nodeCount: 5,
    modifiers: ['fast_breach', 'fragile_nodes'],
    reward: { sp: 55, title: 'Y2K Survivor', titleUk: 'Вцілілий Y2K' },
    unlockCondition: 'ch2_spy',
    wallpaperHue: 30, accentColor: '#0055AA',
  },
  {
    id: 'ch3_napster',
    era: 'win98', chapter: 3,
    eraYear: 2000, eraName: 'Windows 98 SE',
    title: 'Napster Nightmare',
    titleUk: 'Кошмар Napster',
    briefing: 'Someone in sales installed Napster. Within a week, every hard drive is full of "MP3 files" — except half of them are trojans disguised as Metallica tracks.\n\nThe RAM is acting weird — processes that look system-legitimate are actually malware. The Recycle Bin is overflowing with suspicious files. CPU temperature spiking.\n\n"Why are the computers so slow?" asks everyone. They know why. They just won\'t admit it.',
    briefingUk: 'Хтось із відділу продажів встановив Napster. За тиждень кожен жорсткий диск забитий "MP3-файлами" — тільки половина з них трояни, замасковані під треки Metallica.\n\nОЗП поводиться дивно — процеси, що виглядають системними, насправді малварь. Кошик переповнений підозрілими файлами. Температура ЦП зашкалює.\n\n"Чому комп\'ютери такі повільні?" — питають всі. Вони знають чому. Просто не хочуть визнавати.',
    completionText: 'You banned P2P software, cleaned 200 trojans, and wrote a "No unauthorized software" policy. The sales team hates you. The servers love you.',
    completionTextUk: 'Ти заборонив P2P-софт, очистив 200 троянів і написав політику "Ніякого несанкціонованого ПЗ." Відділ продажів тебе ненавидить. Сервери — обожнюють.',
    waves: 5, waveDurationBase: 60, breachMultiplier: 0.9, aiSpeedMultiplier: 0.8,
    startingSP: 10, nodeCount: 6,
    modifiers: ['corrupted_ram', 'double_phishing'],
    reward: { sp: 60, title: 'P2P Slayer', titleUk: 'Мисливець на P2P' },
    unlockCondition: 'ch3_y2k',
    wallpaperHue: 30, accentColor: '#0055AA',
  },
  {
    id: 'ch3_data_heist',
    era: 'win98', chapter: 3,
    eraYear: 2000, eraName: 'Windows 98 SE',
    title: 'The Data Heist',
    titleUk: 'Крадіжка даних',
    briefing: 'This is not a script kiddie. This is organized crime. Someone is systematically exfiltrating customer records from your database server. They compromised one node and used it to spread to neighbors.\n\nYou\'re now protecting 12,000 customer records — names, addresses, credit card numbers. If this data leaks, the company faces lawsuits and bankruptcy.\n\nThe board is watching. Viktor is sweating. This is the moment that defines your career.',
    briefingUk: 'Це не скріпт-кіді. Це організована злочинність. Хтось систематично викрадає записи клієнтів із сервера бази даних. Вони скомпрометували один вузол і використовують його для зараження сусідніх.\n\nТи зараз захищаєш 12,000 записів клієнтів — імена, адреси, номери кредиток. Якщо ці дані витечуть — компанії загрожують судові позови і банкрутство.\n\nПравління спостерігає. Віктор нервує. Це — момент, що визначить твою кар\'єру.',
    completionText: 'Zero records stolen. You identified and blocked the attack vector. Viktor shook your hand in front of the entire team. "From now on, security is priority one." You finally get assistants.',
    completionTextUk: 'Нуль вкрадених записів. Ти ідентифікував і заблокував вектор атаки. Віктор потиснув тобі руку перед усією командою. "Відтепер безпека — пріоритет номер один." Тобі нарешті дають помічників.',
    waves: 6, waveDurationBase: 60, breachMultiplier: 1.0, aiSpeedMultiplier: 0.85,
    startingSP: 10, nodeCount: 6,
    modifiers: ['lateral_movement', 'stealth_ai'],
    reward: { sp: 70, title: 'Data Guardian', titleUk: 'Охоронець даних' },
    unlockCondition: 'ch3_napster',
    wallpaperHue: 30, accentColor: '#0055AA',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 4 — DARK TIMES (Windows ME, 2000-2001)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'ch4_crash',
    era: 'winME', chapter: 4,
    eraYear: 2001, eraName: 'Windows ME',
    title: 'The Crash',
    titleUk: 'Крах',
    briefing: 'Dot-com bubble burst. Revenue dropped 60%. Five people were laid off, including your only assistant. Management "saved money" by upgrading to Windows ME — the most unstable OS in history.\n\nBSOD every hour. Error popups from the OS itself. The system crashes randomly. And somewhere out there, hackers know you\'re running the digital equivalent of a building with no doors.\n\nYour budget: zero. Your tools: basic. Your OS: actively working against you.\n\nSurvive.',
    briefingUk: 'Бульбашка доткомів лопнула. Дохід впав на 60%. П\'ятьох звільнили, включаючи твого єдиного помічника. Менеджмент "зекономив" оновившись до Windows ME — найнестабільнішої ОС в історії.\n\nBSOD щогодини. Попапи помилок від самої ОС. Система падає випадково. І десь там хакери знають, що ти працюєш на цифровому еквіваленті будинку без дверей.\n\nТвій бюджет: нуль. Твої інструменти: базові. Твоя ОС: активно працює проти тебе.\n\nВиживи.',
    completionText: 'You kept the lights on. Barely. Viktor looks ten years older. But the company still exists. That counts for something.',
    completionTextUk: 'Ти тримав все на плаву. Ледь-ледь. Віктор виглядає на десять років старшим. Але компанія все ще існує. Це вже щось.',
    waves: 5, waveDurationBase: 55, breachMultiplier: 1.1, aiSpeedMultiplier: 0.9,
    startingSP: 5, nodeCount: 5,
    modifiers: ['fast_breach', 'fragile_nodes', 'no_firewall'],
    reward: { sp: 60, title: 'ME Survivor', titleUk: 'Вцілілий ME' },
    unlockCondition: 'ch3_data_heist',
    wallpaperHue: -30, accentColor: '#6A0DAD',
  },
  {
    id: 'ch4_mole',
    era: 'winME', chapter: 4,
    eraYear: 2001, eraName: 'Windows ME',
    title: 'The Mole',
    titleUk: 'Кріт',
    briefing: 'Passwords are leaking. Someone inside the company is selling credentials to your competitors. Phishing emails come from internal addresses. System emails that look real are actually traps.\n\nThe board suspects you. "Maybe IT is the leak," someone whispered. You need to prove your innocence by catching the real mole.\n\nNo shop between waves — you work with what you have. Trust nobody. Not even the emails from "IT Department."',
    briefingUk: 'Паролі витікають. Хтось усередині компанії продає облікові дані конкурентам. Фішингові листи приходять з внутрішніх адрес. Системні листи, що виглядають справжніми — насправді пастки.\n\nПравління підозрює тебе. "Може, ІТ і є пролом," — прошепотів хтось. Тобі потрібно довести свою невинність, зловивши справжнього крота.\n\nМіж хвилями немає магазину — працюєш з тим, що є. Не довіряй нікому. Навіть листам від "ІТ-відділу."',
    completionText: 'You caught the mole — the former developer who was laid off. He had kept his VPN access. Viktor was horrified and apologized for doubting you. "You saved us. Again."',
    completionTextUk: 'Ти зловив крота — колишнього розробника, якого скоротили. Він зберіг свій VPN-доступ. Віктор був у жаху і вибачився за сумніви. "Ти нас врятував. Знову."',
    waves: 6, waveDurationBase: 55, breachMultiplier: 1.1, aiSpeedMultiplier: 0.9,
    startingSP: 5, nodeCount: 5,
    modifiers: ['insider_threat', 'social_engineering', 'no_shop'],
    reward: { sp: 65, title: 'Mole Hunter', titleUk: 'Мисливець на кротів' },
    unlockCondition: 'ch4_crash',
    wallpaperHue: -30, accentColor: '#6A0DAD',
  },
  {
    id: 'ch4_scorched',
    era: 'winME', chapter: 4,
    eraYear: 2001, eraName: 'Windows ME',
    title: 'Scorched Earth',
    titleUk: 'Випалена земля',
    briefing: 'A ransomware attack. Your first one. Files are being encrypted on the database server. Client records, financial reports, source code — everything at risk.\n\nThe ransom demand: $10,000 in untraceable wire transfer. The company doesn\'t have $10,000. Your backups are on a node that\'s also under attack.\n\nThis night decides if ViktorTrade Corp lives or dies. Save the data.',
    briefingUk: 'Рансомварь-атака. Твоя перша. Файли шифруються на сервері бази даних. Записи клієнтів, фінансові звіти, вихідний код — все під загрозою.\n\nВимога викупу: $10,000 непростежуваним переказом. У компанії немає $10,000. Твої бекапи — на вузлі, який теж під атакою.\n\nЦієї ночі вирішується — жити ViktorTrade Corp чи помирати. Врятуй дані.',
    completionText: 'You saved 94% of the data. The 6% lost was mostly old marketing material. Viktor cries tears of relief. The board approves an emergency IT budget. "We\'re rebuilding. And you\'re leading IT."',
    completionTextUk: 'Ти врятував 94% даних. Втрачені 6% — переважно старі маркетингові матеріали. Віктор плаче від полегшення. Правління затверджує екстрений ІТ-бюджет. "Ми відбудовуємось. І ти очолюєш ІТ."',
    waves: 6, waveDurationBase: 55, breachMultiplier: 1.2, aiSpeedMultiplier: 0.95,
    startingSP: 10, nodeCount: 6,
    modifiers: ['ransomware', 'fragile_nodes', 'fast_breach'],
    reward: { sp: 75, title: 'Phoenix', titleUk: 'Фенікс' },
    unlockCondition: 'ch4_mole',
    wallpaperHue: -30, accentColor: '#6A0DAD',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 5 — RENAISSANCE (Windows XP, 2002-2006)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'ch5_new_beginning',
    era: 'winXP', chapter: 5,
    eraYear: 2002, eraName: 'Windows XP',
    title: 'New Beginning',
    titleUk: 'Новий початок',
    briefing: 'DataPlex Systems. New name, new energy. The office smells like fresh paint. XP\'s Security Center finally gives you built-in tools. Broadband replaced the modem. You have a real server room.\n\nBut the Blaster worm is spreading across the internet like wildfire. It exploits an RPC vulnerability and jumps from node to node. Your 6 servers need protecting — if one falls, it can infect the neighbors.\n\nNew beginning. Same old fight.',
    briefingUk: 'DataPlex Systems. Нова назва, нова енергія. В офісі пахне свіжою фарбою. Security Center XP нарешті дає вбудовані інструменти. Широкосмуговий інтернет замінив модем. У тебе справжня серверна.\n\nАле черв\'як Blaster поширюється інтернетом як лісова пожежа. Він використовує вразливість RPC і перестрибує з вузла на вузол. Твої 6 серверів потребують захисту — якщо один впаде, він може заразити сусідів.\n\nНовий початок. Та ж стара боротьба.',
    completionText: 'Blaster stopped at your firewall. None of your servers were permanently compromised. Your two new junior admins look at you like you\'re a superhero. It feels good.',
    completionTextUk: 'Blaster зупинився на твоєму файрволі. Жоден сервер не був остаточно скомпрометований. Двоє нових молодших адмінів дивляться на тебе як на супергероя. Приємне відчуття.',
    waves: 6, waveDurationBase: 60, breachMultiplier: 1.0, aiSpeedMultiplier: 0.9,
    startingSP: 20, nodeCount: 6,
    modifiers: ['lateral_movement'],
    reward: { sp: 70, title: 'Worm Hunter', titleUk: 'Мисливець на черв\'яків' },
    unlockCondition: 'ch4_scorched',
    wallpaperHue: 0, accentColor: '#316ac5',
  },
  {
    id: 'ch5_clean_sweep',
    era: 'winXP', chapter: 5,
    eraYear: 2004, eraName: 'Windows XP SP2',
    title: 'Operation Clean Sweep',
    titleUk: 'Операція «Зачистка»',
    briefing: 'A new variant of malware — polymorphic. It changes its process name every few seconds, masking itself as legitimate software. One minute it\'s "svchost.exe", the next it\'s "explorer.exe."\n\nYour network has 7 servers now, and the infection is spreading laterally. The malware is smart — it hides when you scan, reappears when you look away.\n\nTime for Operation Clean Sweep. Find it. Kill it. Patch everything.',
    briefingUk: 'Новий варіант малварі — поліморфний. Він змінює назву процесу кожні кілька секунд, маскуючись під легітимне ПЗ. Хвилину тому це "svchost.exe", зараз — "explorer.exe."\n\nУ мережі вже 7 серверів, і інфекція поширюється латерально. Малварь розумна — вона ховається при скануванні, з\'являється коли відвернешся.\n\nЧас для Операції «Зачистка». Знайди. Вбий. Залатай все.',
    completionText: 'Clean sweep successful. 47 malware instances eliminated. Your team developed scan patterns that became company standard. DataPlex is becoming known for its security.',
    completionTextUk: 'Операція «Зачистка» успішна. 47 зразків малварі знищено. Твоя команда розробила шаблони сканування, що стали стандартом компанії. DataPlex стає відомою своєю безпекою.',
    waves: 7, waveDurationBase: 65, breachMultiplier: 1.1, aiSpeedMultiplier: 1.0,
    startingSP: 15, nodeCount: 7,
    modifiers: ['lateral_movement', 'polymorphic'],
    reward: { sp: 80, title: 'Clean Sweep', titleUk: 'Зачистка' },
    unlockCondition: 'ch5_new_beginning',
    wallpaperHue: 0, accentColor: '#316ac5',
  },
  {
    id: 'ch5_espionage',
    era: 'winXP', chapter: 5,
    eraYear: 2006, eraName: 'Windows XP SP2',
    title: 'Corporate Espionage 2.0',
    titleUk: 'Корпоративне шпигунство 2.0',
    briefing: 'A foreign APT group has targeted DataPlex. This isn\'t like the old days — these are professionals. They use zero-day exploits to bypass firewalls, DNS poisoning to confuse your monitoring, and insider recruitment to get credentials.\n\nThe stakes: 85,000 client records, trade secrets, and the company\'s reputation. Viktor offered to triple the security budget — if you survive this.\n\nWin this battle, and the board will create a dedicated Security Operations Center. Lose, and DataPlex joins the list of breached companies.',
    briefingUk: 'Іноземна APT-група взяла DataPlex на приціл. Це не як у старі часи — це професіонали. Вони використовують zero-day експлойти для обходу файрволів, DNS-отруєння щоб заплутати моніторинг, і вербують інсайдерів для отримання облікових даних.\n\nНа кону: 85,000 записів клієнтів, комерційні таємниці і репутація компанії. Віктор запропонував потроїти бюджет безпеки — якщо ти витримаєш.\n\nВиграй цю битву — і правління створить виділений Центр операцій безпеки. Програй — і DataPlex поповнить список зламаних компаній.',
    completionText: 'You stopped a state-level attack. The board is speechless. Viktor writes a $500K check for the new SOC. You hire a team. "Head of IT Security" — your new title. You\'ve earned it.',
    completionTextUk: 'Ти зупинив атаку державного рівня. Правління онімілo. Віктор виписує чек на $500K для нового SOC. Ти наймаєш команду. "Керівник ІТ-безпеки" — твоя нова посада. Ти її заслужив.',
    waves: 8, waveDurationBase: 65, breachMultiplier: 1.2, aiSpeedMultiplier: 1.05,
    startingSP: 15, nodeCount: 7,
    modifiers: ['stealth_ai', 'insider_threat', 'dns_poisoning', 'zero_day'],
    reward: { sp: 100, title: 'APT Breaker', titleUk: 'Руйнівник APT' },
    unlockCondition: 'ch5_clean_sweep',
    wallpaperHue: 0, accentColor: '#316ac5',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 6 — ENTERPRISE (Windows Vista, 2007-2009)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'ch6_vista_hell',
    era: 'vista', chapter: 6,
    eraYear: 2007, eraName: 'Windows Vista',
    title: 'Vista Migration Hell',
    titleUk: 'Пекло міграції на Vista',
    briefing: 'Management ordered a company-wide Vista deployment. You said it was a mistake. They said "Microsoft recommends it."\n\nNow nothing works. Drivers crash. UAC popups every 5 seconds. Half the software is incompatible. Your DNS entries are corrupted — IPs keep shuffling. Printers stopped working. The CFO\'s laptop has 47 "Are you sure?" dialogs open.\n\nMeanwhile, hackers see the chaos and pounce. Fix Vista AND stop the hackers. At the same time.',
    briefingUk: 'Менеджмент наказав впровадити Vista по всій компанії. Ти казав, що це помилка. Вони сказали: "Microsoft рекомендує."\n\nТепер нічого не працює. Драйвери падають. UAC-попапи кожні 5 секунд. Половина софту несумісна. DNS-записи пошкоджені — IP-адреси постійно змінюються. Принтери зупинились. На ноутбуці CFO відкрито 47 діалогів "Ви впевнені?"\n\nТим часом хакери бачать хаос і нападають. Полагодь Vista І зупини хакерів. Одночасно.',
    completionText: 'Vista is... stable-ish. You wrote a 30-page compatibility report. Management won\'t read it. But at least the hackers are gone.',
    completionTextUk: 'Vista... майже стабільна. Ти написав 30-сторінковий звіт про сумісність. Менеджмент його не прочитає. Але хоча б хакери пішли.',
    waves: 7, waveDurationBase: 65, breachMultiplier: 1.1, aiSpeedMultiplier: 1.0,
    startingSP: 20, nodeCount: 7,
    modifiers: ['dns_poisoning', 'corrupted_ram'],
    reward: { sp: 85, title: 'Vista Veteran', titleUk: 'Ветеран Vista' },
    unlockCondition: 'ch5_espionage',
    wallpaperHue: 200, accentColor: '#1a1a2e',
  },
  {
    id: 'ch6_audit',
    era: 'vista', chapter: 6,
    eraYear: 2008, eraName: 'Windows Vista SP1',
    title: 'The SOX Audit',
    titleUk: 'Аудит SOX',
    briefing: 'DataPlex is going public. The IPO is worth $40 million. But first — a SOX compliance audit. The auditors will monitor your breach level in real-time.\n\nThe rules: breach must NEVER exceed 25%. If it does, even once, the audit fails. The IPO dies. Viktor\'s dream dies.\n\nAnd the hackers know about the audit. They\'re going to test you harder than ever. Stealth attacks, fast breach rates — they want to push your breach over the threshold.\n\n25%. That\'s your line. Don\'t cross it.',
    briefingUk: 'DataPlex виходить на біржу. IPO вартістю $40 мільйонів. Але спочатку — аудит SOX. Аудитори будуть моніторити рівень зламу в реальному часі.\n\nПравила: злам НЕ ПОВИНЕН перевищити 25%. Якщо перевищить — хоча б раз — аудит провалений. IPO помирає. Мрія Віктора помирає.\n\nІ хакери знають про аудит. Вони збираються тестувати тебе жорсткіше ніж будь-коли. Приховані атаки, швидкий злам — вони хочуть підштовхнути рівень зламу за поріг.\n\n25%. Ось твоя лінія. Не переступай її.',
    completionText: 'PASSED. Max breach: 18.7%. The auditors were impressed. The IPO proceeds. Viktor hugged you in front of the entire board. DataPlex Enterprise is born.',
    completionTextUk: 'ПРОЙДЕНО. Макс. злам: 18,7%. Аудитори вражені. IPO відбувається. Віктор обійняв тебе перед усім правлінням. Народжується DataPlex Enterprise.',
    waves: 7, waveDurationBase: 70, breachMultiplier: 1.2, aiSpeedMultiplier: 1.1,
    startingSP: 25, nodeCount: 7,
    modifiers: ['stealth_ai', 'fast_breach'],
    reward: { sp: 100, title: 'Audit Ace', titleUk: 'Ас аудиту' },
    unlockCondition: 'ch6_vista_hell',
    wallpaperHue: 200, accentColor: '#1a1a2e',
  },
  {
    id: 'ch6_apt_long_game',
    era: 'vista', chapter: 6,
    eraYear: 2009, eraName: 'Windows Vista SP2',
    title: 'APT: The Long Game',
    titleUk: 'APT: Довга гра',
    briefing: 'Your SOC detected anomalies — subtle ones. Tiny data packets leaving the network at 3 AM. A process that starts during lunch hour and stops when people return. Someone has been inside your network for weeks.\n\nThis is an Advanced Persistent Threat — APT. They move laterally, they morph, they hide. They\'ve been watching your defense patterns and adapted. Every countermeasure you deploy, they find a way around.\n\n8 servers. 1.2 million records. A ghost in the machine. Find it. Kill it. Before it takes everything.',
    briefingUk: 'Твій SOC виявив аномалії — непомітні. Крихітні пакети даних, що залишають мережу о 3 ночі. Процес, що стартує під час обіду і зупиняється коли люди повертаються. Хтось був усередині твоєї мережі тижнями.\n\nЦе Advanced Persistent Threat — APT. Вони рухаються латерально, морфуються, ховаються. Вони спостерігали за твоїми шаблонами захисту і адаптувались. Кожен контрзахід, який ти впроваджуєш — вони знаходять обхід.\n\n8 серверів. 1,2 мільйони записів. Привид у машині. Знайди його. Знищ. Перш ніж він забере все.',
    completionText: 'The APT group was traced to Eastern Europe. International law enforcement was notified. Your SOC report became a case study in cybersecurity conferences. You\'re now a recognized expert in the field.',
    completionTextUk: 'APT-групу відстежили до Східної Європи. Міжнародні правоохоронці були повідомлені. Твій SOC-звіт став навчальним прикладом на конференціях з кібербезпеки. Тепер ти — визнаний експерт у галузі.',
    waves: 8, waveDurationBase: 70, breachMultiplier: 1.3, aiSpeedMultiplier: 1.15,
    startingSP: 20, nodeCount: 8,
    modifiers: ['stealth_ai', 'lateral_movement', 'polymorphic'],
    reward: { sp: 120, title: 'Ghost Buster', titleUk: 'Мисливець на привидів' },
    unlockCondition: 'ch6_audit',
    wallpaperHue: 200, accentColor: '#1a1a2e',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 7 — THE FINAL STAND (Windows 7, 2009-2012)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'ch7_stuxnet',
    era: 'win7', chapter: 7,
    eraYear: 2010, eraName: 'Windows 7',
    title: 'Stuxnet Protocol',
    titleUk: 'Протокол Stuxnet',
    briefing: 'DataPlex won a contract to manage SCADA systems for a national power grid. Your network now includes industrial control systems — centrifuge controllers, power regulators, safety monitors.\n\nIntelligence reports warn of a state-sponsored cyber weapon called Stuxnet. It targets exactly this type of infrastructure. Zero-day exploits. Lateral movement. Polymorphic payload.\n\nThis isn\'t hacking. This is cyber warfare. And you\'re on the front line.',
    briefingUk: 'DataPlex виграла контракт на управління SCADA-системами для національної електромережі. Твоя мережа тепер включає промислові системи управління — контролери центрифуг, регулятори потужності, монітори безпеки.\n\nРозвідка попереджає про державну кіберзброю під назвою Stuxnet. Вона атакує саме такий тип інфраструктури. Zero-day експлойти. Латеральний рух. Поліморфне корисне навантаження.\n\nЦе не хакінг. Це кібервійна. І ти — на передовій.',
    completionText: 'You stopped Stuxnet at the perimeter. The SCADA systems remain intact. National security agencies sent a classified "thank you" letter. Viktor frames it — blacked-out text and all.',
    completionTextUk: 'Ти зупинив Stuxnet на периметрі. SCADA-системи неушкоджені. Служби нацбезпеки надіслали засекречений лист подяки. Віктор ставить його в рамку — з усім зачерненим текстом.',
    waves: 8, waveDurationBase: 70, breachMultiplier: 1.3, aiSpeedMultiplier: 1.15,
    startingSP: 25, nodeCount: 8,
    specialNodes: [
      { id: 'scada1', name: 'SCADA Controller', ip: '10.0.10.1', difficulty: 5, firewalled: true },
      { id: 'scada2', name: 'Power Regulator', ip: '10.0.10.2', difficulty: 5, firewalled: true },
    ],
    modifiers: ['lateral_movement', 'zero_day', 'polymorphic'],
    reward: { sp: 130, title: 'Cyber Warrior', titleUk: 'Кібервоїн' },
    unlockCondition: 'ch6_apt_long_game',
    wallpaperHue: 210, accentColor: '#2b5797',
  },
  {
    id: 'ch7_mega_breach',
    era: 'win7', chapter: 7,
    eraYear: 2011, eraName: 'Windows 7 SP1',
    title: 'The Mega Breach',
    titleUk: 'Мегазлам',
    briefing: 'Ten million records. Financial data. Medical records. Government secrets. All in your data center.\n\nA ransomware gang has launched the biggest attack you\'ve ever seen. They\'re encrypting servers one by one. Your backup server is targeted too. There\'s no time for shopping between waves — this is raw survival.\n\nIf this data leaks, DataPlex faces $500 million in fines, class-action lawsuits, and criminal prosecution. The company — everything Viktor built from a garage — will cease to exist.\n\nDon\'t. Let. It. Happen.',
    briefingUk: 'Десять мільйонів записів. Фінансові дані. Медичні записи. Урядові секрети. Все у твоєму дата-центрі.\n\nРансомварь-банда запустила найбільшу атаку, яку ти бачив. Вони шифрують сервери один за одним. Твій бекап-сервер теж ціль. Немає часу на магазин між хвилями — це чисте виживання.\n\nЯкщо ці дані витечуть — DataPlex чекає $500 мільйонів штрафів, колективних позовів і кримінального переслідування. Компанія — все, що Віктор побудував з гаража — перестане існувати.\n\nНе. Дай. Цьому. Статися.',
    completionText: 'Zero data stolen. Zero files permanently encrypted. Your team worked 72 hours straight. CNN ran a story: "DataPlex repels historic cyber attack." Job offers from Google, Microsoft, and the NSA fill your inbox.',
    completionTextUk: 'Нуль вкрадених даних. Нуль остаточно зашифрованих файлів. Твоя команда працювала 72 години поспіль. CNN показав сюжет: "DataPlex відбила історичну кібератаку." Пропозиції від Google, Microsoft і NSA заповнюють пошту.',
    waves: 9, waveDurationBase: 75, breachMultiplier: 1.4, aiSpeedMultiplier: 1.2,
    startingSP: 20, nodeCount: 8,
    modifiers: ['ransomware', 'fast_breach', 'no_shop', 'lateral_movement'],
    reward: { sp: 150, title: 'Mega Shield', titleUk: 'Мегащит' },
    unlockCondition: 'ch7_stuxnet',
    wallpaperHue: 210, accentColor: '#2b5797',
  },
  {
    id: 'ch7_legacy',
    era: 'win7', chapter: 7,
    eraYear: 2012, eraName: 'Windows 7 SP1',
    title: 'Legacy',
    titleUk: 'Спадщина',
    briefing: 'Twenty years. From a garage with three 286 PCs to a global enterprise with 500 employees. From a $200/month hobbyist to a CISO making six figures.\n\nAnd now — the final test. Every threat you\'ve ever faced. Script kiddies AND state actors. Worms AND ransomware. Social engineering AND zero-days. Lateral movement, polymorphic malware, insider threats, DNS poisoning — ALL AT ONCE.\n\nThis is your legacy. Everything you\'ve learned. Every scar. Every victory.\n\nThey\'re all coming for you. One last time.\n\nDefend the castle, Administrator. Show them what 20 years of experience looks like.',
    briefingUk: 'Двадцять років. Від гаража з трьома 286-ми до глобальної корпорації з 500 працівниками. Від ентузіаста за $200/місяць до CISO з шестизначною зарплатою.\n\nІ ось — фінальний тест. Кожна загроза, з якою ти стикався. Скріпт-кіді І державні актори. Черв\'яки І рансомварь. Соціальна інженерія І zero-day. Латеральний рух, поліморфна малварь, внутрішні загрози, DNS-отруєння — ВСЕ ОДНОЧАСНО.\n\nЦе — твоя спадщина. Все, чого ти навчився. Кожен шрам. Кожна перемога.\n\nВони всі йдуть за тобою. Востаннє.\n\nЗахисти фортецю, Адміністраторе. Покажи їм, як виглядають 20 років досвіду.',
    completionText: 'You won. Against everything. Against everyone.\n\nViktor called you into his office. The same Viktor from the garage. He\'s older now, silver-haired, but his eyes still have that spark.\n\n"Remember when I said \'just keep them running\'?" he laughed. "I had no idea what I was starting."\n\nHe shook your hand. "Thank you. For twenty years of keeping us safe."\n\nYou look out the window of the HQ tower. The city stretches below — millions of people whose data you protected. Whose lives you made a little safer.\n\nThe screen glows. The cursor blinks.\n\nAnd somewhere out there, a new threat is already forming.\n\nBut that\'s a story for another day.\n\n🏆 CONGRATULATIONS — CAMPAIGN COMPLETE 🏆',
    completionTextUk: 'Ти переміг. Проти всього. Проти всіх.\n\nВіктор покликав тебе у свій кабінет. Той самий Віктор з гаража. Він тепер старший, сивий, але в очах все ще іскра.\n\n"Пам\'ятаєш, коли я сказав \'просто зроби, щоб працювало\'?" — засміявся він. — "Я гадки не мав, що почну."\n\nВін потиснув тобі руку. "Дякую. За двадцять років захисту."\n\nТи дивишся з вікна вежі головного офісу. Місто розстилається внизу — мільйони людей, чиї дані ти захистив. Чиє життя ти зробив трохи безпечнішим.\n\nЕкран світиться. Курсор мигає.\n\nІ десь там, нова загроза вже формується.\n\nАле це — історія на інший день.\n\n🏆 ВІТАЄМО — КАМПАНІЮ ПРОЙДЕНО 🏆',
    waves: 10, waveDurationBase: 75, breachMultiplier: 1.5, aiSpeedMultiplier: 1.3,
    startingSP: 30, nodeCount: 8,
    specialNodes: [
      { id: 'scada1', name: 'SCADA Controller', ip: '10.0.10.1', difficulty: 5, firewalled: true },
      { id: 'scada2', name: 'Centrifuge Control', ip: '10.0.10.2', difficulty: 5, firewalled: true },
    ],
    modifiers: ['lateral_movement', 'zero_day', 'polymorphic', 'ransomware', 'stealth_ai', 'dns_poisoning', 'insider_threat'],
    reward: { sp: 250, title: 'Cyber Legend', titleUk: 'Кіберлегенда' },
    unlockCondition: 'ch7_mega_breach',
    wallpaperHue: 210, accentColor: '#2b5797',
  },
];

// ============================================================================
// ERA_INFO — metadata for UI
// ============================================================================

export const ERA_INFO: Record<CampaignEra, { name: string; nameUk: string; year: string; icon: string; color: string }> = {
  win31:  { name: 'Windows 3.1',   nameUk: 'Windows 3.1',   year: '1992–1994', icon: '🖼️', color: '#808080' },
  win95:  { name: 'Windows 95',    nameUk: 'Windows 95',    year: '1995–1998', icon: '🌐', color: '#008080' },
  win98:  { name: 'Windows 98',    nameUk: 'Windows 98',    year: '1998–2000', icon: '💿', color: '#0055AA' },
  winME:  { name: 'Windows ME',    nameUk: 'Windows ME',    year: '2000–2001', icon: '💀', color: '#6A0DAD' },
  winXP:  { name: 'Windows XP',    nameUk: 'Windows XP',    year: '2001–2014', icon: '🏠', color: '#316ac5' },
  vista:  { name: 'Windows Vista',  nameUk: 'Windows Vista', year: '2007–2009', icon: '🌀', color: '#1a1a2e' },
  win7:   { name: 'Windows 7',     nameUk: 'Windows 7',     year: '2009–2012', icon: '🏁', color: '#2b5797' },
};

// ============================================================================
// HELPERS
// ============================================================================

/** Get the chapter object for a given mission */
export function getChapterForMission(mission: CampaignMission): Chapter | undefined {
  return CHAPTERS.find(ch => ch.id === mission.era);
}

/** Get current chapter based on completed missions — returns the most advanced unlocked chapter */
export function getCurrentChapter(completedMissions: string[]): Chapter {
  const completedSet = new Set(completedMissions);
  let latest = CHAPTERS[0];
  for (const ch of CHAPTERS) {
    const chMissions = CAMPAIGN_MISSIONS.filter(m => m.era === ch.id);
    const anyCompleteOrUnlocked = chMissions.some(m =>
      completedSet.has(m.id) || !m.unlockCondition || completedSet.has(m.unlockCondition)
    );
    if (anyCompleteOrUnlocked) latest = ch;
  }
  return latest;
}

/** Calculate stars based on performance */
export function calculateMissionStars(
  breachLevel: number,
  gameTimeSec: number,
  totalWaveDuration: number,
): number {
  if (breachLevel < 20 && gameTimeSec < totalWaveDuration * 1.1) return 3;
  if (breachLevel < 50) return 2;
  return 1;
}
