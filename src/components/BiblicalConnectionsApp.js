import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Book,
  ZoomIn, 
  ZoomOut,
  Info,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Maximize2, 
  Minimize2,
  BookOpen,
  // Breadcrumb navigation
  History,
  CornerDownLeft,
  // Resize controls
  GripHorizontal
} from 'lucide-react';

import { bibleStructure } from '../data/bibleStructure';
import { allConnections } from '../data/allConnections';
import { bibleBookChapterCounts } from '../constants/bibleBookChapterCounts';
import  { referenceToPassageMap } from '../data/referenceToPassageMap';
import { narrativeSections } from '../data/narrativeSections';
// Using the existing code from the 
// (Keeping all existing variables and functions)




const oldTestamentBooks = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms',
  'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah',
  'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea',
  'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
  'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
];

const newTestamentBooks = [
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
  'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians',
  '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus',
  'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];



// All utility functions stay the same
const isVerseInRange = (verseNum, referenceRange) => {
  const match = referenceRange.match(/(\w+)\s+(\d+):(\d+)-(\d+)/);
  if (!match) return false;
  
  const [_, book, chapter, startVerse, endVerse] = match;
  const start = parseInt(startVerse);
  const end = parseInt(endVerse);
  
  return verseNum >= start && verseNum <= end;
};

const findPassageIdsForVerseRange = (book, chapter, startVerse, endVerse) => {
  const passageIds = new Set();
  
  Object.entries(referenceToPassageMap).forEach(([referenceRange, passageId]) => {
    if (referenceRange.startsWith(`${book} ${chapter}:`)) {
      const rangeMatch = referenceRange.match(/:(\d+)-(\d+)$/);
      if (rangeMatch) {
        const refStartVerse = parseInt(rangeMatch[1]);
        const refEndVerse = parseInt(rangeMatch[2]);
        
        if (
          (refStartVerse <= endVerse && refEndVerse >= startVerse) || 
          (startVerse <= refEndVerse && endVerse >= refStartVerse)
        ) {
          passageIds.add(passageId);
        }
      }
    }
  });
  
  return Array.from(passageIds);
};

const BibleBookConnections = () => {
  // Original state from your application
  const [selectedPassage, setSelectedPassage] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [connections, setConnections] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    pentateuch: true,
    historical: false,
    wisdom: false,
    prophets: false,
    gospels: true,
    epistles: false,
    revelation: false
  });
   
  // State for the reading pane and navigation
  const [showReadingPane, setShowReadingPane] = useState(true);
  const [showNavigator, setShowNavigator] = useState(false);
  const [currentBibleReference, setCurrentBibleReference] = useState('');
  const [bibleText, setBibleText] = useState('');
  const [isLoadingBibleText, setIsLoadingBibleText] = useState(false);
  const [bibleBooks, setBibleBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState('Genesis');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [chapterCount, setChapterCount] = useState(50); // Default for Genesis
  const [activeConnectionsInText, setActiveConnectionsInText] = useState([]);
  const [highlightedVerses, setHighlightedVerses] = useState({});
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [activeTestament, setActiveTestament] = useState("all");
  const [bookSearch, setBookSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showGraph, setShowGraph] = useState(true);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  
  // Additional state for node dragging
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [dragStartTime, setDragStartTime] = useState(0);
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  
  // State for connection type panel
  const [showConnectionTypes, setShowConnectionTypes] = useState(false);
  
  // State for verse-level connections
  const [availableConnectionsForChapter, setAvailableConnectionsForChapter] = useState([]);
  const [activeNarrativeSection, setActiveNarrativeSection] = useState('creation');
  const [currentVerseRange, setCurrentVerseRange] = useState({ start: 1, end: 31 });
  
  // Array to store section headings for the Bible text
  const [bibleSections, setBibleSections] = useState([]);
  const textContainerRef = useRef(null);
  
  // *** NEW STATE FOR RESIZING ***
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartPosition, setResizeStartPosition] = useState(0);
  const [panelSize, setPanelSize] = useState(isLargeScreen ? 50 : 60); // Default: 50% width or 60% height
  const resizeRef = useRef(null);
  const containerRef = useRef(null);
  
  // *** NEW STATE FOR BREADCRUMBS ***
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(false);
  const [breadcrumbSessionName, setBreadcrumbSessionName] = useState("Study Session");
  const [breadcrumbNotes, setBreadcrumbNotes] = useState({});
  const [editingNoteFor, setEditingNoteFor] = useState(null);
  const [showBreadcrumbTimeline, setShowBreadcrumbTimeline] = useState(false);
  const [breadcrumbSessionStartTime, setBreadcrumbSessionStartTime] = useState(new Date().toISOString());

  // Add state for the selected node info
  const [selectedNodeInfo, setSelectedNodeInfo] = useState(null);
  // Add state for focused node view
  const [focusedNodeId, setFocusedNodeId] = useState(null);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Reference to track if we were previously in large screen mode
  const lastIsLargeScreen = useRef(isLargeScreen);

  // Only update panel size when screen size changes and 
  // we're switching between layouts - keeps user's custom sizing otherwise
  useEffect(() => {
    // Set default sizes based on screen layout
    const defaultSize = isLargeScreen ? 50 : 60;
    
    // Only change size if layout changes (large to small or vice versa)
    if (lastIsLargeScreen.current !== isLargeScreen) {
      setPanelSize(defaultSize);
      lastIsLargeScreen.current = isLargeScreen;
    }
  }, [isLargeScreen]);
  
  // Initialize book list
  useEffect(() => {
    const books = Object.keys(bibleBookChapterCounts);
    setBibleBooks(books);
  }, []);

  // Effect to update chapter count when book changes
  useEffect(() => {
    if (currentBook && bibleBookChapterCounts[currentBook]) {
      setChapterCount(bibleBookChapterCounts[currentBook]);
      setCurrentChapter(1); // Reset to chapter 1 when book changes
    }
  }, [currentBook]);

  // *** VERTICAL RESIZE HANDLERS FOR SMALL SCREENS ***
  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);
    
    // Store the current position (only care about Y for vertical resize)
    setResizeStartPosition(e.clientY || e.touches?.[0]?.clientY);
  };

  const handleResizeMove = (e) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Get mouse/touch Y position
    const mousePosition = e.clientY || e.touches?.[0]?.clientY;
    const positionDelta = mousePosition - resizeStartPosition;
    
    // Vertical resize for small screens
    const containerHeight = containerRect.height;
    
    // Calculate new height as a percentage
    const newHeight = panelSize + (positionDelta / containerHeight * 100);
    
    // Constrain between 20% and 80%
    const constrainedHeight = Math.min(Math.max(newHeight, 20), 80);
    setPanelSize(constrainedHeight);
    
    // Update start position for next move
    setResizeStartPosition(mousePosition);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  // Add global mouse event listeners when resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.addEventListener('touchmove', handleResizeMove, { passive: false });
      document.addEventListener('touchend', handleResizeEnd);
      
      // Add a class to prevent text selection during resize
      document.body.classList.add('resize-active');
    } else {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('touchmove', handleResizeMove);
      document.removeEventListener('touchend', handleResizeEnd);
      
      // Remove class when done resizing
      document.body.classList.remove('resize-active');
    }
    
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('touchmove', handleResizeMove);
      document.removeEventListener('touchend', handleResizeEnd);
      document.body.classList.remove('resize-active');
    };
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Touch gesture state
  const [touchDistance, setTouchDistance] = useState(null);
  const [touchCenter, setTouchCenter] = useState(null);

  // Calculate distance between two touch points
  const getTouchDistance = (touches) => {
    if (touches.length < 2) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Calculate center point between two touches
  const getTouchCenter = (touches) => {
    if (touches.length < 2) return null;
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  };
  
  // Enhanced parseTextIntoSections function with verse range awareness
  const parseTextIntoSections = (text) => {
    if (!text) return [];
    
    // More advanced parsing to identify potential section breaks and provide better section titles
    const paragraphs = text.split('\n\n');
    const sections = [];
    
    let currentSection = { title: '', verses: [], text: '' };
    let verseGroups = [];
    let currentVerseGroup = [];
    
    // First, identify verse groups based on context
    paragraphs.forEach((paragraph, index) => {
      const verseMatch = paragraph.match(/^\s*\[(\d+)\]/);
      
      if (verseMatch) {
        const verseNum = parseInt(verseMatch[1]);
        
        // If this is verse 1 or a multiple of 10, or the first verse in the text, 
        // consider it a potential section break
        if (verseNum === 1 || verseNum % 10 === 0 || index === 0) {
          if (currentVerseGroup.length > 0) {
            verseGroups.push([...currentVerseGroup]);
            currentVerseGroup = [];
          }
        }
        
        currentVerseGroup.push({
          verse: verseNum,
          text: paragraph
        });
      } else if (paragraph.trim().length > 0) {
        // Non-verse text, might be a section heading or other content
        // Add it to the current verse group
        if (currentVerseGroup.length > 0) {
          currentVerseGroup[currentVerseGroup.length - 1].text += '\n\n' + paragraph;
        } else {
          currentVerseGroup.push({
            verse: null,
            text: paragraph
          });
        }
      }
    });
    
    // Add the last verse group
    if (currentVerseGroup.length > 0) {
      verseGroups.push([...currentVerseGroup]);
    }
    
    // Convert verse groups to sections
    verseGroups.forEach((group, index) => {
      const firstVerse = group.find(item => item.verse !== null)?.verse || 0;
      const lastVerse = Math.max(...group.map(item => item.verse || 0));
      
      let title = '';
      if (index === 0 && firstVerse <= 1) {
        title = 'Introduction';
      } else if (firstVerse === lastVerse) {
        title = `Verse ${firstVerse}`;
      } else {
        title = `Verses ${firstVerse}${lastVerse ? '-' + lastVerse : ''}`;
      }
      
      const sectionText = group.map(item => item.text).join('\n\n');
      
      sections.push({
        title,
        verses: group.map(item => item.verse).filter(v => v !== null),
        text: sectionText
      });
    });
    
    // If sections are too small, merge them
    if (sections.length > 8) {
      const mergedSections = [];
      let currentMergedSection = null;
      
      sections.forEach((section, index) => {
        if (!currentMergedSection) {
          currentMergedSection = { ...section };
        } else if (currentMergedSection.verses.length < 5) {
          // Merge small sections
          currentMergedSection.title = `${currentMergedSection.title.split('-')[0]}-${section.title.split('-').pop()}`;
          currentMergedSection.verses = [...currentMergedSection.verses, ...section.verses];
          currentMergedSection.text += '\n\n' + section.text;
        } else {
          // Start a new section if the current one is large enough
          mergedSections.push(currentMergedSection);
          currentMergedSection = { ...section };
        }
      });
      
      // Add the last merged section
      if (currentMergedSection) {
        mergedSections.push(currentMergedSection);
      }
      
      return mergedSections;
    }
    
    return sections;
  };

  // Enhanced fetchBiblePassage function with verse-level awareness
  const fetchBiblePassage = async (reference) => {
    setIsLoadingBibleText(true);
    try {
      const url = `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(reference)}&include-passage-references=false&include-verse-numbers=true&include-footnotes=false&include-short-copyright=false&include-passage-horizontal-lines=false&include-heading-horizontal-lines=false`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': 'Token c3be9ae20e39bd6637c709cd2e94fd42135764d1'
        }
      });
      
      const data = await response.json();
      
      if (data.passages && data.passages.length > 0) {
        // Extract verse numbers and create highlight data
        const text = data.passages[0];
        setBibleText(text);
        
        // Parse text into sections for better organization
        const parsedSections = parseTextIntoSections(text);
        setBibleSections(parsedSections);
        
        // Extract verse numbers from the text to determine verse range
        const verseMatches = text.match(/\[(\d+)\]/g) || [];
        const verses = verseMatches.map(match => parseInt(match.replace(/[\[\]]/g, '')));
        
        const startVerse = Math.min(...verses) || 1;
        const endVerse = Math.max(...verses) || 1;
        
        // Update current verse range
        setCurrentVerseRange({ start: startVerse, end: endVerse });
        
        // Find passages that overlap with our current verse range
        const passageIds = findPassageIdsForVerseRange(currentBook, currentChapter, startVerse, endVerse);
        
        if (passageIds.length > 0) {
          // If we have multiple matching passages, use the activeNarrativeSection if it's one of them
          let passageId = passageIds[0]; // Default to first match
          
          if (passageIds.includes(activeNarrativeSection)) {
            passageId = activeNarrativeSection;
          }
          
          // Find the passage in our dataset
          const allPassages = getAllPassages();
          const passage = allPassages.find(p => p.id === passageId);
          
          if (passage) {
            setSelectedPassage(passage);
            const passageConnections = allConnections.filter(
              conn => conn.from === passage.id || conn.to === passage.id
            );
            setConnections(passageConnections);
            setActiveConnectionsInText(passageConnections);
            
            // Create highlighted verses object based on the matching verse range
            const versesToHighlight = {};
            const foundRange = Object.keys(referenceToPassageMap).find(ref => 
              ref.startsWith(`${currentBook} ${currentChapter}:`) && 
              referenceToPassageMap[ref] === passageId
            );
            
            if (foundRange) {
              const rangeMatch = foundRange.match(/:(\d+)-(\d+)$/);
              if (rangeMatch) {
                const rangeStart = parseInt(rangeMatch[1]);
                const rangeEnd = parseInt(rangeMatch[2]);
                
                for (let v = rangeStart; v <= rangeEnd; v++) {
                  versesToHighlight[v] = true;
                }
              }
            }
            
            setHighlightedVerses(versesToHighlight);
            
            // If we have multiple passage matches, make them available for selection
            if (passageIds.length > 1) {
              setAvailableConnectionsForChapter(passageIds.map(id => 
                allPassages.find(p => p.id === id)
              ).filter(Boolean));
            } else {
              setAvailableConnectionsForChapter([]);
            }
          }
        } else {
          // No specific connection for this passage
          setSelectedPassage(null);
          setConnections([]);
          setActiveConnectionsInText([]);
          setHighlightedVerses({});
          setAvailableConnectionsForChapter([]);
        }
      } else {
        setBibleText("Passage not found");
        setBibleSections([]);
        setSelectedPassage(null);
        setConnections([]);
        setActiveConnectionsInText([]);
        setHighlightedVerses({});
        setAvailableConnectionsForChapter([]);
      }
    } catch (error) {
      console.error('Error fetching Bible passage:', error);
      setBibleText("Error loading passage");
      setBibleSections([]);
    } finally {
      setIsLoadingBibleText(false);
    }
  };

  // Load Bible passage when book or chapter changes
  useEffect(() => {
    if (showReadingPane && currentBook && currentChapter) {
      const reference = `${currentBook} ${currentChapter}`;
      setCurrentBibleReference(reference);
      fetchBiblePassage(reference);
      
      // Reset node positions when changing passages
      setNodePositions({});
    }
  }, [currentBook, currentChapter, showReadingPane]);
  
  // Load breadcrumbs from localStorage on initial load
  useEffect(() => {
    try {
      const savedBreadcrumbs = localStorage.getItem('bibleBreadcrumbs');
      const savedNotes = localStorage.getItem('bibleBreadcrumbNotes');
      const savedSessionName = localStorage.getItem('bibleBreadcrumbSessionName');
      const savedSessionStartTime = localStorage.getItem('bibleBreadcrumbSessionStartTime');
      
      if (savedBreadcrumbs) {
        setBreadcrumbs(JSON.parse(savedBreadcrumbs));
      }
      
      if (savedNotes) {
        setBreadcrumbNotes(JSON.parse(savedNotes));
      }
      
      if (savedSessionName) {
        setBreadcrumbSessionName(savedSessionName);
      }
      
      if (savedSessionStartTime) {
        setBreadcrumbSessionStartTime(savedSessionStartTime);
      }
    } catch (error) {
      console.error('Error loading breadcrumbs from localStorage:', error);
    }
  }, []);
  
  // Save breadcrumbs to localStorage whenever they change
  useEffect(() => {
    if (breadcrumbs.length > 0) {
      saveBreadcrumbsToLocalStorage();
    }
  }, [breadcrumbs, breadcrumbNotes, breadcrumbSessionName]);

  const getAllPassages = () => {
    const passages = [];
    Object.values(bibleStructure).forEach(section => {
      section.books.forEach(book => {
        book.passages.forEach(passage => {
          passages.push({
            ...passage,
            book: book.id,
            bookTitle: book.title,
            bookColor: book.color,
            section: section.title
          });
        });
      });
    });
    return passages;
  };

  const allPassages = getAllPassages();

  const findPassage = (id) => allPassages.find(p => p.id === id);

  // Keep all the existing functions like toggleSection, handlePassageClick, etc.
  // The rest of the functions stay the same
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // If we're expanding a section, scroll it into view
    if (!expandedSections[section]) {
      setTimeout(() => {
        const element = document.getElementById(`section-${section}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // *** MODIFIED FUNCTION TO ADD BREADCRUMB TRACKING ***
  const handlePassageClick = (passage) => {
    // Only add to breadcrumbs if it's a new passage
    if (selectedPassage?.id !== passage.id) {
      // Add current passage to breadcrumbs before changing
      if (selectedPassage) {
        // Generate a unique ID for this breadcrumb instance (allows revisiting same passage)
        const breadcrumbId = `${selectedPassage.id}-${Date.now()}`;
        
        // Add to breadcrumbs with additional metadata
        setBreadcrumbs(prev => [...prev, {
          ...selectedPassage,
          breadcrumbId, // Unique ID for this breadcrumb instance
          bookName: currentBook,
          chapterNum: currentChapter,
          timestamp: new Date().toISOString(),
          sessionName: breadcrumbSessionName,
          sessionStartTime: breadcrumbSessionStartTime
        }]);
      }
    }
    
    setSelectedPassage(passage);
    const passageConnections = allConnections.filter(
      conn => conn.from === passage.id || conn.to === passage.id
    );
    setConnections(passageConnections);
    setActiveNarrativeSection(passage.id);
    
    // Update highlighted verses based on the passage's verse range
    const verseRange = Object.keys(referenceToPassageMap).find(ref => 
      referenceToPassageMap[ref] === passage.id &&
      ref.startsWith(`${currentBook} ${currentChapter}:`)
    );
    
    if (verseRange) {
      const rangeMatch = verseRange.match(/:(\d+)-(\d+)$/);
      if (rangeMatch) {
        const rangeStart = parseInt(rangeMatch[1]);
        const rangeEnd = parseInt(rangeMatch[2]);
        
        const versesToHighlight = {};
        for (let v = rangeStart; v <= rangeEnd; v++) {
          versesToHighlight[v] = true;
        }
        setHighlightedVerses(versesToHighlight);
      }
    }
    
    // If we have a reading pane open, try to navigate to the related passage
    if (showReadingPane && passage) {
      const reference = passage.reference;
      const parts = reference.split(" ");
      if (parts.length >= 2) {
        // Extract book and chapter
        let book = parts[0];
        let chapter = parts[1].split(":")[0].split("-")[0];
        
        // Handle multi-word book names
        if (!bibleBookChapterCounts[book]) {
          book = parts[0] + " " + parts[1];
          chapter = parts[2] ? parts[2].split(":")[0].split("-")[0] : "1";
        }
        
        if (bibleBookChapterCounts[book]) {
          // Only navigate if book/chapter is different
          if (book !== currentBook || parseInt(chapter) !== currentChapter) {
            setCurrentBook(book);
            setCurrentChapter(parseInt(chapter));
          }
        }
      }
    }
    
    // Close navigator after selection
    setShowNavigator(false);
  };

  // *** NEW FUNCTION FOR BREADCRUMB NAVIGATION ***
  const handleBreadcrumbClick = (breadcrumb, index) => {
    // Navigate to this breadcrumb
    if (breadcrumb.bookName && breadcrumb.chapterNum) {
      // First set book and chapter to trigger text loading
      setCurrentBook(breadcrumb.bookName);
      setCurrentChapter(breadcrumb.chapterNum);
      
      // Then select the passage
      setTimeout(() => {
        handlePassageClick(breadcrumb);
      }, 100);
      
      // Optionally, truncate breadcrumbs to this point
      setBreadcrumbs(prev => prev.slice(0, index + 1));
    }
  };

  // *** NEW FUNCTION TO CLEAR BREADCRUMBS ***
  const clearBreadcrumbs = () => {
    setBreadcrumbs([]);
    setBreadcrumbNotes({});
    // Clear breadcrumbs from localStorage
    localStorage.removeItem('bibleBreadcrumbs');
    localStorage.removeItem('bibleBreadcrumbNotes');
    // Reset session start time
    setBreadcrumbSessionStartTime(new Date().toISOString());
  };
  
  // *** NEW FUNCTION TO SAVE BREADCRUMBS TO LOCAL STORAGE ***
  const saveBreadcrumbsToLocalStorage = () => {
    try {
      localStorage.setItem('bibleBreadcrumbs', JSON.stringify(breadcrumbs));
      localStorage.setItem('bibleBreadcrumbNotes', JSON.stringify(breadcrumbNotes));
      localStorage.setItem('bibleBreadcrumbSessionName', breadcrumbSessionName);
      localStorage.setItem('bibleBreadcrumbSessionStartTime', breadcrumbSessionStartTime);
    } catch (error) {
      console.error('Error saving breadcrumbs to localStorage:', error);
    }
  };
  
  // *** NEW FUNCTION TO ADD NOTE TO BREADCRUMB ***
  const addNoteToBreadcrumb = (breadcrumbId, note) => {
    const updatedNotes = {
      ...breadcrumbNotes,
      [breadcrumbId]: note
    };
    setBreadcrumbNotes(updatedNotes);
    setEditingNoteFor(null);
    
    // Save to localStorage
    try {
      localStorage.setItem('bibleBreadcrumbNotes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error saving breadcrumb notes to localStorage:', error);
    }
  };
  
  // *** FUNCTION TO START A NEW STUDY SESSION ***
  const startNewStudySession = (sessionName = "New Study Session") => {
    const currentTime = new Date().toISOString();
    setBreadcrumbSessionName(sessionName);
    setBreadcrumbSessionStartTime(currentTime);
    
    // Save to localStorage
    localStorage.setItem('bibleBreadcrumbSessionName', sessionName);
    localStorage.setItem('bibleBreadcrumbSessionStartTime', currentTime);
    
    // Add a session marker to breadcrumbs if there are existing breadcrumbs
    if (breadcrumbs.length > 0) {
      const sessionMarker = {
        id: `session-${Date.now()}`,
        title: "--- New Session: " + sessionName + " ---",
        isSessionMarker: true,
        timestamp: currentTime
      };
      
      const updatedBreadcrumbs = [...breadcrumbs, sessionMarker];
      setBreadcrumbs(updatedBreadcrumbs);
      localStorage.setItem('bibleBreadcrumbs', JSON.stringify(updatedBreadcrumbs));
    }
  };

  const handleBookClick = (bookId) => {
    setSelectedBook(bookId === selectedBook ? null : bookId);
    setSelectedPassage(null);
    setConnections([]);
    setShowNavigator(false); // Close navigator after selection
  };

  const toggleReadingPane = () => {
    setShowReadingPane(!showReadingPane);
    if (!showReadingPane && currentBook && currentChapter) {
      // If we're opening the reading pane, make sure we have text loaded
      const reference = `${currentBook} ${currentChapter}`;
      fetchBiblePassage(reference);
    }
  };
  
  const toggleGraphVisibility = () => {
    setShowGraph(!showGraph);
  };

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 0.2, 0.5));

  const nextChapter = () => {
    if (currentChapter < chapterCount) {
      setCurrentChapter(currentChapter + 1);
    } else if (bibleBooks.indexOf(currentBook) < bibleBooks.length - 1) {
      // Move to next book
      const nextBookIndex = bibleBooks.indexOf(currentBook) + 1;
      setCurrentBook(bibleBooks[nextBookIndex]);
      setCurrentChapter(1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    } else if (bibleBooks.indexOf(currentBook) > 0) {
      // Move to previous book
      const prevBookIndex = bibleBooks.indexOf(currentBook) - 1;
      const prevBook = bibleBooks[prevBookIndex];
      setCurrentBook(prevBook);
      setCurrentChapter(bibleBookChapterCounts[prevBook]);
    }
  };
  
  // Enhanced handleNarrativeSectionSelect function for verse-level support
  const handleNarrativeSectionSelect = (sectionId) => {
    setActiveNarrativeSection(sectionId);
    const section = narrativeSections.find(s => s.id === sectionId);
    if (section) {
      // Find the matching book ID and convert it to the proper book name format
      const book = Object.values(bibleStructure)
        .flatMap(bookSection => bookSection.books)
        .find(b => b.id === section.book);
      
      if (book) {
        const bookName = book.title;
        const wasOnSameChapter = currentBook === bookName && currentChapter === section.chapter;
        
        setCurrentBook(bookName);
        setCurrentChapter(section.chapter);
        
        // If we're already on the same chapter, explicitly select this passage
        if (wasOnSameChapter) {
          const passage = allPassages.find(p => p.id === sectionId);
          if (passage) {
            handlePassageClick(passage);
          }
        } else {
          // Otherwise, wait for the chapter to load, then select the passage
          setTimeout(() => {
            const passage = allPassages.find(p => p.id === sectionId);
            if (passage) {
              handlePassageClick(passage);
            }
          }, 300);
        }
      }
    }
  };

  const filteredConnections = filterType === 'all' 
    ? connections 
    : connections.filter(conn => conn.type === filterType);

  const filteredPassages = searchTerm 
    ? allPassages.filter(passage => 
        passage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        passage.reference.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getConnectedPassage = (connection, currentId) => {
    const connectedId = connection.from === currentId ? connection.to : connection.from;
    return findPassage(connectedId);
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'thematic': return '#3498db';
      case 'typological': return '#e74c3c';
      case 'prophetic': return '#f39c12';
      case 'character': return '#2ecc71';
      case 'linguistic': return '#9b59b6';
      case 'commentary': return '#1abc9c';
      default: return '#95a5a6';
    }
  };

  const connectionTypes = [
    { id: 'all', name: 'All Connections' },
    { id: 'thematic', name: 'Thematic Parallels' },
    { id: 'typological', name: 'Typological' },
    { id: 'prophetic', name: 'Prophetic Fulfillment' },
    { id: 'character', name: 'Character Connections' },
    { id: 'linguistic', name: 'Linguistic Links' },
    { id: 'commentary', name: 'New Testament Commentary' }
  ];

  // Enhanced highlightBibleText function with support for verse-level connections
  const highlightBibleText = (text) => {
    if (!text) return '';
    
    // Enhanced regex to find verse numbers (e.g., [1], [2], etc.)
    const parts = text.split(/(\[\d+\])/g);
    
    // Determine current book color
    let currentBookColor = '#6366f1'; // Default indigo color
    
    // Try to get the color of the current book
    for (const section of Object.values(bibleStructure)) {
      const foundBook = section.books.find(b => b.id === currentBook);
      if (foundBook) {
        currentBookColor = foundBook.color;
        break;
      }
    }
    
    // If we have a selected passage, use its book color
    if (selectedPassage && selectedPassage.bookColor) {
      currentBookColor = selectedPassage.bookColor;
    }
    
    return parts.map((part, index) => {
      // Check if this part is a verse number
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const verseNumber = parseInt(match[1]);
        const isHighlighted = highlightedVerses[verseNumber];
        
        // Find connected passages for this verse
        const connectedPassages = [];
        
        // Check all reference ranges in the map for this verse
        Object.entries(referenceToPassageMap).forEach(([referenceRange, passageId]) => {
          // Check if the reference matches our current book and chapter
          if (referenceRange.startsWith(`${currentBook} ${currentChapter}:`)) {
            // Parse the verse range from the reference
            const rangeMatch = referenceRange.match(/:(\d+)-(\d+)$/);
            if (rangeMatch) {
              const refStartVerse = parseInt(rangeMatch[1]);
              const refEndVerse = parseInt(rangeMatch[2]);
              
              // Check if this verse is in the range
              if (verseNumber >= refStartVerse && verseNumber <= refEndVerse) {
                const passage = allPassages.find(p => p.id === passageId);
                if (passage && !connectedPassages.some(p => p.id === passageId)) {
                  connectedPassages.push(passage);
                }
              }
            }
          }
        });
        
        // Determine if this verse is part of the currently selected passage
        const isConnectionPoint = connectedPassages.length > 0;
        const isPartOfSelectedPassage = selectedPassage && connectedPassages.some(p => p.id === selectedPassage.id);
        
        // Get connection color - if it's part of selected passage, use that book's color
        let connectionColor = currentBookColor;
        if (isConnectionPoint && connectedPassages.length > 0) {
          // If it's the selected passage, use the connected passage's book color
          if (isPartOfSelectedPassage) {
            const selectedConnectedPassage = connectedPassages.find(p => p.id === selectedPassage.id);
            if (selectedConnectedPassage && selectedConnectedPassage.bookColor) {
              connectionColor = selectedConnectedPassage.bookColor;
            }
          }
          // Otherwise use the first connected passage's book color
          else if (connectedPassages[0].bookColor) {
            connectionColor = connectedPassages[0].bookColor;
          }
        }
        
        // Add opacity for background colors
        const bgColor = `${connectionColor}15`; // 15% opacity
        const bgColorHover = `${connectionColor}25`; // 25% opacity
        const borderColor = `${connectionColor}30`; // 30% opacity
        
        return (
          <div key={index} className="inline-block relative verse-number-container">
            <button 
              className={`
                inline-flex items-center justify-center w-6 h-6 rounded mx-1 text-xs
                ${isHighlighted || isPartOfSelectedPassage
                  ? 'font-medium' 
                  : isConnectionPoint
                    ? 'border' 
                    : 'text-gray-500 hover:bg-gray-50'}
                transition-colors focus:outline-none focus:ring-1
              `}
              style={{
                color: isHighlighted || isPartOfSelectedPassage || isConnectionPoint ? connectionColor : '',
                backgroundColor: isHighlighted || isPartOfSelectedPassage ? bgColor : isConnectionPoint ? 'rgba(243, 244, 246, 0.8)' : '',
                borderColor: isConnectionPoint ? borderColor : '',
                boxShadow: isHighlighted || isPartOfSelectedPassage ? `0 0 0 1px ${borderColor}` : ''
              }}
              title={isConnectionPoint ? `${connectedPassages.map(p => p.title).join(', ')}` : ""}
              onClick={() => {
                if (isConnectionPoint) {
                  // If there's only one connection, use it
                  if (connectedPassages.length === 1) {
                    handlePassageClick(connectedPassages[0]);
                  } 
                  // If clicked verse has the current passage, cycle to next option
                  else if (isPartOfSelectedPassage) {
                    const currentIndex = connectedPassages.findIndex(p => p.id === selectedPassage.id);
                    const nextIndex = (currentIndex + 1) % connectedPassages.length;
                    handlePassageClick(connectedPassages[nextIndex]);
                  }
                  // Otherwise use the first connection
                  else {
                    handlePassageClick(connectedPassages[0]);
                  }
                }
              }}
            >
              {verseNumber}
            </button>
            
            {/* Show a small dot indicator if there are multiple connections for this verse */}
            {connectedPassages.length > 1 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white"
                  style={{ backgroundColor: connectionColor }}></div>
            )}
          </div>
        );
      }
      
      // Regular text part
      // Process paragraph text to add proper styling
      const paragraphText = part.trim();
      if (paragraphText.length > 0) {
        // Check if this is a potential section heading (all caps, short text)
        if (paragraphText === paragraphText.toUpperCase() && paragraphText.length < 100) {
          return (
            <h4 key={index} className="text-lg font-medium text-indigo-800 mt-6 mb-2">
              {paragraphText}
            </h4>
          );
        }
        
        return (
          <span key={index} className="text-gray-800">
            {' ' + paragraphText + ' '}
          </span>
        );
      }
      
      return <span key={index}>{part}</span>;
    });
  };

  // UI component to switch between different connection visualizations
  const renderConnectionSwitcher = () => {
    if (!availableConnectionsForChapter.length || availableConnectionsForChapter.length <= 1) {
      return null; // Don't show if there's only one or no connection
    }
    
    return (
      <div className="mb-6 bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {availableConnectionsForChapter.map(passage => (
              <button
                key={passage.id}
                onClick={() => handlePassageClick(passage)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors group whitespace-nowrap
                  ${selectedPassage && selectedPassage.id === passage.id 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'}`}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: passage.bookColor || '#6366f1' }}
                ></div>
                <div className="text-xs font-medium">
                  {passage.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const MyBreadcrumbsComponent = ({
    breadcrumbs,
    breadcrumbNotes,
    breadcrumbSessionStartTime,
    breadcrumbSessionName,
    showBreadcrumbTimeline,
    setShowBreadcrumbTimeline,
    startNewStudySession,
    handleBreadcrumbClick,
    setEditingNoteFor,
    editingNoteFor,
    addNoteToBreadcrumb,
    clearBreadcrumbs
  }) => {
    const [isBreadcrumbsVisible, setIsBreadcrumbsVisible] = useState(false);
  
    const renderBreadcrumbs = () => {
      if (breadcrumbs.length === 0) {
        return (
          <div className="py-6 px-4 text-center">
            <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-3">
              <History size={28} className="text-indigo-400" />
            </div>
            <p className="text-gray-500 text-sm">
              Your navigation history will appear here as you explore passages
            </p>
            <button 
              className="mt-4 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm rounded-md"
              onClick={() => startNewStudySession("My Bible Study")}
            >
              Start a new study session
            </button>
          </div>
        );
      }
  
      if (!isBreadcrumbsVisible) {
        return (
          <div className="flex justify-center p-4">
            <button 
              className="text-gray-500 hover:text-indigo-600 text-xl"
              onClick={() => setIsBreadcrumbsVisible(true)}
              title="Show Navigation History"
            >
              ...
            </button>
          </div>
        );
      }
  
      // Group breadcrumbs by session
      const groupedBySession = {};
      let currentSession = null;
  
      breadcrumbs.forEach(crumb => {
        if (crumb.isSessionMarker) {
          currentSession = crumb.title;
          if (!groupedBySession[currentSession]) {
            groupedBySession[currentSession] = [];
          }
        } else {
          const sessionKey = crumb.sessionStartTime || breadcrumbSessionStartTime;
          const sessionName = crumb.sessionName || breadcrumbSessionName;
          const sessionDisplay = `Session: ${sessionName}`;
  
          if (!groupedBySession[sessionDisplay]) {
            groupedBySession[sessionDisplay] = [];
          }
  
          groupedBySession[sessionDisplay].push(crumb);
        }
      });
  
      if (showBreadcrumbTimeline) {
        return renderBreadcrumbTimeline();
      }
  
      return (
        <div className="flex flex-col h-full">
          <div className="px-4 py-2 bg-indigo-50 flex justify-between items-center">
            <span className="text-xs font-medium text-indigo-800">NAVIGATION HISTORY</span>
            <div className="flex space-x-2">
              <button
                className={`p-1 rounded ${showBreadcrumbTimeline ? 'bg-indigo-200 text-indigo-700' : 'text-indigo-600 hover:bg-indigo-100'}`}
                onClick={() => setShowBreadcrumbTimeline(!showBreadcrumbTimeline)}
                title={showBreadcrumbTimeline ? "Switch to list view" : "Switch to timeline view"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 8 14 12 10 8 6 12 2 8"></polyline>
                  <path d="M2 22 L22 22"></path>
                </svg>
              </button>
              <button
                className="p-1 text-indigo-600 hover:bg-indigo-100 rounded"
                onClick={() => startNewStudySession()}
                title="Start new session"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
              </button>
              <button
                className="p-1 text-gray-600 hover:bg-indigo-100 rounded"
                onClick={() => setIsBreadcrumbsVisible(false)}
                title="Hide Navigation History"
              >
                Hide
              </button>
            </div>
          </div>
  
          <div className="flex-1 overflow-y-auto">
            {Object.entries(groupedBySession).map(([sessionName, sessionCrumbs]) => (
              <div key={sessionName} className="mb-2">
                <div className="sticky top-0 z-10 px-4 py-1 bg-gray-100 text-xs font-medium text-gray-700">
                  {sessionName}
                </div>
                <div className="divide-y divide-gray-100">
                  {sessionCrumbs.map((crumb, index) => {
                    if (crumb.isSessionMarker) return null;
  
                    const crumbId = crumb.breadcrumbId || `${crumb.id}-${index}`;
                    const hasNote = breadcrumbNotes[crumbId];
  
                    return (
                      <div key={crumbId} className="relative group">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition-colors flex items-start"
                          onClick={() => handleBreadcrumbClick(crumb, index)}
                        >
                          <div className="mr-2 mt-0.5">
                            <div 
                              className="w-3 h-3 rounded-full mt-1"
                              style={{ backgroundColor: crumb.bookColor || '#6366f1' }}
                            ></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-indigo-900 truncate">{crumb.title}</div>
                            <div className="text-xs text-gray-500 flex justify-between">
                              <span>{crumb.reference}</span>
                              <span className="text-gray-400">
                                {new Date(crumb.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
  
                            {hasNote && (
                              <div className="mt-1 text-xs bg-yellow-50 p-1.5 rounded text-yellow-800 border-l-2 border-yellow-300">
                                {breadcrumbNotes[crumbId]}
                              </div>
                            )}
                          </div>
                        </button>
  
                        <button
                          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setEditingNoteFor(crumbId)}
                          title={hasNote ? "Edit note" : "Add note"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                        </button>
  
                        {editingNoteFor === crumbId && (
                          <div className="p-3 bg-yellow-50 border-t border-yellow-100">
                            <textarea
                              className="w-full p-2 border border-yellow-300 rounded text-sm"
                              rows="2"
                              placeholder="Add your notes about this passage..."
                              defaultValue={breadcrumbNotes[crumbId] || ''}
                              autoFocus
                            ></textarea>
                            <div className="flex justify-end mt-2 space-x-2">
                              <button 
                                className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                                onClick={() => setEditingNoteFor(null)}
                              >
                                Cancel
                              </button>
                              <button 
                                className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                onClick={(e) => {
                                  const noteText = e.target.parentNode.parentNode.querySelector('textarea').value.trim();
                                  addNoteToBreadcrumb(crumbId, noteText);
                                }}
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
  
          <div className="border-t border-gray-200 p-3 bg-gray-50 flex justify-between">
            <button 
              className="text-xs text-gray-500 hover:text-red-500"
              onClick={clearBreadcrumbs}
            >
              Clear History
            </button>
            <div className="text-xs text-gray-500">
              {breadcrumbs.filter(b => !b.isSessionMarker).length} passages
            </div>
          </div>
        </div>
      );
    };
  
    return (
      <div>
        {renderBreadcrumbs()}
      </div>
    );
  };
  
  // *** NEW COMPONENT TO RENDER BREADCRUMB TIMELINE ***
  const renderBreadcrumbTimeline = () => {
    // Filter out session markers
    const timelineCrumbs = breadcrumbs.filter(crumb => !crumb.isSessionMarker);
    
    if (timelineCrumbs.length === 0) {
      return (
        <div className="py-6 px-4 text-center">
          <p className="text-gray-500 text-sm">No passages to display in timeline</p>
        </div>
      );
    }
    
    // Group by date
    const groupedByDate = {};
    timelineCrumbs.forEach(crumb => {
      const date = new Date(crumb.timestamp).toLocaleDateString();
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(crumb);
    });
    
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-2 bg-indigo-50 flex justify-between items-center">
          <span className="text-xs font-medium text-indigo-800">TIMELINE VIEW</span>
          <button
            className="p-1 text-indigo-600 hover:bg-indigo-100 rounded"
            onClick={() => setShowBreadcrumbTimeline(false)}
            title="Switch to list view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(groupedByDate).map(([date, dateCrumbs]) => (
            <div key={date} className="mb-6">
              <div className="text-sm font-medium text-gray-700 mb-2">{date}</div>
              <div className="ml-4 border-l-2 border-indigo-200 pl-4 space-y-4">
                {dateCrumbs.map((crumb, index) => {
                  const crumbId = crumb.breadcrumbId || `${crumb.id}-${index}`;
                  const time = new Date(crumb.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                  
                  return (
                    <div 
                      key={crumbId} 
                      className="relative pb-4"
                    >
                      <div className="absolute -left-[22px] mt-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white"></div>
                      <div className="text-xs text-gray-500 mb-1">{time}</div>
                      <button
                        className="block w-full text-left mb-1"
                        onClick={() => handleBreadcrumbClick(crumb, index)}
                      >
                        <div className="font-medium text-indigo-900">{crumb.title}</div>
                        <div className="text-xs text-indigo-600">{crumb.reference}</div>
                      </button>
                      
                      {/* Display note if exists */}
                      {breadcrumbNotes[crumbId] && (
                        <div className="mt-1 text-xs bg-yellow-50 p-2 rounded text-yellow-800 border-l-2 border-yellow-300">
                          {breadcrumbNotes[crumbId]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 p-3 bg-gray-50 flex justify-end">
          <div className="text-xs text-gray-500">
            {timelineCrumbs.length} passages
          </div>
        </div>
      </div>
    );
  };

  const renderBibleSections = () => {
    return Object.entries(bibleStructure).map(([sectionId, section]) => (
      <div key={sectionId} id={`section-${sectionId}`} className="mb-4">
        <div 
          className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer"
          onClick={() => toggleSection(sectionId)}
        >
          <span className="font-bold text-indigo-800">{section.title}</span>
          <ChevronRight 
            size={18} 
            className={`transform transition-transform text-indigo-600 ${expandedSections[sectionId] ? 'rotate-90' : ''}`} 
          />
        </div>
        {expandedSections[sectionId] && (
          <div className="ml-2 mt-1 space-y-1">
            {section.books.map(book => (
              <div key={book.id}>
                <div
                  className={`flex items-center p-2 rounded cursor-pointer ${selectedBook === book.id ? 'bg-indigo-50 text-indigo-800' : 'hover:bg-gray-50'}`}
                  onClick={() => handleBookClick(book.id)}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: book.color }}
                  ></div>
                  <span>{book.title}</span>
                </div>
                {selectedBook === book.id && (
                  <div className="ml-4 mt-1 grid grid-cols-1 gap-2">
                    {book.passages.map(passage => (
                      <div 
                        key={passage.id}
                        className={`p-3 rounded cursor-pointer ${selectedPassage && selectedPassage.id === passage.id ? 'bg-indigo-100 border border-indigo-300' : 'bg-white hover:bg-indigo-50 border border-gray-100'}`}
                        onClick={() => {
                          handlePassageClick({
                            ...passage,
                            book: book.id,
                            bookTitle: book.title,
                            bookColor: book.color,
                            section: section.title
                          });
                          setShowNavigator(false); // Close navigator after selection
                        }}
                      >
                        <div className="font-medium text-indigo-900">{passage.title}</div>
                        <div className="text-sm text-indigo-500">{passage.reference}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  // All other render functions like renderConnectionsVisualization stay the same
  const renderConnectionsVisualization = () => {
    if (!selectedPassage) return null;
    const visData = { nodes: [], links: [] };
    visData.nodes.push({
      id: selectedPassage.id,
      label: selectedPassage.title,
      book: selectedPassage.book,
      color: selectedPassage.bookColor,
      primary: true
    });
    filteredConnections.forEach(connection => {
      const connectedId = connection.from === selectedPassage.id ? connection.to : connection.from;
      const connectedPassage = findPassage(connectedId);
      if (connectedPassage) {
        if (!visData.nodes.find(n => n.id === connectedId)) {
          visData.nodes.push({
            id: connectedId,
            label: connectedPassage.title,
            book: connectedPassage.book,
            color: connectedPassage.bookColor,
            primary: false
          });
        }
        visData.links.push({
          source: connection.from,
          target: connection.to,
          type: connection.type,
          strength: connection.strength,
          description: connection.description
        });
      }
    });
    const bookGroups = {};
    visData.nodes.forEach(node => {
      if (!bookGroups[node.book]) {
        bookGroups[node.book] = [];
      }
      bookGroups[node.book].push(node);
    });
    const centerX = 400, centerY = 300, radius = 250;
    const books = Object.keys(bookGroups);
    books.forEach((book, bookIndex) => {
      const bookAngle = (bookIndex / books.length) * Math.PI * 2;
      const nodes = bookGroups[book];
      nodes.forEach((node, nodeIndex) => {
        const nodeRadius = node.primary ? 0 : radius * 0.8;
        const nodesInBook = nodes.length;
        const arcSize = Math.PI / 8;
        const nodeAngle = bookAngle + (nodeIndex - (nodesInBook - 1) / 2) * arcSize / Math.max(1, nodesInBook - 1);
        node.x = node.primary ? centerX : centerX + Math.cos(nodeAngle) * nodeRadius;
        node.y = node.primary ? centerY : centerY + Math.sin(nodeAngle) * nodeRadius;
      });
    });
    return (
      <div className="bg-slate-50 w-full h-full relative overflow-hidden">
        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
          <button 
            onClick={handleZoomIn}
            className="p-2 bg-white rounded-full shadow-md hover:bg-slate-100"
            aria-label="Zoom in"
          >
            <ZoomIn size={20} className="text-slate-700" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="p-2 bg-white rounded-full shadow-md hover:bg-slate-100"
            aria-label="Zoom out"
          >
            <ZoomOut size={20} className="text-slate-700" />
          </button>
        </div>
        
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          
          <button
            onClick={() => setShowConnectionTypes(!showConnectionTypes)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-slate-100"
            aria-label="Connection types"
          >
            <Info size={20} className="text-slate-700" />
          </button>
        </div>
        
        {/* Breadcrumbs Panel */}
        {showBreadcrumbs && (
          {/* Breadcrumbs Panel - Removed as requested */}
        )}
        
        {showConnectionTypes && (
          <div className="absolute top-16 right-4 z-20 bg-white p-3 rounded-lg shadow-lg">
            <div className="text-sm font-medium mb-2 text-gray-700">Connection Types:</div>
            <div className="flex flex-col space-y-1">
              {connectionTypes.map(type => (
                <button
                  key={type.id}
                  className={`flex items-center px-2 py-1 rounded text-sm ${filterType === type.id ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'}`}
                  onClick={() => setFilterType(type.id)}
                >
                  {type.id !== 'all' && (
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getTypeColor(type.id) }}
                    ></div>
                  )}
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ 
            transform: `scale(${zoomLevel})`, 
            transformOrigin: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none' // Prevent browser handling of touch gestures
          }}
          className="transition-transform duration-200"
          onClick={clearNodeFocus}
          onMouseDown={(e) => {
            if (e.button === 0) { // Only handle left mouse button
              setIsDragging(true);
              setDragStart({ x: e.clientX, y: e.clientY });
            }
          }}
          onMouseMove={(e) => {
            if (isDragging) {
              const dx = e.clientX - dragStart.x;
              const dy = e.clientY - dragStart.y;
              setPanOffset({
                x: panOffset.x + dx/zoomLevel,
                y: panOffset.y + dy/zoomLevel
              });
              setDragStart({ x: e.clientX, y: e.clientY });
            }
          }}
          onMouseUp={() => {
            setIsDragging(false);
          }}
          onMouseLeave={() => {
            setIsDragging(false);
          }}
          onTouchStart={(e) => {
            e.preventDefault(); // Prevent default touch actions
            if (e.touches.length === 1) {
              // Single touch = panning
              setIsDragging(true);
              setDragStart({ 
                x: e.touches[0].clientX, 
                y: e.touches[0].clientY 
              });
              setTouchDistance(null);
              setTouchCenter(null);
            } else if (e.touches.length === 2) {
              // Double touch = potential zoom gesture
              setTouchDistance(getTouchDistance(e.touches));
              setTouchCenter(getTouchCenter(e.touches));
              setIsDragging(false);
            }
          }}
          onTouchMove={(e) => {
            e.preventDefault(); // Prevent default touch actions
            if (e.touches.length === 1 && isDragging) {
              // Single touch = panning
              const dx = e.touches[0].clientX - dragStart.x;
              const dy = e.touches[0].clientY - dragStart.y;
              setPanOffset({
                x: panOffset.x + dx/zoomLevel,
                y: panOffset.y + dy/zoomLevel
              });
              setDragStart({ 
                x: e.touches[0].clientX, 
                y: e.touches[0].clientY 
              });
            } else if (e.touches.length === 2 && touchDistance) {
              // Handle pinch zoom
              const newDistance = getTouchDistance(e.touches);
              const newCenter = getTouchCenter(e.touches);
              
              if (newDistance && touchDistance) {
                // Calculate zoom factor
                const zoomDelta = newDistance / touchDistance;
                const newZoomLevel = Math.min(Math.max(zoomLevel * zoomDelta, 0.5), 2);
                
                // Update zoom
                setZoomLevel(newZoomLevel);
                
                // Calculate pan adjustment for zoom around pinch center
                if (touchCenter && newCenter) {
                  const centerDeltaX = newCenter.x - touchCenter.x;
                  const centerDeltaY = newCenter.y - touchCenter.y;
                  
                  // Adjust pan offset
                  setPanOffset({
                    x: panOffset.x + centerDeltaX/newZoomLevel,
                    y: panOffset.y + centerDeltaY/newZoomLevel
                  });
                }
                
                // Update touch state
                setTouchDistance(newDistance);
                setTouchCenter(newCenter);
              }
            }
          }}
          onTouchEnd={(e) => {
            // Reset touch states if no touches left
            if (e.touches.length === 0) {
              setIsDragging(false);
              setTouchDistance(null);
              setTouchCenter(null);
            } else if (e.touches.length === 1) {
              // Switched from pinch zoom to pan
              setIsDragging(true);
              setDragStart({ 
                x: e.touches[0].clientX, 
                y: e.touches[0].clientY 
              });
              setTouchDistance(null);
              setTouchCenter(null);
            }
          }}
          onTouchCancel={() => {
            setIsDragging(false);
            setTouchDistance(null);
            setTouchCenter(null);
          }}
        >
          <g>
            <rect width="800" height="600" fill="#f8fafc" rx="8" ry="8" />
          </g>
          <g transform={`translate(${panOffset.x}, ${panOffset.y})`}>
            {/* Book labels around the visualization */}
            {books.map((book, index) => {
              const bookAngle = (index / books.length) * Math.PI * 2;
              const labelRadius = radius + 30;
              const labelX = centerX + Math.cos(bookAngle) * labelRadius;
              const labelY = centerY + Math.sin(bookAngle) * labelRadius;
              let bookData = null;
              for (const section of Object.values(bibleStructure)) {
                const foundBook = section.books.find(b => b.id === book);
                if (foundBook) {
                  bookData = foundBook;
                  break;
                }
              }
              if (!bookData) return null;
              return (
                <g key={`book-${book}`} className="cursor-pointer" onClick={() => handleBookClick(book)}>
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill={bookData.color}
                    stroke="#ffffff"
                    strokeWidth="4"
                    paintOrder="stroke"
                  >
                    {bookData.title}
                  </text>
                  <circle 
                    cx={labelX}
                    cy={labelY - 20}
                    r="6"
                    fill={bookData.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              );
            })}
            
            {/* Filter links when in focused mode */}
            {visData.links.filter(link => {
              // If no node is focused, show all links
              if (!focusedNodeId) return true;
              
              // Otherwise, only show links connected to the focused node
              return link.source === focusedNodeId || link.target === focusedNodeId;
            }).map(link => {
              const sourceNode = visData.nodes.find(n => n.id === link.source);
              const targetNode = visData.nodes.find(n => n.id === link.target);
              
              if (!sourceNode || !targetNode) return null;
              
              const sourcePos = nodePositions[sourceNode.id] || { x: sourceNode.x, y: sourceNode.y };
              const targetPos = nodePositions[targetNode.id] || { x: targetNode.x, y: targetNode.y };
              
              // Calculate line path for link
              const dx = targetPos.x - sourcePos.x;
              const dy = targetPos.y - sourcePos.y;
              const linkLength = Math.sqrt(dx * dx + dy * dy);
              
              // Adjust source and target points to be at the edge of the circles
              const sourceRadius = sourceNode.primary ? 12 : 8;
              const targetRadius = targetNode.primary ? 12 : 8;
              
              const offsetRatio = sourceRadius / linkLength;
              const offsetX = dx * offsetRatio;
              const offsetY = dy * offsetRatio;
              
              const targetOffsetRatio = targetRadius / linkLength;
              const targetOffsetX = dx * targetOffsetRatio;
              const targetOffsetY = dy * targetOffsetRatio;
              
              const adjustedSourceX = sourcePos.x + offsetX;
              const adjustedSourceY = sourcePos.y + offsetY;
              const adjustedTargetX = targetPos.x - targetOffsetX;
              const adjustedTargetY = targetPos.y - targetOffsetY;
              
              // Create a unique ID for the path
              const pathId = `path-${link.source}-${link.target}`;
              
              return (
                <g key={`link-${link.source}-${link.target}`}>
                  <defs>
                    <path 
                      id={pathId} 
                      d={`M${adjustedSourceX},${adjustedSourceY} L${adjustedTargetX},${adjustedTargetY}`}
                    />
                  </defs>
                  <path
                    d={`M${adjustedSourceX},${adjustedSourceY} L${adjustedTargetX},${adjustedTargetY}`}
                    stroke={getTypeColor(link.type)}
                    strokeWidth={1 + link.strength * 2}
                    opacity={0.7}
                    strokeLinecap="round"
                    fill="none"
                    markerEnd={`url(#${link.type}Marker)`}
                  />
                  {link.description && (
                    <text dy={-3} className="connection-label">
                      <textPath xlinkHref={`#${pathId}`} startOffset="50%" textAnchor="middle" fontSize="10" fill="#4b5563">
                        <tspan>
                          {link.description}
                        </tspan>
                      </textPath>
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Filter nodes when in focused mode */}
            {visData.nodes.filter(node => {
              // If no node is focused, show all nodes
              if (!focusedNodeId) return true;
              
              // Always show the primary node
              if (node.primary) return true;
              
              // Show the focused node
              if (node.id === focusedNodeId) return true;
              
              // Show nodes directly connected to the focused node
              const connectedToFocused = visData.links.some(link => 
                (link.source === focusedNodeId && link.target === node.id) ||
                (link.target === focusedNodeId && link.source === node.id)
              );
              
              return connectedToFocused;
            }).map(node => {
              const nodePos = nodePositions[node.id] || { x: node.x, y: node.y };
              
              return (
                <g 
                  key={`node-${node.id}`}
                  transform={`translate(${nodePos.x}, ${nodePos.y})`}
                  className={`${isDraggingNode && draggedNodeId === node.id ? 'cursor-grabbing' : 'cursor-pointer'}`}
                  onMouseDown={(e) => {
                    console.log('Node mouseDown');
                    // Don't interfere with the main svg panning
                    e.stopPropagation();
                    
                    // Set the start time to detect click vs drag
                    setDragStartTime(Date.now());
                    setDraggedNodeId(node.id);
                    setDragStart({ x: e.clientX, y: e.clientY });
                    
                    // Only set isDraggingNode to true if the mouse moves a certain distance
                    // This will be handled in the onMouseMove handler
                    
                    // Add mouse move and mouse up handlers to document
                    const handleMouseMove = (e) => {
                      // Only begin dragging after a small movement to differentiate from clicks
                      if (draggedNodeId === node.id) {
                        const dx = e.clientX - dragStart.x;
                        const dy = e.clientY - dragStart.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance > 5 && !isDraggingNode) {
                          setIsDraggingNode(true);
                        }
                      }
                    };
                    
                    // Add these handlers to document so drags continue outside the node
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                    }, { once: true });
                  }}
                  onMouseMove={(e) => {
                    // Only handle drag if this is the dragged node
                    if (draggedNodeId === node.id && isDraggingNode) {
                      e.stopPropagation();
                      
                      // Calculate the new position
                      const dx = e.clientX - dragStart.x;
                      const dy = e.clientY - dragStart.y;
                      
                      // Update node position
                      setNodePositions(prev => ({
                        ...prev,
                        [node.id]: {
                          x: nodePos.x + dx / zoomLevel,
                          y: nodePos.y + dy / zoomLevel
                        }
                      }));
                      
                      // Update drag start for next movement
                      setDragStart({ x: e.clientX, y: e.clientY });
                    }
                  }}
                  onMouseUp={(e) => {
                    console.log('Node mouseUp');
                    const isClick = (Date.now() - dragStartTime) < 200;
                    
                    if (draggedNodeId === node.id) {
                      setDraggedNodeId(null);
                      setIsDraggingNode(false);
                      
                      if (isClick) {
                        // This was a click, not a drag
                        console.log('Node clicked:', node);
                        // If this node is already focused, clear focus
                        if (focusedNodeId === node.id) {
                          setFocusedNodeId(null);
                          setSelectedNodeInfo(null);
                        } else {
                          // Focus on this node and show its info
                          setFocusedNodeId(node.id);
                          
                          // Get passage and connection info
                          const passage = findPassage(node.id);
                          
                          // Find the connection information for this node
                          const connection = filteredConnections.find(conn => 
                            conn.from === node.id || conn.to === node.id
                          );
                          
                          setSelectedNodeInfo({
                            ...node,
                            x: nodePos.x,
                            y: nodePos.y,
                            reference: passage?.reference,
                            passage,
                            connection,
                            isSource: connection?.from === node.id,
                            connectedTo: connection?.from === node.id ? 
                              findPassage(connection?.to)?.title : 
                              findPassage(connection?.from)?.title
                          });
                        }
                      }
                    }
                  }}
                  onMouseLeave={() => {
                    console.log('Node mouseLeave');
                    // Reset if mouse leaves while dragging
                    if (draggedNodeId === node.id) {
                      setIsDraggingNode(false);
                      setDraggedNodeId(null);
                    }
                  }}
                >
                  {node.primary && (
                    <circle
                      r="25"
                      fill={node.color}
                      opacity="0.2"
                    >
                      
                    </circle>
                  )}
                  <circle
                    r={node.primary ? 12 : 8}
                    fill={node.color}
                    stroke={node.primary ? "#ffffff" : "#ffffff"}
                    strokeWidth="2"
                    className={isDraggingNode && draggedNodeId === node.id ? 'cursor-grabbing' : ''}
                  >
                   
                  </circle>
                  <text
                    y={node.primary ? 30 : 20}
                    textAnchor="middle"
                    fontSize={node.primary ? 14 : 12}
                    fontWeight={node.primary ? "bold" : "normal"}
                    fill="#1e293b"
                    stroke="#ffffff"
                    strokeWidth="4"
                    paintOrder="stroke"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
        
        {/* Bottom bar with breadcrumb trail indicator */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="p-3 bg-white rounded-lg shadow-lg">
            <h3 className="font-medium text-indigo-800 text-sm">{selectedPassage.reference}</h3>
          </div>

                        {/* Breadcrumb journey indicator with visual trail - Removed as requested */}
        </div>
      </div>
    );
  };

  // Render the reading pane
  const renderReadingPane = () => {
    return (
      <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden">
        <div className="bg-white relative">
          <div className="absolute h-1 bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60"></div>
          <div className="flex items-center h-[56px] relative w-full">
            <button 
              className="sticky left-0 px-2 py-3 bg-gradient-to-r from-white to-transparent z-10"
              onClick={() => {
                const container = document.getElementById('sections-container');
                if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
              }}
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <div 
              id="sections-container"
              ref={sectionsContainerRef}
              className="flex-1 overflow-x-auto py-3 px-2 flex space-x-3 scrollbar-hide"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                width: '100%'
              }}
            >
              {sortedNarrativeSections.map((section) => (
                <button
                  key={section.id}
                  data-section-id={section.id}
                  onClick={() => handleNarrativeSectionSelect(section.id)}
                  className={`py-1.5 px-4 text-sm font-medium rounded-full transition-colors whitespace-nowrap relative ${
                    activeNarrativeSection === section.id 
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                  }`}
                >
                  {section.title}
                  {section.reference && <span className="ml-1 text-xs text-gray-400 hidden sm:inline">{section.reference}</span>}
                </button>
              ))}
            </div>
            <button 
              className="sticky right-0 px-2 py-3 bg-gradient-to-l from-white to-transparent z-10"
              onClick={() => {
                const container = document.getElementById('sections-container');
                if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
              }}
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        <div 
          className="bibleReadingSection flex-1 overflow-y-auto bg-white"
          ref={textContainerRef}
        >
          {isLoadingBibleText ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-8 py-8">
              <div className="mb-4 pb-2 border-b border-indigo-100">
                <h2 className="text-3xl font-serif font-bold text-indigo-900">{currentBibleReference}</h2>
              </div>
              
              {/* Add the connection switcher for multiple connections */}
              {renderConnectionSwitcher()}
              
                              {/* Display enhanced breadcrumb navigation in reading pane if there are breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <div className="mb-6 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="p-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      {breadcrumbs
                        .filter(b => !b.isSessionMarker)
                        .map((crumb, index) => {
                          const crumbId = crumb.breadcrumbId || `${crumb.id}-${index}`;
                          
                          // Find book information to display
                          let bookInfo = null;
                          for (const section of Object.values(bibleStructure)) {
                            const foundBook = section.books.find(b => b.id === crumb.book);
                            if (foundBook) {
                              bookInfo = foundBook;
                              break;
                            }
                          }
                          
                          const bookColor = bookInfo?.color || crumb.bookColor || '#6366f1';
                          const bookName = bookInfo?.title || crumb.bookName || 'Unknown';
                          
                          return (
                            <button
                              key={`breadcrumb-${crumbId}`}
                              className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors group whitespace-nowrap"
                              onClick={() => handleBreadcrumbClick(crumb, breadcrumbs.indexOf(crumb))}
                            >
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: bookColor }}
                              ></div>
                              <div className="text-xs font-medium text-gray-700 group-hover:text-indigo-700">
                                {crumb.title}
                              </div>
                            </button>
                          );
                        })
                      }
                    </div>
                    <button
                      onClick={clearBreadcrumbs}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                      title="Clear history"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              {bibleSections.length > 0 ? (
                bibleSections.map((section, index) => (
                  <div key={index} className="mb-6">
                    
                    <div className="prose prose-indigo prose-lg max-w-none font-serif leading-relaxed">
                      {highlightBibleText(section.text)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="prose prose-indigo prose-lg max-w-none font-serif leading-relaxed">
                  {highlightBibleText(bibleText)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render the resize handle
  const renderResizeHandle = () => {
    if (!showGraph || isLargeScreen) return null; // Only show for small screens
    
    return (
      <div 
        ref={resizeRef}
        className="
          resize-handle z-10 flex items-center justify-center
          transition-colors hover:bg-indigo-100 active:bg-indigo-200
          cursor-row-resize h-4 w-16 absolute left-1/2 transform -translate-x-1/2 
          bg-white rounded-full shadow-md hover:shadow-lg
        "
        style={{
          top: `calc(${panelSize}% - 8px)`,
          borderTop: '2px solid #e2e8f0',
          borderBottom: '2px solid #e2e8f0'
        }}
        onMouseDown={handleResizeStart}
        onTouchStart={handleResizeStart}
      >
        <GripHorizontal size={16} className="text-gray-500" />
      </div>
    );
  };

  // Style for the main container to support resize UI feedback
  const containerStyle = {
    cursor: isResizing ? (isLargeScreen ? 'col-resize' : 'row-resize') : 'default'
  };

  // Add this new component for the node info popup
  const NodeInfoPopup = ({ node, onClose, onNavigate }) => {
    const popupRef = useRef(null);
    const [position, setPosition] = useState({ left: node.x + 20, top: node.y - 20 });
    
    // Adjust position when component mounts
    useEffect(() => {
      if (!popupRef.current) return;
      
      const updatePosition = () => {
        const popup = popupRef.current;
        if (!popup) return;
        
        const rect = popup.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
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
      
      // Run once on mount
      updatePosition();
      
      // Also update on resize
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }, [node.x, node.y]);
    
    console.log('Rendering NodeInfoPopup with node:', node);
    
    return (
      <div 
        ref={popupRef}
        className="fixed bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm w-full sm:w-96"
        style={{ 
          left: `${position.left}px`, 
          top: `${position.top}px`,
          zIndex: 1000,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <button 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ×
        </button>
        
        {/* Title and Reference */}
        <h3 className="font-bold text-xl text-indigo-900 mb-1">{node.label}</h3>
        <div className="text-sm text-indigo-600 mb-4 font-medium">
          {node.reference}
        </div>
        
        {/* Connection Details */}
        {node.connection && (
          <div className="space-y-3 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Connection Type:</span>
                <span className="text-sm font-medium px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${getTypeColor(node.connection.type)}20`,
                    color: getTypeColor(node.connection.type)
                  }}
                >
                  {node.connection.type.charAt(0).toUpperCase() + node.connection.type.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Direction:</span>
                <span className="text-sm font-medium text-gray-900">
                  {node.isSource ? 'Source → ' : '← Target'} {node.connectedTo}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Strength:</span>
                <div className="flex items-center">
                  {/* Replace dots with progress bar */}
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full" 
                      style={{
                        width: `${Math.max(5, node.connection.strength * 100)}%`,
                        backgroundColor: getTypeColor(node.connection.type)
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-700">
                    {(node.connection.strength * 10).toFixed(1)}/10
                  </span>
                </div>
              </div>

              {node.connection.level && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Level:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {node.connection.level}
                  </span>
                </div>
              )}
            </div>

            {node.connection.description && (
              <div className="bg-indigo-50 p-3 rounded-lg">
                <div className="text-xs font-medium text-indigo-800 mb-1">
                  Description:
                </div>
                <div className="text-sm text-indigo-900">
                  {node.connection.description}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Button */}
        <button
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate();
          }}
        >
          Go to Passage
        </button>
      </div>
    );
  };

  // Remove duplicated sections container - this should already exist in the component state section
  const sectionsContainerRef = useRef(null);
  
  // Sort narrative sections by biblical order
  const sortedNarrativeSections = useMemo(() => {
    // Create a complete list of Bible books in order
    const fullBibleBooksList = [...oldTestamentBooks, ...newTestamentBooks];
    
    // Create a mapping of book names to their order in the Bible
    const bibleBookOrder = {};
    fullBibleBooksList.forEach((book, index) => {
      bibleBookOrder[book.toLowerCase()] = index;
    });
    
    // Get the first part of the reference to determine the book name
    const getBookFromReference = (reference) => {
      if (!reference) return '';
      // Extract book name from reference like "Genesis 1:1"
      const match = reference.match(/^(\d*\s*[A-Za-z]+)/);
      return match ? match[1].toLowerCase() : '';
    };
    
    return [...narrativeSections].sort((a, b) => {
      // Get book names
      const bookNameA = a.book || getBookFromReference(a.reference) || '';
      const bookNameB = b.book || getBookFromReference(b.reference) || '';
      
      // Get book order - normalize "genesis" to "genesis" for lookup
      let bookOrderA = Infinity;
      let bookOrderB = Infinity;
      
      // Try to match book name with or without spaces
      Object.keys(bibleBookOrder).forEach(bookName => {
        if (bookNameA.includes(bookName) || bookName.includes(bookNameA)) {
          bookOrderA = Math.min(bookOrderA, bibleBookOrder[bookName]);
        }
        if (bookNameB.includes(bookName) || bookName.includes(bookNameB)) {
          bookOrderB = Math.min(bookOrderB, bibleBookOrder[bookName]);
        }
      });
      
      // If exact match is available, use it
      if (bibleBookOrder[bookNameA] !== undefined) {
        bookOrderA = bibleBookOrder[bookNameA];
      }
      if (bibleBookOrder[bookNameB] !== undefined) {
        bookOrderB = bibleBookOrder[bookNameB];
      }
      
      // First sort by book
      if (bookOrderA !== bookOrderB) return bookOrderA - bookOrderB;
      
      // Then sort by chapter
      if (a.chapter !== b.chapter) return a.chapter - b.chapter;
      
      // If same chapter, try to sort by verse if available
      const verseA = a.reference?.match(/:(\d+)/)?.[1] || 0;
      const verseB = b.reference?.match(/:(\d+)/)?.[1] || 0;
      
      return parseInt(verseA) - parseInt(verseB);
    });
  }, [narrativeSections, oldTestamentBooks, newTestamentBooks]);

  // Function to clear node focus when clicking outside
  const clearNodeFocus = (e) => {
    // Only clear if clicking on the SVG background, not on a node
    if (e.target.tagName === 'svg') {
      setFocusedNodeId(null);
    }
  };

  // Updated return statement with resize functionality
  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans" style={containerStyle}>
      <header className="p-4 bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          {/* Navigation History Section */}
          {breadcrumbs.length > 0 && (
            <div className="mb-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className="p-2 flex items-center justify-between">
                <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {breadcrumbs
                    .filter(b => !b.isSessionMarker)
                    .map((crumb, index) => {
                      const crumbId = crumb.breadcrumbId || `${crumb.id}-${index}`;
                      
                      // Find book information to display
                      let bookInfo = null;
                      for (const section of Object.values(bibleStructure)) {
                        const foundBook = section.books.find(b => b.id === crumb.book);
                        if (foundBook) {
                          bookInfo = foundBook;
                          break;
                        }
                      }
                      
                      const bookColor = bookInfo?.color || crumb.bookColor || '#6366f1';
                      const bookName = bookInfo?.title || crumb.bookName || 'Unknown';
                      
                      return (
                        <button
                          key={`breadcrumb-${crumbId}`}
                          className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors group whitespace-nowrap"
                          onClick={() => handleBreadcrumbClick(crumb, breadcrumbs.indexOf(crumb))}
                        >
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: bookColor }}
                          ></div>
                          <div className="text-xs font-medium text-gray-700 group-hover:text-indigo-700">
                            {crumb.title}
                          </div>
                        </button>
                      );
                    })
                  }
                </div>
                <button
                  onClick={clearBreadcrumbs}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                  title="Clear history"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex flex-1 items-center gap-3 justify-end">
              {/* Book selector */}
              <div className="relative">
                <button
                  onClick={() => setShowBookSelector(!showBookSelector)}
                  className="flex items-center space-x-2 py-2 px-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm"
                >
                  <span className="font-medium">{currentBook}</span>
                  <ChevronDown size={16} />
                </button>
                {showBookSelector && (
 <div className="absolute top-12 left-0 w-72 max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg border border-gray-200 z-30">
    <div className="p-3 border-b border-gray-200">
      <div className="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded">
        <Search size={16} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search books..."
          value={bookSearch}
          onChange={(e) => setBookSearch(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-sm"
        />
      </div>
      <div className="flex space-x-1 mt-2">
        <button
          onClick={() => setActiveTestament("all")}
          className={`text-xs px-2 py-1 rounded ${activeTestament === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTestament("old")}
          className={`text-xs px-2 py-1 rounded ${activeTestament === "old" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}
        >
          Old Testament
        </button>
        <button
          onClick={() => setActiveTestament("new")}
          className={`text-xs px-2 py-1 rounded ${activeTestament === "new" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}
        >
          New Testament
        </button>
      </div>
    </div>
    <div className="p-2">
      <div className="grid grid-cols-2 gap-1">
        {bibleBooks
          .filter(book => {
            // First filter by search text
            const matchesSearch = bookSearch ? 
              book.toLowerCase().includes(bookSearch.toLowerCase()) : 
              true;
            
            // Then filter by testament
            let matchesTestament = true;
            if (activeTestament === "old") {
              matchesTestament = oldTestamentBooks.includes(book);
            } else if (activeTestament === "new") {
              matchesTestament = newTestamentBooks.includes(book);
            }
            
            return matchesSearch && matchesTestament;
          })
          .map(book => (
            <button
              key={book}
              onClick={() => {
                setCurrentBook(book);
                setShowBookSelector(false);
              }}
              className={`text-left px-3 py-2 rounded text-sm ${
                currentBook === book ? "bg-indigo-100 text-indigo-700 font-medium" : "hover:bg-gray-100"
              }`}
            >
              {book}
            </button>
          ))}
      </div>
    </div>
  </div>
)}
              </div>
              
              {/* Chapter selector */}
              <div className="relative">
                <button
                  onClick={() => setShowChapterSelector(prev => !prev)}
                  className="flex items-center space-x-2 py-2 px-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm"
                >
                  <span className="font-medium">{currentChapter}</span>
                  <ChevronDown size={16} />
                </button>
                {showChapterSelector && (
                  <div className="absolute top-12 left-0 w-64 max-h-80 overflow-y-auto bg-white shadow-lg rounded-lg border border-gray-200 z-30">
                    <div className="p-2">
                      <div className="grid grid-cols-5 gap-1">
                        {Array.from({ length: chapterCount }, (_, i) => (
                          <button
                            key={`chapter-${i + 1}`}
                            onClick={() => {
                              setCurrentChapter(i + 1);
                              setShowChapterSelector(false);
                            }}
                            className={`h-10 w-10 text-sm rounded-full flex items-center justify-center ${
                              currentChapter === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Navigation buttons */}
              <div className="flex items-center">
                <button 
                  className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-l-lg shadow-sm"
                  onClick={prevChapter}
                >
                  <ArrowLeft size={18} />
                </button>
                <button 
                  className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-r-lg shadow-sm border-l border-white/20"
                  onClick={nextChapter}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center gap-2">
                
                <button
                  className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg"
                  onClick={toggleGraphVisibility}
                  title={showGraph ? "Hide connections" : "Show connections"}
                >
                  {showGraph ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg"
                  onClick={() => setShowInfo(!showInfo)}
                  title="Show Information"
                >
                  <Info size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content area with resize capabilities */}
      <div 
        ref={containerRef}
        className={`flex-1 relative ${isLargeScreen ? 'flex flex-row' : 'flex flex-col'} overflow-hidden`}
      >
        {/* Add sections container here at the top level */}
        <div className="absolute top-0 left-0 right-0 w-screen bg-white z-10">
          <div className="absolute h-1 bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60"></div>
          <div className="flex items-center h-[56px] relative w-full">
            <button 
              className="sticky left-4 px-2 py-3 bg-gradient-to-r from-white to-transparent z-10"
              onClick={() => {
                const container = document.getElementById('sections-container');
                if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
              }}
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <div 
              id="sections-container"
              ref={sectionsContainerRef}
              className="flex-1 overflow-x-auto py-3 px-2 flex space-x-3 scrollbar-hide"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                width: '100%'
              }}
            >
              {sortedNarrativeSections.map((section) => (
                <button
                  key={section.id}
                  data-section-id={section.id}
                  onClick={() => handleNarrativeSectionSelect(section.id)}
                  className={`py-1.5 px-4 text-sm font-medium rounded-full transition-colors whitespace-nowrap relative ${
                    activeNarrativeSection === section.id 
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                  }`}
                >
                  {section.title}
                  {section.reference && <span className="ml-1 text-xs text-gray-400 hidden sm:inline">{section.reference}</span>}
                </button>
              ))}
            </div>
            <button 
              className="sticky right-4 px-2 py-3 bg-gradient-to-l from-white to-transparent z-10"
              onClick={() => {
                const container = document.getElementById('sections-container');
                if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
              }}
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div 
          className={`transition-all duration-100 mt-[56px]`}
          style={{ 
            height: isLargeScreen || !showGraph ? 'calc(100% - 56px)' : `${panelSize}%`,
            width: isLargeScreen && showGraph ? '50%' : '100%'
          }}
        >
          <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden">
            <div 
              className="bibleReadingSection flex-1 overflow-y-auto bg-white"
              ref={textContainerRef}
            >
              {isLoadingBibleText ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto px-8 py-8">
                  <div className="mb-4 pb-2 border-b border-indigo-100">
                    <h2 className="text-3xl font-serif font-bold text-indigo-900">{currentBibleReference}</h2>
                  </div>
                  
                  {/* Add the connection switcher for multiple connections */}
                  {renderConnectionSwitcher()}
                  
                  {bibleSections.length > 0 ? (
                    bibleSections.map((section, index) => (
                      <div key={index} className="mb-6">
                       
                        <div className="prose prose-indigo prose-lg max-w-none font-serif leading-relaxed">
                          {highlightBibleText(section.text)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="prose prose-indigo prose-lg max-w-none font-serif leading-relaxed">
                      {highlightBibleText(bibleText)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Resize handle between panels */}
        {renderResizeHandle()}
        
        {showGraph && (
          <div className={`
            transition-all duration-100 mt-[56px]
            ${isLargeScreen ? 'border-l' : 'border-t'} border-indigo-100
          `}
          style={{ 
            height: isLargeScreen ? 'calc(100% - 56px)' : `${100-panelSize}%`,
            width: isLargeScreen ? '50%' : '100%'
          }}
          >
            {selectedPassage ? (
              <div className="h-full flex flex-col">
                <div className="bg-white py-3 px-4 border-b border-indigo-100 h-[56px] flex items-center justify-between">
                  <div className="flex flex-col justify-center">
                    <h2 className="text-lg font-bold text-indigo-900 leading-tight">{selectedPassage.title}</h2>
                  </div>
                </div>
                <div className="flex-1">
                  {renderConnectionsVisualization()}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 mt-[56px]">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen size={48} className="text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-indigo-900">Select a Passage</h2>
                <p className="text-gray-600 max-w-md">
                We are still building the connections for this passage. Please select a passage from the reading pane to explore connections.
                </p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center max-w-xl">
                  {sortedNarrativeSections.slice(0, 0).map(section => (
                    <button
                      key={section.id}
                      onClick={() => handleNarrativeSectionSelect(section.id)}
                      className="p-4 bg-white rounded-lg shadow-sm hover:bg-indigo-50 border border-gray-200 text-left w-60"
                    >
                      <h3 className="font-bold text-indigo-700">{section.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{section.reference}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl max-h-full overflow-auto">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-indigo-900">Echoes of Logos Guide</h2>
              <h3 className="text-xl font-bold mb-2 text-indigo-800">Connection Types:</h3>
              <ul className="mb-6 space-y-3 text-gray-700">
                <li className="flex items-center">
                  <div className="w-6 h-3 mr-2 rounded-full" style={{ backgroundColor: getTypeColor('thematic') }}></div>
                  <div>
                    <strong>Thematic:</strong> <span className="text-gray-600">Passages that share similar themes or motifs</span>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-3 mr-2 rounded-full" style={{ backgroundColor: getTypeColor('typological') }}></div>
                  <div>
                    <strong>Typological:</strong> <span className="text-gray-600">Earlier events that foreshadow later ones</span>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-3 mr-2 rounded-full" style={{ backgroundColor: getTypeColor('prophetic') }}></div>
                  <div>
                    <strong>Prophetic:</strong> <span className="text-gray-600">Prophecies and their fulfillments</span>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-3 mr-2 rounded-full" style={{ backgroundColor: getTypeColor('commentary') }}></div>
                  <div>
                    <strong>Commentary:</strong> <span className="text-gray-600">New Testament commentary on Old Testament events</span>
                  </div>
                </li>
              </ul>
              
              <h3 className="text-xl font-bold mb-2 text-indigo-800">How to Use the Visualization:</h3>
              <ul className="mb-6 space-y-2 list-disc pl-6 text-gray-700">
                <li>The <strong>central node</strong> represents the current passage.</li>
                <li>Connected nodes show related passages across Scripture.</li>
                <li>The <strong>colored lines</strong> indicate the type of connection.</li>
                <li>Click on any node to navigate to that passage.</li>
                <li><strong>Drag nodes</strong> to reposition them for better visibility.</li>
                <li>Use the <strong>zoom controls</strong> to adjust your view.</li>
                <li>Click and drag the background to pan the visualization.</li>
                <li>Verse numbers highlighted in the text can be clicked to explore connections.</li>
                <li><strong>Green dots</strong> on verse numbers indicate multiple available connections.</li>
                <li>Use the <strong>resize handle</strong> to adjust the size of the reading pane and graph.</li>
                <li>Use the <strong>history button</strong> <History size={14} className="inline mb-1" /> to view your navigation history.</li>
              </ul>
              
              <h3 className="text-xl font-bold mb-2 text-indigo-800">Navigation History:</h3>
              <p className="mb-4 text-gray-700">
                As you explore different passages, your journey is automatically saved in the navigation history.
                Click the history button <History size={14} className="inline mb-1" /> in the toolbar or graph area to view 
                your exploration path and quickly jump back to previously visited passages.
              </p>
              
              <h3 className="text-xl font-bold mb-2 text-indigo-800">Reading Tips:</h3>
              <p className="mb-4 text-gray-700">
                While reading, look for <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium">highlighted verse numbers</span>, 
                which indicate connections to other passages. Click these to explore the connected passages directly.
                If a verse has multiple connections, clicking will cycle through them.
              </p>
              
              <div className="text-center">
                <button 
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  onClick={() => setShowInfo(false)}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add a global CSS class for preventing text selection during resizing */}
      <style jsx global>{`
        .resize-active {
          user-select: none;
          -webkit-user-select: none;
          cursor: row-resize;
        }
        
        .resize-handle {
          transition: background-color 0.2s ease;
        }
        
        .resize-handle:hover {
          background-color: rgba(99, 102, 241, 0.1);
        }
        
        .resize-handle:active {
          background-color: rgba(99, 102, 241, 0.2);
        }
      `}</style>
      
      {/* Add the NodeInfoPopup to the visualization */}
      {selectedNodeInfo && (
        <NodeInfoPopup
          node={selectedNodeInfo}
          onClose={() => setSelectedNodeInfo(null)}
          onNavigate={() => {
            if (selectedNodeInfo.passage) {
              console.log('Navigating to passage:', selectedNodeInfo.passage);
              
              // Extract book and chapter from the reference
              const reference = selectedNodeInfo.passage.reference;
              console.log('Reference:', reference);
              
              // Parse using regex
              const referenceRegex = /^((?:[1-3]\s+)?[A-Za-z\s]+)\s+(\d+)(?::|\s)/;
              const match = reference.match(referenceRegex);
              
              if (match) {
                const book = match[1].trim();
                const chapter = parseInt(match[2]);
                console.log('Extracted book:', book, 'chapter:', chapter);
                
                // IMPORTANT: First set the book and chapter to ensure 
                // the reading pane shows the correct chapter
                setCurrentBook(book);
                setCurrentChapter(chapter);
                
                // Then, with a small delay, call handlePassageClick
                setTimeout(() => {
                  handlePassageClick(selectedNodeInfo.passage);
                  setSelectedNodeInfo(null);
                }, 50);
              } else {
                // Fallback if regex fails
                handlePassageClick(selectedNodeInfo.passage);
                setSelectedNodeInfo(null);
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default BibleBookConnections;