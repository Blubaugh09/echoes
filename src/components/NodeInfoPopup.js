import React, { useState, useEffect, useRef } from 'react';
import { X, Book, ArrowRight } from 'lucide-react';

const NodeInfoPopup = ({ node, onClose, onNavigate, isDarkMode, getTypeColor }) => {
  const [position, setPosition] = useState({ left: node.x + 20, top: node.y - 20 });
  const [isCentered, setIsCentered] = useState(false);
  const [bibleText, setBibleText] = useState('');
  const [isLoadingText, setIsLoadingText] = useState(false);
  const popupRef = useRef(null);
  
  // Fetch Bible verses when the component mounts
  useEffect(() => {
    if (node.passage && node.passage.reference) {
      fetchBibleVerses(node.passage.reference);
    }
  }, [node.passage]);

  // Adjust position when component mounts and on window resize
  useEffect(() => {
    if (!popupRef.current) return;
    
    const updatePosition = () => {
      const popup = popupRef.current;
      if (!popup) return;
      
      const rect = popup.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // For smaller screens (mobile), always center the popup
      if (viewportWidth < 768) { // 768px is the standard md breakpoint in Tailwind
        setIsCentered(true);
        return;
      }
      
      setIsCentered(false);
      
      let newLeft = node.x + 20;
      let newTop = node.y - 20;
      
      // Check if popup extends beyond right edge
      if (newLeft + rect.width > viewportWidth) {
        newLeft = node.x - rect.width - 10; // Position to the left of node
      }
      
      // If still off-screen on the left, center it
      if (newLeft < 0) {
        newLeft = Math.max(10, (viewportWidth - rect.width) / 2);
      }
      
      // Check if popup extends beyond bottom edge
      if (newTop + rect.height > viewportHeight) {
        newTop = node.y - rect.height - 10; // Position above node
      }
      
      // If still off-screen on the top, position at top of viewport
      if (newTop < 0) {
        newTop = 10;
      }
      
      setPosition({ left: newLeft, top: newTop });
    };
    
    // Run once on mount and when window is resized
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [node.x, node.y, bibleText]);

  // Function to fetch Bible verses from ESV API
  const fetchBibleVerses = async (reference) => {
    setIsLoadingText(true);
    try {
      const url = `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(reference)}&include-passage-references=false&include-verse-numbers=true&include-footnotes=false&include-short-copyright=false&include-passage-horizontal-lines=false&include-heading-horizontal-lines=false`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': 'Token c3be9ae20e39bd6637c709cd2e94fd42135764d1'
        }
      });
      
      const data = await response.json();
      
      if (data.passages && data.passages.length > 0) {
        setBibleText(data.passages[0]);
      } else {
        setBibleText("Passage not found");
      }
    } catch (error) {
      console.error('Error fetching Bible passage:', error);
      setBibleText("Error loading passage");
    } finally {
      setIsLoadingText(false);
    }
  };

  // Function to highlight Bible text with verse numbers
  const highlightBibleText = (text) => {
    if (!text) return '';
    
    // Enhanced regex to find verse numbers (e.g., [1], [2], etc.)
    const parts = text.split(/(\[\d+\])/g);
    
    return parts.map((part, index) => {
      // Check if this part is a verse number
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const verseNumber = parseInt(match[1]);
        
        return (
          <span key={index} className="inline-flex items-center justify-center w-6 h-6 rounded mx-1 text-xs font-medium" 
                style={{ color: node.passage?.bookColor || '#6366f1' }}>
            {verseNumber}
          </span>
        );
      }
      
      // Regular text part
      return <span key={index} className={isDarkMode ? 'text-white' : 'text-gray-800'}>{part}</span>;
    });
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Determine the position style
  const positionStyle = isCentered
    ? {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '90vw',
        maxHeight: '80vh',
        zIndex: 1000
      }
    : {
        position: 'absolute',
        top: position.top,
        left: position.left,
        maxWidth: '400px',
        maxHeight: '80vh',
        zIndex: 1000
      };

  if (!node) return null;
  
  const { passage, label, type } = node;
  const color = getTypeColor ? getTypeColor(type) : '#6366f1';
  
  return (
    <div
      ref={popupRef}
      style={positionStyle}
      className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden`}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
        style={{ borderLeftColor: color, borderLeftWidth: 4 }}
      >
        <h3 className={isDarkMode ? 'text-white font-medium' : 'text-gray-800 font-medium'}>
          {truncateText(label || 'Node Info', 40)}
        </h3>
        <button 
          onClick={onClose}
          className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Content */}
      <div className="px-4 py-3">
        {passage && (
          <>
            <div className="mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${color}20`, color: color }}>
                {passage.type || 'Passage'}
              </span>
              {passage.bookTitle && (
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-white' : 'text-gray-500'}`}>
                  {passage.bookTitle}
                </span>
              )}
            </div>
            
            <h4 className={`text-md font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {passage.title}
            </h4>
            
            {passage.reference && (
              <p className={`text-sm mb-3 ${isDarkMode ? 'text-white' : 'text-gray-500'}`}>
                {passage.reference}
              </p>
            )}
            
            {passage.description && (
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                {passage.description}
              </p>
            )}
          </>
        )}
        
        {/* Bible Text Section */}
        {node.passage && node.passage.reference && (
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
            <h4 className={`text-sm font-medium flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
              <Book size={16} className="mr-1" /> 
              Scripture
            </h4>
            
            <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar"
                 style={{
                   scrollbarWidth: 'thin',
                   scrollbarColor: isDarkMode ? '#4B5563 #1F2937' : '#CBD5E0 #EDF2F7'
                 }}>
              {isLoadingText ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2"
                       style={{ borderColor: color }}></div>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none"
                     style={{ fontFamily: document.documentElement.style.fontFamily || 'inherit' }}>
                  {highlightBibleText(bibleText)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer with navigation button */}
      {passage && (
        <div className={`px-4 py-3 border-t border-gray-200 dark:border-gray-700 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <button
            onClick={onNavigate}
            className={`flex items-center justify-center w-full py-2 px-4 rounded-md transition-colors shadow-sm text-sm font-medium
              ${isDarkMode ? 'bg-indigo-900 text-indigo-200 hover:bg-indigo-800' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
          >
            <span>View in Bible</span>
            <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      )}

      {/* CSS for custom scrollbar */}
      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#1F2937' : '#EDF2F7'};
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: ${isDarkMode ? '#4B5563' : '#CBD5E0'};
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default NodeInfoPopup; 