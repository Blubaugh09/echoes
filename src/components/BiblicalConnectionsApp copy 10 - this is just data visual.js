import React, { useState } from 'react';
import { Info, Search, BookOpen, ChevronRight } from 'lucide-react';

const BibleBookConnections = () => {
  const [selectedPassage, setSelectedPassage] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [connections, setConnections] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    pentateuch: true,
    historical: false,
    wisdom: false,
    prophets: false,
    gospels: true,
    epistles: false,
    revelation: false
  });
  
  const bibleStructure = {
    pentateuch: {
      title: "Pentateuch",
      books: [
        {
          id: "genesis",
          title: "Genesis",
          color: "#3498db",
          passages: [
            {
              id: 'creation',
              title: 'Creation',
              reference: 'Genesis 1-2',
              description: 'God creates the heavens and earth'
            },
            {
              id: 'fall',
              title: 'The Fall',
              reference: 'Genesis 3',
              description: 'Humanity falls into sin'
            },
            {
              id: 'cainAbel',
              title: 'Cain & Abel',
              reference: 'Genesis 4',
              description: 'First murder; Cain kills Abel'
            },
            {
              id: 'noahArk',
              title: "Noah's Ark",
              reference: 'Genesis 6-9',
              description: 'God sends a flood but saves Noah'
            },
            {
              id: 'babel',
              title: 'Tower of Babel',
              reference: 'Genesis 11',
              description: 'People attempt to build tower to heaven'
            },
            {
              id: 'abraham',
              title: 'Call of Abraham',
              reference: 'Genesis 12',
              description: 'God calls Abraham and makes covenant'
            },
            {
              id: 'isaacOffering',
              title: 'Offering of Isaac',
              reference: 'Genesis 22',
              description: 'Abraham shows faith by offering Isaac'
            },
            {
              id: 'jacobLadder',
              title: "Jacob's Ladder",
              reference: 'Genesis 28',
              description: 'Jacob dreams of ladder to heaven'
            },
            {
              id: 'josephSold',
              title: 'Joseph Sold',
              reference: 'Genesis 37',
              description: "Joseph's brothers sell him into slavery"
            }
          ]
        },
        {
          id: "exodus",
          title: "Exodus",
          color: "#2980b9",
          passages: [
            {
              id: 'burningBush',
              title: 'Burning Bush',
              reference: 'Exodus 3',
              description: 'God calls Moses from burning bush'
            },
            {
              id: 'passover',
              title: 'Passover',
              reference: 'Exodus 12',
              description: 'Blood of lamb saves Israelites'
            },
            {
              id: 'redSea',
              title: 'Red Sea Crossing',
              reference: 'Exodus 14',
              description: 'Israel passes through parted sea'
            },
            {
              id: 'tenCommandments',
              title: 'Ten Commandments',
              reference: 'Exodus 20',
              description: 'God gives law at Mount Sinai'
            },
            {
              id: 'goldenCalf',
              title: 'Golden Calf',
              reference: 'Exodus 32',
              description: 'Israel worships golden idol'
            }
          ]
        }
      ]
    },
    historical: {
      title: "Historical Books",
      books: [
        {
          id: "joshua",
          title: "Joshua",
          color: "#e67e22",
          passages: [
            {
              id: 'jericho',
              title: 'Fall of Jericho',
              reference: 'Joshua 6',
              description: 'Walls of Jericho fall by faith'
            }
          ]
        },
        {
          id: "ruth",
          title: "Ruth",
          color: "#d35400",
          passages: [
            {
              id: 'ruthRedeemer',
              title: 'Ruth & Boaz',
              reference: 'Ruth 4',
              description: 'Boaz redeems Ruth as kinsman-redeemer'
            }
          ]
        }
      ]
    },
    wisdom: {
      title: "Wisdom Literature",
      books: [
        {
          id: "psalms",
          title: "Psalms",
          color: "#f1c40f",
          passages: [
            {
              id: 'psalm22',
              title: 'Forsaken Psalm',
              reference: 'Psalm 22',
              description: "Prophecy of Messiah's suffering"
            },
            {
              id: 'psalm23',
              title: 'Shepherd Psalm',
              reference: 'Psalm 23',
              description: 'The Lord as shepherd'
            }
          ]
        }
      ]
    },
    prophets: {
      title: "Prophets",
      books: [
        {
          id: "isaiah",
          title: "Isaiah",
          color: "#e74c3c",
          passages: [
            {
              id: 'isaiah53',
              title: 'Suffering Servant',
              reference: 'Isaiah 53',
              description: 'Prophecy of the suffering servant'
            },
            {
              id: 'isaiah7',
              title: 'Immanuel',
              reference: 'Isaiah 7:14',
              description: 'Prophecy of virgin birth'
            }
          ]
        },
        {
          id: "daniel",
          title: "Daniel",
          color: "#c0392b",
          passages: [
            {
              id: 'daniel7',
              title: 'Son of Man',
              reference: 'Daniel 7',
              description: 'Vision of the Son of Man'
            }
          ]
        },
        {
          id: "jonah",
          title: "Jonah",
          color: "#e74c3c",
          passages: [
            {
              id: 'jonah',
              title: 'Jonah & the Fish',
              reference: 'Jonah 1-2',
              description: 'Prophet swallowed by great fish'
            }
          ]
        }
      ]
    },
    gospels: {
      title: "Gospels & Acts",
      books: [
        {
          id: "matthew",
          title: "Matthew",
          color: "#2ecc71",
          passages: [
            {
              id: 'birth',
              title: 'Birth of Jesus',
              reference: 'Matthew 1-2',
              description: 'Jesus is born in Bethlehem'
            },
            {
              id: 'baptism',
              title: 'Baptism of Jesus',
              reference: 'Matthew 3',
              description: 'Jesus baptized by John'
            },
            {
              id: 'temptation',
              title: 'Temptation',
              reference: 'Matthew 4',
              description: 'Jesus tempted in wilderness'
            },
            {
              id: 'sermon',
              title: 'Sermon on Mount',
              reference: 'Matthew 5-7',
              description: 'Jesus teaches about kingdom'
            }
          ]
        },
        {
          id: "john",
          title: "John",
          color: "#27ae60",
          passages: [
            {
              id: 'word',
              title: 'The Word',
              reference: 'John 1',
              description: 'Jesus as the eternal Word'
            },
            {
              id: 'nicodemus',
              title: 'Born Again',
              reference: 'John 3',
              description: 'Jesus teaches Nicodemus about new birth'
            },
            {
              id: 'crucifixion',
              title: 'Crucifixion',
              reference: 'John 19',
              description: 'Jesus dies on the cross'
            }
          ]
        },
        {
          id: "acts",
          title: "Acts",
          color: "#16a085",
          passages: [
            {
              id: 'pentecost',
              title: 'Pentecost',
              reference: 'Acts 2',
              description: 'Holy Spirit comes on disciples'
            },
            {
              id: 'conversion',
              title: "Paul's Conversion",
              reference: 'Acts 9',
              description: 'Saul becomes Paul on Damascus road'
            }
          ]
        }
      ]
    },
    epistles: {
      title: "Epistles",
      books: [
        {
          id: "romans",
          title: "Romans",
          color: "#9b59b6",
          passages: [
            {
              id: 'romans8',
              title: 'More Than Conquerors',
              reference: 'Romans 8',
              description: "Nothing can separate us from God's love"
            }
          ]
        },
        {
          id: "hebrews",
          title: "Hebrews",
          color: "#8e44ad",
          passages: [
            {
              id: 'hebrewsFaith',
              title: 'Hall of Faith',
              reference: 'Hebrews 11',
              description: 'Examples of faith throughout Scripture'
            }
          ]
        }
      ]
    },
    revelation: {
      title: "Revelation",
      books: [
        {
          id: "revelation",
          title: "Revelation",
          color: "#f1c40f",
          passages: [
            {
              id: 'throne',
              title: 'Heavenly Throne',
              reference: 'Revelation 4',
              description: "Vision of God's throne"
            },
            {
              id: 'newCreation',
              title: 'New Creation',
              reference: 'Revelation 21',
              description: 'New heaven and new earth'
            }
          ]
        }
      ]
    }
  };

  const allConnections = [
    {
      from: 'noahArk',
      to: 'creation',
      type: 'thematic',
      strength: 0.7,
      description: 'Re-creation of the world after the flood'
    },
    {
      from: 'noahArk',
      to: 'baptism',
      type: 'typological',
      strength: 0.8,
      description: 'Waters of judgment and salvation (1 Peter 3:20-21)'
    },
    {
      from: 'noahArk',
      to: 'redSea',
      type: 'typological',
      strength: 0.9,
      description: 'Passing through water to salvation'
    },
    {
      from: 'noahArk',
      to: 'newCreation',
      type: 'thematic',
      strength: 0.6,
      description: 'Gods covenant and rainbow promise fulfilled'
    },
    {
      from: 'noahArk',
      to: 'jonah',
      type: 'typological',
      strength: 0.7,
      description: 'Salvation through wood/vessel amid waters'
    },
    {
      from: 'isaacOffering',
      to: 'crucifixion',
      type: 'typological',
      strength: 0.9,
      description: 'Father offering beloved son as sacrifice'
    },
    {
      from: 'isaacOffering',
      to: 'passover',
      type: 'typological',
      strength: 0.8,
      description: 'Substitute sacrifice provided by God'
    },
    {
      from: 'isaacOffering',
      to: 'hebrewsFaith',
      type: 'commentary',
      strength: 0.7,
      description: 'Abraham received Isaac back figuratively (Heb 11:19)'
    },
    {
      from: 'passover',
      to: 'crucifixion',
      type: 'typological',
      strength: 0.9,
      description: 'Blood of the lamb brings salvation'
    },
    {
      from: 'redSea',
      to: 'baptism',
      type: 'typological',
      strength: 0.8,
      description: 'Passing through water into new life'
    },
    {
      from: 'tenCommandments',
      to: 'sermon',
      type: 'thematic',
      strength: 0.9,
      description: "God's law explained and fulfilled"
    },
    {
      from: 'isaiah53',
      to: 'crucifixion',
      type: 'prophetic',
      strength: 0.95,
      description: 'Prophecy of suffering servant fulfilled'
    },
    {
      from: 'psalm22',
      to: 'crucifixion',
      type: 'prophetic',
      strength: 0.9,
      description: 'Details of crucifixion prophesied'
    },
    {
      from: 'daniel7',
      to: 'conversion',
      type: 'prophetic',
      strength: 0.8,
      description: 'Son of Man appears to Saul on Damascus road'
    },
    {
      from: 'jonah',
      to: 'crucifixion',
      type: 'typological',
      strength: 0.85,
      description: 'Three days in "grave" then restoration'
    },
    {
      from: 'creation',
      to: 'newCreation',
      type: 'thematic',
      strength: 0.9,
      description: 'Original creation fulfilled in new creation'
    },
    {
      from: 'creation',
      to: 'word',
      type: 'thematic',
      strength: 0.8,
      description: 'Word as agent of creation'
    },
    {
      from: 'fall',
      to: 'crucifixion',
      type: 'thematic',
      strength: 0.85,
      description: 'Sins entry addressed by sins defeat'
    },
    {
      from: 'temptation',
      to: 'fall',
      type: 'thematic',
      strength: 0.8,
      description: 'Temptation resisted vs. temptation yielded to'
    },
    {
      from: 'cainAbel',
      to: 'crucifixion',
      type: 'typological',
      strength: 0.7,
      description: 'Innocent blood shed (Hebrews 12:24)'
    },
    {
      from: 'jacobLadder',
      to: 'pentecost',
      type: 'thematic',
      strength: 0.7,
      description: 'Heaven and earth connected'
    },
    {
      from: 'burningBush',
      to: 'pentecost',
      type: 'typological',
      strength: 0.8,
      description: 'Gods presence manifested in fire'
    },
    {
      from: 'josephSold',
      to: 'crucifixion',
      type: 'typological',
      strength: 0.8,
      description: 'Betrayed by brothers/disciples, yet brings salvation'
    },
    {
      from: 'babel',
      to: 'pentecost',
      type: 'typological',
      strength: 0.9,
      description: 'Languages confused vs. language barrier overcome'
    },
    {
      from: 'jericho',
      to: 'hebrewsFaith',
      type: 'commentary',
      strength: 0.8,
      description: 'Walls fell by faith (Hebrews 11:30)'
    },
    {
      from: 'ruthRedeemer',
      to: 'crucifixion',
      type: 'typological',
      strength: 0.7,
      description: 'Kinsman-redeemer as type of Christ'
    },
    {
      from: 'psalm23',
      to: 'word',
      type: 'thematic',
      strength: 0.8,
      description: 'The Lord as shepherd'
    }
  ];

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePassageClick = (passage) => {
    setSelectedPassage(passage);
    const passageConnections = allConnections.filter(
      conn => conn.from === passage.id || conn.to === passage.id
    );
    setConnections(passageConnections);
  };

  const handleBookClick = (bookId) => {
    setSelectedBook(bookId === selectedBook ? null : bookId);
    setSelectedPassage(null);
    setConnections([]);
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

  const renderBibleSections = () => {
    return Object.entries(bibleStructure).map(([sectionId, section]) => (
      <div key={sectionId} className="mb-4">
        <div 
          className="flex items-center justify-between p-2 bg-gray-800 rounded cursor-pointer"
          onClick={() => toggleSection(sectionId)}
        >
          <span className="font-bold">{section.title}</span>
          <ChevronRight 
            size={18} 
            className={`transform transition-transform ${expandedSections[sectionId] ? 'rotate-90' : ''}`} 
          />
        </div>
        {expandedSections[sectionId] && (
          <div className="ml-2 mt-1 space-y-1">
            {section.books.map(book => (
              <div key={book.id}>
                <div
                  className={`flex items-center p-2 rounded cursor-pointer ${selectedBook === book.id ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
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
                        className={`p-3 rounded cursor-pointer ${selectedPassage && selectedPassage.id === passage.id ? 'bg-gray-700 border border-blue-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                        onClick={() => handlePassageClick({
                          ...passage,
                          book: book.id,
                          bookTitle: book.title,
                          bookColor: book.color,
                          section: section.title
                        })}
                      >
                        <div className="font-medium">{passage.title}</div>
                        <div className="text-sm text-gray-400">{passage.reference}</div>
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
      <svg width="800" height="600" className="bg-gray-900 rounded-lg">
        <rect width="800" height="600" fill="#0f172a" rx="8" ry="8" />
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
                stroke="#0f172a"
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
                stroke="#0f172a"
                strokeWidth="2"
              />
            </g>
          );
        })}
        {visData.links.map((link, index) => {
          const source = visData.nodes.find(n => n.id === link.source);
          const target = visData.nodes.find(n => n.id === link.target);
          if (!source || !target) return null;
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
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
                  gradientTransform={`rotate(${Math.atan2(dy, dx) * 180 / Math.PI}, ${source.x}, ${source.y})`}
                >
                  <stop offset="0%" stopColor={source.color} stopOpacity="0.7" />
                  <stop offset="100%" stopColor={target.color} stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <path
                d={`M ${source.x},${source.y} A ${dr},${dr} 0 0,1 ${target.x},${target.y}`}
                fill="none"
                stroke={`url(#link-gradient-${index})`}
                strokeWidth={link.strength * 4 + 1}
                strokeOpacity="0.6"
                strokeDasharray={link.type === 'prophetic' ? "5,5" : (link.type === 'commentary' ? "2,2" : "none")}
              >
                <title>{link.description}</title>
              </path>
              <circle
                cx={(source.x + target.x) / 2}
                cy={(source.y + target.y) / 2}
                r="6"
                fill={getTypeColor(link.type)}
                stroke="#0f172a"
                strokeWidth="2"
              >
                <title>{link.type}</title>
              </circle>
            </g>
          );
        })}
        {visData.nodes.map(node => (
          <g 
            key={`node-${node.id}`}
            transform={`translate(${node.x}, ${node.y})`}
            onClick={() => {
              const passage = findPassage(node.id);
              if (passage) {
                handlePassageClick({
                  ...passage,
                  book: node.book,
                  bookColor: node.color
                });
              }
            }}
            className="cursor-pointer"
          >
            {node.primary && (
              <circle
                r="25"
                fill={node.color}
                opacity="0.2"
              >
                <animate
                  attributeName="r"
                  values="25;35;25"
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.2;0.3;0.2"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              r={node.primary ? 12 : 8}
              fill={node.color}
              stroke={node.primary ? "#ffffff" : "#0f172a"}
              strokeWidth="2"
            >
              {node.primary && (
                <animate
                  attributeName="r"
                  values="12;14;12"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
            <text
              y={node.primary ? 30 : 20}
              textAnchor="middle"
              fontSize={node.primary ? 14 : 12}
              fontWeight={node.primary ? "bold" : "normal"}
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="4"
              paintOrder="stroke"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Biblical Book Connections</h1>
          <div className="flex space-x-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search passages..."
                className="pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info size={20} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-gray-800 overflow-y-auto p-4">
          <h2 className="text-lg font-bold mb-4">Scripture Navigator</h2>
          {searchTerm && filteredPassages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-400 mb-2">SEARCH RESULTS</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {filteredPassages.map(passage => (
                  <div 
                    key={passage.id}
                    className="p-2 rounded cursor-pointer hover:bg-gray-700 text-sm"
                    onClick={() => handlePassageClick(passage)}
                  >
                    <div className="font-medium">{passage.title}</div>
                    <div className="text-xs text-gray-400">{passage.reference}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 border-t border-gray-700 pt-2"></div>
            </div>
          )}
          {renderBibleSections()}
        </div>
        <div className="flex-1 p-4">
          {selectedPassage ? (
            <div className="h-full flex flex-col">
              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{selectedPassage.title}</h2>
                    <h3 className="text-gray-400">{selectedPassage.reference}</h3>
                    <div className="flex items-center mt-1">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: selectedPassage.bookColor }}
                      ></div>
                      <span className="text-sm">{selectedPassage.bookTitle}</span>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-2">
                    <div className="text-sm font-bold mb-1">Connection Types:</div>
                    <div className="flex flex-wrap gap-1">
                      {connectionTypes.map(type => (
                        <button
                          key={type.id}
                          className={`px-2 py-0.5 text-xs rounded-full ${filterType === type.id ? 'ring-2 ring-white' : ''}`}
                          style={{ 
                            backgroundColor: type.id === 'all' ? '#64748b' : getTypeColor(type.id),
                            opacity: filterType === type.id || filterType === 'all' ? 1 : 0.6
                          }}
                          onClick={() => setFilterType(type.id)}
                        >
                          {type.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-gray-300">{selectedPassage.description}</p>
              </div>
              <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden flex">
                <div className="flex-1 min-w-0">
                  {renderConnectionsVisualization()}
                </div>
                <div className="w-72 border-l border-gray-700 overflow-y-auto p-4">
                  <h3 className="font-bold border-b border-gray-700 pb-2 mb-4">
                    {filterType === 'all' ? 'Connections' : `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Connections`}
                  </h3>
                  {filteredConnections.length > 0 ? (
                    <div className="space-y-4">
                      {filteredConnections.map(connection => {
                        const connectedPassage = getConnectedPassage(connection, selectedPassage.id);
                        return (
                          <div 
                            key={`${connection.from}-${connection.to}`}
                            className="p-3 rounded-lg border-l-4 bg-gray-700 cursor-pointer hover:bg-gray-600"
                            style={{ borderColor: getTypeColor(connection.type) }}
                            onClick={() => handlePassageClick(connectedPassage)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium">{connectedPassage.title}</div>
                              <div 
                                className="px-2 py-0.5 text-xs rounded-full"
                                style={{ backgroundColor: getTypeColor(connection.type) }}
                              >
                                {connection.type}
                              </div>
                            </div>
                            <div className="text-sm text-gray-300">{connectedPassage.reference}</div>
                            <div className="mt-2 text-sm">{connection.description}</div>
                            <div className="mt-2 w-full bg-gray-600 rounded-full h-1">
                              <div 
                                className="h-1 rounded-full" 
                                style={{ 
                                  width: `${connection.strength * 100}%`,
                                  backgroundColor: getTypeColor(connection.type)
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-gray-700 rounded-lg">
                      <p className="text-gray-400">No {filterType !== 'all' ? filterType : ''} connections found.</p>
                      {filterType !== 'all' && (
                        <button 
                          className="mt-2 text-blue-400 hover:underline"
                          onClick={() => setFilterType('all')}
                        >
                          View all connection types
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <BookOpen size={48} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Select a Passage</h2>
              <p className="text-gray-400 max-w-md">
                Select a book from the navigation panel, then choose a passage to view its connections across Scripture.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 max-w-xl">
                <div 
                  className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                  onClick={() => {
                    setExpandedSections(prev => ({ ...prev, pentateuch: true }));
                    handleBookClick('genesis');
                  }}
                >
                  <h3 className="font-bold" style={{ color: '#3498db' }}>Genesis</h3>
                  <p className="text-sm text-gray-400">Explore Creation, Noah, Abraham</p>
                </div>
                <div 
                  className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                  onClick={() => {
                    setExpandedSections(prev => ({ ...prev, gospels: true }));
                    handleBookClick('john');
                  }}
                >
                  <h3 className="font-bold" style={{ color: '#27ae60' }}>John</h3>
                  <p className="text-sm text-gray-400">Explore Jesus' ministry and crucifixion</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl max-h-full overflow-auto">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4">About Biblical Book Connections</h2>
              <p className="mb-4">
                This visualization organizes biblical passages by their books and sections, making it easy to explore
                connections between different parts of Scripture. When you select a passage, you'll see how it connects
                to passages in other books.
              </p>
              <h3 className="text-xl font-bold mb-2">Connection Types:</h3>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: getTypeColor('thematic') }}></div>
                  <strong>Thematic:</strong> Similar themes or motifs (flood/baptism)
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: getTypeColor('typological') }}></div>
                  <strong>Typological:</strong> Earlier events that foreshadow later ones
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: getTypeColor('prophetic') }}></div>
                  <strong>Prophetic:</strong> Prophecies and their fulfillments
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: getTypeColor('commentary') }}></div>
                  <strong>Commentary:</strong> New Testament commentary on Old Testament events
                </li>
              </ul>
              <h3 className="text-xl font-bold mb-2">How to Use:</h3>
              <ol className="mb-6 list-decimal pl-6 space-y-2">
                <li>Browse through Bible sections and books in the left panel</li>
                <li>Select a book to see its key passages</li>
                <li>Click on a passage to see its connections to other parts of Scripture</li>
                <li>Use the filter buttons to focus on specific types of connections</li>
                <li>Use the search box to find specific passages by title or reference</li>
              </ol>
              <div className="text-center">
                <button 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => setShowInfo(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BibleBookConnections;
