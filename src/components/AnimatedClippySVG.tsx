import React, { useState, useEffect } from 'react';

export type ClippyExpression = 'idle' | 'thinking' | 'happy' | 'worried' | 'wink' | 'alert';

interface AnimatedClippySVGProps {
  expression?: ClippyExpression;
  size?: number;
}

const AnimatedClippySVG: React.FC<AnimatedClippySVGProps> = ({ expression = 'idle', size = 64 }) => {
  const [blinkPhase, setBlinkPhase] = useState(false);
  const [bouncePhase, setBouncePhase] = useState(0);

  // Blink every 3-5 seconds
  useEffect(() => {
    const blink = () => {
      setBlinkPhase(true);
      setTimeout(() => setBlinkPhase(false), 150);
    };
    const interval = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Idle bounce animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBouncePhase(p => (p + 1) % 60);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const bounce = Math.sin(bouncePhase / 60 * Math.PI * 2) * 2;
  const wiggle = Math.sin(bouncePhase / 30 * Math.PI * 2) * (expression === 'alert' ? 4 : 1);

  // Eye parameters based on expression
  const getEyes = () => {
    if (blinkPhase && expression !== 'wink') {
      return { leftEye: 'line', rightEye: 'line' };
    }
    switch (expression) {
      case 'happy':
        return { leftEye: 'arc-up', rightEye: 'arc-up' };
      case 'worried':
        return { leftEye: 'wide', rightEye: 'wide' };
      case 'wink':
        return { leftEye: 'dot', rightEye: 'line' };
      case 'thinking':
        return { leftEye: 'look-up', rightEye: 'look-up' };
      case 'alert':
        return { leftEye: 'wide', rightEye: 'wide' };
      default:
        return { leftEye: 'dot', rightEye: 'dot' };
    }
  };

  const getMouth = () => {
    switch (expression) {
      case 'happy': return 'smile';
      case 'worried': return 'frown';
      case 'alert': return 'open';
      case 'thinking': return 'flat';
      case 'wink': return 'smile';
      default: return 'neutral';
    }
  };

  const eyes = getEyes();
  const mouth = getMouth();

  const renderEye = (type: string, cx: number, cy: number) => {
    switch (type) {
      case 'line':
        return <line x1={cx - 3} y1={cy} x2={cx + 3} y2={cy} stroke="#333" strokeWidth="2" strokeLinecap="round" />;
      case 'arc-up':
        return <path d={`M${cx - 3} ${cy} Q${cx} ${cy - 4} ${cx + 3} ${cy}`} stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />;
      case 'wide':
        return (
          <>
            <circle cx={cx} cy={cy} r={4} fill="white" stroke="#333" strokeWidth="1" />
            <circle cx={cx} cy={cy} r={2} fill="#333" />
          </>
        );
      case 'look-up':
        return (
          <>
            <circle cx={cx} cy={cy} r={3} fill="white" stroke="#333" strokeWidth="1" />
            <circle cx={cx} cy={cy - 1} r={1.5} fill="#333" />
          </>
        );
      default: // dot
        return <circle cx={cx} cy={cy} r={2.5} fill="#333" />;
    }
  };

  const renderMouth = () => {
    const mx = 32;
    const my = 46;
    switch (mouth) {
      case 'smile':
        return <path d={`M${mx - 5} ${my - 1} Q${mx} ${my + 5} ${mx + 5} ${my - 1}`} stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />;
      case 'frown':
        return <path d={`M${mx - 4} ${my + 2} Q${mx} ${my - 3} ${mx + 4} ${my + 2}`} stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />;
      case 'open':
        return <ellipse cx={mx} cy={my} rx={3} ry={4} fill="#333" />;
      case 'flat':
        return <line x1={mx - 4} y1={my} x2={mx + 4} y2={my} stroke="#333" strokeWidth="1.5" strokeLinecap="round" />;
      default: // neutral
        return <path d={`M${mx - 4} ${my} Q${mx} ${my + 2} ${mx + 4} ${my}`} stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />;
    }
  };

  // Color accents based on expression
  const bodyColor = expression === 'alert' ? '#ffcccc' :
                    expression === 'worried' ? '#fff3cd' :
                    '#e8e8e8';
  const clipColor = expression === 'alert' ? '#cc4444' :
                    expression === 'happy' ? '#44aa44' :
                    '#888';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={{ transform: `translateY(${bounce}px) rotate(${wiggle}deg)` }}
    >
      {/* Paperclip body - stylized */}
      <g>
        {/* Outer clip wire */}
        <path
          d="M20 58 C10 58, 6 50, 6 40 L6 20 C6 10, 14 4, 24 4 L40 4 C50 4, 58 10, 58 20 L58 40"
          fill="none"
          stroke={clipColor}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Inner clip return */}
        <path
          d="M46 40 L46 20 C46 14, 42 10, 36 10 L28 10 C22 10, 18 14, 18 20 L18 48"
          fill="none"
          stroke={clipColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.3"
        />
      </g>

      {/* Face background (round head) */}
      <ellipse cx="32" cy="36" rx="18" ry="20" fill={bodyColor} stroke="#aaa" strokeWidth="1" />

      {/* Eyebrows */}
      {expression === 'worried' && (
        <>
          <line x1="22" y1="26" x2="27" y2="28" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="42" y1="26" x2="37" y2="28" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {expression === 'alert' && (
        <>
          <line x1="22" y1="24" x2="28" y2="26" stroke="#c00" strokeWidth="2" strokeLinecap="round" />
          <line x1="42" y1="24" x2="36" y2="26" stroke="#c00" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {expression === 'thinking' && (
        <>
          <line x1="24" y1="27" x2="28" y2="26" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="40" y1="26" x2="36" y2="27" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}

      {/* Eyes */}
      {renderEye(eyes.leftEye, 26, 34)}
      {renderEye(eyes.rightEye, 38, 34)}

      {/* Nose - tiny */}
      <circle cx="32" cy="40" r="1" fill="#bbb" />

      {/* Mouth */}
      {renderMouth()}

      {/* Cheek blush for happy */}
      {expression === 'happy' && (
        <>
          <circle cx="20" cy="40" r="4" fill="#ffaaaa" opacity="0.4" />
          <circle cx="44" cy="40" r="4" fill="#ffaaaa" opacity="0.4" />
        </>
      )}

      {/* Alert exclamation */}
      {expression === 'alert' && (
        <g>
          <text x="50" y="16" fontSize="14" fill="#ff0000" fontWeight="bold">!</text>
        </g>
      )}

      {/* Thinking bubble */}
      {expression === 'thinking' && (
        <g opacity="0.6">
          <circle cx="50" cy="14" r="3" fill="#ddd" stroke="#aaa" strokeWidth="0.5" />
          <circle cx="54" cy="8" r="2" fill="#ddd" stroke="#aaa" strokeWidth="0.5" />
          <circle cx="56" cy="4" r="1.5" fill="#ddd" stroke="#aaa" strokeWidth="0.5" />
        </g>
      )}
    </svg>
  );
};

export default AnimatedClippySVG;
