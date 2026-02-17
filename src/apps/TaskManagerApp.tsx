import React from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';

const TaskManagerApp: React.FC = () => {
  const processes = useGameStore(s => s.processes);
  const cpuTemp = useGameStore(s => s.cpuTemp);
  const breachLevel = useGameStore(s => s.breachLevel);
  const hackerState = useGameStore(s => s.hackerState);
  const deepScan = useGameStore(s => s.upgrades.find(u => u.id === 'deep_scan')?.purchased);
  const killProcess = useGameStore(s => s.killProcess);
  const removeBreachLevel = useGameStore(s => s.removeBreachLevel);
  const addStabilityPoints = useGameStore(s => s.addStabilityPoints);
  const { t } = useTranslation();

  const visibleProcs = processes.filter(p => !p.hidden || deepScan);
  const totalCpu = visibleProcs.reduce((sum, p) => sum + p.cpu, 0);

  const handleKill = (pid: number, isMalicious: boolean) => {
    if (isMalicious) {
      killProcess(pid);
      removeBreachLevel(5);
      addStabilityPoints(5);
    }
  };

  return (
    <XPWindow windowId="taskMgr" title={t('taskMgr.title')} icon="📊" width={460} height="340px">
      <div className="h-full flex flex-col">
        {/* Tabs */}
        <div className="flex bg-[#ece9d8] border-b text-[10px]">
          <div className="px-3 py-1 bg-white border-t-2 border-t-[#0058e6] border-x border-gray-300 font-bold -mb-[1px] rounded-t">
            {t('taskMgr.processes')}
          </div>
          <div className="px-3 py-1 text-gray-500 cursor-default">{t('taskMgr.performance')}</div>
        </div>

        {/* Process table */}
        <div className="flex-1 overflow-y-auto bg-white border border-gray-400 mx-1 mt-1">
          <table className="w-full text-[10px]">
            <thead className="sticky top-0">
              <tr className="bg-[#ece9d8] border-b">
                <th className="text-left px-2 py-1 border-r font-normal">{t('taskMgr.imageName')}</th>
                <th className="text-right px-2 py-1 border-r font-normal w-12">{t('taskMgr.pid')}</th>
                <th className="text-right px-2 py-1 border-r font-normal w-12">{t('taskMgr.cpu')}</th>
                <th className="text-right px-2 py-1 border-r font-normal w-16">{t('taskMgr.mem')}</th>
                <th className="text-center px-1 py-1 font-normal w-10"></th>
              </tr>
            </thead>
            <tbody>
              {visibleProcs.map((proc) => (
                <tr 
                  key={proc.pid} 
                  className={`border-b border-gray-100 hover:bg-[#e8e4d8] ${
                    proc.isMalicious ? 'bg-red-50 text-red-700 font-bold' : ''
                  }`}
                >
                  <td className="px-2 py-[2px] border-r">
                    {proc.isMalicious && <span className="mr-1">⚠️</span>}
                    {proc.name}
                    {proc.hidden && <span className="text-yellow-500 ml-1 text-[8px]">{t('taskMgr.hidden')}</span>}
                  </td>
                  <td className="text-right px-2 py-[2px] border-r font-mono">{proc.pid}</td>
                  <td className={`text-right px-2 py-[2px] border-r ${proc.cpu > 30 ? 'text-red-500 font-bold' : ''}`}>
                    {proc.cpu}%
                  </td>
                  <td className="text-right px-2 py-[2px] border-r">{proc.mem}</td>
                  <td className="text-center px-1 py-[2px]">
                    {proc.isMalicious && (
                      <button 
                        onClick={() => handleKill(proc.pid, true)}
                        className="text-red-600 hover:text-red-800 text-[8px] font-bold border border-red-300 rounded px-1 hover:bg-red-100"
                      >
                        {t('taskMgr.end')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer stats */}
        <div className="flex justify-between items-center mx-1 mb-1 mt-1 text-[9px] text-gray-600 bg-[#f5f3ed] border rounded px-2 py-1">
          <span>{t('taskMgr.processCount')}: {visibleProcs.length}</span>
          <span>{t('taskMgr.cpu')}: {Math.min(100, totalCpu)}%</span>
          <span className={cpuTemp > 70 ? 'text-red-500 font-bold animate-pulse' : ''}>
            {t('taskMgr.temp')}: {cpuTemp.toFixed(0)}°C
          </span>
          <span className={breachLevel > 50 ? 'text-red-500 font-bold' : ''}>
            {t('taskMgr.breach')}: {breachLevel.toFixed(1)}%
          </span>
          <span className={`font-bold ${
            hackerState === 'ATTACK' ? 'text-red-500' : 
            hackerState === 'RECON' ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {t('taskMgr.ai')}: {hackerState}
          </span>
        </div>
      </div>
    </XPWindow>
  );
};

export default TaskManagerApp;
