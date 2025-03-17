// LoadingPage.js
import React, { useState, useEffect } from 'react';
import './LoadingPage.css';

const LoadingPage = ({ onLoadingComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    // Start the fade-out effect after 3.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3500);
    
    // Complete loading after 4 seconds (giving time for the animation to play fully)
    const loadingTimer = setTimeout(() => {
      onLoadingComplete();
    }, 4000);
    
    // Clean up timers on unmount
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(loadingTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div className={`loading-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="bible-animation-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" className="bible-graph-animation">
          {/* Background gradient */}
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a2463" />
              <stop offset="100%" stopColor="#1e50a2" />
            </linearGradient>
            
            {/* Filter for glow effects */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Radial gradient for center glow */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Background */}
          <rect width="800" height="500" fill="url(#bgGradient)" />
          
          {/* Open Bible in the center */}
          <g id="bible" transform="translate(400, 250)">
            {/* Left page */}
            <path d="M -140 -100 C -120 -110, -80 -120, -5 -110 L -5 110 C -80 100, -120 90, -140 100 Z" 
                  fill="#F0EDE5" stroke="#D4D4F5" strokeWidth="1" />
            {/* Right page */}
            <path d="M 5 -110 C 80 -120, 120 -110, 140 -100 L 140 100 C 120 90, 80 100, 5 110 Z" 
                  fill="#F0EDE5" stroke="#D4D4F5" strokeWidth="1" />
            
            {/* Center binding */}
            <path d="M -5 -110 C -3 -110, 3 -110, 5 -110 L 5 110 C 3 110, -3 110, -5 110 Z" 
                  fill="#966F33" stroke="#634b23" strokeWidth="1" />
            
            {/* Text lines on left page */}
            <line x1="-120" y1="-70" x2="-20" y2="-70" stroke="#8B8B8B" strokeWidth="1" />
            <line x1="-120" y1="-50" x2="-20" y2="-50" stroke="#8B8B8B" strokeWidth="1" />
            <line x1="-120" y1="-30" x2="-20" y2="-30" stroke="#8B8B8B" strokeWidth="1" />
            <line x1="-120" y1="-10" x2="-20" y2="-10" stroke="#8B8B8B" strokeWidth="1" />
            <line x1="-120" y1="10" x2="-20" y2="10" stroke="#8B8B8B" strokeWidth="1" />
            <line x1="-120" y1="30" x2="-20" y2="30" stroke="#8B8B8B" strokeWidth="1" />
            <line x1="-120" y1="50" x2="-20" y2="50" stroke="#8B8B8B" strokeWidth="1" />
            <line x1="-120" y1="70" x2="-20" y2="70" stroke="#8B8B8B" strokeWidth="1" />
            
            {/* Text lines on right page */}
            <line x1="20" y1="-70" x2="120" y2="-70" stroke="#8B8B8B" strokeWidth="1" />
            <line x1="20" y1="-50" x2="120" y2="-50" stroke="#8B8B8B" strokeWidth="1" />
            <line x1="20" y1="-30" x2="120" y2="-30" stroke="#8B8B8B" strokeWidth="1" />
            <line x1="20" y1="-10" x2="120" y2="-10" stroke="#8B8B8B" strokeWidth="1" />
            <line x1="20" y1="10" x2="120" y2="10" stroke="#8B8B8B" strokeWidth="1" />
            <line x1="20" y1="30" x2="120" y2="30" stroke="#8B8B8B" strokeWidth="1" />
            <line x1="20" y1="50" x2="120" y2="50" stroke="#8B8B8B" strokeWidth="1" />
            <line x1="20" y1="70" x2="120" y2="70" stroke="#8B8B8B" strokeWidth="1" />
            
            {/* Glowing center */}
            <circle cx="0" cy="0" r="30" fill="url(#centerGlow)" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
              <animate attributeName="r" values="25;35;25" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
          
          {/* Edge lines from Bible center to nodes */}
          <g id="edges">
            {/* Edge 1 (to top right) */}
            <path id="edge1" d="M 400 250 L 400 250" stroke="#FFFFFF" strokeWidth="1.5" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 550 150" dur="1.5s" begin="0.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.5s" begin="0.2s" fill="freeze" />
            </path>
            
            {/* Edge 2 (to far right) */}
            <path id="edge2" d="M 400 250 L 400 250" stroke="#FFFFFF" strokeWidth="1.5" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 650 250" dur="1.8s" begin="0.5s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.8s" begin="0.5s" fill="freeze" />
            </path>
            
            {/* Edge 3 (to bottom right) */}
            <path id="edge3" d="M 400 250 L 400 250" stroke="#FFFFFF" strokeWidth="1.5" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 550 350" dur="1.6s" begin="0.8s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.6s" begin="0.8s" fill="freeze" />
            </path>
            
            {/* Edge 4 (to top left) */}
            <path id="edge4" d="M 400 250 L 400 250" stroke="#FFFFFF" strokeWidth="1.5" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 250 150" dur="1.7s" begin="1.1s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.7s" begin="1.1s" fill="freeze" />
            </path>
            
            {/* Edge 5 (to far left) */}
            <path id="edge5" d="M 400 250 L 400 250" stroke="#FFFFFF" strokeWidth="1.5" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 150 250" dur="1.9s" begin="1.4s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.9s" begin="1.4s" fill="freeze" />
            </path>
            
            {/* Edge 6 (to bottom left) */}
            <path id="edge6" d="M 400 250 L 400 250" stroke="#FFFFFF" strokeWidth="1.5" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 250 350" dur="1.5s" begin="1.7s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.5s" begin="1.7s" fill="freeze" />
            </path>
          </g>
          
          {/* Nodes that grow as edges reach them */}
          <g id="nodes">
            {/* Node 1 (top right) */}
            <circle id="node1" cx="550" cy="150" r="0" fill="#FFFFFF" opacity="0.1">
              <animate attributeName="r" values="0;15" dur="0.5s" begin="1.7s" fill="freeze" />
              <animate attributeName="opacity" values="0.1;0.9;0.6" dur="3s" begin="1.7s" repeatCount="indefinite" />
            </circle>
            
            {/* Node 2 (far right) */}
            <circle id="node2" cx="650" cy="250" r="0" fill="#FFFFFF" opacity="0.1">
              <animate attributeName="r" values="0;18" dur="0.5s" begin="2.3s" fill="freeze" />
              <animate attributeName="opacity" values="0.1;0.9;0.6" dur="3s" begin="2.3s" repeatCount="indefinite" />
            </circle>
            
            {/* Node 3 (bottom right) */}
            <circle id="node3" cx="550" cy="350" r="0" fill="#FFFFFF" opacity="0.1">
              <animate attributeName="r" values="0;12" dur="0.5s" begin="2.4s" fill="freeze" />
              <animate attributeName="opacity" values="0.1;0.9;0.6" dur="3s" begin="2.4s" repeatCount="indefinite" />
            </circle>
            
            {/* Node 4 (top left) */}
            <circle id="node4" cx="250" cy="150" r="0" fill="#FFFFFF" opacity="0.1">
              <animate attributeName="r" values="0;14" dur="0.5s" begin="2.8s" fill="freeze" />
              <animate attributeName="opacity" values="0.1;0.9;0.6" dur="3s" begin="2.8s" repeatCount="indefinite" />
            </circle>
            
            {/* Node 5 (far left) */}
            <circle id="node5" cx="150" cy="250" r="0" fill="#FFFFFF" opacity="0.1">
              <animate attributeName="r" values="0;16" dur="0.5s" begin="3.3s" fill="freeze" />
              <animate attributeName="opacity" values="0.1;0.9;0.6" dur="3s" begin="3.3s" repeatCount="indefinite" />
            </circle>
            
            {/* Node 6 (bottom left) */}
            <circle id="node6" cx="250" cy="350" r="0" fill="#FFFFFF" opacity="0.1">
              <animate attributeName="r" values="0;13" dur="0.5s" begin="3.2s" fill="freeze" />
              <animate attributeName="opacity" values="0.1;0.9;0.6" dur="3s" begin="3.2s" repeatCount="indefinite" />
            </circle>
          </g>
          
          {/* Small pulses traveling from Bible to nodes */}
          <g id="pulses">
            {/* Pulse 1 (to top right) */}
            <circle id="pulse1" cx="400" cy="250" r="3" fill="#FFFFFF" opacity="0">
              <animate attributeName="cx" values="400;550" dur="1.5s" begin="0.2s" fill="freeze" />
              <animate attributeName="cy" values="250;150" dur="1.5s" begin="0.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.9;0" dur="1.5s" begin="0.2s" fill="freeze" />
            </circle>
            
            {/* Pulse 2 (to far right) */}
            <circle id="pulse2" cx="400" cy="250" r="3" fill="#FFFFFF" opacity="0">
              <animate attributeName="cx" values="400;650" dur="1.8s" begin="0.5s" fill="freeze" />
              <animate attributeName="cy" values="250;250" dur="1.8s" begin="0.5s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.9;0" dur="1.8s" begin="0.5s" fill="freeze" />
            </circle>
            
            {/* Pulse 3 (to bottom right) */}
            <circle id="pulse3" cx="400" cy="250" r="3" fill="#FFFFFF" opacity="0">
              <animate attributeName="cx" values="400;550" dur="1.6s" begin="0.8s" fill="freeze" />
              <animate attributeName="cy" values="250;350" dur="1.6s" begin="0.8s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.9;0" dur="1.6s" begin="0.8s" fill="freeze" />
            </circle>
            
            {/* Pulse 4 (to top left) */}
            <circle id="pulse4" cx="400" cy="250" r="3" fill="#FFFFFF" opacity="0">
              <animate attributeName="cx" values="400;250" dur="1.7s" begin="1.1s" fill="freeze" />
              <animate attributeName="cy" values="250;150" dur="1.7s" begin="1.1s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.9;0" dur="1.7s" begin="1.1s" fill="freeze" />
            </circle>
            
            {/* Pulse 5 (to far left) */}
            <circle id="pulse5" cx="400" cy="250" r="3" fill="#FFFFFF" opacity="0">
              <animate attributeName="cx" values="400;150" dur="1.9s" begin="1.4s" fill="freeze" />
              <animate attributeName="cy" values="250;250" dur="1.9s" begin="1.4s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.9;0" dur="1.9s" begin="1.4s" fill="freeze" />
            </circle>
            
            {/* Pulse 6 (to bottom left) */}
            <circle id="pulse6" cx="400" cy="250" r="3" fill="#FFFFFF" opacity="0">
              <animate attributeName="cx" values="400;250" dur="1.5s" begin="1.7s" fill="freeze" />
              <animate attributeName="cy" values="250;350" dur="1.5s" begin="1.7s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.9;0" dur="1.5s" begin="1.7s" fill="freeze" />
            </circle>
          </g>
          
          {/* Application Title */}
          <text x="400" y="430" fontFamily="'Cinzel', serif" fontSize="30" textAnchor="middle" fill="#FFFFFF" filter="url(#glow)">Echoes of Logos</text>
        </svg>
      </div>
    </div>
  );
};

export default LoadingPage;