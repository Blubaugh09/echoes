import React, { useState, useRef, useEffect } from 'react';
import {
  Book,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Maximize,
  Minimize
} from 'lucide-react';
import { bibleStructure } from '../constants/bibleStructure';
import { bibleSections } from '../constants/bibleSections';
import { passageSections } from '../constants/passageSections';
import { ESV_API_URL, ESV_API_KEY } from '../constants/apiConfig';
import { generateSectionIds } from '../constants/sectionIds';

// Component for rendering a single graph node with biblical theming
const GraphNode = ({
  node,
  pos,
  level,
  selected,
  onNodeClick,
  onNodeDragStart,
  nodeDragOffset,
  setDraggedNodeId
}) => {
  const isPrimary = node.isPrimary; // we expect to mark primary nodes
  const nodeFill =
    level === 1
      ? (node.id === 1 ? "#4F46E5" : "#FFFFFF")
      : level === 2
      ? "#F5F3FF"
      : "#F3E8FF";
  const nodeStroke =
    level === 1 ? "#6366F1" : level === 2 ? "#8B5CF6" : "#A855F7";
  const textFill =
    level === 1
      ? (node.id === 1 ? "#FFFFFF" : "#6366F1")
      : level === 2
      ? "#7C3AED"
      : "#9333EA";
  const animationDelay = (level - 1) * 0.2;

  return (
    <g
      onMouseDown={(e) => {
        e.stopPropagation();
        setDraggedNodeId(node.id);
        onNodeDragStart(node.id, {
          x: e.clientX - pos.x,
          y: e.clientY - pos.y,
        });
      }}
      onClick={(e) => {
        e.stopPropagation();
        onNodeClick(node.id);
      }}
      className={`cursor-pointer node-enter ${level > 1 ? "level-change" : ""}`}
      style={{ animationDelay: `${animationDelay}s` }}
      opacity={selected ? 1 : 0.95}
    >
      {level > 1 && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={node.size + 4}
          fill="none"
          stroke={level === 2 ? "#A78BFA" : "#C084FC"}
          strokeWidth={1}
          opacity={0.5}
          className={level === 3 ? "depth-indicator" : ""}
        />
      )}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={node.size}
        fill={nodeFill}
        stroke={node.id === selected ? "#F59E0B" : nodeStroke}
        strokeWidth={node.id === selected ? 3 : 1.5}
        className="transition-all duration-300"
      />
      {/* Biblical icon for primary nodes */}
      {level === 1 && (
        <text
          x={pos.x}
          y={pos.y + 4}
          textAnchor="middle"
          fontSize="8"
          fill="#FFFFFF"
          fontWeight="bold"
        >
          &#128214;
        </text>
      )}
      <g>
        <rect
          x={pos.x - (node.verse.length * 3.5) / 2}
          y={pos.y + node.size + 5}
          width={node.verse.length * 3.5}
          height={20}
          rx={4}
          fill={node.id === selected ? "#EEF2FF" : "white"}
          opacity={0.8}
        />
        <text
          x={pos.x}
          y={pos.y + node.size + 19}
          textAnchor="middle"
          fontSize="12"
          fontWeight={node.id === selected ? "bold" : "normal"}
          fill={node.id === selected ? "#4F46E5" : level === 1 ? "#64748B" : level === 2 ? "#7C3AED" : "#9333EA"}
          className="transition-all duration-300"
        >
          {node.verse}
        </text>
      </g>
      <text
        x={pos.x}
        y={pos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="10"
        fill={textFill}
        fontWeight="bold"
      >
        {node.theme}
      </text>
      {selected === node.id && (
        <g>
          <rect
            x={pos.x - (node.label.length * 2.8) / 2}
            y={pos.y + node.size + 29}
            width={node.label.length * 2.8}
            height={18}
            rx={4}
            fill="#F3F4F6"
            opacity={0.9}
          />
          <text
            x={pos.x}
            y={pos.y + node.size + 42}
            textAnchor="middle"
            fontSize="11"
            fill="#64748B"
          >
            {node.label}
          </text>
          {level > 1 && (
            <g>
              <rect
                x={pos.x - 30}
                y={pos.y + node.size + 50}
                width={60}
                height={16}
                rx={8}
                fill={level === 2 ? "#A78BFA" : "#C084FC"}
                className="depth-level-badge"
              />
              <text
                x={pos.x}
                y={pos.y + node.size + 60}
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
      <title>{`Verse: ${node.verse}\nTheme: ${node.theme}`}</title>
    </g>
  );
};

// Component for rendering an edge between two nodes
const GraphEdge = ({ sourcePos, targetPos, conn, selected, edgeStyles }) => {
  const edgeStyle = edgeStyles[conn.type];
  const dx = targetPos.x - sourcePos.x;
  const dy = targetPos.y - sourcePos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const midX = (sourcePos.x + targetPos.x) / 2;
  const curveMagnitude = Math.min(dist * 0.3, 60);
  const midY = (sourcePos.y + targetPos.y) / 2 - curveMagnitude;
  const levelOpacity = 1 - ((conn.level - 1) * 0.15);
  return (
    <g>
      <path
        d={`M ${sourcePos.x} ${sourcePos.y} Q ${midX} ${midY} ${targetPos.x} ${targetPos.y}`}
        stroke={
          conn.level === 1 ? edgeStyle.color : conn.level === 2 ? "#A78BFA" : "#C084FC"
        }
        strokeWidth={edgeStyle.thickness * (conn.strength || 1)}
        strokeDasharray={
          conn.level === 1 ? edgeStyle.dash : conn.level === 2 ? "5,5" : "8,3,2,3"
        }
        fill="none"
        opacity={selected ? 1 : levelOpacity}
        className={`connection-line transition-opacity duration-300 level-change ${
          conn.level > 1 ? "depth-level-" + conn.level : ""
        }`}
      />
      {selected === conn.sourceId && (
        <text
          x={midX}
          y={midY - 10}
          textAnchor="middle"
          fontSize="10"
          fill={
            conn.level === 1 ? edgeStyle.color : conn.level === 2 ? "#A78BFA" : "#C084FC"
          }
          className="transition-opacity duration-300"
        >
          {conn.level === 1 ? edgeStyle.label : conn.level === 2 ? "Secondary Connection" : "Deep Connection"}
        </text>
      )}
    </g>
  );
};

const BiblicalConnectionsApp = () => {
  // Bible text and navigation states
  const [bibleText, setBibleText] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTestament, setActiveTestament] = useState("old");
  const [activeBook, setActiveBook] = useState("genesis");
  const [activeChapter, setActiveChapter] = useState(1);
  const [activeNarrativeSection, setActiveNarrativeSection] = useState("creation");
  const [bookSearch, setBookSearch] = useState("");
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [chapterSections, setChapterSections] = useState([]);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [showSectionNav, setShowSectionNav] = useState(true);
  const [showGraph, setShowGraph] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (chapterSections.length > 0 && !activeNarrativeSection) {
      setActiveNarrativeSection(chapterSections[0].id);
    }
    setTimeout(() => {
      const sectionButton = document.getElementById(`section-${activeNarrativeSection}`);
      const container = document.getElementById('sections-container');
      if (sectionButton && container) {
        const buttonRect = sectionButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollLeft = sectionButton.offsetLeft - (containerRect.width / 2) + (buttonRect.width / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }, 100);
  }, [activeNarrativeSection, chapterSections]);

  useEffect(() => {
    if (!chapterSections || chapterSections.length === 0) return;
    const options = { root: null, rootMargin: '-10px 0px', threshold: [0.1, 0.5] };
    const handleIntersection = (entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        const sortedEntries = [...visibleEntries].sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const sectionId = sortedEntries[0].target.getAttribute('data-section-id');
        if (sectionId && sectionId !== activeNarrativeSection) {
          setActiveNarrativeSection(sectionId);
        }
      }
    };
    const observer = new IntersectionObserver(handleIntersection, options);
    chapterSections.forEach(section => {
      const element = document.querySelector(`[data-section-id="${section.id}"]`);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [chapterSections, activeNarrativeSection]);

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
    const matchingSection = bibleSections.find(
      section => section.book === activeBook && section.chapter === activeChapter
    );
    if (matchingSection) {
      setActiveNarrativeSection(matchingSection.id);
    } else {
      const bookIndex = bibleStructure.findIndex(b => b.id === activeBook);
      if (bookIndex >= 0) {
        const sectionsBefore = bibleSections.filter(section => {
          const sectionBookIndex = bibleStructure.findIndex(b => b.id === section.book);
          return (sectionBookIndex < bookIndex) || (sectionBookIndex === bookIndex && section.chapter <= activeChapter);
        });
        if (sectionsBefore.length > 0) {
          const closestSection = sectionsBefore[sectionsBefore.length - 1];
          setActiveNarrativeSection(closestSection.id);
        }
      }
    }
    setSelectedNode(null);
    setPanOffset({ x: 0, y: 0 });
    setDepthLevel(1);
  }, [activeBook, activeChapter]);

  const [activeSectionsList, setActiveSectionsList] = useState([]);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const fetchBibleText = async () => {
      if (activeSectionsList.length === 0) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const results = {};
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
            headers: { 'Authorization': `Token ${ESV_API_KEY}` }
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

  const filteredBooks = bookSearch
    ? bibleStructure.filter(book =>
        book.name.toLowerCase().includes(bookSearch.toLowerCase()) &&
        (activeTestament === "all" || book.testament === activeTestament)
      )
    : bibleStructure.filter(book =>
        activeTestament === "all" || book.testament === activeTestament
      );

  const textContainerRef = useRef(null);
  const sectionRefs = useRef([]);
  useEffect(() => {
    sectionRefs.current = chapterSections.map(() => React.createRef());
  }, [chapterSections]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [depthLevel, setDepthLevel] = useState(1);
  const maxDepthLevel = 3;

  const edgeStyles = {
    direct_reference: { color: "#6366F1", dash: "none", thickness: 3, label: "Direct Reference" },
    thematic: { color: "#EC4899", dash: "5,5", thickness: 2, label: "Thematic Connection" },
    symbolic: { color: "#10B981", dash: "10,5", thickness: 2, label: "Symbolic Echo" },
    prophetic: { color: "#10B981", dash: "10,5", thickness: 2, label: "Prophetic Echo" }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (textContainerRef.current) {
        setScrollY(textContainerRef.current.scrollTop);
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
          setActiveSection(mostVisibleSection);
          setDepthLevel(1);
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

  const getAllConnections = () => {
    if (!passageSections[activeSection]) return [];
    const primaryNodes = passageSections[activeSection].connections;
    if (depthLevel === 1) return primaryNodes;
    let allConnections = [...primaryNodes];
    if (depthLevel >= 2) {
      primaryNodes.forEach(node => {
        if (node.deeperConnections) {
          const level2Connections = node.deeperConnections.filter(conn => conn.level === 2);
          allConnections = [...allConnections, ...level2Connections];
        }
      });
    }
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

  const getConnectionLines = () => {
    if (!passageSections[activeSection]) return [];
    const connections = [];
    const allNodes = getAllConnections();
    passageSections[activeSection].connections.forEach(node => {
      node.connections.forEach(conn => {
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
    if (depthLevel >= 2) {
      passageSections[activeSection].connections.forEach(node => {
        if (node.deeperConnections) {
          node.deeperConnections.forEach(deepNode => {
            if (deepNode.level <= depthLevel) {
              const deepConnectionType = deepNode.level === 2 ? "thematic" : "symbolic";
              const deepConnectionStrength = 0.6 - ((deepNode.level - 2) * 0.1);
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

  const handleNodeClick = (nodeId) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const currentSectionIndex = activeSectionsList.indexOf(activeSection);
  const prevSection = currentSectionIndex > 0 ? activeSectionsList[currentSectionIndex - 1] : null;
  const nextSection = currentSectionIndex < activeSectionsList.length - 1 ? activeSectionsList[currentSectionIndex + 1] : null;

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 0.2, 0.5));
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const jumpToSection = (sectionId) => {
    const index = activeSectionsList.indexOf(sectionId);
    if (index >= 0 && sectionRefs.current[index] && sectionRefs.current[index].current) {
      textContainerRef.current.scrollTo({
        top: sectionRefs.current[index].current.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const getCurrentBookChapter = () => {
    const book = bibleStructure.find(b => b.id === activeBook);
    return book ? `${book.name} ${activeChapter}` : "";
  };

  const handleBookChange = (bookId) => {
    setActiveBook(bookId);
    setActiveChapter(1);
    setShowBookSelector(false);
  };

  const handleSectionSelect = (sectionId) => {
    const section = bibleSections.find(s => s.id === sectionId);
    if (section) {
      setActiveNarrativeSection(sectionId);
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
      const currentBookIndex = bibleStructure.findIndex(b => b.id === activeBook);
      if (currentBookIndex > 0) {
        const prevBook = bibleStructure[currentBookIndex - 1];
        setActiveBook(prevBook.id);
        setActiveChapter(prevBook.chapters);
      }
    }
  };

  const toggleGraphVisibility = () => {
    setShowGraph(!showGraph);
  };

  // Node dragging states
  const [nodePositions, setNodePositions] = useState({});
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [nodeDragOffset, setNodeDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (passageSections[activeSection]) {
      const nodes = getAllConnections();
      const initialPositions = {};
      nodes.forEach(node => {
        initialPositions[node.id] = { x: node.x, y: node.y };
      });
      // Collision resolution (simplified)
      let positions = { ...initialPositions };
      const iterations = 10;
      const margin = 10;
      for (let iter = 0; iter < iterations; iter++) {
        let adjusted = false;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const nodeA = nodes[i];
            const nodeB = nodes[j];
            const posA = positions[nodeA.id];
            const posB = positions[nodeB.id];
            const dx = posB.x - posA.x;
            const dy = posB.y - posA.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = nodeA.size + nodeB.size + margin;
            if (dist < minDist && dist > 0) {
              const overlap = (minDist - dist) / 2;
              const offsetX = (dx / dist) * overlap;
              const offsetY = (dy / dist) * overlap;
              positions[nodeA.id] = { x: posA.x - offsetX, y: posA.y - offsetY };
              positions[nodeB.id] = { x: posB.x + offsetX, y: posB.y + offsetY };
              adjusted = true;
            }
          }
        }
        if (!adjusted) break;
      }
      setNodePositions(positions);
    }
  }, [activeSection, passageSections]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="p-4 bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="w-1/3 flex justify-start"></div>
          <div className="w-1/3 flex items-center justify-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowBookSelector(!showBookSelector)}
                className="flex items-center space-x-2 py-2 px-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <span className="font-medium">
                  {bibleStructure.find(b => b.id === activeBook)?.name || "Select Book"}
                </span>
                <ChevronDown size={16} />
              </button>
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
                              activeBook === book.id ? "bg-indigo-100 text-indigo-700 font-medium" : "hover:bg-slate-100"
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
            <div className="relative">
              <button
                onClick={() => setShowChapterSelector(prev => !prev)}
                className="flex items-center space-x-2 py-1.5 px-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <span className="font-medium">{activeChapter}</span>
                <ChevronDown size={16} />
              </button>
              {showChapterSelector && (
                <div className="absolute top-10 left-0 w-64 max-h-80 overflow-y-auto bg-white shadow-lg rounded-lg border border-slate-200 z-30">
                  <div className="p-2">
                    <div className="grid grid-cols-5 gap-1">
                      {Array.from({ length: bibleStructure.find(b => b.id === activeBook)?.chapters || 0 }, (_, i) => (
                        <button
                          key={`chapter-${i + 1}`}
                          onClick={() => {
                            handleChapterChange(i + 1);
                            setShowChapterSelector(false);
                          }}
                          className={`h-8 w-8 text-xs rounded-full flex items-center justify-center ${
                            activeChapter === i + 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
          </div>
          <div className="w-1/3 flex items-center justify-end space-x-4">
            <button 
              onClick={toggleGraphVisibility}
              className="p-2 rounded-full hover:bg-slate-100"
              title={showGraph ? "Hide connections" : "Show connections"}
            >
              {showGraph ? <EyeOff size={20} className="text-slate-600" /> : <Eye size={20} className="text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 relative">
        <div className="absolute h-1 bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60"></div>
        <div className="flex items-center">
          <button 
            className="sticky left-0 px-2 py-3 bg-gradient-to-r from-white to-transparent z-10 hover:bg-slate-50"
            onClick={() => {
              const container = document.getElementById('sections-container');
              if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
            }}
          >
            <ChevronLeft size={16} className="text-slate-600" />
          </button>
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
                {activeNarrativeSection === section.id && (
                  <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                )}
              </button>
            ))}
          </div>
          <button 
            className="sticky right-0 px-2 py-3 bg-gradient-to-l from-white to-transparent z-10 hover:bg-slate-50"
            onClick={() => {
              const container = document.getElementById('sections-container');
              if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
            }}
          >
            <ChevronRight size={16} className="text-slate-600" />
          </button>
        </div>
      </div>

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

      <div className={`flex-1 ${isLargeScreen ? 'flex flex-row' : 'flex flex-col'} overflow-hidden`}>
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
              {showSectionNav ? (
                <div className="sticky top-0 z-10 bg-white shadow-sm mb-6">
                  <div className="flex border-b border-slate-200 relative">
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
                    <button 
                      onClick={() => setShowSectionNav(false)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-slate-100"
                      title="Hide navigation"
                    >
                      <ChevronUp size={16} className="text-slate-500" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="sticky top-0 z-10 flex justify-center">
                  <button 
                    onClick={() => setShowSectionNav(true)}
                    className="bg-white rounded-b-lg shadow-md px-3 py-1 text-slate-500 hover:text-indigo-600 flex items-center space-x-1"
                    title="Show navigation"
                  >
                    <ChevronDown size={16} />
                    <span className="text-xs font-medium">Section Nav</span>
                  </button>
                </div>
              )}
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
        {!isLargeScreen && showGraph && (
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        )}
        {isLargeScreen && showGraph && (
          <div className="w-2 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>
        )}
        {showGraph && (
          <div className={`
            bg-slate-50 relative overflow-hidden transition-all duration-300
            ${isLargeScreen ? 'w-1/2' : (isExpanded ? 'h-4/5' : 'h-3/5')}
          `}>
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
                  animation: pulse 2s ease-in-out;
                }
                .level-change {
                  transition: all 0.5s ease-in-out;
                }
                .depth-level-badge {
                  transition: background-color 0.3s;
                }
              `}
            </style>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-full shadow-md text-sm">
              <span className="text-indigo-700 font-medium">{activeSection || "Select a section"}</span>
            </div>
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
            <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 ">
              <div className="flex items-center justify-between">
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
              </div>
            </div>
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
              <svg 
                width="100%" 
                height="100%" 
                style={{ 
                  transform: `scale(${zoomLevel})`, 
                  transformOrigin: 'center',
                  cursor: draggedNodeId ? 'grabbing' : isDragging ? 'grabbing' : 'grab'
                }}
                viewBox="0 0 600 300"
                className="transition-transform duration-200"
                onMouseDown={(e) => {
                  if (!draggedNodeId) {
                    setIsDragging(true);
                    setDragStart({ x: e.clientX, y: e.clientY });
                  }
                }}
                onMouseMove={(e) => {
                  if (draggedNodeId !== null) {
                    setNodePositions(prev => ({
                      ...prev,
                      [draggedNodeId]: { x: e.clientX - nodeDragOffset.x, y: e.clientY - nodeDragOffset.y }
                    }));
                  } else if (isDragging) {
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
                  if (draggedNodeId !== null) setDraggedNodeId(null);
                  setIsDragging(false);
                }}
                onMouseLeave={() => {
                  if (draggedNodeId !== null) setDraggedNodeId(null);
                  setIsDragging(false);
                }}
              >
                <g transform={`translate(${panOffset.x}, ${panOffset.y})`}>
                  {prevSection && passageSections[prevSection] && (
                    <g transform={`translate(-200, 0)`} opacity="0.3">
                      {passageSections[prevSection].connections.map(node => 
                        node.connections.map((conn, idx) => {
                          const target = passageSections[prevSection].connections.find(n => n.id === conn.targetId);
                          const edgeStyle = edgeStyles[conn.type];
                          if (!target) return null;
                          const dx = target.x - node.x;
                          const dy = target.y - node.y;
                          const dist = Math.sqrt(dx * dx + dy * dy);
                          const midX = (node.x + target.x) / 2;
                          const curveMagnitude = Math.min(dist * 0.3, 60);
                          const midY = (node.y + target.y) / 2 - curveMagnitude;
                          return (
                            <g key={`prev-edge-${node.id}-${conn.targetId}`}>
                              <GraphEdge
                                sourcePos={{ x: node.x, y: node.y }}
                                targetPos={{ x: target.x, y: target.y }}
                                conn={conn}
                                selected={selectedNode}
                                edgeStyles={edgeStyles}
                              />
                            </g>
                          );
                        })
                      )}
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
                  <g transform="translate(0, 0)">
                    {getConnectionLines().map((conn, idx) => {
                      const sourcePos = nodePositions[conn.sourceId] || { x: conn.sourceNode.x, y: conn.sourceNode.y };
                      const targetPos = nodePositions[conn.targetId] || { x: conn.targetNode.x, y: conn.targetNode.y };
                      return (
                        <g key={`edge-${conn.sourceId}-${conn.targetId}-${idx}`}>
                          <GraphEdge
                            sourcePos={sourcePos}
                            targetPos={targetPos}
                            conn={conn}
                            selected={selectedNode}
                            edgeStyles={edgeStyles}
                          />
                        </g>
                      );
                    })}
                    {getAllConnections().map((node) => {
                      const pos = nodePositions[node.id] || { x: node.x, y: node.y };
                      // Mark primary nodes explicitly
                      const isPrimary = passageSections[activeSection].connections.some(n => n.id === node.id);
                      const level = isPrimary ? 1 : node.level || 2;
                      return (
                        <GraphNode
                          key={`node-${node.id}-${level}`}
                          node={{ ...node, isPrimary }}
                          pos={pos}
                          level={level}
                          selected={selectedNode}
                          onNodeClick={handleNodeClick}
                          onNodeDragStart={(id, offset) => setNodeDragOffset(offset)}
                          nodeDragOffset={nodeDragOffset}
                          setDraggedNodeId={setDraggedNodeId}
                        />
                      );
                    })}
                  </g>
                  {nextSection && passageSections[nextSection] && (
                    <g transform={`translate(400, 0)`} opacity="0.3">
                      {passageSections[nextSection].connections.map(node => 
                        node.connections.map((conn, idx) => {
                          const target = passageSections[nextSection].connections.find(n => n.id === conn.targetId);
                          const edgeStyle = edgeStyles[conn.type];
                          if (!target) return null;
                          const dx = target.x - node.x;
                          const dy = target.y - node.y;
                          const dist = Math.sqrt(dx * dx + dy * dy);
                          const midX = (node.x + target.x) / 2;
                          const curveMagnitude = Math.min(dist * 0.3, 60);
                          const midY = (node.y + target.y) / 2 - curveMagnitude;
                          return (
                            <g key={`next-edge-${node.id}-${conn.targetId}`}>
                              <GraphEdge
                                sourcePos={{ x: node.x, y: node.y }}
                                targetPos={{ x: target.x, y: target.y }}
                                conn={conn}
                                selected={selectedNode}
                                edgeStyles={edgeStyles}
                              />
                            </g>
                          );
                        })
                      )}
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
            {selectedNode && (
              <div 
                className="absolute bottom-20 right-4 bg-white p-4 rounded-lg shadow-lg border border-slate-200 w-72 transition-all duration-300"
                style={{ transform: 'translateY(0)', opacity: 1, animation: 'slideUp 0.3s ease-out' }}
              >
                {(() => {
                  const allNodes = getAllConnections();
                  const selectedNodeData = allNodes.find(n => n.id === selectedNode);
                  if (!selectedNodeData) return null;
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
