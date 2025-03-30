// LoadingPage.js
import React, { useState, useEffect } from 'react';
import './LoadingPage.css';

const LoadingPage = ({ onLoadingComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    // Start the fade-out effect after 4.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 4500);
    
    // Complete loading after 5 seconds
    const loadingTimer = setTimeout(() => {
      onLoadingComplete();
    }, 5000);
    
    // Clean up timers on unmount
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(loadingTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div className={`loading-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loader-content">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" className="bible-graph-animation">
          {/* App Name moved to top */}
          <text x="400" y="80" fontFamily="'Playfair Display', serif" fontSize="28" fontWeight="500" textAnchor="middle" fill="#333333" opacity="0">
            Echoes of Logos
            <animate attributeName="opacity" values="0;1" dur="1s" begin="0.5s" fill="freeze" />
          </text>
          
          {/* Central Bible Book */}
          <g className="bible-group" transform="translate(400, 250)">
            <g className="bible-icon">
              {/* Back cover shadow */}
              <rect x="-35" y="-45" width="70" height="90" rx="3" ry="3" fill="#e0e0e0" />
              
              {/* Front cover */}
              <rect x="-40" y="-50" width="70" height="90" rx="3" ry="3" fill="#f8f8f8" stroke="#d0d0d0" strokeWidth="1" />
              
              {/* Book spine */}
              <rect x="-45" y="-50" width="10" height="90" rx="1" ry="1" fill="#e3e3e3" stroke="#d0d0d0" strokeWidth="1" />
              
              {/* Book pages - right side curved */}
              <path d="M -38 -48 L 28 -48 Q 30 -35, 28 -20 Q 30 0, 28 20 Q 30 35, 28 48 L -38 48 Z" 
                    fill="#fff" stroke="#f0f0f0" strokeWidth="0.5" />
              
              {/* Page edge gradient */}
              <rect x="28" y="-48" width="2" height="96" fill="#eee" />
              
              {/* Text lines inside */}
              <line x1="-30" y1="-35" x2="20" y2="-35" stroke="#e5e5e5" strokeWidth="1" />
              <line x1="-30" y1="-25" x2="20" y2="-25" stroke="#e5e5e5" strokeWidth="1" />
              <line x1="-30" y1="-15" x2="20" y2="-15" stroke="#e5e5e5" strokeWidth="1" />
              <line x1="-30" y1="-5" x2="20" y2="-5" stroke="#e5e5e5" strokeWidth="1" />
              <line x1="-30" y1="5" x2="20" y2="5" stroke="#e5e5e5" strokeWidth="1" />
              <line x1="-30" y1="15" x2="20" y2="15" stroke="#e5e5e5" strokeWidth="1" />
              <line x1="-30" y1="25" x2="20" y2="25" stroke="#e5e5e5" strokeWidth="1" />
              <line x1="-30" y1="35" x2="20" y2="35" stroke="#e5e5e5" strokeWidth="1" />
              
              {/* Simple decorative element on cover */}
              <rect x="-25" y="-35" width="40" height="1" rx="0.5" fill="#e0e0e0" />
              <rect x="-25" y="-30" width="30" height="1" rx="0.5" fill="#e0e0e0" />
              <rect x="-25" y="-25" width="35" height="1" rx="0.5" fill="#e0e0e0" />
            </g>
          </g>
          
          {/* Connection Nodes - Now more books and larger circles */}
          <g className="connection-nodes">
            {/* Genesis - Blue */}
            <circle className="node" cx="650" cy="130" r="0" fill="#1A73E8">
              <animate attributeName="r" values="0;22" dur="0.8s" begin="0.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;1" dur="0.8s" begin="0.2s" fill="freeze" />
            </circle>
            <text x="650" y="130" className="node-label" textAnchor="middle" alignmentBaseline="middle" 
                  fill="#FFFFFF" fontSize="12" fontFamily="Arial" fontWeight="bold" opacity="0">
              Genesis
              <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1s" fill="freeze" />
            </text>
            
            {/* Exodus - Teal */}
            <circle className="node" cx="700" cy="220" r="0" fill="#009688">
              <animate attributeName="r" values="0;20" dur="0.8s" begin="0.4s" fill="freeze" />
              <animate attributeName="opacity" values="0;1" dur="0.8s" begin="0.4s" fill="freeze" />
            </circle>
            <text x="700" y="220" className="node-label" textAnchor="middle" alignmentBaseline="middle" 
                  fill="#FFFFFF" fontSize="12" fontFamily="Arial" fontWeight="bold" opacity="0">
              Exodus
              <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.2s" fill="freeze" />
            </text>
            
            {/* Psalms - Purple */}
            <circle className="node" cx="680" cy="310" r="0" fill="#9C27B0">
              <animate attributeName="r" values="0;21" dur="0.8s" begin="0.6s" fill="freeze" />
              <animate attributeName="opacity" values="0;1" dur="0.8s" begin="0.6s" fill="freeze" />
            </circle>
            <text x="680" y="310" className="node-label" textAnchor="middle" alignmentBaseline="middle" 
                  fill="#FFFFFF" fontSize="12" fontFamily="Arial" fontWeight="bold" opacity="0">
              Psalms
              <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.4s" fill="freeze" />
            </text>
            
            {/* Samuel - Orange */}
            <circle className="node" cx="600" cy="380" r="0" fill="#FF5722">
              <animate attributeName="r" values="0;19" dur="0.8s" begin="0.8s" fill="freeze" />
              <animate attributeName="opacity" values="0;1" dur="0.8s" begin="0.8s" fill="freeze" />
            </circle>
            <text x="600" y="380" className="node-label" textAnchor="middle" alignmentBaseline="middle" 
                  fill="#FFFFFF" fontSize="12" fontFamily="Arial" fontWeight="bold" opacity="0">
              Samuel
              <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.6s" fill="freeze" />
            </text>
            
            {/* Isaiah - Deep Purple */}
            <circle className="node" cx="500" cy="420" r="0" fill="#673AB7">
              <animate attributeName="r" values="0;18" dur="0.8s" begin="1s" fill="freeze" />
              <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1s" fill="freeze" />
            </circle>
            <text x="500" y="420" className="node-label" textAnchor="middle" alignmentBaseline="middle" 
                  fill="#FFFFFF" fontSize="12" fontFamily="Arial" fontWeight="bold" opacity="0">
              Isaiah
              <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.8s" fill="freeze" />
            </text>
            
            {/* Proverbs - Indigo */}
            <circle className="node" cx="380" cy="430" r="0" fill="#3F51B5">
              <animate attributeName="r" values="0;20" dur="0.8s" begin="1.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1.2s" fill="freeze" />
            </circle>
            <text x="380" y="430" className="node-label" textAnchor="middle" alignmentBaseline="middle" 
                  fill="#FFFFFF" fontSize="12" fontFamily="Arial" fontWeight="bold" opacity="0">
              Proverbs
              <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2s" fill="freeze" />
            </text>
            
            {/* Judges - Amber */}
            <circle className="node" cx="260" cy="410" r="0" fill="#FFC107">
              <animate attributeName="r" values="0;17" dur="0.8s" begin="1.4s" fill="freeze" />
              <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1.4s" fill="freeze" />
            </circle>
            <text x="260" y="410" className="node-label" textAnchor="middle" alignmentBaseline="middle" 
                  fill="#FFFFFF" fontSize="12" fontFamily="Arial" fontWeight="bold" opacity="0">
              Judges
              <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2.2s" fill="freeze" />
            </text>
            
            {/* John - Green */}
            <circle className="node" cx="170" cy="350" r="0" fill="#4CAF50">
              <animate attributeName="r" values="0;19" dur="0.8s" begin="1.6s" fill="freeze" />
              <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1.6s" fill="freeze" />
            </circle>
            <text x="170" y="350" className="node-label" textAnchor="middle" alignmentBaseline="middle" 
                  fill="#FFFFFF" fontSize="12" fontFamily="Arial" fontWeight="bold" opacity="0">
              John
              <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2.4s" fill="freeze" />
            </text>
            
            {/* Luke - Dark Green */}
            <circle className="node" cx="120" cy="250" r="0" fill="#3F9142">
              <animate attributeName="r" values="0;18" dur="0.8s" begin="1.8s" fill="freeze" />
              <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1.8s" fill="freeze" />
            </circle>
            <text x="120" y="250" className="node-label" textAnchor="middle" alignmentBaseline="middle" 
                  fill="#FFFFFF" fontSize="12" fontFamily="Arial" fontWeight="bold" opacity="0">
              Luke
              <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2.6s" fill="freeze" />
            </text>
            
            {/* Romans - Red */}
            <circle className="node" cx="140" cy="160" r="0" fill="#F44336">
              <animate attributeName="r" values="0;20" dur="0.8s" begin="2s" fill="freeze" />
              <animate attributeName="opacity" values="0;1" dur="0.8s" begin="2s" fill="freeze" />
            </circle>
            <text x="140" y="160" className="node-label" textAnchor="middle" alignmentBaseline="middle" 
                  fill="#FFFFFF" fontSize="12" fontFamily="Arial" fontWeight="bold" opacity="0">
              Romans
              <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2.8s" fill="freeze" />
            </text>
            
            {/* Revelation - Deep Orange */}
            <circle className="node" cx="220" cy="100" r="0" fill="#FF5722">
              <animate attributeName="r" values="0;21" dur="0.8s" begin="2.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;1" dur="0.8s" begin="2.2s" fill="freeze" />
            </circle>
            <text x="220" y="100" className="node-label" textAnchor="middle" alignmentBaseline="middle" 
                  fill="#FFFFFF" fontSize="12" fontFamily="Arial" fontWeight="bold" opacity="0">
              Revelation
              <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3s" fill="freeze" />
            </text>
          </g>
          
          {/* Connection Lines */}
          <g className="connection-lines">
            {/* Genesis Connection */}
            <path d="M 400 250 L 400 250" stroke="#1A73E8" strokeWidth="2" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 650 130" dur="1.2s" begin="0.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.2s" begin="0.2s" fill="freeze" />
            </path>
            
            {/* Exodus Connection */}
            <path d="M 400 250 L 400 250" stroke="#009688" strokeWidth="2" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 700 220" dur="1.2s" begin="0.4s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.2s" begin="0.4s" fill="freeze" />
            </path>
            
            {/* Psalms Connection */}
            <path d="M 400 250 L 400 250" stroke="#9C27B0" strokeWidth="2" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 680 310" dur="1.2s" begin="0.6s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.2s" begin="0.6s" fill="freeze" />
            </path>
            
            {/* Samuel Connection */}
            <path d="M 400 250 L 400 250" stroke="#FF5722" strokeWidth="2" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 600 380" dur="1.2s" begin="0.8s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.2s" begin="0.8s" fill="freeze" />
            </path>
            
            {/* Isaiah Connection */}
            <path d="M 400 250 L 400 250" stroke="#673AB7" strokeWidth="2" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 500 420" dur="1.2s" begin="1s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.2s" begin="1s" fill="freeze" />
            </path>
            
            {/* Proverbs Connection */}
            <path d="M 400 250 L 400 250" stroke="#3F51B5" strokeWidth="2" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 380 430" dur="1.2s" begin="1.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.2s" begin="1.2s" fill="freeze" />
            </path>
            
            {/* Judges Connection */}
            <path d="M 400 250 L 400 250" stroke="#FFC107" strokeWidth="2" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 260 410" dur="1.2s" begin="1.4s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.2s" begin="1.4s" fill="freeze" />
            </path>
            
            {/* John Connection */}
            <path d="M 400 250 L 400 250" stroke="#4CAF50" strokeWidth="2" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 170 350" dur="1.2s" begin="1.6s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.2s" begin="1.6s" fill="freeze" />
            </path>
            
            {/* Luke Connection */}
            <path d="M 400 250 L 400 250" stroke="#3F9142" strokeWidth="2" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 120 250" dur="1.2s" begin="1.8s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.2s" begin="1.8s" fill="freeze" />
            </path>
            
            {/* Romans Connection */}
            <path d="M 400 250 L 400 250" stroke="#F44336" strokeWidth="2" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 140 160" dur="1.2s" begin="2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.2s" begin="2s" fill="freeze" />
            </path>
            
            {/* Revelation Connection */}
            <path d="M 400 250 L 400 250" stroke="#FF5722" strokeWidth="2" opacity="0">
              <animate attributeName="d" values="M 400 250 L 400 250; M 400 250 L 220 100" dur="1.2s" begin="2.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.7" dur="1.2s" begin="2.2s" fill="freeze" />
            </path>
          </g>
          
          {/* Pulse animations along the connections */}
          <g className="pulses">
            <circle cx="400" cy="250" r="4" fill="#1A73E8" opacity="0">
              <animate attributeName="cx" values="400;650" dur="1.2s" begin="0.2s" fill="freeze" />
              <animate attributeName="cy" values="250;130" dur="1.2s" begin="0.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" begin="0.2s" fill="freeze" />
            </circle>
            
            <circle cx="400" cy="250" r="4" fill="#009688" opacity="0">
              <animate attributeName="cx" values="400;700" dur="1.2s" begin="0.4s" fill="freeze" />
              <animate attributeName="cy" values="250;220" dur="1.2s" begin="0.4s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" begin="0.4s" fill="freeze" />
            </circle>
            
            <circle cx="400" cy="250" r="4" fill="#9C27B0" opacity="0">
              <animate attributeName="cx" values="400;680" dur="1.2s" begin="0.6s" fill="freeze" />
              <animate attributeName="cy" values="250;310" dur="1.2s" begin="0.6s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" begin="0.6s" fill="freeze" />
            </circle>
            
            <circle cx="400" cy="250" r="4" fill="#FF5722" opacity="0">
              <animate attributeName="cx" values="400;600" dur="1.2s" begin="0.8s" fill="freeze" />
              <animate attributeName="cy" values="250;380" dur="1.2s" begin="0.8s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" begin="0.8s" fill="freeze" />
            </circle>
            
            <circle cx="400" cy="250" r="4" fill="#673AB7" opacity="0">
              <animate attributeName="cx" values="400;500" dur="1.2s" begin="1s" fill="freeze" />
              <animate attributeName="cy" values="250;420" dur="1.2s" begin="1s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" begin="1s" fill="freeze" />
            </circle>
            
            <circle cx="400" cy="250" r="4" fill="#3F51B5" opacity="0">
              <animate attributeName="cx" values="400;380" dur="1.2s" begin="1.2s" fill="freeze" />
              <animate attributeName="cy" values="250;430" dur="1.2s" begin="1.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" begin="1.2s" fill="freeze" />
            </circle>
            
            <circle cx="400" cy="250" r="4" fill="#FFC107" opacity="0">
              <animate attributeName="cx" values="400;260" dur="1.2s" begin="1.4s" fill="freeze" />
              <animate attributeName="cy" values="250;410" dur="1.2s" begin="1.4s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" begin="1.4s" fill="freeze" />
            </circle>
            
            <circle cx="400" cy="250" r="4" fill="#4CAF50" opacity="0">
              <animate attributeName="cx" values="400;170" dur="1.2s" begin="1.6s" fill="freeze" />
              <animate attributeName="cy" values="250;350" dur="1.2s" begin="1.6s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" begin="1.6s" fill="freeze" />
            </circle>
            
            <circle cx="400" cy="250" r="4" fill="#3F9142" opacity="0">
              <animate attributeName="cx" values="400;120" dur="1.2s" begin="1.8s" fill="freeze" />
              <animate attributeName="cy" values="250;250" dur="1.2s" begin="1.8s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" begin="1.8s" fill="freeze" />
            </circle>
            
            <circle cx="400" cy="250" r="4" fill="#F44336" opacity="0">
              <animate attributeName="cx" values="400;140" dur="1.2s" begin="2s" fill="freeze" />
              <animate attributeName="cy" values="250;160" dur="1.2s" begin="2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" begin="2s" fill="freeze" />
            </circle>
            
            <circle cx="400" cy="250" r="4" fill="#FF5722" opacity="0">
              <animate attributeName="cx" values="400;220" dur="1.2s" begin="2.2s" fill="freeze" />
              <animate attributeName="cy" values="250;100" dur="1.2s" begin="2.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" begin="2.2s" fill="freeze" />
            </circle>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default LoadingPage;