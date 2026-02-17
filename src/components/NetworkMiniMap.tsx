import React, { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';

// Network topology layout — nodes placed in a circle with connections
const NODE_RADIUS = 8;
const MAP_W = 180;
const MAP_H = 120;
const CENTER_X = MAP_W / 2;
const CENTER_Y = MAP_H / 2;
const ORBIT = 42;

// Edge definitions: which nodes connect to which (star topology via firewall)
const EDGES: [number, number][] = [
  [4, 0], // firewall → main server
  [4, 1], // firewall → database
  [4, 2], // firewall → mail server
  [0, 3], // main server → backup NAS
  [0, 5], // main server → workstation
  [1, 2], // database → mail server
];

// Extra edges for hard mode nodes
const HARD_EDGES: [number, number][] = [
  [4, 6], // firewall → DMZ Proxy
  [6, 7], // DMZ Proxy → SCADA Controller
];

const STATUS_COLORS: Record<string, string> = {
  secure: '#22c55e',
  probing: '#eab308',
  compromised: '#ef4444',
  offline: '#6b7280',
};

const NetworkMiniMap: React.FC = () => {
  const nodes = useGameStore(s => s.nodes);
  const currentTargetNodeId = useGameStore(s => s.currentTargetNodeId);
  const breachLevel = useGameStore(s => s.breachLevel);
  const language = useGameStore(s => s.language);

  // Calculate node positions in a circle
  const nodePositions = useMemo(() => {
    return nodes.map((_, i) => {
      const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      return {
        x: CENTER_X + Math.cos(angle) * ORBIT,
        y: CENTER_Y + Math.sin(angle) * ORBIT,
      };
    });
  }, [nodes.length]);

  // All edges depending on node count
  const edges = useMemo(() => {
    const base = EDGES.filter(([a, b]) => a < nodes.length && b < nodes.length);
    if (nodes.length > 6) {
      const extra = HARD_EDGES.filter(([a, b]) => a < nodes.length && b < nodes.length);
      return [...base, ...extra];
    }
    return base;
  }, [nodes.length]);

  const secureCount = nodes.filter(n => n.status === 'secure').length;
  const compromisedCount = nodes.filter(n => n.status === 'compromised').length;

  return (
    <div className="bg-black/70 backdrop-blur-sm rounded border border-green-800/60 p-1 pointer-events-auto">
      <div className="text-[8px] text-green-400 font-mono text-center mb-0.5 opacity-80">
        {language === 'uk' ? 'ТОПОЛОГІЯ' : 'TOPOLOGY'}
      </div>
      <svg width={MAP_W} height={MAP_H} className="block">
        {/* Background grid */}
        <defs>
          <pattern id="minimap-grid" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M12 0H0v12" fill="none" stroke="rgba(34,197,94,0.08)" strokeWidth="0.5" />
          </pattern>
          {/* Glow filter for active attack */}
          <filter id="attack-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Pulse animation for probing */}
          <radialGradient id="probe-pulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eab308" stopOpacity="0.6">
              <animate attributeName="stopOpacity" values="0.6;0.1;0.6" dur="1.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={MAP_W} height={MAP_H} fill="url(#minimap-grid)" />

        {/* Edges */}
        {edges.map(([a, b], i) => {
          if (!nodePositions[a] || !nodePositions[b]) return null;
          const nodeA = nodes[a];
          const nodeB = nodes[b];
          const isCompromised = nodeA?.status === 'compromised' || nodeB?.status === 'compromised';
          const isProbing = nodeA?.status === 'probing' || nodeB?.status === 'probing';
          return (
            <line
              key={`edge-${i}`}
              x1={nodePositions[a].x}
              y1={nodePositions[a].y}
              x2={nodePositions[b].x}
              y2={nodePositions[b].y}
              stroke={isCompromised ? '#ef4444' : isProbing ? '#eab308' : '#22c55e'}
              strokeWidth={isCompromised ? 1.5 : 0.8}
              strokeOpacity={isCompromised ? 0.8 : 0.3}
              strokeDasharray={isProbing ? '3,2' : undefined}
            >
              {isProbing && (
                <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite" />
              )}
            </line>
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const pos = nodePositions[i];
          if (!pos) return null;
          const isTarget = node.id === currentTargetNodeId;
          const color = STATUS_COLORS[node.status] || '#6b7280';

          return (
            <g key={node.id}>
              {/* Probe pulse ring */}
              {node.status === 'probing' && (
                <circle cx={pos.x} cy={pos.y} r={NODE_RADIUS + 6} fill="url(#probe-pulse)" />
              )}
              {/* Attack indicator */}
              {isTarget && (
                <circle
                  cx={pos.x} cy={pos.y} r={NODE_RADIUS + 4}
                  fill="none" stroke="#ef4444" strokeWidth="1"
                  filter="url(#attack-glow)"
                >
                  <animate attributeName="r" values={`${NODE_RADIUS + 2};${NODE_RADIUS + 8};${NODE_RADIUS + 2}`} dur="1s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Node circle */}
              <circle
                cx={pos.x} cy={pos.y} r={NODE_RADIUS}
                fill={color}
                fillOpacity={0.25}
                stroke={color}
                strokeWidth={isTarget ? 2 : 1.2}
              />
              {/* Firewall shield icon */}
              {node.firewalled && (
                <text x={pos.x} y={pos.y + 3} textAnchor="middle" fontSize="8" fill="#60a5fa">🛡</text>
              )}
              {/* Node label */}
              <text
                x={pos.x}
                y={pos.y + NODE_RADIUS + 8}
                textAnchor="middle"
                fontSize="6"
                fill={color}
                fontFamily="monospace"
                opacity={0.9}
              >
                {node.name.length > 10 ? node.name.slice(0, 8) + '..' : node.name}
              </text>
            </g>
          );
        })}

        {/* Center hub icon */}
        <text x={CENTER_X} y={CENTER_Y + 3} textAnchor="middle" fontSize="10" fill="rgba(34,197,94,0.3)">⬡</text>
      </svg>

      {/* Status bar */}
      <div className="flex justify-between text-[7px] font-mono px-1 mt-0.5">
        <span className="text-green-400">✓{secureCount}</span>
        <span className="text-red-400">✗{compromisedCount}</span>
        <span className={`${breachLevel > 50 ? 'text-red-400' : 'text-yellow-400'}`}>
          {breachLevel.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

export default NetworkMiniMap;
