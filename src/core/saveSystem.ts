// Save/Load system — localStorage persistence with import/export JSON

const SAVE_KEY = 'xp-pocalypse-breach-save';
const SAVE_VERSION = 1;

// Fields to persist (exclude functions, timers, and transient UI state)
const PERSIST_FIELDS = [
  'language', 'gameTime', 'isPaused', 'gameOver',
  'breachLevel', 'maxBreachLevel', 'cpuTemp',
  'hackerState', 'hackerAggression', 'hackerAdminAccess',
  'attackCooldown', 'currentTargetNodeId', 'bruteforceProgress',
  'nodes', 'blockedIPs',
  'emails', 'unreadCount',
  'recycleBinItems',
  'processes',
  'stabilityPoints', 'upgrades',
  'minerActive', 'dustLevel', 'liquidCoolingActive',
  'icqMessages', 'icqSpamActive', 'registryPassword', 'registryUsed',
  'defragScore',
  'autocompletePromptShown',
  'hardware',
  'currentWave', 'waveTimeLeft', 'wavePaused', 'wavesCompleted', 'totalWaves', 'gameWon',
  'difficulty',
  'achievements', 'totalProcessesKilled', 'lowBreachTime',
  'tutorialStep', 'tutorialActive',
  'clippyDisabled',
  'fwTetrisScore',
  // New Game+ fields
  'newGamePlusLevel',
] as const;

export interface SaveData {
  version: number;
  timestamp: number;
  gameTime: number;
  wave: number;
  difficulty: string;
  breachLevel: number;
  state: Record<string, unknown>;
}

/**
 * Extract saveable state from the full store state
 */
export function extractSaveState(state: Record<string, unknown>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const key of PERSIST_FIELDS) {
    if (key in state) {
      // Deep clone to avoid reference issues
      data[key] = JSON.parse(JSON.stringify(state[key]));
    }
  }
  return data;
}

/**
 * Save current game state to localStorage
 */
export function saveGame(state: Record<string, unknown>): boolean {
  try {
    const saveData: SaveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      gameTime: (state.gameTime as number) || 0,
      wave: (state.currentWave as number) || 0,
      difficulty: (state.difficulty as string) || 'normal',
      breachLevel: (state.breachLevel as number) || 0,
      state: extractSaveState(state),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (e) {
    console.error('Failed to save game:', e);
    return false;
  }
}

/**
 * Load game state from localStorage
 */
export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    if (data.version !== SAVE_VERSION) {
      console.warn('Save version mismatch, ignoring save');
      return null;
    }
    return data;
  } catch (e) {
    console.error('Failed to load game:', e);
    return null;
  }
}

/**
 * Check if a save exists
 */
export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

/**
 * Delete saved game
 */
export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

/**
 * Export save data as a downloadable JSON string
 */
export function exportSave(state: Record<string, unknown>): string {
  const saveData: SaveData = {
    version: SAVE_VERSION,
    timestamp: Date.now(),
    gameTime: (state.gameTime as number) || 0,
    wave: (state.currentWave as number) || 0,
    difficulty: (state.difficulty as string) || 'normal',
    breachLevel: (state.breachLevel as number) || 0,
    state: extractSaveState(state),
  };
  return JSON.stringify(saveData, null, 2);
}

/**
 * Import save data from JSON string
 */
export function importSave(jsonStr: string): SaveData | null {
  try {
    const data = JSON.parse(jsonStr) as SaveData;
    if (data.version !== SAVE_VERSION || !data.state) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Download a string as a file
 */
export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Get save info summary without loading the full state
 */
export function getSaveInfo(): { exists: boolean; timestamp?: number; gameTime?: number; wave?: number; difficulty?: string } {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { exists: false };
    const data = JSON.parse(raw) as SaveData;
    return {
      exists: true,
      timestamp: data.timestamp,
      gameTime: data.gameTime,
      wave: data.wave,
      difficulty: data.difficulty,
    };
  } catch {
    return { exists: false };
  }
}
