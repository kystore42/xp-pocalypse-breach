import React, { useState, useRef, useEffect } from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore } from '../store/gameStore';
import { playKeyPress } from '../core/audio/soundManager';

const COMMANDS = ['help', 'cls', 'ipconfig', 'netstat', 'tasklist', 'taskkill', 'scan', 'patch', 'systeminfo', 'regedit'];

const TerminalApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const executeCommand = useGameStore(s => s.executeCommand);
  const terminalHistory = useGameStore(s => s.terminalHistory);
  const upgrades = useGameStore(s => s.upgrades);
  const hasAutocomplete = upgrades.some(u => u.id === 'cmd_autocomplete' && u.purchased);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  // Update suggestions as user types
  useEffect(() => {
    if (!hasAutocomplete || !input.trim()) {
      setSuggestions([]);
      return;
    }
    const lower = input.toLowerCase().trim();
    const matches = COMMANDS.filter(c => c.startsWith(lower) && c !== lower);
    setSuggestions(matches);
    setSelectedSuggestion(0);
  }, [input, hasAutocomplete]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      executeCommand(input.trim());
      setInput('');
      setSuggestions([]);
      return;
    }
    if (e.key === 'Tab' && hasAutocomplete && suggestions.length > 0) {
      e.preventDefault();
      setInput(suggestions[selectedSuggestion]);
      setSuggestions([]);
      return;
    }
    if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault();
      setSelectedSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
    }
    if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault();
      setSelectedSuggestion(prev => Math.max(prev - 1, 0));
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-300';
      case 'system': return 'text-cyan-300';
      case 'input': return 'text-white';
      default: return 'text-[#c0c0c0]';
    }
  };

  return (
    <XPWindow windowId="cmd" title="C:\WINDOWS\system32\cmd.exe" icon="⌨️" width={580} height="320px">
      <div 
        className="bg-black text-[#c0c0c0] font-mono text-[12px] h-full overflow-y-auto p-2 cursor-text relative"
        onClick={() => inputRef.current?.focus()}
      >
        {terminalHistory.map((line, i) => (
          <div key={i} className={`${getColor(line.type)} whitespace-pre leading-[1.4]`}>
            {line.text}
          </div>
        ))}
        <div className="flex items-center relative">
          <span className="text-[#c0c0c0]">C:\&gt;&nbsp;</span>
          <input
            ref={inputRef}
            id="cmd-input"
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); playKeyPress(); }}
            onKeyDown={handleKey}
            className="bg-transparent border-none outline-none text-[#c0c0c0] flex-1 font-mono text-[12px] caret-[#c0c0c0]"
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        {/* Autocomplete dropdown */}
        {hasAutocomplete && suggestions.length > 0 && (
          <div className="bg-[#1a1a2e] border border-cyan-700 rounded text-[11px] z-50 shadow-lg w-fit"
          >
            {suggestions.map((s, i) => (
              <div 
                key={s}
                onClick={() => { setInput(s); setSuggestions([]); }}
                className={`px-3 py-[3px] cursor-pointer ${
                  i === selectedSuggestion ? 'bg-cyan-800 text-white' : 'text-cyan-300 hover:bg-cyan-900'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </XPWindow>
  );
};

export default TerminalApp;
