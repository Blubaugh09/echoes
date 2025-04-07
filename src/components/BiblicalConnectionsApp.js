import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  GripHorizontal,
  X,
  List
} from 'lucide-react';

import AppSettings from './AppSettings';

import NodeInfoPopup from './NodeInfoPopup';
import { bibleStructure } from '../data/bibleStructure';
import { allConnections } from '../data/allConnections';
import { bibleBookChapterCounts } from '../constants/bibleBookChapterCounts';
import  { referenceToPassageMap } from '../data/referenceToPassageMap';
import { narrativeSections } from '../data/narrativeSections';
import VerseAIDialog from './VerseAIDialog';
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
  const [currentVerse, setCurrentVerse] = useState(1);
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
  const [showNodeList, setShowNodeList] = useState(false);
  
  // State for verse-level connections
  const [availableConnectionsForChapter, setAvailableConnectionsForChapter] = useState([]);
  const [activeNarrativeSection, setActiveNarrativeSection] = useState('creation');
  const [currentVerseRange, setCurrentVerseRange] = useState({ start: 1, end: 31 });
  const [sectionSearchTerm, setSectionSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentVisibleBook, setCurrentVisibleBook] = useState('');
  const [currentBookColor, setCurrentBookColor] = useState('#6366f1'); // Default indigo color
  
  // State for the node list book expansion
  const [bookExpansionState, setBookExpansionState] = useState({});
  
  // Array to store section headings for the Bible text
  const [bibleSections, setBibleSections] = useState([]);
  const textContainerRef = useRef(null);
  const sectionsContainerRef = useRef(null);
  
  // *** NEW STATE FOR GRAPH MODAL ***
  const [showGraphModal, setShowGraphModal] = useState(false);
  
  // *** NEW STATE FOR RESIZING ***
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartPosition, setResizeStartPosition] = useState(0);
  const [panelSize, setPanelSize] = useState(isLargeScreen ? 50 : 60); // Default: 50% width or 60% height
  const resizeRef = useRef(null);
  const containerRef = useRef(null);
  
  // *** NEW STATE FOR BREADCRUMBS ***
  // Sort narrative sections by biblical order
  const sortedNarrativeSections = useMemo(() => {
    // Create a complete list of Bible books in order
    const fullBibleBooksList = [...oldTestamentBooks, ...newTestamentBooks];
    
    // Create a mapping of book names to their order in the Bible
    const bibleBookOrder = {};
    fullBibleBooksList.forEach((book, index) => {
      bibleBookOrder[book.toLowerCase()] = index;
    });
    
    // Sort the narrative sections based on biblical book order
    return [...narrativeSections].sort((a, b) => {
      // Extract book names from sections
      const bookA = a.book || '';
      const bookB = b.book || '';
      
      // Get their positions in the Bible
      const orderA = bibleBookOrder[bookA.toLowerCase()] || 999;
      const orderB = bibleBookOrder[bookB.toLowerCase()] || 999;
      
      return orderA - orderB;
    });
  }, [narrativeSections, oldTestamentBooks, newTestamentBooks]);
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

  // Add state for AI dialog
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [selectedVerseReference, setSelectedVerseReference] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    
    // Clear any focused node state when changing passages
    if (typeof setFocusedNodeId === 'function') {
      setFocusedNodeId(null);
      setSelectedNodeInfo(null);
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
    setShowGraph(prev => !prev);
    // On small screens, automatically open in modal view
    if (!isLargeScreen) {
      setShowGraphModal(true);
    }
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
    // Clear any focused node state when changing sections
    if (typeof setFocusedNodeId === 'function') {
      setFocusedNodeId(null);
      setSelectedNodeInfo(null);
    }
    
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

  // Function to clean connection data that might have corrupted descriptions
  const cleanConnection = (connection) => {
    if (!connection) return null;
    
    console.log('Cleaning connection:', {
      originalDescription: connection.description,
      type: typeof connection.description,
      connection
    });
    
    // Create a clean copy of the connection
    const cleanedConnection = { ...connection };
    
    // Always ensure description is a clean, safe string
    if (typeof connection.description === 'string') {
      // If description contains error messages, try to preserve more information
      if (connection.description.includes('fallback response') || 
          connection.description.includes('JSON repair failed')) {
        console.log('Found error message in description, attempting to extract meaningful content');
        
        // Try to extract the main content before any error messages
        const mainContentMatch = connection.description.match(/^([^(]+)/);
        if (mainContentMatch) {
          // Keep the main content but clean it up
          cleanedConnection.description = mainContentMatch[1].trim();
          console.log('Extracted main content:', cleanedConnection.description);
        } else {
          // Fallback to reference extraction if no main content found
          const match = connection.description.match(/Connection to ([^(]+)/);
          const reference = match ? match[1].trim() : '';
          cleanedConnection.description = `Connection to ${reference}`;
          console.log('Falling back to reference extraction:', reference);
        }
      } else {
        // Keep the original description if it's a valid string without errors
        cleanedConnection.description = connection.description;
        console.log('Keeping original description:', cleanedConnection.description);
      }
    } else if (connection.description === null || connection.description === undefined) {
      console.log('Description is null/undefined, using default');
      // If description is null or undefined, set a default
      cleanedConnection.description = "Connection between passages";
    } else {
      console.log('Description is non-string type, attempting to convert');
      // For any other non-string type, try to convert it
      try {
        // If it's an object that might be stringified, try to extract meaningful content
        if (typeof connection.description === 'object') {
          // Try to get a meaningful string representation
          const stringified = JSON.stringify(connection.description);
          if (stringified.length > 0) {
            cleanedConnection.description = stringified;
          } else {
            cleanedConnection.description = "Connection between passages";
          }
        } else {
          // For other types, try to convert to string
          cleanedConnection.description = String(connection.description);
        }
      } catch (error) {
        console.log('Error converting description:', error);
        cleanedConnection.description = "Connection between passages";
      }
    }
    
    // Final validation to ensure we have a reasonable description
    if (cleanedConnection.description.length > 500) {
      console.log('Description too long, truncating');
      cleanedConnection.description = cleanedConnection.description.substring(0, 497) + '...';
    }
    
    console.log('Final cleaned connection:', {
      finalDescription: cleanedConnection.description,
      cleanedConnection
    });
    
    return cleanedConnection;
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
              onClick={(e) => {
                console.log('Verse button clicked:', {
                  book: currentBook,
                  chapter: currentChapter,
                  verse: verseNumber,
                  eventType: e.type
                });

                // Always show AI dialog on click
                setSelectedVerseReference(`${currentBook} ${currentChapter}:${verseNumber}`);
                setIsAIDialogOpen(true);
                console.log('Opening AI dialog for verse:', `${currentBook} ${currentChapter}:${verseNumber}`);

                // Handle connections if this is a connection point
                if (isConnectionPoint) {
                  if (connectedPassages.length === 1) {
                    handlePassageClick(connectedPassages[0]);
                  } else if (isPartOfSelectedPassage) {
                    const currentIndex = connectedPassages.findIndex(p => p.id === selectedPassage.id);
                    const nextIndex = (currentIndex + 1) % connectedPassages.length;
                    handlePassageClick(connectedPassages[nextIndex]);
                  } else {
                    handlePassageClick(connectedPassages[0]);
                  }
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                console.log('Right-click on verse:', {
                  book: currentBook,
                  chapter: currentChapter,
                  verse: verseNumber
                });
                setSelectedVerseReference(`${currentBook} ${currentChapter}:${verseNumber}`);
                setIsAIDialogOpen(true);
                console.log('Opening AI dialog for verse (right-click):', `${currentBook} ${currentChapter}:${verseNumber}`);
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
      <div className="mb-6 bg-white rounded-lg border border-gray-100 shadow-sm sticky top-[50px] z-30">
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
    
    // Graph visualization content
    const graphContent = (
      <div className={`bg-slate-50 w-full h-full relative overflow-hidden ${showGraphModal ? 'rounded-lg' : ''}`}>
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
            onClick={() => setShowGraphModal(!showGraphModal)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-slate-100"
            aria-label={showGraphModal ? "Minimize graph" : "Maximize graph"}
          >
            {showGraphModal ? <Minimize2 size={20} className="text-slate-700" /> : <Maximize2 size={20} className="text-slate-700" />}
          </button>
          
          <button
            onClick={() => setShowConnectionTypes(!showConnectionTypes)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-slate-100"
            aria-label="Connection types"
          >
            <Info size={20} className="text-slate-700" />
          </button>
          
          <button
            onClick={() => setShowNodeList(!showNodeList)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-slate-100"
            aria-label="Node list"
          >
            <List size={20} className="text-slate-700" />
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
        
        {/* Node List Panel */}
        {showNodeList && (
          <div className="absolute top-16 left-4 z-20 bg-white p-3 rounded-lg shadow-lg max-h-80 overflow-y-auto w-72">
            <div className="text-sm font-medium mb-2 text-gray-700">Passages by Book:</div>
            <div className="flex flex-col space-y-1">
              {(() => {
                // Group nodes by book and chapter
                const bookGroups = {};
                
                visData.nodes.forEach(node => {
                  const passage = findPassage(node.id);
                  if (!passage) return;
                  
                  // Extract book and chapter from reference
                  const reference = passage.reference;
                  const bookName = node.book;
                  
                  // Initialize expansion state for this book if not yet set
                  if (bookExpansionState[bookName] === undefined) {
                    // Update the book expansion state for new books
                    setBookExpansionState(prev => ({
                      ...prev,
                      [bookName]: true // Default to expanded
                    }));
                  }
                  
                  // Get chapter from reference (assuming format like "Genesis 1:1-10")
                  let chapter = "Unknown";
                  const chapterMatch = reference.match(/\s(\d+):/);
                  if (chapterMatch && chapterMatch[1]) {
                    chapter = chapterMatch[1];
                  }
                  
                  // Create book group if it doesn't exist
                  if (!bookGroups[bookName]) {
                    bookGroups[bookName] = {
                      color: node.color,
                      chapters: {}
                    };
                  }
                  
                  // Create chapter group if it doesn't exist
                  if (!bookGroups[bookName].chapters[chapter]) {
                    bookGroups[bookName].chapters[chapter] = [];
                  }
                  
                  // Add node to chapter group
                  bookGroups[bookName].chapters[chapter].push({
                    node,
                    passage
                  });
                });
                
                // Sort books alphabetically
                const sortedBooks = Object.keys(bookGroups).sort();
                
                return (
                  <>
                    {sortedBooks.map(bookName => {
                      const bookData = bookGroups[bookName];
                      const bookColor = bookData.color;
                      
                      // Sort chapters numerically
                      const sortedChapters = Object.keys(bookData.chapters)
                        .sort((a, b) => parseInt(a) - parseInt(b));
                      
                      return (
                        <div key={bookName} className="mb-2">
                          {/* Book Header */}
                          <button
                            className="w-full text-left p-2 rounded flex items-center justify-between"
                            style={{ backgroundColor: bookColor }}
                            onClick={() => {
                              setBookExpansionState(prev => ({
                                ...prev,
                                [bookName]: !prev[bookName]
                              }));
                            }}
                          >
                            <span className="font-medium text-white">{bookName}</span>
                            <span className="text-white">
                              {bookExpansionState[bookName] ? 
                                <ChevronDown size={16} /> : 
                                <ChevronRight size={16} />
                              }
                            </span>
                          </button>
                          
                          {/* Chapters and Passages */}
                          {bookExpansionState[bookName] && (
                            <div className="ml-2 mt-1">
                              {sortedChapters.map(chapter => (
                                <div key={`${bookName}-${chapter}`} className="mt-1">
                                  <div className="font-medium text-sm text-gray-700 pl-2">
                                    Chapter {chapter}
                                  </div>
                                  
                                  <div className="ml-2">
                                    {bookData.chapters[chapter].map(({node, passage}) => (
                                      <button
                                        key={node.id}
                                        className="flex items-center px-2 py-2 rounded text-sm text-white font-medium w-full mt-1"
                                        style={{ backgroundColor: node.color, opacity: 0.9 }}
                                        onClick={() => {
                                          setFocusedNodeId(node.id === focusedNodeId ? null : node.id);
                                          
                                          const connection = filteredConnections.find(conn => 
                                            conn.from === node.id || conn.to === node.id
                                          );
                                          
                                          const nodePos = nodePositions[node.id] || { x: node.x, y: node.y };
                                          
                                          setSelectedNodeInfo({
                                            ...node,
                                            x: nodePos.x,
                                            y: nodePos.y,
                                            reference: passage.reference,
                                            passage,
                                            connection,
                                            isSource: connection?.from === node.id,
                                            connectedTo: connection?.from === node.id ? 
                                              findPassage(connection.to)?.title : 
                                              findPassage(connection.from)?.title
                                          });
                                        }}
                                      >
                                        <div className="flex flex-col w-full">
                                          <div className="flex items-center">
                                            <div 
                                              className={`w-3 h-3 rounded-full mr-2 ${node.primary ? 'border-2 border-white' : 'border border-white'}`}
                                              style={{ backgroundColor: '#ffffff', opacity: 0.9 }}
                                            ></div>
                                            <span>{node.label} {node.primary && '(Primary)'}</span>
                                          </div>
                                          <div className="text-xs opacity-80 mt-1 ml-5">
                                            {passage.reference}
                                          </div>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                );
              })()}
            </div>
          </div>
        )}
        
        <svg 
          width="100%" 
          height="100%" 
          style={{ 
            transform: `scale(${zoomLevel})`, 
            transformOrigin: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none' // Prevent browser handling of touch gestures
          }}
          viewBox="0 0 800 600"
          className="transition-transform duration-200"
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
          <rect width="800" height="600" fill="#f8fafc" rx="8" ry="8" />
          <g transform={`translate(${panOffset.x}, ${panOffset.y})`}>
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
            {visData.links.map((link, index) => {
              const source = visData.nodes.find(n => n.id === link.source);
              const target = visData.nodes.find(n => n.id === link.target);
              if (!source || !target) return null;

              // Get node positions with any custom positioning applied
              const sourcePos = nodePositions[source.id] || { x: source.x, y: source.y };
              const targetPos = nodePositions[target.id] || { x: target.x, y: target.y };
              
              const dx = targetPos.x - sourcePos.x;
              const dy = targetPos.y - sourcePos.y;
              const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
              
              // Calculate angle to determine if the text would be upside down
              const angle = Math.atan2(dy, dx) * 180 / Math.PI;
              // If angle is between 90 and 270 degrees, the text would appear upside down
              const textUpsideDown = (angle > 90 && angle < 270);
              
              // Set path direction based on text orientation
              const pathData = textUpsideDown 
                ? `M ${targetPos.x},${targetPos.y} A ${dr},${dr} 0 0,0 ${sourcePos.x},${sourcePos.y}` // Reversed
                : `M ${sourcePos.x},${sourcePos.y} A ${dr},${dr} 0 0,1 ${targetPos.x},${targetPos.y}`;
              
              return (
                <g key={`link-${index}`}>
                  <defs>
                    <linearGradient 
                      id={`link-gradient-${index}`} 
                      x1="0%" 
                      y1="0%" 
                      x2="100%" 
                      y2="0%"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform={`rotate(${Math.atan2(dy, dx) * 180 / Math.PI}, ${sourcePos.x}, ${sourcePos.y})`}
                    >
                      <stop offset="0%" stopColor={source.color} stopOpacity="0.7" />
                      <stop offset="100%" stopColor={target.color} stopOpacity="0.7" />
                    </linearGradient>
                  </defs>
                  <path
                    id={`path-${index}`}
                    d={pathData}
                    fill="none"
                    stroke={`url(#link-gradient-${index})`}
                    strokeWidth={link.strength * 4 + 1}
                    strokeOpacity="0.6"
                    strokeDasharray={link.type === 'prophetic' ? "5,5" : (link.type === 'commentary' ? "2,2" : "none")}
                  >
                    <title>{link.description}</title>
                  </path>
                  
                  {/* Add visible edge label */}
                  {link.description && (
                    <text>
                      <textPath 
                        href={`#path-${index}`} 
                        startOffset="50%" 
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="500"
                        side={textUpsideDown ? "right" : "left"}
                      >
                        <tspan
                          dy="-5"
                          fill="#ffffff"
                          strokeWidth="3"
                          stroke="#ffffff"
                          paintOrder="stroke"
                        >
                          {link.description}
                        </tspan>
                        <tspan
                          dy="-5"
                          x="0"
                          fill="#4a5568"
                          strokeWidth="0"
                        >
                          {link.description}
                        </tspan>
                      </textPath>
                    </text>
                  )}
                </g>
              );
            })}
            {visData.nodes.map(node => {
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
                  }}
                  onMouseMove={(e) => {
                    // If we're dragging this node
                    if (draggedNodeId === node.id) {
                      console.log('Node dragging');
                      e.stopPropagation();
                      
                      // Only set dragging after a small movement to differentiate from clicks
                      const dx = e.clientX - dragStart.x;
                      const dy = e.clientY - dragStart.y;
                      const distance = Math.sqrt(dx * dx + dy * dy);
                      
                      if (distance > 5) {
                        setIsDraggingNode(true);
                        
                        // Calculate new position accounting for zoom level
                        const newPos = {
                          x: nodePos.x + dx / zoomLevel,
                          y: nodePos.y + dy / zoomLevel
                        };
                        
                        // Update node position
                        setNodePositions(prev => ({
                          ...prev,
                          [node.id]: newPos
                        }));
                        
                        // Update drag start for next movement
                        setDragStart({ x: e.clientX, y: e.clientY });
                      }
                    }
                  }}
                  onMouseUp={(e) => {
                    console.log('Node mouseUp');
                    e.stopPropagation();
                    
                    const dragDuration = Date.now() - dragStartTime;
                    console.log('Drag duration:', dragDuration);
                    console.log('isDraggingNode:', isDraggingNode);
                    
                    if (!isDraggingNode && dragDuration < 200) {
                      console.log('Treating as click - showing node info');
                      const passage = findPassage(node.id);
                      if (passage) {
                        // Find the connection information for this node
                        const connection = filteredConnections.find(conn => 
                          conn.from === node.id || conn.to === node.id
                        );
                        
                        setSelectedNodeInfo({
                          ...node,
                          x: nodePos.x,
                          y: nodePos.y,
                          reference: passage.reference,
                          passage,
                          connection,
                          isSource: connection?.from === node.id,
                          connectedTo: connection?.from === node.id ? 
                            findPassage(connection.to)?.title : 
                            findPassage(connection.from)?.title
                        });
                        return;
                      }
                    }
                    
                    // Reset dragging state
                    setIsDraggingNode(false);
                    setDraggedNodeId(null);
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
        </div>
      </div>
    );
    
    // Modal component for the graph
    const graphModal = (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2" onClick={() => setShowGraphModal(false)}>
        <div className="bg-white rounded-lg shadow-2xl w-[95vw] h-[95vh] overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Connections for {selectedPassage.reference}</h2>
            <button 
              onClick={() => setShowGraphModal(false)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="h-[calc(100%-4rem)]">
            {graphContent}
          </div>
        </div>
      </div>
    );
    
    // Show graph button component for small screens
    const showGraphButton = (
      <div className="p-4 flex justify-center">
        <button
          onClick={() => setShowGraphModal(true)}
          className="flex items-center space-x-2 py-3 px-4 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          <BookOpen size={20} />
          <span>Show Connections Graph</span>
        </button>
      </div>
    );
    
    return (
      <>
        {/* On large screens, show graph if showGraph is true */}
        {isLargeScreen && showGraph && !showGraphModal && graphContent}
        
        {/* On small screens, we no longer need the button since toggle will show modal directly */}
        
        {/* Show modal if showGraphModal is true */}
        {showGraphModal && graphModal}
      </>
    );
  };

  // Render the reading pane
  const renderReadingPane = () => {
    return (
      <div className={`relative flex flex-col h-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleReadingPane}
              className={`p-2 rounded-full hover:bg-opacity-10 ${
                isDarkMode ? 'hover:bg-white' : 'hover:bg-gray-800'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {currentBook} {currentChapter}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevChapter}
              className={`p-2 rounded-full hover:bg-opacity-10 ${
                isDarkMode ? 'hover:bg-white' : 'hover:bg-gray-800'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextChapter}
              className={`p-2 rounded-full hover:bg-opacity-10 ${
                isDarkMode ? 'hover:bg-white' : 'hover:bg-gray-800'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="prose max-w-none">
            {highlightBibleText(bibleText)}
          </div>
        </div>

        {/* AI Dialog */}
        <div className="absolute inset-0">
          <VerseAIDialog
            isOpen={isAIDialogOpen}
            onClose={() => setIsAIDialogOpen(false)}
            verseReference={selectedVerseReference}
            verseText={bibleText?.split('\n').find(line => {
              const verseNum = selectedVerseReference.split(':')[1];
              return line.trim().startsWith(verseNum);
            })}
            isDarkMode={isDarkMode}
          />
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

  // Use our separate NodeInfoPopup component
  const NodeInfoPopupWrapper = ({ node, onClose, onNavigate }) => {
    return (
      <NodeInfoPopup
        node={node}
        onClose={onClose}
        onNavigate={onNavigate}
        isDarkMode={document.documentElement.classList.contains("dark")}
        getTypeColor={getTypeColor}
      />
    );
  };
  // Function to clear node focus when clicking outside
  const clearNodeFocus = (e) => {
    // Only clear if clicking on the SVG background, not on a node
    if (e.target.tagName === 'svg' || e.target.tagName === 'rect') {
      setFocusedNodeId(null);
      setSelectedNodeInfo(null);
    }
  };

  // Add this function to filter sections based on search term
  const filteredNarrativeSections = useMemo(() => {
    if (!sectionSearchTerm) return sortedNarrativeSections;
    
    const searchLower = sectionSearchTerm.toLowerCase();
    return sortedNarrativeSections.filter(section => 
      section.title.toLowerCase().includes(searchLower) ||
      (section.reference && section.reference.toLowerCase().includes(searchLower))
    );
  }, [sortedNarrativeSections, sectionSearchTerm]);

  // Effect to set initial visible book
  useEffect(() => {
    if (sortedNarrativeSections.length > 0 && !currentVisibleBook) {
      const firstSection = sortedNarrativeSections[0];
      if (firstSection) {
        // Set book name
        let bookName = '';
        if (firstSection.book) {
          bookName = firstSection.book;
          setCurrentVisibleBook(bookName);
        } else if (firstSection.reference) {
          // Extract book from reference if not directly available
          const match = firstSection.reference.match(/^((?:[1-3]\s+)?[A-Za-z\s]+)/);
          if (match) {
            bookName = match[1].trim();
            setCurrentVisibleBook(bookName);
          }
        }
        
        // Set book color
        if (bookName) {
          // Find the book in bibleStructure
          let bookColor = '#6366f1'; // Default color
          
          for (const sectionData of Object.values(bibleStructure)) {
            const foundBook = sectionData.books?.find(b => 
              b.title?.toLowerCase() === bookName?.toLowerCase() ||
              b.id?.toLowerCase() === bookName?.toLowerCase()
            );
            
            if (foundBook && foundBook.color) {
              bookColor = foundBook.color;
              break;
            }
          }
          
          setCurrentBookColor(bookColor);
        }
      }
    }
  }, [sortedNarrativeSections, currentVisibleBook, bibleStructure]);
  
  // Function to scroll to the first section for the selected book and chapter
  console.log('*** DEFINING scrollToFirstSectionForChapter with sortedNarrativeSections:', 
    sortedNarrativeSections ? `(length: ${sortedNarrativeSections.length})` : 'undefined');
  
  const scrollToFirstSectionForChapter = useCallback((book, chapter) => {
    console.log('*** scrollToFirstSectionForChapter called with:', { book, chapter });
    console.log('*** Total narrative sections:', sortedNarrativeSections.length);
    
    // SPECIAL TEST FOR EXODUS
    if (book === 'Exodus') {
      console.log('*** TESTING SPECIFICALLY FOR EXODUS ***');
      const exodusSections = sortedNarrativeSections.filter(s => 
        s.book === 'exodus' || 
        (s.reference && s.reference.toLowerCase().includes('exodus'))
      );
      console.log('*** Found Exodus sections:', exodusSections.length);
      
      // Find Exodus chapter 1 sections specifically
      const exodusChapter1Sections = exodusSections.filter(s => s.chapter === 1);
      console.log('*** Exodus chapter 1 sections:', exodusChapter1Sections);
      
      // Try various formats to find matching sections
      const exactMatch = sortedNarrativeSections.find(s => s.book === 'exodus' && s.chapter === 1);
      const caseInsensitiveMatch = sortedNarrativeSections.find(s => 
        s.book && s.book.toLowerCase() === 'exodus' && s.chapter === 1
      );
      const referenceMatch = sortedNarrativeSections.find(s => 
        s.reference && s.reference.startsWith('Exodus 1') && s.chapter === 1
      );
      
      console.log('*** Matching tests:', {
        exactMatch,
        caseInsensitiveMatch,
        referenceMatch
      });
    }
    
    // Log what books we have in the sections
    const uniqueBooks = [...new Set(sortedNarrativeSections.map(s => s.book))];
    console.log('*** Available books in sections:', uniqueBooks);
    
    // Log some key troubleshooting info
    console.log('*** Searching for book formats:', {
      original: book,
      lowercase: book.toLowerCase(),
      withoutSpaces: book.replace(/\s+/g, '').toLowerCase()
    });
    
    // Collect book + chapter combinations to help debug
    const bookChapterCombos = sortedNarrativeSections
      .filter(s => s.chapter !== undefined)
      .map(s => ({ book: s.book, chapter: s.chapter }));
    console.log('*** Book+Chapter combinations available:', bookChapterCombos.slice(0, 10)); // Show first 10
    
    // Log book name format in first 10 sections
    const sectionsSample = sortedNarrativeSections.slice(0, 10);
    console.log('*** Sample sections book formats:', sectionsSample.map(s => ({ 
      id: s.id,
      title: s.title,
      book: s.book, 
      chapter: s.chapter,
      reference: s.reference
    })));
    
    // Find the first section that matches the current book and chapter
    let firstMatchingSection = null;
    
    // First try exact match with book and chapter properties
    firstMatchingSection = sortedNarrativeSections.find(section => {
      if (section.book && section.book.toLowerCase() === book.toLowerCase() && section.chapter === chapter) {
        console.log('*** Found exact match:', section);
        return true;
      }
      return false;
    });
    
    // If no match found, try with book name without spaces
    if (!firstMatchingSection) {
      console.log('*** No exact match found, trying with spaces removed');
      const normalizedBook = book.replace(/\s+/g, '').toLowerCase();
      
      firstMatchingSection = sortedNarrativeSections.find(section => {
        if (section.book) {
          const normalizedSectionBook = section.book.replace(/\s+/g, '').toLowerCase();
          if (normalizedSectionBook === normalizedBook && section.chapter === chapter) {
            console.log('*** Found normalized match:', section);
            return true;
          }
        }
        return false;
      });
    }
    
    // Specifically handle exodus case
    if (!firstMatchingSection && book === 'Exodus' && chapter === 1) {
      console.log('*** Special handling for Exodus 1');
      // Look for sections with "Exodus" in the reference field
      firstMatchingSection = sortedNarrativeSections.find(section => 
        section.book === 'exodus' && section.chapter === 1
      );
      
      if (!firstMatchingSection) {
        // Fall back to any section that mentions Exodus chapter 1
        firstMatchingSection = sortedNarrativeSections.find(section =>
          section.reference && 
          section.reference.includes('Exodus 1') &&
          (section.chapter === 1 || section.chapter === undefined)
        );
      }
      
      if (firstMatchingSection) {
        console.log('*** Found Exodus 1 section with special handling:', firstMatchingSection);
      }
    }
    
    // If STILL no match found, try matching with reference
    if (!firstMatchingSection) {
      console.log('*** No normalized match found, trying reference matching');
      firstMatchingSection = sortedNarrativeSections.find(section => {
        if (section.reference) {
          // Extract book from reference (like "Genesis 1:1")
          const bookMatch = section.reference.match(/^((?:[1-3]\s+)?[A-Za-z\s]+)/);
          if (bookMatch) {
            const sectionBook = bookMatch[1].trim().toLowerCase();
            const bookMatches = sectionBook === book.toLowerCase() || 
                             book.toLowerCase().includes(sectionBook) || 
                             sectionBook.includes(book.toLowerCase());
            
            // Extract chapter from reference
            const chapterMatch = section.reference.match(/(\d+):/);
            if (chapterMatch) {
              const sectionChapter = parseInt(chapterMatch[1]);
              const chapterMatches = sectionChapter === chapter;
              
              if (bookMatches && chapterMatches) {
                console.log('*** Found reference match:', section);
                return true;
              }
            }
          }
        }
        return false;
      });
    }
    
    // If still no match, try matching by title
    if (!firstMatchingSection) {
      console.log('*** No reference match found, trying title matching');
      // Try to match by title - gather all sections that mention the book name
      const possibleMatches = sortedNarrativeSections.filter(section => 
        section.title && section.title.toLowerCase().includes(book.toLowerCase())
      );
      
      console.log('*** Title matches found:', possibleMatches.length);
      
      // If we found multiple matches, try to find one with the right chapter
      if (possibleMatches.length > 0) {
        // First see if any have a chapter property matching
        const withChapter = possibleMatches.find(section => section.chapter === chapter);
        if (withChapter) {
          console.log('*** Found title+chapter match:', withChapter);
          firstMatchingSection = withChapter;
        } else {
          // Just take the first one as a fallback
          console.log('*** Using first title match as fallback:', possibleMatches[0]);
          firstMatchingSection = possibleMatches[0];
        }
      }
    }
    
    // FINAL FALLBACK: If we still can't find anything, just get ANY section with the right book
    if (!firstMatchingSection) {
      console.log('*** Using final book-only fallback');
      
      // Convert book name to lowercase for comparison
      const bookLower = book.toLowerCase();
      
      // Try to find any section with matching book property
      const bookMatch = sortedNarrativeSections.find(section => 
        section.book && section.book.toLowerCase() === bookLower
      );
      
      if (bookMatch) {
        console.log('*** Found book-only fallback match:', bookMatch);
        firstMatchingSection = bookMatch;
      } else {
        // As a last resort, try to find any section with the book name in the reference
        const referenceMatch = sortedNarrativeSections.find(section => 
          section.reference && section.reference.toLowerCase().includes(bookLower)
        );
        
        if (referenceMatch) {
          console.log('*** Found reference fallback match:', referenceMatch);
          firstMatchingSection = referenceMatch;
        }
      }
    }
    
    console.log('*** Final matching section found:', firstMatchingSection);
    
    if (firstMatchingSection) {
      // Find the DOM element for this section
      setTimeout(() => {
        const container = document.getElementById('sections-container');
        const sectionButton = container?.querySelector(`button[data-section-id="${firstMatchingSection.id}"]`);
        
        console.log('*** Found section container:', container);
        console.log('*** Found section button:', sectionButton);
        
        if (container && sectionButton) {
          // Log positions to verify calculations
          const containerRect = container.getBoundingClientRect();
          const sectionRect = sectionButton.getBoundingClientRect();
          
          console.log('*** Container measurements:', { 
            left: containerRect.left, 
            width: containerRect.width,
            scrollLeft: container.scrollLeft
          });
          
          console.log('*** Section button measurements:', { 
            left: sectionRect.left, 
            width: sectionRect.width,
            offsetLeft: sectionButton.offsetLeft
          });
          
          // Calculate the target scroll position to center the button
          const scrollLeft = sectionButton.offsetLeft - (containerRect.width / 2) + (sectionRect.width / 2);
          
          console.log('*** Scrolling to position:', scrollLeft);
          
          // Scroll to the section
          container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
          
          console.log('*** Scroll command issued');
          
          // Highlight this section
          setActiveNarrativeSection(firstMatchingSection.id);
          
          // Make the button visually stand out
          sectionButton.classList.add('pulse-animation');
          setTimeout(() => {
            sectionButton.classList.remove('pulse-animation');
          }, 2000);
        } else {
          console.error('*** Failed to find DOM elements:',
            !container ? 'Container missing' : 'Section button missing',
            'Section ID:', firstMatchingSection.id
          );
        }
      }, 600); // Increased delay to ensure DOM is ready
    } else {
      console.warn('*** No matching section found for:', { book, chapter });
    }
  }, [sortedNarrativeSections, setActiveNarrativeSection]);
  
  // Track component re-renders
  useEffect(() => {
    console.log('*** COMPONENT RE-RENDERED with:', { 
      currentBook, 
      currentChapter,
      sectionsCount: sortedNarrativeSections.length,
      domReady: document.getElementById('sections-container') ? 'yes' : 'no'
    });
    
    // Check if we need to scroll to current book/chapter
    const timeout = setTimeout(() => {
      const container = document.getElementById('sections-container');
      if (container) {
        console.log('*** sections-container is ready in DOM after timeout');
        
        // Directly attempt to scroll to the section, independent of the Bible text fetch
        if (typeof scrollToFirstSectionForChapter === 'function') {
          console.log('*** Direct scroll attempt from component render effect');
          scrollToFirstSectionForChapter(currentBook, currentChapter);
        }
      } else {
        console.log('*** sections-container still not in DOM after timeout');
      }
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [currentBook, currentChapter, sortedNarrativeSections, scrollToFirstSectionForChapter]);
  
  // Fetch bible text whenever book or chapter changes
  useEffect(() => {
    console.log('*** useEffect triggered - book/chapter changed:', { book: currentBook, chapter: currentChapter });
    
    const fetchBibleText = async () => {
      setIsLoadingBibleText(true);
      try {
        console.log('*** Fetching Bible text for:', { book: currentBook, chapter: currentChapter });
        const response = await fetch(`/api/getBibleText?book=${currentBook}&chapter=${currentChapter}`);
        if (!response.ok) throw new Error('Failed to fetch Bible text');
        const data = await response.json();
        
        setBibleText(data.text);
        setCurrentVerseRange({ start: 1, end: 31 }); // Reset verse range on chapter change
        
        console.log('*** Bible text fetch complete, now calling scrollToFirstSectionForChapter');
        
        try {
          // Call the function to scroll to the first section for this book/chapter
          if (typeof scrollToFirstSectionForChapter === 'function') {
            console.log('*** scrollToFirstSectionForChapter exists as a function');
            scrollToFirstSectionForChapter(currentBook, currentChapter);
          } else {
            console.error('*** scrollToFirstSectionForChapter is not a function:', scrollToFirstSectionForChapter);
          }
        } catch (scrollError) {
          console.error('*** Error in scrollToFirstSectionForChapter:', scrollError);
        }
        
      } catch (error) {
        console.error('Error fetching Bible text:', error);
        setBibleText('Error loading Bible text. Please try again.');
        
        // Even if the text fetch fails, still attempt to scroll to the correct section
        console.log('*** Attempting to scroll despite fetch error');
        setTimeout(() => {
          try {
            if (typeof scrollToFirstSectionForChapter === 'function') {
              scrollToFirstSectionForChapter(currentBook, currentChapter);
            }
          } catch (scrollError) {
            console.error('*** Error in scrollToFirstSectionForChapter after fetch failure:', scrollError);
          }
        }, 500);
      } finally {
        setIsLoadingBibleText(false);
      }
    };
    
    if (currentBook && currentChapter) {
      fetchBibleText();
    }
  }, [currentBook, currentChapter, scrollToFirstSectionForChapter]);  // Added scrollToFirstSectionForChapter to dependencies
  
  // Add effect to sync with localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('bibleAppSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setIsDarkMode(settings.isDarkMode || false);
      } catch (e) {
        console.error('Error parsing saved settings:', e);
      }
    }
  }, []);

  // Listen for changes to dark mode setting
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSettings = localStorage.getItem('bibleAppSettings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          setIsDarkMode(settings.isDarkMode || false);
        } catch (e) {
          console.error('Error parsing saved settings:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Add useEffect to initialize showGraph based on screen size
  useEffect(() => {
    // On small screens, hide the graph by default
    setShowGraph(isLargeScreen);
  }, [isLargeScreen]);
  
  // Updated return statement with resize functionality
  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans" style={containerStyle}>
      <header className="p-4 bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          {/* Navigation History Section */}
{/*           {breadcrumbs.length > 0 && (
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
          )} */}

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
                console.log('*** Book selected:', book);
                setCurrentBook(book);
                setShowBookSelector(false);
              }}
              className={`px-3 py-2 block w-full text-left text-sm ${
                currentBook === book 
                  ? 'bg-indigo-50 text-indigo-600 font-medium' 
                  : 'text-gray-700 hover:bg-gray-50'
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
                  <>
                    {isLargeScreen ? (
                      // Desktop dropdown
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
                    ) : (
                      // Mobile modal
                      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowChapterSelector(false)}>
                        <div className="bg-white rounded-lg shadow-xl w-5/6 max-w-sm max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-medium text-gray-800">Select Chapter</h3>
                            <button 
                              onClick={() => setShowChapterSelector(false)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <X size={18} className="text-gray-600" />
                            </button>
                          </div>
                          <div className="p-4 overflow-y-auto max-h-[60vh]">
                            <div className="grid grid-cols-5 gap-2">
                              {Array.from({ length: chapterCount }, (_, i) => (
                                <button
                                  key={`chapter-${i + 1}`}
                                  onClick={() => {
                                    setCurrentChapter(i + 1);
                                    setShowChapterSelector(false);
                                  }}
                                  className={`h-12 w-12 text-sm rounded-full flex items-center justify-center ${
                                    currentChapter === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  {i + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Navigation buttons */}
{/*               <div className="flex items-center">
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
              </div> */}
              
              {/* Action buttons */}
              <div className="flex items-center gap-2">
                
                <button
                  className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg"
                  onClick={toggleGraphVisibility}
                  title={showGraph ? "Hide connections" : "Show connections"}
                >
                  {showGraph ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
               {/*  <button
                  className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg"
                  onClick={() => setShowInfo(!showInfo)}
                  title="Show Information"
                >
                  <Info size={18} />
                </button> */}
              </div>
              <AppSettings className="mr-2" />

               {/* Search sections button with slide-out */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    if (!isSearchOpen) {
                      setTimeout(() => {
                        const searchInput = document.getElementById('section-search-input');
                        if (searchInput) {
                          searchInput.focus();
                        }
                      }, 50);
                    }
                  }}
                  className="flex items-center py-2 px-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm"
                  title="Search sections"
                >
                  <Search size={16} />
                </button>
                
                {/* Search input dropdown */}
                <div 
                  className={`absolute top-full right-0 mt-1 transform transition-all duration-300 ease-in-out bg-white border border-gray-200 rounded-lg shadow-md z-50 ${
                    isSearchOpen ? 'opacity-100 w-64 scale-100' : 'opacity-0 w-0 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="relative flex items-center w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="section-search-input"
                      type="text"
                      placeholder="Search sections..."
                      value={sectionSearchTerm}
                      onChange={(e) => setSectionSearchTerm(e.target.value)}
                      onBlur={() => {
                        if (!sectionSearchTerm) {
                          setTimeout(() => setIsSearchOpen(false), 200);
                        }
                      }}
                      className="w-full pl-10 pr-10 py-2 rounded-lg focus:outline-none text-sm"
                    />
                    <button
                      onClick={() => {
                        setSectionSearchTerm('');
                        document.getElementById('section-search-input')?.focus();
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
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
          
          {/* Book indicator that updates as sections scroll */}
          <div 
            className="h-7 px-4 flex items-center border-b border-indigo-100"
            style={{ 
              background: `linear-gradient(to right, ${currentBookColor}15, ${currentBookColor}05)`,
              borderLeft: `3px solid ${currentBookColor}`
            }}
          >
            <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: currentBookColor }}>
              {currentVisibleBook || 'Genesis'}
            </span>
          </div>
          
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
              onScroll={(e) => {
                // Update the current visible book based on scroll position
                const container = e.currentTarget;
                const scrollLeft = container.scrollLeft;
                const containerWidth = container.clientWidth;
                
                // Find the first section that's fully visible or partially visible
                const sections = Array.from(container.querySelectorAll('button[data-section-id]'));
                let visibleSection = null;
                
                for (const section of sections) {
                  const rect = section.getBoundingClientRect();
                  const containerRect = container.getBoundingClientRect();
                  
                  // Check if the section is visible in the viewport
                  if (rect.left >= containerRect.left - rect.width / 2 && 
                      rect.left <= containerRect.right - rect.width / 2) {
                    visibleSection = section;
                    break;
                  }
                }
                
                if (visibleSection) {
                  const sectionId = visibleSection.dataset.sectionId;
                  // Find the section data
                  const section = sortedNarrativeSections.find(s => s.id === sectionId);
                  if (section) {
                    // Set book name
                    if (section.book) {
                      setCurrentVisibleBook(section.book);
                    } else if (section.reference) {
                      // Extract book from reference
                      const match = section.reference.match(/^((?:[1-3]\s+)?[A-Za-z\s]+)/);
                      if (match) {
                        setCurrentVisibleBook(match[1].trim());
                      }
                    }
                    
                    // Find book color from bibleStructure
                    let bookColor = '#6366f1'; // Default color
                    const bookName = section.book || (section.reference ? section.reference.match(/^((?:[1-3]\s+)?[A-Za-z\s]+)/) : null)?.[1]?.trim();
                    
                    if (bookName) {
                      // Find the book in bibleStructure
                      for (const sectionData of Object.values(bibleStructure)) {
                        const foundBook = sectionData.books?.find(b => 
                          b.title?.toLowerCase() === bookName?.toLowerCase() ||
                          b.id?.toLowerCase() === bookName?.toLowerCase()
                        );
                        
                        if (foundBook && foundBook.color) {
                          bookColor = foundBook.color;
                          break;
                        }
                      }
                    }
                    
                    setCurrentBookColor(bookColor);
                  }
                }
              }}
            >
              {/* Group sections by book for better organization */}
              {filteredNarrativeSections.map((section) => {
                // Extract book from reference if not directly available
                let book = section.book;
                if (!book && section.reference) {
                  const match = section.reference.match(/^((?:[1-3]\s+)?[A-Za-z\s]+)/);
                  if (match) {
                    book = match[1].trim();
                  }
                }
                
                return (
                  <button
                    key={section.id}
                    data-section-id={section.id}
                    data-book={book || ''}
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
                );
              })}
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
                 {/*  <div className="mb-4 pb-2 border-b border-indigo-100">
                    <h2 className="text-3xl font-serif font-bold text-indigo-900">{currentBibleReference}</h2>
                  </div> */}
                  
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
                    <div className="text-center text-gray-500 py-8">
                      No sections found in this chapter.
                    </div>
                  )}
                  
                  {/* Next Chapter button at the bottom */}
                  <div className="mt-10 mb-6 flex justify-center">
                    <div className="flex items-center gap-4">
                      <button 
                        className="flex items-center gap-2 py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg shadow-sm transition-colors"
                        onClick={prevChapter}
                      >
                        <ArrowLeft size={18} />
                        <span>Previous Chapter</span>
                      </button>
                      
                      <button 
                        className="flex items-center gap-2 py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg shadow-sm transition-colors"
                        onClick={nextChapter}
                      >
                        <span>Next Chapter</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Resize handle between panels */}
        {renderResizeHandle()}
        
        {showGraph && (
          <div className={`
          
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
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(99, 102, 241, 0);
            transform: scale(1.05);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
            transform: scale(1);
          }
        }
        
        .pulse-animation {
          animation: pulse 0.8s ease-in-out 2;
        }
      `}</style>
      
      {/* Add the NodeInfoPopupWrapper to the visualization */}
      {selectedNodeInfo && (
        <NodeInfoPopupWrapper
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
      {/* AI Dialog */}
      <VerseAIDialog
        isOpen={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        verseReference={selectedVerseReference}
        verseText={bibleText?.split('\n').find(line => {
          const verseNum = selectedVerseReference.split(':')[1];
          return line.trim().startsWith(verseNum);
        })}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default BibleBookConnections;