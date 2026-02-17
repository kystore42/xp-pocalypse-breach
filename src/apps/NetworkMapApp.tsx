import React from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';

const NetworkMapApp: React.FC = () => {
  const nodes = useGameStore(s => s.nodes);
  const currentTargetNodeId = useGameStore(s => s.currentTargetNodeId);
  const bruteforceProgress = useGameStore(s => s.bruteforceProgress);
  const blockedIPs = useGameStore(s => s.blockedIPs);
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'bg-green-500 border-green-300';
      case 'probing': return 'bg-yellow-400 border-yellow-200 animate-pulse';
      case 'compromised': return 'bg-red-500 border-red-300 animate-bounce';
      case 'offline': return 'bg-gray-500 border-gray-300';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'secure': return t('network.secure');
      case 'probing': return t('network.probing');
      case 'compromised': return t('network.compromised');
      case 'offline': return t('network.offline');
      default: return status;
    }
  };

  return (
    <XPWindow windowId="network" title={t('network.title')} icon="🌐" width={500} height="380px"
      menuBar={<><span className="hover:bg-[#316ac5] hover:text-white px-2 cursor-default">{t('network.menuFile')}</span><span className="hover:bg-[#316ac5] hover:text-white px-2 cursor-default">{t('network.menuView')}</span><span className="hover:bg-[#316ac5] hover:text-white px-2 cursor-default">{t('network.menuTools')}</span></>}
    >
      <div className="bg-white h-full overflow-y-auto border border-gray-400 m-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#e8e4d8] to-[#d6d2c2] border-b p-2 flex justify-between items-center">
          <span className="text-[11px] font-bold text-gray-700">{t('network.topologyNodes', { count: nodes.length })}</span>
          <span className="text-[10px] text-gray-500">
            {t('network.blockedIPs')}: {blockedIPs.length}
          </span>
        </div>

        {/* Node grid */}
        <div className="p-3 grid grid-cols-2 gap-2">
          {nodes.map(node => {
            const isTarget = node.id === currentTargetNodeId;
            const isBlocked = blockedIPs.includes(node.ip);

            return (
              <div 
                key={node.id}
                className={`border rounded p-2 text-[10px] transition-all ${
                  node.status === 'compromised' ? 'border-red-400 bg-red-50' :
                  node.status === 'probing' ? 'border-yellow-400 bg-yellow-50' :
                  'border-gray-300 bg-white'
                } ${isTarget ? 'ring-2 ring-red-500 ring-offset-1' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full border ${getStatusColor(node.status)}`} />
                  <span className="font-bold text-[11px]">{node.name}</span>
                </div>
                <div className="text-gray-500 space-y-[1px]">
                  <div>IP: <span className="font-mono">{node.ip}</span> {isBlocked && <span className="text-red-500 font-bold">🚫 BLOCKED</span>}</div>
                  <div>ID: <span className="font-mono">{node.id}</span></div>
                  <div>Status: {getStatusLabel(node.status)}</div>
                  <div>{t('network.security')}: {'🔒'.repeat(node.difficulty)}{'🔓'.repeat(Math.max(0, 5 - node.difficulty))}</div>
                  {node.firewalled && <div className="text-blue-600">{t('network.firewalled')}</div>}
                </div>

                {/* Bruteforce progress bar */}
                {isTarget && (
                  <div className="mt-1">
                    <div className="text-red-600 font-bold text-[9px] animate-pulse">
                      {t('network.bruteForce')}
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded mt-1">
                      <div 
                        className="h-full bg-red-500 rounded transition-all duration-1000 animate-pulse"
                        style={{ width: `${bruteforceProgress}%` }}
                      />
                    </div>
                    <div className="text-[8px] text-right text-red-400">{bruteforceProgress.toFixed(0)}%</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </XPWindow>
  );
};

export default NetworkMapApp;
