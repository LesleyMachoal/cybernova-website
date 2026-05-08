import React, { useState, useEffect } from 'react';
import './TerminalAnimation.css';

const terminalLines = [
  { type: 'command', text: '$ cybernova-security-server --start' },
  { type: 'output', text: 'Initializing CyberNova Security Engine...' },
  { type: 'output', text: '[INFO] Loading threat detection models' },
  { type: 'output', text: '[INFO] Connecting to global threat feed' },
  { type: 'output', text: '[INFO] Starting 24/7 monitoring service' },
  { type: 'output', text: '' },
  { type: 'command', text: '$ npm run monitor' },
  { type: 'output', text: '🚀 Security monitoring started at port 5999' },
  { type: 'output', text: '[SHIELD] Firewall rules applied ✓' },
  { type: 'output', text: '[SCAN] Network intrusion detection enabled ✓' },
  { type: 'output', text: '[GUARD] Endpoint protection active ✓' },
  { type: 'output', text: '' },
  { type: 'command', text: '$ system-analytics --realtime' },
  { type: 'output', text: 'Threats detected: 127' },
  { type: 'output', text: 'Incidents contained: 3' },
  { type: 'output', text: 'Protection rate: 99.9%' },
  { type: 'output', text: '[SUCCESS] All systems operational' },
  { type: 'output', text: '' },
  { type: 'command', text: '$ > Enterprise security is live' },
];

export function TerminalAnimation() {
  const [displayedLines, setDisplayedLines] = useState(terminalLines);

  return (
    <div className="terminal-animation">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-btn red"></div>
          <div className="terminal-btn yellow"></div>
          <div className="terminal-btn green"></div>
        </div>
        <span className="terminal-title">cybernova@security-server</span>
      </div>
      <div className="terminal-content">
        {displayedLines.map((line, idx) => (
          <div key={idx} className={`terminal-line terminal-${line.type} animate-line`} style={{ animationDelay: `${idx * 0.1}s` }}>
            <span>{line.text}</span>
          </div>
        ))}
        <div className="terminal-line cursor-line">
          <span className="cursor-blink">▌</span>
        </div>
      </div>
    </div>
  );
}
