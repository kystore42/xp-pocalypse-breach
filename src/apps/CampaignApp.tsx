import React, { useState, useMemo } from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore } from '../store/gameStore';
import {
  CAMPAIGN_MISSIONS, ERA_INFO, CHAPTERS,
  type CampaignEra, type CampaignMission, type Chapter,
} from '../core/campaign';

/* ── Era ordering ────────────────────────────────────────────────────────── */
const ERAS: CampaignEra[] = ['win31', 'win95', 'win98', 'winME', 'winXP', 'vista', 'win7'];

/* ── Modifier badges ─────────────────────────────────────────────────────── */
const MOD: Record<string, { en: string; uk: string; icon: string }> = {
  no_firewall:        { en: 'No Firewall',        uk: 'Без файрвола',        icon: '🚫' },
  double_phishing:    { en: '2× Phishing',        uk: '2× Фішинг',          icon: '📧' },
  stealth_ai:         { en: 'Stealth AI',          uk: 'Прихований ШІ',      icon: '👻' },
  fast_breach:        { en: 'Fast Breach',         uk: 'Швидкий злам',       icon: '⚡' },
  fragile_nodes:      { en: 'Fragile Nodes',       uk: 'Крихкі вузли',       icon: '💔' },
  no_shop:            { en: 'No Shop',             uk: 'Без магазину',        icon: '🚷' },
  limited_cmds:       { en: 'Limited Commands',    uk: 'Обмежені команди',    icon: '⌨️' },
  corrupted_ram:      { en: 'Corrupted RAM',       uk: 'Пошкоджена ОЗП',     icon: '🧩' },
  polymorphic:        { en: 'Polymorphic Malware', uk: 'Поліморфна малварь', icon: '🦠' },
  lateral_movement:   { en: 'Lateral Movement',    uk: 'Бічний рух',         icon: '🔀' },
  zero_day:           { en: 'Zero-Day Exploits',   uk: 'Zero-Day експлойти', icon: '💣' },
  insider_threat:     { en: 'Insider Threat',      uk: 'Внутрішня загроза',  icon: '🕵️' },
  dns_poisoning:      { en: 'DNS Poisoning',       uk: 'DNS-отруєння',       icon: '🌐' },
  ransomware:         { en: 'Ransomware',          uk: 'Рансомварь',         icon: '🔒' },
  social_engineering: { en: 'Social Engineering',  uk: 'Соц. інженерія',     icon: '🎭' },
};

/* ── View state ──────────────────────────────────────────────────────────── */
type View = 'story' | 'list' | 'detail';

/* ──────────────────────────────────────────────────────────────────────────
   CampaignApp – story-driven campaign UI
   ────────────────────────────────────────────────────────────────────────── */
