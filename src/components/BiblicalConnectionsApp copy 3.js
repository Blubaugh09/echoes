import React, { useState, useRef, useEffect } from 'react';
import { Book, ZoomIn, ZoomOut, ChevronDown, ChevronUp, Info, Layers, ArrowRight, Search, ChevronLeft, ChevronRight, Eye, EyeOff, Maximize, Minimize } from 'lucide-react';

const BiblicalConnectionsApp = () => {
  // Complete Bible structure with book names and chapter counts
  const bibleStructure = [
    // Old Testament
    { id: "genesis", name: "Genesis", chapters: 50, testament: "old" },
    { id: "exodus", name: "Exodus", chapters: 40, testament: "old" },
    { id: "leviticus", name: "Leviticus", chapters: 27, testament: "old" },
    { id: "numbers", name: "Numbers", chapters: 36, testament: "old" },
    { id: "deuteronomy", name: "Deuteronomy", chapters: 34, testament: "old" },
    { id: "joshua", name: "Joshua", chapters: 24, testament: "old" },
    { id: "judges", name: "Judges", chapters: 21, testament: "old" },
    { id: "ruth", name: "Ruth", chapters: 4, testament: "old" },
    { id: "1samuel", name: "1 Samuel", chapters: 31, testament: "old" },
    { id: "2samuel", name: "2 Samuel", chapters: 24, testament: "old" },
    { id: "1kings", name: "1 Kings", chapters: 22, testament: "old" },
    { id: "2kings", name: "2 Kings", chapters: 25, testament: "old" },
    { id: "1chronicles", name: "1 Chronicles", chapters: 29, testament: "old" },
    { id: "2chronicles", name: "2 Chronicles", chapters: 36, testament: "old" },
    { id: "ezra", name: "Ezra", chapters: 10, testament: "old" },
    { id: "nehemiah", name: "Nehemiah", chapters: 13, testament: "old" },
    { id: "esther", name: "Esther", chapters: 10, testament: "old" },
    { id: "job", name: "Job", chapters: 42, testament: "old" },
    { id: "psalms", name: "Psalms", chapters: 150, testament: "old" },
    { id: "proverbs", name: "Proverbs", chapters: 31, testament: "old" },
    { id: "ecclesiastes", name: "Ecclesiastes", chapters: 12, testament: "old" },
    { id: "songofsolomon", name: "Song of Solomon", chapters: 8, testament: "old" },
    { id: "isaiah", name: "Isaiah", chapters: 66, testament: "old" },
    { id: "jeremiah", name: "Jeremiah", chapters: 52, testament: "old" },
    { id: "lamentations", name: "Lamentations", chapters: 5, testament: "old" },
    { id: "ezekiel", name: "Ezekiel", chapters: 48, testament: "old" },
    { id: "daniel", name: "Daniel", chapters: 12, testament: "old" },
    { id: "hosea", name: "Hosea", chapters: 14, testament: "old" },
    { id: "joel", name: "Joel", chapters: 3, testament: "old" },
    { id: "amos", name: "Amos", chapters: 9, testament: "old" },
    { id: "obadiah", name: "Obadiah", chapters: 1, testament: "old" },
    { id: "jonah", name: "Jonah", chapters: 4, testament: "old" },
    { id: "micah", name: "Micah", chapters: 7, testament: "old" },
    { id: "nahum", name: "Nahum", chapters: 3, testament: "old" },
    { id: "habakkuk", name: "Habakkuk", chapters: 3, testament: "old" },
    { id: "zephaniah", name: "Zephaniah", chapters: 3, testament: "old" },
    { id: "haggai", name: "Haggai", chapters: 2, testament: "old" },
    { id: "zechariah", name: "Zechariah", chapters: 14, testament: "old" },
    { id: "malachi", name: "Malachi", chapters: 4, testament: "old" },
    // New Testament
    { id: "matthew", name: "Matthew", chapters: 28, testament: "new" },
    { id: "mark", name: "Mark", chapters: 16, testament: "new" },
    { id: "luke", name: "Luke", chapters: 24, testament: "new" },
    { id: "john", name: "John", chapters: 21, testament: "new" },
    { id: "acts", name: "Acts", chapters: 28, testament: "new" },
    { id: "romans", name: "Romans", chapters: 16, testament: "new" },
    { id: "1corinthians", name: "1 Corinthians", chapters: 16, testament: "new" },
    { id: "2corinthians", name: "2 Corinthians", chapters: 13, testament: "new" },
    { id: "galatians", name: "Galatians", chapters: 6, testament: "new" },
    { id: "ephesians", name: "Ephesians", chapters: 6, testament: "new" },
    { id: "philippians", name: "Philippians", chapters: 4, testament: "new" },
    { id: "colossians", name: "Colossians", chapters: 4, testament: "new" },
    { id: "1thessalonians", name: "1 Thessalonians", chapters: 5, testament: "new" },
    { id: "2thessalonians", name: "2 Thessalonians", chapters: 3, testament: "new" },
    { id: "1timothy", name: "1 Timothy", chapters: 6, testament: "new" },
    { id: "2timothy", name: "2 Timothy", chapters: 4, testament: "new" },
    { id: "titus", name: "Titus", chapters: 3, testament: "new" },
    { id: "philemon", name: "Philemon", chapters: 1, testament: "new" },
    { id: "hebrews", name: "Hebrews", chapters: 13, testament: "new" },
    { id: "james", name: "James", chapters: 5, testament: "new" },
    { id: "1peter", name: "1 Peter", chapters: 5, testament: "new" },
    { id: "2peter", name: "2 Peter", chapters: 3, testament: "new" },
    { id: "1john", name: "1 John", chapters: 5, testament: "new" },
    { id: "2john", name: "2 John", chapters: 1, testament: "new" },
    { id: "3john", name: "3 John", chapters: 1, testament: "new" },
    { id: "jude", name: "Jude", chapters: 1, testament: "new" },
    { id: "revelation", name: "Revelation", chapters: 22, testament: "new" }
  ];

  // Define Bible narrative sections
  const bibleSections = [
    // Genesis narrative arc
    { id: "creation", reference: "Genesis 1", title: "Creation", book: "genesis", chapter: 1 },
    { id: "eden", reference: "Genesis 2", title: "Eden", book: "genesis", chapter: 2 },
    { id: "fall", reference: "Genesis 3", title: "Fall", book: "genesis", chapter: 3 },
    { id: "flood", reference: "Genesis 6-9", title: "Flood", book: "genesis", chapter: 6 },
    { id: "babel", reference: "Genesis 11", title: "Babel", book: "genesis", chapter: 11 },
    { id: "abraham", reference: "Genesis 12", title: "Abraham", book: "genesis", chapter: 12 },
    // Exodus to Deuteronomy
    { id: "exodus", reference: "Exodus 1", title: "Exodus", book: "exodus", chapter: 1 },
    { id: "sinai", reference: "Exodus 19", title: "Sinai", book: "exodus", chapter: 19 },
    { id: "tabernacle", reference: "Exodus 25", title: "Tabernacle", book: "exodus", chapter: 25 },
    { id: "wilderness", reference: "Numbers 10", title: "Wilderness", book: "numbers", chapter: 10 },
    // Historical books
    { id: "conquest", reference: "Joshua 1", title: "Conquest", book: "joshua", chapter: 1 },
    { id: "judges", reference: "Judges 1", title: "Judges", book: "judges", chapter: 1 },
    { id: "kingdom", reference: "1 Samuel 8", title: "Kingdom", book: "1samuel", chapter: 8 },
    { id: "exile", reference: "2 Kings 25", title: "Exile", book: "2kings", chapter: 25 },
    { id: "return", reference: "Ezra 1", title: "Return", book: "ezra", chapter: 1 },
    // Gospels
    { id: "incarnation", reference: "Matthew 1", title: "Incarnation", book: "matthew", chapter: 1 },
    { id: "ministry", reference: "Mark 1", title: "Ministry", book: "mark", chapter: 1 },
    { id: "passion", reference: "John 18", title: "Passion", book: "john", chapter: 18 },
    { id: "resurrection", reference: "Matthew 28", title: "Resurrection", book: "matthew", chapter: 28 },
    // Acts to Revelation
    { id: "church", reference: "Acts 2", title: "Church", book: "acts", chapter: 2 },
    { id: "mission", reference: "Acts 13", title: "Mission", book: "acts", chapter: 13 },
    { id: "letters", reference: "Romans 1", title: "Letters", book: "romans", chapter: 1 },
    { id: "revelation", reference: "Revelation 1", title: "Revelation", book: "revelation", chapter: 1 }
  ];

  // Define API key and settings
  const ESV_API_KEY = 'c3be9ae20e39bd6637c709cd2e94fd42135764d1'; // Your ESV API key
  const ESV_API_URL = 'https://api.esv.org/v3/passage/text/';

  // State for Bible text and navigation
  const [bibleText, setBibleText] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTestament, setActiveTestament] = useState("old");
  const [activeBook, setActiveBook] = useState("genesis");
  const [activeChapter, setActiveChapter] = useState(1);
  const [activeNarrativeSection, setActiveNarrativeSection] = useState("creation"); // Current narrative section
  const [bookSearch, setBookSearch] = useState("");
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [chapterSections, setChapterSections] = useState([]);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  // New states for layout control
  const [showGraph, setShowGraph] = useState(true); // Toggle for graph visibility
  const [isLargeScreen, setIsLargeScreen] = useState(false); // Track screen size for responsive layout

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // 1024px is typically 'lg' breakpoint
    };
    
    checkScreenSize(); // Check on initial load
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Generate section IDs based on book and chapter
  const generateSectionIds = (book, chapter) => {
    // Special handling for Genesis 1-3 (our visualization data)
    if (book === "genesis" && chapter >= 1 && chapter <= 3) {
      const sectionMapping = {
        1: [
          { id: "Genesis 1:1-2", title: "Creation Beginning" },
          { id: "Genesis 1:3-25", title: "Six Days of Creation" },
          { id: "Genesis 1:26-31", title: "Creation of Humanity" }
        ],
        2: [
          { id: "Genesis 2:1-3", title: "Sabbath Rest" },
          { id: "Genesis 2:4-17", title: "Garden of Eden" },
          { id: "Genesis 2:18-25", title: "Creation of Woman" }
        ],
        3: [
          { id: "Genesis 3:1-7", title: "The Temptation" },
          { id: "Genesis 3:8-19", title: "The Judgment" },
          { id: "Genesis 3:20-24", title: "Consequence and Promise" }
        ]
      };
      
      return sectionMapping[chapter] || [];
    }
    
    // For other books/chapters, create a single section for the whole chapter
    const book_obj = bibleStructure.find(b => b.id === book);
    if (book_obj) {
      return [{ id: `${book_obj.name} ${chapter}`, title: "Full Chapter" }];
    }
    
    return []; // Return empty array for books/chapters without defined sections
  };
  
  // Effect to scroll the active narrative section into view
  useEffect(() => {
    // Allow the DOM to update first
    setTimeout(() => {
      const sectionButton = document.getElementById(`section-${activeNarrativeSection}`);
      const container = document.getElementById('sections-container');
      
      if (sectionButton && container) {
        // Calculate the position to scroll to (centered)
        const buttonRect = sectionButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollLeft = sectionButton.offsetLeft - (containerRect.width / 2) + (buttonRect.width / 2);
        
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }, 100);
  }, [activeNarrativeSection]);

  // Update sections when book or chapter changes
  useEffect(() => {
    const newSections = generateSectionIds(activeBook, activeChapter);
    setChapterSections(newSections);
    
    if (newSections.length > 0) {
      setActiveSectionsList(newSections.map(section => section.id));
      setActiveSection(newSections[0].id);
    } else {
      setActiveSectionsList([]);
      setActiveSection(null);
    }
    
    // Update active narrative section based on book and chapter
    const matchingSection = bibleSections.find(
      section => section.book === activeBook && section.chapter === activeChapter
    );
    if (matchingSection) {
      setActiveNarrativeSection(matchingSection.id);
    } else {
      // Find the closest section that comes before this book/chapter
      const bookIndex = bibleStructure.findIndex(b => b.id === activeBook);
      if (bookIndex >= 0) {
        const sectionsBefore = bibleSections.filter(section => {
          const sectionBookIndex = bibleStructure.findIndex(b => b.id === section.book);
          return (sectionBookIndex < bookIndex) || 
                 (sectionBookIndex === bookIndex && section.chapter <= activeChapter);
        });
        
        if (sectionsBefore.length > 0) {
          // Get the latest section before current position
          const closestSection = sectionsBefore[sectionsBefore.length - 1];
          setActiveNarrativeSection(closestSection.id);
        }
      }
    }
    
    // Reset visualization
    setSelectedNode(null);
    setPanOffset({ x: 0, y: 0 });
    setDepthLevel(1);
  }, [activeBook, activeChapter]);
  
  // State initialization for visualization
  const [activeSectionsList, setActiveSectionsList] = useState([]);
  const [activeSection, setActiveSection] = useState(null);

  // Fetch ESV Bible text
  useEffect(() => {
    const fetchBibleText = async () => {
      // Skip fetching if we don't have any sections defined
      if (activeSectionsList.length === 0) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const results = {};
        
        // Fetch each passage
        for (const passage of activeSectionsList) {
          const params = new URLSearchParams({
            q: passage,
            "include-passage-references": false,
            "include-verse-numbers": true,
            "include-first-verse-numbers": true,
            "include-footnotes": false,
            "include-headings": false,
          });
          
          const response = await fetch(`${ESV_API_URL}?${params}`, {
            headers: {
              'Authorization': `Token ${ESV_API_KEY}`
            }
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch ${passage}: ${response.statusText}`);
          }
          
          const data = await response.json();
          results[passage] = data.passages[0].trim();
        }
        
        setBibleText(results);
      } catch (error) {
        console.error("Error fetching Bible text:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBibleText();
  }, [activeSectionsList]);

  // Book selector functions
  const filteredBooks = bookSearch
    ? bibleStructure.filter(book => 
        book.name.toLowerCase().includes(bookSearch.toLowerCase()) &&
        (activeTestament === "all" || book.testament === activeTestament)
      )
    : bibleStructure.filter(book => 
        activeTestament === "all" || book.testament === activeTestament
      );

  // Update section refs when chapter sections change
  const textContainerRef = useRef(null);
  const sectionRefs = useRef([]);
  
  useEffect(() => {
    // Create new refs for each section
    sectionRefs.current = chapterSections.map(() => React.createRef());
  }, [chapterSections]);
  
  // Connections visualization data structure
  // Genesis 1-3 connections (existing data from your original code)
  const passageSections = {};

  // Extra states for visualization and UI
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [depthLevel, setDepthLevel] = useState(1);
  const [showLevelInfo, setShowLevelInfo] = useState(false);
  
  // Max depth level available
  const maxDepthLevel = 3;
  
  // Edge type styles
  const edgeStyles = {
    direct_reference: { color: "#6366F1", dash: "none", thickness: 3, label: "Direct Reference" },
    thematic: { color: "#EC4899", dash: "5,5", thickness: 2, label: "Thematic Connection" },
    symbolic: { color: "#10B981", dash: "10,5", thickness: 2, label: "Symbolic Echo" }
  };
  
  // Handle scroll events to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (textContainerRef.current) {
        setScrollY(textContainerRef.current.scrollTop);
        
        // Determine which section is most visible
        const containerTop = textContainerRef.current.scrollTop;
        const containerHeight = textContainerRef.current.clientHeight;
        const containerBottom = containerTop + containerHeight;
        
        let maxVisibleArea = 0;
        let mostVisibleSection = activeSection;
        
        sectionRefs.current.forEach((ref, index) => {
          if (ref && ref.current) {
            const sectionTop = ref.current.offsetTop;
            const sectionHeight = ref.current.clientHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Calculate visible area of this section
            const visibleTop = Math.max(containerTop, sectionTop);
            const visibleBottom = Math.min(containerBottom, sectionBottom);
            const visibleArea = Math.max(0, visibleBottom - visibleTop);
            
            if (visibleArea > maxVisibleArea) {
              maxVisibleArea = visibleArea;
              mostVisibleSection = activeSectionsList[index];
            }
          }
        });
        
        if (mostVisibleSection !== activeSection && mostVisibleSection) {
          console.log('Changing active section to:', mostVisibleSection);
          setActiveSection(mostVisibleSection);
          // Reset depth level when changing sections
          setDepthLevel(1);
          // Reset selected node when changing sections
          setSelectedNode(null);
        }
      }
    };
    
    const container = textContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [activeSection, activeSectionsList]);
  
  // Get all connections for current section based on depth level
  const getAllConnections = () => {
    if (!passageSections[activeSection]) return [];
    
    const primaryNodes = passageSections[activeSection].connections;
    
    if (depthLevel === 1) {
      return primaryNodes;
    }
    
    // Add deeper connections based on depth level
    let allConnections = [...primaryNodes];
    
    // Add level 2 connections if depth level is at least 2
    if (depthLevel >= 2) {
      primaryNodes.forEach(node => {
        if (node.deeperConnections) {
          const level2Connections = node.deeperConnections.filter(conn => conn.level === 2);
          allConnections = [...allConnections, ...level2Connections];
        }
      });
    }
    
    // Add level 3 connections if depth level is 3
    if (depthLevel >= 3) {
      primaryNodes.forEach(node => {
        if (node.deeperConnections) {
          const level3Connections = node.deeperConnections.filter(conn => conn.level === 3);
          allConnections = [...allConnections, ...level3Connections];
        }
      });
    }
    
    return allConnections;
  };
  
  // Get connection lines to draw
  const getConnectionLines = () => {
    if (!passageSections[activeSection]) return [];
    
    const connections = [];
    const allNodes = getAllConnections();
    
    // First level connections (explicitly defined in the data structure)
    passageSections[activeSection].connections.forEach(node => {
      node.connections.forEach(conn => {
        // Only include if target exists and is within current depth level
        const target = allNodes.find(n => n.id === conn.targetId);
        if (target && conn.level <= depthLevel) {
          connections.push({
            sourceId: node.id,
            targetId: conn.targetId,
            sourceNode: node,
            targetNode: target,
            type: conn.type,
            strength: conn.strength,
            level: conn.level
          });
        }
      });
    });
    
    // For deeper connections, create implicit connections to their "parent" nodes
    if (depthLevel >= 2) {
      passageSections[activeSection].connections.forEach(node => {
        if (node.deeperConnections) {
          node.deeperConnections.forEach(deepNode => {
            if (deepNode.level <= depthLevel) {
              // Determine connection type based on node's level
              const deepConnectionType = deepNode.level === 2 ? "thematic" : "symbolic";
              const deepConnectionStrength = 0.6 - ((deepNode.level - 2) * 0.1); // Weaker the deeper it goes
              
              connections.push({
                sourceId: node.id,
                targetId: deepNode.id,
                sourceNode: node,
                targetNode: deepNode,
                type: deepConnectionType,
                strength: deepConnectionStrength,
                level: deepNode.level
              });
            }
          });
        }
      });
    }
    
    return connections;
  };
  
  // Handle node click
  const handleNodeClick = (nodeId) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };
  
  // Get current section index and find sections for visualization
  const currentSectionIndex = activeSectionsList.indexOf(activeSection);
  
  // Get previous and next sections if they exist
  const prevSection = currentSectionIndex > 0 ? activeSectionsList[currentSectionIndex - 1] : null;
  const nextSection = currentSectionIndex < activeSectionsList.length - 1 ? activeSectionsList[currentSectionIndex + 1] : null;
  
  // Zoom controls
  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 0.2, 0.5));
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  // Jump to a specific section
  const jumpToSection = (sectionId) => {
    const index = activeSectionsList.indexOf(sectionId);
    if (index >= 0 && sectionRefs.current[index] && sectionRefs.current[index].current) {
      textContainerRef.current.scrollTo({
        top: sectionRefs.current[index].current.offsetTop,
        behavior: 'smooth'
      });
    }
  };
  
  // Depth level controls
  const increaseDepthLevel = () => {
    if (depthLevel < maxDepthLevel) {
      setDepthLevel(depthLevel + 1);
    }
  };
  
  const decreaseDepthLevel = () => {
    if (depthLevel > 1) {
      setDepthLevel(depthLevel - 1);
    }
  };
  
  // Find the current chapter title
  const getCurrentBookChapter = () => {
    const book = bibleStructure.find(b => b.id === activeBook);
    return book ? `${book.name} ${activeChapter}` : "";
  };
  
  // Navigation functions
  const handleBookChange = (bookId) => {
    setActiveBook(bookId);
    // Set to chapter 1 when changing books
    setActiveChapter(1);
    // Hide book selector after selection
    setShowBookSelector(false);
  };
  
  // Handle narrative section selection
  const handleSectionSelect = (sectionId) => {
    // Find the selected section
    const section = bibleSections.find(s => s.id === sectionId);
    if (section) {
      // Update active narrative section
      setActiveNarrativeSection(sectionId);
      
      // Navigate to the corresponding book and chapter
      setActiveBook(section.book);
      setActiveChapter(section.chapter);
    }
  };
  
  const handleChapterChange = (chapterNum) => {
    setActiveChapter(chapterNum);
  };

  const navigateToNextChapter = () => {
    const book = bibleStructure.find(b => b.id === activeBook);
    if (book && activeChapter < book.chapters) {
      setActiveChapter(activeChapter + 1);
    } else {
      // Move to next book
      const currentBookIndex = bibleStructure.findIndex(b => b.id === activeBook);
      if (currentBookIndex < bibleStructure.length - 1) {
        setActiveBook(bibleStructure[currentBookIndex + 1].id);
        setActiveChapter(1);
      }
    }
  };

  const navigateToPreviousChapter = () => {
    if (activeChapter > 1) {
      setActiveChapter(activeChapter - 1);
    } else {
      // Move to previous book
      const currentBookIndex = bibleStructure.findIndex(b => b.id === activeBook);
      if (currentBookIndex > 0) {
        const prevBook = bibleStructure[currentBookIndex - 1];
        setActiveBook(prevBook.id);
        setActiveChapter(prevBook.chapters);
      }
    }
  };

  // Toggle graph visibility
  const toggleGraphVisibility = () => {
    setShowGraph(!showGraph);
  };
  
  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="p-4 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Book className="text-indigo-600" size={24} />
          <h1 className="text-xl font-semibold text-indigo-700">Echoes</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleGraphVisibility}
            className="p-2 rounded-full hover:bg-slate-100"
            title={showGraph ? "Hide connections" : "Show connections"}
          >
            {showGraph ? <EyeOff size={20} className="text-slate-600" /> : <Eye size={20} className="text-slate-600" />}
          </button>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full hover:bg-slate-100"
            title="Show info"
          >
            <Info size={20} className="text-slate-600" />
          </button>
          <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            {getCurrentBookChapter()}
          </div>
        </div>
      </header>
      
{/* 
        NOTE: Add this state variable to your component:
        const [showChapterSelector, setShowChapterSelector] = useState(false);
      */}
      
      {/* Book and chapter navigation */}
      <div className="bg-white border-b border-slate-200 px-4 py-2">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          {/* Book selector button */}
          <div className="relative">
            <button
              onClick={() => setShowBookSelector(!showBookSelector)}
              className="flex items-center space-x-2 py-2 px-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <span className="font-medium">{bibleStructure.find(b => b.id === activeBook)?.name || "Select Book"}</span>
              <ChevronDown size={16} />
            </button>
            
            {/* Book selector dropdown */}
            {showBookSelector && (
              <div className="absolute top-12 left-0 w-72 max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg border border-slate-200 z-30">
                <div className="p-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2 px-2 py-1 bg-slate-100 rounded">
                    <Search size={16} className="text-slate-500" />
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
                      className={`text-xs px-2 py-1 rounded ${activeTestament === "all" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setActiveTestament("old")}
                      className={`text-xs px-2 py-1 rounded ${activeTestament === "old" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}
                    >
                      Old Testament
                    </button>
                    <button
                      onClick={() => setActiveTestament("new")}
                      className={`text-xs px-2 py-1 rounded ${activeTestament === "new" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}
                    >
                      New Testament
                    </button>
                  </div>
                </div>
                
                <div className="p-2">
                  {filteredBooks.length === 0 ? (
                    <div className="text-center py-4 text-slate-500">No books found</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1">
                      {filteredBooks.map(book => (
                        <button
                          key={book.id}
                          onClick={() => handleBookChange(book.id)}
                          className={`text-left px-3 py-2 rounded text-sm ${
                            activeBook === book.id
                              ? "bg-indigo-100 text-indigo-700 font-medium"
                              : "hover:bg-slate-100"
                          }`}
                        >
                          {book.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Chapter navigation - Updated to use dropdown */}
          <div className="flex items-center space-x-3">
            <button
              onClick={navigateToPreviousChapter}
              className="p-1 rounded-full hover:bg-slate-100"
              aria-label="Previous chapter"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowChapterSelector(prev => !prev)}
                className="flex items-center space-x-2 py-1.5 px-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <span className="font-medium">Chapter {activeChapter}</span>
                <ChevronDown size={16} />
              </button>
              
              {/* Chapter selector dropdown */}
              {showChapterSelector && (
                <div className="absolute top-10 left-0 w-64 max-h-80 overflow-y-auto bg-white shadow-lg rounded-lg border border-slate-200 z-30">
                  <div className="p-2">
                    <div className="grid grid-cols-5 gap-1">
                      {Array.from({ length: bibleStructure.find(b => b.id === activeBook)?.chapters || 0 }, (_, i) => (
                        <button
                          key={`chapter-${i+1}`}
                          onClick={() => {
                            handleChapterChange(i+1);
                            setShowChapterSelector(false);
                          }}
                          className={`h-8 w-8 text-xs rounded-full flex items-center justify-center ${
                            activeChapter === i+1
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {i+1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={navigateToNextChapter}
              className="p-1 rounded-full hover:bg-slate-100"
              aria-label="Next chapter"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Bible narrative sections navigation */}
      <div className="bg-white border-b border-slate-200 relative">
        {/* Section flow indicator line */}
        <div className="absolute h-1 bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60"></div>
        
        <div className="flex items-center">
          {/* Left scroll button */}
          <button 
            className="sticky left-0 px-2 py-3 bg-gradient-to-r from-white to-transparent z-10 hover:bg-slate-50"
            onClick={() => {
              const container = document.getElementById('sections-container');
              if (container) {
                container.scrollBy({ left: -200, behavior: 'smooth' });
              }
            }}
          >
            <ChevronLeft size={16} className="text-slate-600" />
          </button>
          
          {/* Scrollable sections */}
          <div 
            id="sections-container"
            className="flex-1 overflow-x-auto py-2 px-2 flex space-x-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {bibleSections.map((section) => (
              <button
                key={section.id}
                id={`section-${section.id}`}
                onClick={() => handleSectionSelect(section.id)}
                className={`py-1 px-3 text-sm font-medium rounded-full transition-colors whitespace-nowrap relative ${
                  activeNarrativeSection === section.id 
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
                }`}
              >
                {section.title}
                <span className="ml-1 text-xs text-slate-400 hidden sm:inline">{section.reference}</span>
                
                {/* Active indicator dot */}
                {activeNarrativeSection === section.id && (
                  <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                )}
              </button>
            ))}
          </div>
          
          {/* Right scroll button */}
          <button 
            className="sticky right-0 px-2 py-3 bg-gradient-to-l from-white to-transparent z-10 hover:bg-slate-50"
            onClick={() => {
              const container = document.getElementById('sections-container');
              if (container) {
                container.scrollBy({ left: 200, behavior: 'smooth' });
              }
            }}
          >
            <ChevronRight size={16} className="text-slate-600" />
          </button>
        </div>
      </div>
      
      {/* Info modal */}
      {showInfo && (
        <div className="absolute top-16 right-4 z-20 bg-white rounded-lg shadow-lg p-4 w-72 border border-slate-200">
          <h3 className="font-semibold text-indigo-700 mb-2">Connection Types</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-6 h-1 bg-indigo-600 mr-2"></div>
              <span>Direct Reference</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-1 bg-pink-500 mr-2 border-dashed border-t-2"></div>
              <span>Thematic Connection</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-1 bg-emerald-500 mr-2 border-dotted border-t-2"></div>
              <span>Symbolic Echo</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-indigo-700 mt-4 mb-2">Depth Levels</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-indigo-600 mr-2"></div>
              <span>Level 1: Direct connections</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-violet-500 mr-2"></div>
              <span>Level 2: Secondary connections</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
              <span>Level 3: Tertiary connections</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Depth level info modal */}
      {showLevelInfo && (
        <div className="absolute top-16 left-20 z-20 bg-white rounded-lg shadow-lg p-4 w-72 border border-slate-200">
          <h3 className="font-semibold text-indigo-700 mb-2">Depth Levels Explained</h3>
          <div className="space-y-3 text-sm">
            <p><span className="font-semibold">Level 1:</span> Direct connections to the primary passage.</p>
            <p><span className="font-semibold">Level 2:</span> Secondary connections that are one step removed but share important theological themes.</p>
            <p><span className="font-semibold">Level 3:</span> Tertiary connections that reveal deeper biblical patterns and motifs.</p>
            <div className="mt-2 text-slate-500 italic">
              Increase the depth level to explore deeper relationships between passages.
            </div>
          </div>
        </div>
      )}
      
      {/* Main content - responsive layout */}
      <div className={`flex-1 ${isLargeScreen ? 'flex flex-row' : 'flex flex-col'} overflow-hidden`}>
        {/* Scripture reading section */}
        <div 
          className={`
            bg-white overflow-y-auto transition-all duration-300
            ${isLargeScreen ? (showGraph ? 'w-1/2' : 'w-full') : (isExpanded ? 'h-1/5' : showGraph ? 'h-2/5' : 'h-full')}
          `}
          ref={textContainerRef}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600">Loading Bible text...</p>
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto px-8 py-6">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <p className="font-medium">Error loading Bible text</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto px-8 py-6">
              <h2 className="text-2xl font-serif mb-4 text-slate-800">{getCurrentBookChapter()}</h2>
              
              {/* Section navigation tabs */}
              <div className="flex mb-4 border-b border-slate-200">
                {chapterSections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => jumpToSection(section.id)}
                    className={`py-2 px-4 font-medium text-sm ${
                      activeSection === section.id 
                        ? 'text-indigo-600 border-b-2 border-indigo-600' 
                        : 'text-slate-600 hover:text-indigo-500'
                    }`}
                  >
                    {section.id}
                    {section.title && <span className="ml-1 text-xs text-slate-500">({section.title})</span>}
                  </button>
                ))}
              </div>
              
              {/* Scripture sections */}
              {activeSectionsList.map((section, index) => (
                <div 
                  key={section}
                  ref={sectionRefs.current[index]}
                  className="mb-8"
                >
                  <h3 className="text-lg font-medium mb-2 text-indigo-700">{section}</h3>
                  <p className="text-lg leading-relaxed font-serif text-slate-700">
                    {bibleText[section]}
                  </p>
                </div>
              ))}
              
              {/* Show Text/Graph toggle button for small screens */}
              {!isLargeScreen && showGraph && (
                <button 
                  onClick={toggleExpand}
                  className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  {isExpanded ? (
                    <>Show more text <ChevronDown size={16} className="ml-1" /></>
                  ) : (
                    <>Show less text <ChevronUp size={16} className="ml-1" /></>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Divider for vertical layout */}
        {!isLargeScreen && showGraph && (
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        )}
        
        {/* Divider for horizontal layout */}
        {isLargeScreen && showGraph && (
          <div className="w-2 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>
        )}
        
        {/* Connections visualization - only show if enabled and we have data for the current section */}
        {showGraph && (
          <div className={`
            bg-slate-50 relative overflow-hidden transition-all duration-300
            ${isLargeScreen ? 'w-1/2' : (isExpanded ? 'h-4/5' : 'h-3/5')}
          `}>
            {/* Add CSS animations */}
            <style>
              {`
                @keyframes appear {
                  from { opacity: 0; transform: scale(0.8); }
                  to { opacity: 1; transform: scale(1); }
                }
                
                @keyframes slideUp {
                  from { transform: translateY(20px); opacity: 0; }
                  to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes pulse {
                  0% { transform: scale(1); opacity: 0.8; }
                  50% { transform: scale(1.05); opacity: 1; }
                  100% { transform: scale(1); opacity: 0.8; }
                }
                
                .node-enter {
                  animation: appear 0.5s forwards;
                }
                
                .connection-line {
                  transition: opacity 0.3s, stroke-width 0.3s;
                }
                
                .grab-cursor {
                  cursor: grab;
                }
                
                .grabbing-cursor {
                  cursor: grabbing;
                }
                
                .depth-indicator {
                  animation: pulse 2s infinite ease-in-out;
                }
                
                .level-change {
                  transition: all 0.5s ease-in-out;
                }
                
                .depth-level-badge {
                  transition: background-color 0.3s;
                }
              `}
            </style>
            
            {/* Visualization section header */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-full shadow-md text-sm">
              <span className="text-indigo-700 font-medium">{activeSection || "Select a section"}</span>
            </div>
            
            {/* Zoom controls */}
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
            
            {/* Depth level controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 bg-white p-3 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-700">Connection Depth</span>
                <button
                  onClick={() => setShowLevelInfo(!showLevelInfo)}
                  className="p-1 rounded hover:bg-slate-100"
                >
                  <Info size={14} className="text-slate-500" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={decreaseDepthLevel}
                  className="p-1 rounded hover:bg-slate-100 disabled:opacity-50"
                  disabled={depthLevel <= 1}
                >
                  <ChevronDown size={18} className="text-slate-700" />
                </button>
                
                <div className="flex space-x-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium cursor-pointer transition-colors duration-300 ${
                        depthLevel >= level 
                          ? level === 1 
                            ? 'bg-indigo-600 text-white' 
                            : level === 2 
                              ? 'bg-violet-500 text-white'
                              : 'bg-purple-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                      onClick={() => setDepthLevel(level)}
                    >
                      {level}
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={increaseDepthLevel}
                  className="p-1 rounded hover:bg-slate-100 disabled:opacity-50"
                  disabled={depthLevel >= maxDepthLevel}
                >
                  <ChevronUp size={18} className="text-slate-700" />
                </button>
              </div>
            </div>
            
            {/* Visualization controls */}
            <div className="absolute bottom-4 left-4 z-10 bg-white p-2 rounded-lg shadow-md">
              <div className="text-xs text-slate-500 mb-1 font-medium">Visualization Controls</div>
              <div className="flex items-center mb-2">
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100"
                  onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))}
                  aria-label="Zoom out"
                >
                  -
                </button>
                <div className="w-12 text-center text-sm">{Math.round(zoomLevel * 100)}%</div>
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100"
                  onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 2))}
                  aria-label="Zoom in"
                >
                  +
                </button>
              </div>
              <button
                className="w-full py-1 px-2 text-xs bg-slate-100 rounded hover:bg-slate-200 text-slate-700"
                onClick={() => setPanOffset({ x: 0, y: 0 })}
              >
                Reset View
              </button>
            </div>
            
            {/* Depth level indicator */}
            <div className="absolute bottom-4 right-4 z-10 bg-white p-2 rounded-lg shadow-md transition-all duration-300">
              <div className="text-xs text-slate-500 mb-1 font-medium">Current Depth Level</div>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  depthLevel === 1 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : depthLevel === 2 
                      ? 'bg-violet-100 text-violet-800'
                      : 'bg-purple-100 text-purple-800'
                }`}>
                  Level {depthLevel}
                </div>
                <div className="text-xs text-slate-600">
                  {depthLevel === 1 
                    ? 'Direct connections' 
                    : depthLevel === 2 
                      ? 'Secondary themes'
                      : 'Deep theological patterns'}
                </div>
              </div>
            </div>
            
            {passageSections[activeSection] ? (
              /* SVG Connections Graph */
              <svg 
                width="100%" 
                height="100%" 
                style={{ 
                  transform: `scale(${zoomLevel})`, 
                  transformOrigin: 'center',
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                viewBox="0 0 600 300"
                className="transition-transform duration-200"
                onMouseDown={(e) => {
                  setIsDragging(true);
                  setDragStart({ x: e.clientX, y: e.clientY });
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
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              >
                <g transform={`translate(${panOffset.x}, ${panOffset.y})`}>
                  {/* Previous section (ghosted to the left) */}
                  {prevSection && passageSections[prevSection] && (
                    <g transform={`translate(-200, 0)`} opacity="0.3">
                      {/* Render edges */}
                      {passageSections[prevSection].connections.map(node => 
                        node.connections.map((conn, idx) => {
                          const target = passageSections[prevSection].connections.find(n => n.id === conn.targetId);
                          const edgeStyle = edgeStyles[conn.type];
                          
                          if (!target) return null;
                          
                          // Calculate control point for curved lines
                          const dx = target.x - node.x;
                          const dy = target.y - node.y;
                          const dist = Math.sqrt(dx * dx + dy * dy);
                          const midX = (node.x + target.x) / 2;
                          const curveMagnitude = Math.min(dist * 0.3, 60);
                          const midY = (node.y + target.y) / 2 - curveMagnitude;
                          
                          return (
                            <g key={`prev-edge-${node.id}-${conn.targetId}`}>
                              <path 
                                d={`M ${node.x} ${node.y} Q ${midX} ${midY} ${target.x} ${target.y}`}
                                stroke={edgeStyle.color}
                                strokeWidth={edgeStyle.thickness * (conn.strength || 1)}
                                strokeDasharray={edgeStyle.dash}
                                fill="none"
                              />
                            </g>
                          );
                        })
                      )}
                      
                      {/* Render nodes */}
                      {passageSections[prevSection].connections.map(node => (
                        <g key={`prev-node-${node.id}`}>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.size}
                            fill={node.id === 1 ? "#4F46E5" : "#FFFFFF"}
                            stroke="#6366F1"
                            strokeWidth={1.5}
                          />
                          
                          <text
                            x={node.x}
                            y={node.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="10"
                            fill={node.id === 1 ? "#FFFFFF" : "#6366F1"}
                            fontWeight="bold"
                          >
                            {node.theme}
                          </text>
                        </g>
                      ))}
                    </g>
                  )}
                  
                  {/* Active section (center, fully visible) */}
                  <g transform="translate(0, 0)">
                    {/* Render connection lines */}
                    {getConnectionLines().map((conn, idx) => {
                      const edgeStyle = edgeStyles[conn.type];
                      
                      // Calculate control point for curved lines
                      const dx = conn.targetNode.x - conn.sourceNode.x;
                      const dy = conn.targetNode.y - conn.sourceNode.y;
                      const dist = Math.sqrt(dx * dx + dy * dy);
                      const midX = (conn.sourceNode.x + conn.targetNode.x) / 2;
                      const curveMagnitude = Math.min(dist * 0.3, 60);
                      const midY = (conn.sourceNode.y + conn.targetNode.y) / 2 - curveMagnitude;
                      
                      // Adjust opacity and style based on connection level
                      const levelOpacity = 1 - ((conn.level - 1) * 0.15);
                      
                      return (
                        <g key={`edge-${conn.sourceId}-${conn.targetId}-${idx}`}>
                          <path 
                            d={`M ${conn.sourceNode.x} ${conn.sourceNode.y} Q ${midX} ${midY} ${conn.targetNode.x} ${conn.targetNode.y}`}
                            stroke={conn.level === 1 ? edgeStyle.color : conn.level === 2 ? "#A78BFA" : "#C084FC"}
                            strokeWidth={edgeStyle.thickness * (conn.strength || 1)}
                            strokeDasharray={conn.level === 1 ? edgeStyle.dash : conn.level === 2 ? "5,5" : "8,3,2,3"}
                            fill="none"
                            opacity={
                              selectedNode 
                                ? (selectedNode === conn.sourceId || selectedNode === conn.targetId ? 1 : 0.2) 
                                : levelOpacity
                            }
                            className={`connection-line transition-opacity duration-300 level-change ${
                              conn.level > 1 ? "depth-level-" + conn.level : ""
                            }`}
                          />
                          
                          {/* Edge label - only show for selected node connections */}
                          {selectedNode === conn.sourceId && (
                            <text
                              x={midX}
                              y={midY - 10}
                              textAnchor="middle"
                              fontSize="10"
                              fill={conn.level === 1 ? edgeStyle.color : conn.level === 2 ? "#A78BFA" : "#C084FC"}
                              className="transition-opacity duration-300"
                            >
                              {conn.level === 1 
                                ? edgeStyle.label 
                                : conn.level === 2 
                                  ? "Secondary Connection" 
                                  : "Deep Connection"}
                            </text>
                          )}
                        </g>
                      );
                    })}
                    
                    {/* Render all visible nodes based on current depth level */}
                    {getAllConnections().map((node) => {
                      // For primary nodes in the data
                      const isPrimary = passageSections[activeSection].connections.some(n => n.id === node.id);
                      // For nodes that are from deeper levels
                      const level = isPrimary ? 1 : node.level || 2;
                      
                      // Determine node appearance based on level
                      const nodeFill = level === 1 
                        ? (node.id === 1 ? "#4F46E5" : "#FFFFFF")
                        : level === 2 
                          ? "#F5F3FF" 
                          : "#F3E8FF";
                          
                      const nodeStroke = level === 1 
                        ? "#6366F1" 
                        : level === 2 
                          ? "#8B5CF6" 
                          : "#A855F7";
                      
                      const textFill = level === 1 
                        ? (node.id === 1 ? "#FFFFFF" : "#6366F1")
                        : level === 2 
                          ? "#7C3AED" 
                          : "#9333EA";
                          
                      // Animation delay based on level
                      const animationDelay = (level - 1) * 0.2;
                      
                      return (
                        <g 
                          key={`node-${node.id}-${level}`}
                          onClick={() => handleNodeClick(node.id)}
                          className={`cursor-pointer node-enter ${level > 1 ? "level-change" : ""}`}
                          style={{ animationDelay: `${animationDelay}s` }}
                          opacity={level === 1 ? 1 : level === 2 ? 0.95 : 0.9}
                        >
                          {/* Node highlight aura for deeper connections */}
                          {level > 1 && (
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={node.size + 4}
                              fill="none"
                              stroke={level === 2 ? "#A78BFA" : "#C084FC"}
                              strokeWidth={1}
                              opacity={0.5}
                              className={level === 3 ? "depth-indicator" : ""}
                            />
                          )}
                        
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.size}
                            fill={nodeFill}
                            stroke={node.id === selectedNode ? "#F59E0B" : nodeStroke}
                            strokeWidth={node.id === selectedNode ? 3 : 1.5}
                            opacity={
                              selectedNode 
                                ? (selectedNode === node.id || getConnectionLines().some(c => 
                                    (c.sourceId === selectedNode && c.targetId === node.id) || 
                                    (c.targetId === selectedNode && c.sourceId === node.id)
                                  ) ? 1 : 0.4) 
                                : 1
                            }
                            className="transition-all duration-300"
                          />
                          
                          {/* Level indicator for deeper connections */}
                          {level > 1 && (
                            <circle
                              cx={node.x + node.size - 5}
                              cy={node.y - node.size + 5}
                              r={8}
                              fill={level === 2 ? "#8B5CF6" : "#A855F7"}
                              stroke="#FFFFFF"
                              strokeWidth={1.5}
                              className="level-indicator"
                            >
                              <title>Level {level} Connection</title>
                            </circle>
                          )}
                          
                          {/* Level number indicator */}
                        {/* Level number indicator */}
                        {level > 1 && (
                            <text
                              x={node.x + node.size - 5}
                              y={node.y - node.size + 5}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize="8"
                              fill="#FFFFFF"
                              fontWeight="bold"
                            >
                              {level}
                            </text>
                          )}
                          
                          {/* Node verse reference with dynamic width background */}
                          <g>
                            <rect 
                              x={node.x - (node.verse.length * 3.5) / 2}
                              y={node.y + node.size + 5}
                              width={node.verse.length * 3.5}
                              height={20}
                              rx={4}
                              fill={node.id === selectedNode ? "#EEF2FF" : "white"}
                              opacity={0.8}
                            />
                            <text
                              x={node.x}
                              y={node.y + node.size + 19}
                              textAnchor="middle"
                              fontSize="12"
                              fontWeight={node.id === selectedNode ? "bold" : "normal"}
                              fill={node.id === selectedNode ? "#4F46E5" : level === 1 ? "#64748B" : level === 2 ? "#7C3AED" : "#9333EA"}
                              className="transition-all duration-300"
                            >
                              {node.verse}
                            </text>
                          </g>
                          
                          {/* Theme text inside node */}
                          <text
                            x={node.x}
                            y={node.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="10"
                            fill={textFill}
                            fontWeight="bold"
                          >
                            {node.theme}
                          </text>
                          
                          {/* Label displayed only when node is selected */}
                          {selectedNode === node.id && (
                            <g>
                              <rect 
                                x={node.x - (node.label.length * 2.8) / 2}
                                y={node.y + node.size + 29}
                                width={node.label.length * 2.8}
                                height={18}
                                rx={4}
                                fill="#F3F4F6"
                                opacity={0.9}
                              />
                              <text
                                x={node.x}
                                y={node.y + node.size + 42}
                                textAnchor="middle"
                                fontSize="11"
                                fill="#64748B"
                              >
                                {node.label}
                              </text>
                              
                              {/* Level indicator badge for selected nodes */}
                              {level > 1 && (
                                <g>
                                  <rect
                                    x={node.x - 30}
                                    y={node.y + node.size + 50}
                                    width={60}
                                    height={16}
                                    rx={8}
                                    fill={level === 2 ? "#A78BFA" : "#C084FC"}
                                    className="depth-level-badge"
                                  />
                                  <text
                                    x={node.x}
                                    y={node.y + node.size + 60}
                                    textAnchor="middle"
                                    fontSize="9"
                                    fill="white"
                                    fontWeight="medium"
                                  >
                                    Level {level} Connection
                                  </text>
                                </g>
                              )}
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                  
                  {/* Next section (ghosted to the right) */}
                  {nextSection && passageSections[nextSection] && (
                    <g transform={`translate(400, 0)`} opacity="0.3">
                      {/* Render edges */}
                      {passageSections[nextSection].connections.map(node => 
                        node.connections.map((conn, idx) => {
                          const target = passageSections[nextSection].connections.find(n => n.id === conn.targetId);
                          const edgeStyle = edgeStyles[conn.type];
                          
                          if (!target) return null;
                          
                          // Calculate control point for curved lines
                          const dx = target.x - node.x;
                          const dy = target.y - node.y;
                          const dist = Math.sqrt(dx * dx + dy * dy);
                          const midX = (node.x + target.x) / 2;
                          const curveMagnitude = Math.min(dist * 0.3, 60);
                          const midY = (node.y + target.y) / 2 - curveMagnitude;
                          
                          return (
                            <g key={`next-edge-${node.id}-${conn.targetId}`}>
                              <path 
                                d={`M ${node.x} ${node.y} Q ${midX} ${midY} ${target.x} ${target.y}`}
                                stroke={edgeStyle.color}
                                strokeWidth={edgeStyle.thickness * (conn.strength || 1)}
                                strokeDasharray={edgeStyle.dash}
                                fill="none"
                              />
                            </g>
                          );
                        })
                      )}
                      
                      {/* Render nodes */}
                      {passageSections[nextSection].connections.map(node => (
                        <g key={`next-node-${node.id}`}>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.size}
                            fill={node.id === 1 ? "#4F46E5" : "#FFFFFF"}
                            stroke="#6366F1"
                            strokeWidth={1.5}
                          />
                          
                          <text
                            x={node.x}
                            y={node.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="10"
                            fill={node.id === 1 ? "#FFFFFF" : "#6366F1"}
                            fontWeight="bold"
                          >
                            {node.theme}
                          </text>
                        </g>
                      ))}
                    </g>
                  )}
                </g>
              </svg>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-indigo-500 text-xl mb-2">No visualization data available</div>
                  <p className="text-slate-600">Connection data is only available for Genesis 1-3 in this demo.</p>
                </div>
              </div>
            )}
            
            {/* Node details panel - appears when node is selected */}
            {selectedNode && (
              <div 
                className="absolute bottom-20 right-4 bg-white p-4 rounded-lg shadow-lg border border-slate-200 w-72 transition-all duration-300"
                style={{ 
                  transform: 'translateY(0)', 
                  opacity: 1,
                  animation: 'slideUp 0.3s ease-out'
                }}
              >
                {/* Find the selected node */}
                {(() => {
                  const allNodes = getAllConnections();
                  const selectedNodeData = allNodes.find(n => n.id === selectedNode);
                  
                  if (!selectedNodeData) return null;
                  
                  // Determine if it's a primary or deeper connection
                  const isPrimary = passageSections[activeSection].connections.some(n => n.id === selectedNode);
                  const level = isPrimary ? 1 : selectedNodeData.level || 2;
                  
                  return (
                    <>
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold text-lg text-indigo-700">
                          {selectedNodeData.verse}
                        </h3>
                        
                        {level > 1 && (
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            level === 2 ? "bg-violet-100 text-violet-800" : "bg-purple-100 text-purple-800"
                          }`}>
                            Level {level}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-slate-600 mb-3">
                        Theme: <span className="font-medium">{selectedNodeData.theme}</span>
                      </div>
                      
                      <p className="text-sm text-slate-700 mb-3">
                        {selectedNodeData.label}
                      </p>
                      
                      {/* Connection information */}
                      {level > 1 && (
                        <div className="mt-2 pt-2 border-t border-slate-200">
                          <div className="text-xs text-slate-500 mb-1">
                            Connected to primary passage through:
                          </div>
                          <div className="flex items-center text-sm">
                            <ArrowRight size={14} className="text-indigo-500 mr-1" />
                            <span className="text-indigo-700 font-medium">
                              {passageSections[activeSection].connections.find(n => 
                                n.deeperConnections && n.deeperConnections.some(d => d.id === selectedNode)
                              )?.verse || "Multiple passages"}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Show Graph button when graph is hidden */}
        {!showGraph && (
          <div className="fixed bottom-4 right-4 z-20">
            <button
              onClick={toggleGraphVisibility}
              className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
              title="Show connections"
            >
              <Eye size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiblicalConnectionsApp;