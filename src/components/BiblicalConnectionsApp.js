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
    console.log("Toggle graph visibility called", { isLargeScreen, showGraph, showGraphModal });
    
    if (isLargeScreen) {
      // On large screens, toggle the graph visibility as before
      setShowGraph(prev => !prev);
    } else {
      // On small screens, toggle the modal state
      console.log("Toggling modal on small screen");
      
      // Force the modal to toggle its state by using the function form
      setShowGraphModal(prevState => {
        const newState = !prevState;
        console.log(`Setting modal state from ${prevState} to ${newState}`);
        return newState;
      });
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

  // Extract the graph content generation to a separate function
  const generateGraphData = () => {
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
    
    // Layout the graph
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
    
    return {
      visData,
      books,
      bookGroups
    };
  };

  // Get the graph data
  const graphData = selectedPassage ? generateGraphData() : null;
  
  // Log during render to debug
  console.log("Main render - graph data and modal state:", {
    hasGraphData: !!graphData,
    showGraphModal,
    isLargeScreen
  });

  // Add event listener to debug clicks
  useEffect(() => {
    const debugClickHandler = (e) => {
      // Log all click events to help debug
      console.log("Document click detected", {
        target: e.target.tagName,
        classes: e.target.className,
        path: e.composedPath().map(el => el.tagName).join(' > ')
      });
    };

    document.addEventListener('click', debugClickHandler);
    return () => document.removeEventListener('click', debugClickHandler);
  }, []);

  // Main component render
  return (
    <div className="min-h-screen max-h-screen flex flex-col bg-slate-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* Alternative eye toggle button at the top of the page */}
      <div className="absolute top-4 right-4 z-50">
        <button
          className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          onClick={() => {
            console.log("Alternative eye button clicked");
            if (isLargeScreen) {
              setShowGraph(prev => !prev);
            } else {
              setShowGraphModal(prev => {
                console.log(`Setting modal from ${prev} to ${!prev}`);
                return !prev;
              });
            }
          }}
          title={showGraph ? "Hide connections" : "Show connections"}
        >
          {showGraph ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      
      {/* Main content area */}
      <div className={`flex-1 relative ${isLargeScreen ? 'flex flex-row' : 'flex flex-col'} overflow-hidden`} ref={containerRef}>
        {/* Other UI components */}
        
        {/* Graph visualization for large screens */}
        {isLargeScreen && showGraph && graphData && (
          <div className="bg-slate-50 w-full h-full relative overflow-hidden">
            {/* Graph content here */}
            {/* ... */}
          </div>
        )}
        
        {/* ... other UI components ... */}
      </div>
      
      {/* Modal - Placed at the root level outside the main layout flow */}
      {showGraphModal && graphData && selectedPassage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2"
          onClick={() => {
            console.log("Modal backdrop clicked");
            setShowGraphModal(false);
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-[95vw] h-[95vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Connections for {selectedPassage.reference}</h2>
              <button 
                onClick={() => {
                  console.log("Close button clicked");
                  setShowGraphModal(false);
                }}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="h-[calc(100%-4rem)] bg-slate-50">
              {/* Graph content in modal */}
              {/* ... */}
            </div>
          </div>
        </div>
      )}
      
      {/* Debug buttons - add this at the end of your main component */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded shadow"
          onClick={() => {
            console.log("Debug: Direct modal toggle");
            setShowGraphModal(prev => !prev);
          }}
        >
          Debug: Toggle Modal
        </button>
        
        <div className="bg-white p-2 rounded shadow text-xs">
          <div>showGraphModal: {String(showGraphModal)}</div>
          <div>showGraph: {String(showGraph)}</div>
          <div>isLargeScreen: {String(isLargeScreen)}</div>
          <div>selectedPassage: {selectedPassage ? "yes" : "no"}</div>
        </div>
      </div>
      
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