const CampaignApp: React.FC = () => {
  const language     = useGameStore(s => s.language);
  const campaign     = useGameStore(s => s.campaignState);
  const startMission = useGameStore(s => s.startCampaignMission);

  const [selectedEra, setSelectedEra]         = useState<CampaignEra>('win31');
  const [selectedMission, setSelectedMission] = useState<CampaignMission | null>(null);
  const [view, setView]                       = useState<View>('story');

  const uk = language === 'uk';

  /* ── helpers ──────────────────────────────────────────────────────────── */
  const chapter     = useMemo(() => CHAPTERS.find(c => c.id === selectedEra)!, [selectedEra]);
  const eraMissions = useMemo(() => CAMPAIGN_MISSIONS.filter(m => m.era === selectedEra), [selectedEra]);

  const unlocked  = (m: CampaignMission) => !m.unlockCondition || campaign.completedMissions.includes(m.unlockCondition);
  const completed = (m: CampaignMission) => campaign.completedMissions.includes(m.id);
  const stars     = (id: string) => campaign.missionStars[id] || 0;

  const isEraUnlocked = (era: CampaignEra) =>
    CAMPAIGN_MISSIONS.filter(m => m.era === era).some(m => unlocked(m));

  const eraCompleted = (era: CampaignEra) => {
    const ms = CAMPAIGN_MISSIONS.filter(m => m.era === era);
    return ms.length > 0 && ms.every(m => completed(m));
  };

  const eraStars = (era: CampaignEra) =>
    CAMPAIGN_MISSIONS.filter(m => m.era === era).reduce((s, m) => s + stars(m.id), 0);

  const totalStars = Object.values(campaign.missionStars).reduce((s: number, v: number) => s + v, 0);
  const maxStars   = CAMPAIGN_MISSIONS.length * 3;

  const renderStars = (n: number) => (
    <span className="text-[13px] tracking-tight">
      {[1, 2, 3].map(i => (
        <span key={i} className={i <= n ? 'text-yellow-400' : 'text-gray-400'}>★</span>
      ))}
    </span>
  );

  /* ── Select chapter ──────────────────────────────────────────────────── */
  const selectChapter = (era: CampaignEra) => {
    setSelectedEra(era);
    setSelectedMission(null);
    setView('story');
  };

  /* ── Render: Company / Player / PC bar ───────────────────────────────── */
  const InfoBar = ({ ch }: { ch: Chapter }) => (
    <div className="grid grid-cols-3 gap-1 px-3 py-2 bg-gradient-to-r from-[#eef3fc] to-[#d6e4f9] border-b border-[#7394cf] text-[9px]">
      <div className="flex items-center gap-1.5" title={uk ? 'Компанія' : 'Company'}>
        <span className="text-[16px]">{ch.company.icon}</span>
        <div>
          <div className="font-bold text-gray-700 text-[10px]">{ch.company.name}</div>
          <div className="text-gray-500">{ch.company.employees} 👤 • {ch.company.servers} 🖥️</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5" title={uk ? 'Посада' : 'Role'}>
        <span className="text-[16px]">{ch.player.icon}</span>
        <div>
          <div className="font-bold text-gray-700 text-[10px]">{uk ? ch.player.roleUk : ch.player.role}</div>
          <div className="text-gray-500">{ch.player.salary}</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5" title={uk ? 'Комп\'ютер' : 'PC'}>
        <span className="text-[16px]">{ch.pc.icon}</span>
        <div>
          <div className="font-bold text-gray-700 text-[10px]">{ch.pc.cpu}</div>
          <div className="text-gray-500">{ch.pc.ram} • {ch.pc.connection}</div>
        </div>
      </div>
    </div>
  );

  /* ── Render: Chapter story intro ─────────────────────────────────────── */
  const StoryView = ({ ch }: { ch: Chapter }) => (
    <div className="flex-1 overflow-y-auto px-5 py-4">
      {/* Chapter header */}
      <div className="text-center mb-4">
        <div className="text-[10px] tracking-widest text-gray-400 mb-1">
          {uk ? 'РОЗДІЛ' : 'CHAPTER'} {ch.number}
        </div>
        <h2 className="text-[22px] font-bold text-gray-800 leading-tight">
          {uk ? ch.titleUk : ch.title}
        </h2>
        <div className="text-[11px] text-gray-500 mt-0.5">
          {ch.yearRange} • {ERA_INFO[ch.id].icon} {uk ? ERA_INFO[ch.id].nameUk : ERA_INFO[ch.id].name}
        </div>
      </div>

      {/* Story intro */}
      <div
        className="bg-[#fefcf0] border border-yellow-200 rounded-lg p-4 mb-4 shadow-inner"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {(uk ? ch.storyIntroUk : ch.storyIntro).split('\n\n').map((para, i) => (
          <p key={i} className="text-[11.5px] text-gray-700 leading-[1.7] mb-3 last:mb-0">
            {para}
          </p>
        ))}
      </div>

      {/* Company / Player / PC cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* Company card */}
        <div className="bg-white border border-gray-200 rounded p-2.5">
          <div className="text-[8px] text-gray-400 font-bold mb-1">{uk ? 'КОМПАНІЯ' : 'COMPANY'}</div>
          <div className="text-[14px] mb-1">{ch.company.icon}</div>
          <div className="text-[10px] font-bold text-gray-700">{ch.company.name}</div>
          <div className="text-[8px] text-gray-500 mt-0.5">
            👤 {ch.company.employees} • 🖥️ {ch.company.servers}<br/>
            💰 {ch.company.revenue}<br/>
            📁 {ch.company.dataRecords}<br/>
            🏢 {uk ? ch.company.officeUk : ch.company.office}
          </div>
        </div>
        {/* Player card */}
        <div className="bg-white border border-gray-200 rounded p-2.5">
          <div className="text-[8px] text-gray-400 font-bold mb-1">{uk ? 'ПОСАДА' : 'YOUR ROLE'}</div>
          <div className="text-[14px] mb-1">{ch.player.icon}</div>
          <div className="text-[10px] font-bold text-gray-700">{uk ? ch.player.roleUk : ch.player.role}</div>
          <div className="text-[8px] text-gray-500 mt-0.5">
            💪 {uk ? 'Рівень' : 'Skill'}: {ch.player.skillLevel}/7<br/>
            💵 {ch.player.salary}
          </div>
          {/* Skill bar */}
          <div className="w-full h-1.5 bg-gray-200 rounded mt-1.5">
            <div className="h-full bg-blue-500 rounded transition-all" style={{ width: `${(ch.player.skillLevel / 7) * 100}%` }} />
          </div>
        </div>
        {/* PC card */}
        <div className="bg-white border border-gray-200 rounded p-2.5">
          <div className="text-[8px] text-gray-400 font-bold mb-1">{uk ? 'КОМП\'ЮТЕР' : 'YOUR PC'}</div>
          <div className="text-[14px] mb-1">{ch.pc.icon}</div>
          <div className="text-[10px] font-bold text-gray-700">{ch.pc.name}</div>
          <div className="text-[8px] text-gray-500 mt-0.5">
            🖥️ {ch.pc.cpu}<br/>
            🧠 {ch.pc.ram} • 💾 {ch.pc.storage}<br/>
            🌐 {ch.pc.connection}
          </div>
        </div>
      </div>

      {/* Go to missions button */}
      <button
        onClick={() => setView('list')}
        className="w-full py-2.5 bg-[#316ac5] text-white text-[12px] font-bold rounded hover:bg-[#2555a5] transition-colors"
      >
        {uk ? '▶ ПЕРЕЙТИ ДО МІСІЙ' : '▶ PROCEED TO MISSIONS'}
      </button>
    </div>
  );

  /* ── Render: Mission list ────────────────────────────────────────────── */
  const MissionList = () => (
    <div className="flex-1 overflow-y-auto p-3">
      <button
        onClick={() => setView('story')}
        className="text-[10px] text-[#316ac5] hover:underline mb-2 block"
      >
        ← {uk ? 'Передісторія розділу' : 'Chapter story'}
      </button>

      {eraMissions.map((mission, idx) => {
        const isUnlocked  = unlocked(mission);
        const isCompleted = completed(mission);
        const mStars      = stars(mission.id);

        return (
          <button
            key={mission.id}
            onClick={() => { if (isUnlocked) { setSelectedMission(mission); setView('detail'); } }}
            disabled={!isUnlocked}
            className={`w-full text-left p-3 rounded border mb-2 transition-all
              ${!isUnlocked
                ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                : isCompleted
                  ? 'bg-green-50 border-green-200 hover:border-green-400 cursor-pointer'
                  : 'bg-white border-gray-200 hover:border-[#316ac5] hover:shadow-sm cursor-pointer'}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[18px] w-6 text-center">
                  {!isUnlocked ? '🔒' : isCompleted ? '✅' : <span className="text-[14px] text-gray-400 font-bold">{idx + 1}</span>}
                </span>
                <div>
                  <div className="text-[12px] font-bold text-gray-800">
                    {uk ? mission.titleUk : mission.title}
                  </div>
                  <div className="text-[9px] text-gray-500">
                    {mission.eraYear} • {mission.waves} {uk ? 'хв.' : 'waves'} • {mission.nodeCount} {uk ? 'вузлів' : 'nodes'}
                  </div>
                  {/* Show completion text if completed */}
                  {isCompleted && (
                    <div className="text-[8px] text-green-600 mt-0.5 italic line-clamp-1">
                      {uk ? mission.completionTextUk : mission.completionText}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex gap-0.5">
                  {mission.modifiers.slice(0, 3).map(mod => (
                    <span key={mod} className="text-[11px]" title={uk ? MOD[mod]?.uk : MOD[mod]?.en}>
                      {MOD[mod]?.icon}
                    </span>
                  ))}
                  {mission.modifiers.length > 3 && (
                    <span className="text-[9px] text-gray-400">+{mission.modifiers.length - 3}</span>
                  )}
                </div>
                {isCompleted && renderStars(mStars)}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  /* ── Render: Mission detail ──────────────────────────────────────────── */
  const MissionDetail = ({ mission }: { mission: CampaignMission }) => (
    <div className="flex-1 overflow-y-auto p-4">
      <button
        onClick={() => { setSelectedMission(null); setView('list'); }}
        className="text-[10px] text-[#316ac5] hover:underline mb-3 block"
      >
        ← {uk ? 'Назад до місій' : 'Back to missions'}
      </button>

      {/* Title */}
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[15px] font-bold text-gray-800">
          {uk ? mission.titleUk : mission.title}
        </h3>
        {completed(mission) && renderStars(stars(mission.id))}
      </div>
      <div className="text-[10px] text-gray-400 mb-3">
        {mission.eraName} • {mission.eraYear}
      </div>

      {/* Briefing */}
      <div
        className="bg-[#fefcf0] border border-yellow-200 rounded-lg p-3 mb-3 shadow-inner"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        <div className="text-[9px] text-yellow-700 font-bold mb-1.5">
          📋 {uk ? 'БРИФІНГ МІСІЇ' : 'MISSION BRIEFING'}
        </div>
        {(uk ? mission.briefingUk : mission.briefing).split('\n\n').map((p, i) => (
          <p key={i} className="text-[11px] text-gray-700 leading-[1.65] mb-2 last:mb-0">{p}</p>
        ))}
      </div>

      {/* Completion text (if completed) */}
      {completed(mission) && (
        <div className="bg-green-50 border border-green-200 rounded p-2.5 mb-3">
          <div className="text-[9px] text-green-700 font-bold mb-1">
            ✅ {uk ? 'РЕЗУЛЬТАТ' : 'OUTCOME'}
          </div>
          <p className="text-[10px] text-green-800 italic leading-relaxed">
            {uk ? mission.completionTextUk : mission.completionText}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {[
          { label: uk ? 'Хвилі' : 'Waves',      value: mission.waves,                       color: 'text-gray-800' },
          { label: uk ? 'Вузли' : 'Nodes',        value: mission.nodeCount + (mission.specialNodes?.length || 0), color: 'text-gray-800' },
          { label: uk ? 'Старт ОС' : 'Start SP',  value: mission.startingSP,                  color: 'text-green-600' },
          { label: uk ? 'ШІ швид.' : 'AI Speed',  value: `${mission.aiSpeedMultiplier}×`,     color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 border border-gray-200 rounded p-1.5 text-center">
            <div className="text-[8px] text-gray-400">{s.label}</div>
            <div className={`text-[14px] font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Modifiers */}
      <div className="mb-3">
        <div className="text-[9px] text-gray-500 font-bold mb-1">
          ⚠️ {uk ? 'МОДИФІКАТОРИ' : 'MODIFIERS'}
        </div>
        <div className="flex flex-wrap gap-1">
          {mission.modifiers.map(mod => (
            <span key={mod} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[8px] bg-red-50 text-red-700 border border-red-200 rounded-full">
              {MOD[mod]?.icon} {uk ? MOD[mod]?.uk : MOD[mod]?.en}
            </span>
          ))}
        </div>
      </div>

      {/* Special nodes */}
      {mission.specialNodes && mission.specialNodes.length > 0 && (
        <div className="mb-3">
          <div className="text-[9px] text-gray-500 font-bold mb-1">
            🖥️ {uk ? 'СПЕЦІАЛЬНІ ВУЗЛИ' : 'SPECIAL NODES'}
          </div>
          <div className="flex flex-wrap gap-1">
            {mission.specialNodes.map(n => (
              <span key={n.id} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[8px] bg-orange-50 text-orange-700 border border-orange-200 rounded-full">
                ⚙️ {n.name} ({n.ip})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reward */}
      <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-4">
        <div className="text-[9px] text-blue-600 font-bold">
          🏆 {uk ? 'НАГОРОДА' : 'REWARD'}
        </div>
        <div className="text-[10px] text-gray-700">
          +{mission.reward.sp} SP • {uk ? 'Титул' : 'Title'}: <strong>{uk ? mission.reward.titleUk : mission.reward.title}</strong>
        </div>
      </div>

      {/* Launch */}
      <button
        onClick={() => startMission(mission.id)}
        disabled={!unlocked(mission)}
        className={`w-full py-2.5 text-[13px] font-bold rounded transition-colors
          ${unlocked(mission)
            ? 'bg-[#316ac5] text-white hover:bg-[#2555a5] cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
        `}
      >
        {completed(mission)
          ? (uk ? '🔄 Перепройти місію' : '🔄 Replay Mission')
          : (uk ? '▶ ПОЧАТИ МІСІЮ' : '▶ START MISSION')
        }
      </button>
    </div>
  );

  /* ── MAIN RENDER ─────────────────────────────────────────────────────── */
  return (
    <XPWindow
      windowId="campaign"
      title={uk ? '📜 Кампанія — Сага ViktorTrade' : '📜 Campaign — The ViktorTrade Saga'}
      icon="📜"
      width={760}
      height="600px"
    >
      <div className="flex h-full" style={{ minHeight: 520 }}>
        {/* ── Left sidebar: Chapter timeline ────────────────────────────── */}
        <div className="w-[150px] bg-gradient-to-b from-[#d6dff7] to-[#a8beea] border-r border-[#7394cf] flex flex-col py-1">
          {/* Progress header */}
          <div className="px-2 py-1.5 border-b border-[#7394cf] mb-1">
            <div className="text-[8px] text-gray-600 font-bold text-center tracking-wider">
              {uk ? 'ПРОГРЕС' : 'PROGRESS'}
            </div>
            <div className="text-center text-[12px] font-bold text-[#316ac5]">
              ⭐ {totalStars}/{maxStars}
            </div>
            <div className="w-full h-1.5 bg-gray-400 rounded overflow-hidden mt-1">
              <div
                className="h-full bg-yellow-400 rounded transition-all"
                style={{ width: `${(totalStars / maxStars) * 100}%` }}
              />
            </div>
          </div>

          {/* Chapter buttons */}
          <div className="flex-1 overflow-y-auto">
            {ERAS.map(era => {
              const ch = CHAPTERS.find(c => c.id === era)!;
              const isUnlocked = isEraUnlocked(era);
              const isDone     = eraCompleted(era);
              const chStars    = eraStars(era);
              const ms         = CAMPAIGN_MISSIONS.filter(m => m.era === era);
              const completedN = ms.filter(m => completed(m)).length;

              return (
                <button
                  key={era}
                  onClick={() => isUnlocked && selectChapter(era)}
                  disabled={!isUnlocked}
                  className={`w-full px-2 py-1.5 text-left border-b border-[#7394cf]/30 transition-colors
                    ${selectedEra === era
                      ? 'bg-[#316ac5] text-white'
                      : isUnlocked
                        ? 'hover:bg-[#c1d2ee] text-gray-800'
                        : 'text-gray-400 cursor-not-allowed opacity-60'}
                  `}
                >
                  <div className="flex items-start gap-1.5">
                    {/* Chapter number badge */}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5
                      ${isDone ? 'bg-green-500 text-white' : selectedEra === era ? 'bg-white/30 text-white' : 'bg-gray-400/30 text-gray-600'}
                    `}>
                      {isDone ? '✓' : ch.number}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold truncate">
                        {uk ? ch.titleUk : ch.title}
                      </div>
                      <div className={`text-[8px] ${selectedEra === era ? 'text-blue-200' : 'text-gray-500'}`}>
                        {ch.yearRange}
                      </div>
                      <div className={`text-[8px] ${selectedEra === era ? 'text-blue-200' : 'text-gray-500'}`}>
                        {completedN}/{ms.length} • {'★'.repeat(chStars)}{'☆'.repeat(ms.length * 3 - chStars)}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Overall progress */}
          <div className="px-2 py-1.5 border-t border-[#7394cf]">
            <div className="text-[8px] text-gray-600 text-center">
              {campaign.completedMissions.length}/{CAMPAIGN_MISSIONS.length} {uk ? 'місій' : 'missions'}
            </div>
            <div className="w-full h-1.5 bg-gray-400 rounded overflow-hidden mt-0.5">
              <div
                className="h-full bg-[#316ac5] rounded transition-all"
                style={{ width: `${(campaign.completedMissions.length / CAMPAIGN_MISSIONS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Right content area ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Info bar */}
          <InfoBar ch={chapter} />

          {/* Content */}
          {view === 'story' && <StoryView ch={chapter} />}
          {view === 'list'  && <MissionList />}
          {view === 'detail' && selectedMission && <MissionDetail mission={selectedMission} />}
        </div>
      </div>
    </XPWindow>
  );
};

export default CampaignApp;
