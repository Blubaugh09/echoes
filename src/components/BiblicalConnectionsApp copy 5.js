import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Biblical events data
const bibleEvents = [
  {
    id: 'creation',
    name: 'Creation',
    description: 'God creates the heavens and earth in six days',
    height: 0.85,
    position: [-18, -10],
    color: '#2a9d8f',
    year: 'Beginning',
    era: 'early',
    scripture: 'Genesis 1-2',
    keyFigures: ['God', 'Adam', 'Eve'],
    connections: ['fall', 'flood']
  },
  {
    id: 'fall',
    name: 'The Fall',
    description: 'Adam and Eve disobey God and sin enters the world',
    height: 0.8,
    position: [-16, -8],
    color: '#e63946',
    year: 'Beginning',
    era: 'early',
    scripture: 'Genesis 3',
    keyFigures: ['Adam', 'Eve', 'Serpent'],
    connections: ['cain_abel', 'flood']
  },
  {
    id: 'cain_abel',
    name: 'Cain and Abel',
    description: 'First murder as Cain kills his brother Abel',
    height: 0.7,
    position: [-14, -9],
    color: '#6a040f',
    year: 'Early history',
    era: 'early',
    scripture: 'Genesis 4',
    keyFigures: ['Cain', 'Abel'],
    connections: ['flood']
  },
  {
    id: 'flood',
    name: 'Great Flood',
    description: 'God sends a flood to cleanse the earth; Noah builds an ark',
    height: 0.9,
    position: [-12, -6],
    color: '#457b9d',
    year: 'c. 2350 BC',
    era: 'early',
    scripture: 'Genesis 6-9',
    keyFigures: ['Noah', 'God'],
    connections: ['babel', 'abraham_call']
  },
  {
    id: 'babel',
    name: 'Tower of Babel',
    description: 'People attempt to build a tower to heaven; God confuses languages',
    height: 0.75,
    position: [-10, -7],
    color: '#e9c46a',
    year: 'c. 2200 BC',
    era: 'early',
    scripture: 'Genesis 11:1-9',
    keyFigures: ['Nimrod'],
    connections: ['abraham_call']
  },
  {
    id: 'abraham_call',
    name: 'Call of Abraham',
    description: 'God calls Abraham to leave his home for the Promised Land',
    height: 0.85,
    position: [-8, -4],
    color: '#f4a261',
    year: 'c. 2000 BC',
    era: 'early',
    scripture: 'Genesis 12',
    keyFigures: ['Abraham', 'Sarah'],
    connections: ['isaac_birth', 'sodom', 'isaac_sacrifice']
  },
  {
    id: 'sodom',
    name: 'Destruction of Sodom',
    description: 'God destroys the wicked cities of Sodom and Gomorrah',
    height: 0.7,
    position: [-7, -6],
    color: '#e76f51',
    year: 'c. 1900 BC',
    era: 'early',
    scripture: 'Genesis 19',
    keyFigures: ['Lot', 'Abraham'],
    connections: ['isaac_birth']
  },
  {
    id: 'isaac_birth',
    name: 'Birth of Isaac',
    description: 'Abraham and Sarah have a son in their old age',
    height: 0.7,
    position: [-6, -4],
    color: '#f4a261',
    year: 'c. 1900 BC',
    era: 'early',
    scripture: 'Genesis 21',
    keyFigures: ['Isaac', 'Abraham', 'Sarah'],
    connections: ['isaac_sacrifice', 'jacob_esau']
  },
  {
    id: 'isaac_sacrifice',
    name: 'Sacrifice of Isaac',
    description: 'Abraham shows willingness to sacrifice his son Isaac',
    height: 0.8,
    position: [-5, -5],
    color: '#bc6c25',
    year: 'c. 1875 BC',
    era: 'early',
    scripture: 'Genesis 22',
    keyFigures: ['Abraham', 'Isaac'],
    connections: ['jacob_esau']
  },
  {
    id: 'jacob_esau',
    name: 'Jacob and Esau',
    description: 'Jacob receives the birthright and blessing instead of Esau',
    height: 0.75,
    position: [-4, -3],
    color: '#a8dadc',
    year: 'c. 1850 BC',
    era: 'early',
    scripture: 'Genesis 25-27',
    keyFigures: ['Jacob', 'Esau', 'Isaac', 'Rebekah'],
    connections: ['jacobs_ladder', 'joseph_coat']
  },
  {
    id: 'jacobs_ladder',
    name: "Jacob's Ladder",
    description: 'Jacob dreams of a ladder to heaven with angels',
    height: 0.7,
    position: [-3, -4],
    color: '#219ebc',
    year: 'c. 1800 BC',
    era: 'early',
    scripture: 'Genesis 28',
    keyFigures: ['Jacob'],
    connections: ['joseph_coat']
  },
  {
    id: 'joseph_coat',
    name: "Joseph's Coat",
    description: 'Joseph receives a coat of many colors and is sold into slavery',
    height: 0.8,
    position: [-2, -2],
    color: '#ffb703',
    year: 'c. 1750 BC',
    era: 'early',
    scripture: 'Genesis 37',
    keyFigures: ['Joseph', 'Jacob'],
    connections: ['joseph_egypt', 'moses_birth']
  },
  {
    id: 'joseph_egypt',
    name: 'Joseph in Egypt',
    description: 'Joseph rises to power in Egypt and saves his family',
    height: 0.8,
    position: [-1, -3],
    color: '#ffb703',
    year: 'c. 1700 BC',
    era: 'early',
    scripture: 'Genesis 39-47',
    keyFigures: ['Joseph', 'Pharaoh'],
    connections: ['moses_birth']
  },
  {
    id: 'moses_birth',
    name: 'Birth of Moses',
    description: "Moses is born and saved from Pharaoh's decree",
    height: 0.7,
    position: [0, -1],
    color: '#8a5a44',
    year: 'c. 1525 BC',
    era: 'exodus',
    scripture: 'Exodus 2',
    keyFigures: ['Moses', "Pharaoh's Daughter"],
    connections: ['burning_bush', 'plagues']
  },
  {
    id: 'burning_bush',
    name: 'Burning Bush',
    description: 'God speaks to Moses through a burning bush',
    height: 0.75,
    position: [1, -2],
    color: '#e63946',
    year: 'c. 1445 BC',
    era: 'exodus',
    scripture: 'Exodus 3-4',
    keyFigures: ['Moses', 'God'],
    connections: ['plagues', 'exodus']
  },
  {
    id: 'plagues',
    name: 'Ten Plagues',
    description: 'God sends ten plagues upon Egypt',
    height: 0.85,
    position: [2, 0],
    color: '#1d3557',
    year: 'c. 1445 BC',
    era: 'exodus',
    scripture: 'Exodus 7-12',
    keyFigures: ['Moses', 'Aaron', 'Pharaoh'],
    connections: ['exodus', 'red_sea']
  },
  {
    id: 'exodus',
    name: 'The Exodus',
    description: 'Israelites leave Egypt and slavery',
    height: 0.9,
    position: [3, -1],
    color: '#457b9d',
    year: 'c. 1445 BC',
    era: 'exodus',
    scripture: 'Exodus 12-13',
    keyFigures: ['Moses', 'Israelites'],
    connections: ['red_sea', 'ten_commandments']
  },
  {
    id: 'red_sea',
    name: 'Red Sea Crossing',
    description: 'God parts the Red Sea for the Israelites to escape',
    height: 0.85,
    position: [4, 0],
    color: '#219ebc',
    year: 'c. 1445 BC',
    era: 'exodus',
    scripture: 'Exodus 14',
    keyFigures: ['Moses', 'Israelites', 'Egyptian Army'],
    connections: ['ten_commandments', 'wilderness']
  },
  {
    id: 'ten_commandments',
    name: 'Ten Commandments',
    description: 'God gives the Law to Moses on Mount Sinai',
    height: 0.9,
    position: [5, 1],
    color: '#e9c46a',
    year: 'c. 1445 BC',
    era: 'exodus',
    scripture: 'Exodus 20',
    keyFigures: ['Moses', 'God'],
    connections: ['wilderness', 'promised_land']
  },
  {
    id: 'wilderness',
    name: 'Wilderness Wandering',
    description: '40 years of wandering in the desert',
    height: 0.75,
    position: [6, 0],
    color: '#f4a261',
    year: 'c. 1445-1405 BC',
    era: 'exodus',
    scripture: 'Numbers',
    keyFigures: ['Moses', 'Aaron', 'Israelites'],
    connections: ['promised_land']
  },
  {
    id: 'promised_land',
    name: 'Entering Promised Land',
    description: 'Joshua leads Israelites into Canaan',
    height: 0.85,
    position: [7, 2],
    color: '#2a9d8f',
    year: 'c. 1405 BC',
    era: 'exodus',
    scripture: 'Joshua 1-4',
    keyFigures: ['Joshua', 'Israelites'],
    connections: ['judges', 'davidking']
  },
  {
    id: 'judges',
    name: 'Period of Judges',
    description: 'Israel is ruled by judges before the monarchy',
    height: 0.7,
    position: [8, 3],
    color: '#8a5a44',
    year: 'c. 1375-1050 BC',
    era: 'kingdom',
    scripture: 'Judges',
    keyFigures: ['Deborah', 'Gideon', 'Samson'],
    connections: ['saul_king', 'davidking']
  },
  {
    id: 'saul_king',
    name: 'Saul Becomes King',
    description: "Israel's first king is anointed",
    height: 0.75,
    position: [9, 4],
    color: '#6a040f',
    year: 'c. 1050 BC',
    era: 'kingdom',
    scripture: '1 Samuel 9-10',
    keyFigures: ['Saul', 'Samuel'],
    connections: ['davidking']
  },
  {
    id: 'davidking',
    name: "David's Reign",
    description: 'David becomes king and establishes Jerusalem',
    height: 0.85,
    position: [10, 5],
    color: '#1d3557',
    year: 'c. 1010-970 BC',
    era: 'kingdom',
    scripture: '2 Samuel',
    keyFigures: ['David'],
    connections: ['solomon_temple', 'divided_kingdom']
  },
  {
    id: 'solomon_temple',
    name: "Solomon's Temple",
    description: 'King Solomon builds the first temple',
    height: 0.8,
    position: [11, 6],
    color: '#e9c46a',
    year: 'c. 966 BC',
    era: 'kingdom',
    scripture: '1 Kings 6-8',
    keyFigures: ['Solomon'],
    connections: ['divided_kingdom']
  },
  {
    id: 'divided_kingdom',
    name: 'Divided Kingdom',
    description: 'Israel splits into two kingdoms after Solomon',
    height: 0.7,
    position: [12, 5],
    color: '#e76f51',
    year: 'c. 930 BC',
    era: 'kingdom',
    scripture: '1 Kings 12',
    keyFigures: ['Rehoboam', 'Jeroboam'],
    connections: ['israel_exile', 'judah_exile']
  },
  {
    id: 'israel_exile',
    name: 'Israel in Exile',
    description: 'Northern kingdom falls to Assyria',
    height: 0.75,
    position: [13, 6],
    color: '#6a040f',
    year: 'c. 722 BC',
    era: 'exile',
    scripture: '2 Kings 17',
    keyFigures: ['Hoshea', 'Shalmaneser'],
    connections: ['judah_exile']
  },
  {
    id: 'judah_exile',
    name: 'Judah in Exile',
    description: 'Southern kingdom falls to Babylon',
    height: 0.75,
    position: [14, 7],
    color: '#6a040f',
    year: 'c. 586 BC',
    era: 'exile',
    scripture: '2 Kings 25',
    keyFigures: ['Nebuchadnezzar', 'Zedekiah'],
    connections: ['return_exile', 'daniel_lions']
  },
  {
    id: 'daniel_lions',
    name: "Daniel in Lion's Den",
    description: 'Daniel is thrown into a den of lions but is saved',
    height: 0.7,
    position: [14, 9],
    color: '#457b9d',
    year: 'c. 539 BC',
    era: 'exile',
    scripture: 'Daniel 6',
    keyFigures: ['Daniel', 'Darius'],
    connections: ['return_exile']
  },
  {
    id: 'return_exile',
    name: 'Return from Exile',
    description: 'Jews return to Jerusalem to rebuild',
    height: 0.8,
    position: [15, 8],
    color: '#2a9d8f',
    year: 'c. 538-445 BC',
    era: 'exile',
    scripture: 'Ezra, Nehemiah',
    keyFigures: ['Zerubbabel', 'Ezra', 'Nehemiah'],
    connections: ['jesus_birth', 'john_baptist']
  },
  {
    id: 'john_baptist',
    name: 'John the Baptist',
    description: 'John prepares the way for Jesus',
    height: 0.75,
    position: [16, 9],
    color: '#219ebc',
    year: 'c. 27 AD',
    era: 'jesus',
    scripture: 'Luke 3',
    keyFigures: ['John the Baptist'],
    connections: ['jesus_birth', 'jesus_baptism']
  },
  {
    id: 'jesus_birth',
    name: 'Birth of Jesus',
    description: 'Jesus is born in Bethlehem',
    height: 0.9,
    position: [16, 7],
    color: '#ffb703',
    year: 'c. 4-6 BC',
    era: 'jesus',
    scripture: 'Matthew 1-2, Luke 2',
    keyFigures: ['Jesus', 'Mary', 'Joseph'],
    connections: ['jesus_baptism', 'jesus_ministry']
  },
  {
    id: 'jesus_baptism',
    name: 'Baptism of Jesus',
    description: 'Jesus is baptized by John in the Jordan',
    height: 0.8,
    position: [17, 8],
    color: '#219ebc',
    year: 'c. 27 AD',
    era: 'jesus',
    scripture: 'Matthew 3:13-17',
    keyFigures: ['Jesus', 'John the Baptist'],
    connections: ['jesus_ministry']
  },
  {
    id: 'jesus_ministry',
    name: "Jesus' Ministry",
    description: 'Jesus teaches, performs miracles, and calls disciples',
    height: 0.9,
    position: [18, 9],
    color: '#1d3557',
    year: 'c. 27-30 AD',
    era: 'jesus',
    scripture: 'Gospels',
    keyFigures: ['Jesus', 'Disciples'],
    connections: ['crucifixion']
  },
  {
    id: 'crucifixion',
    name: 'Crucifixion',
    description: "Jesus dies on the cross for humanity's sins",
    height: 0.95,
    position: [19, 10],
    color: '#e63946',
    year: 'c. 30 AD',
    era: 'jesus',
    scripture: 'Matthew 27, Mark 15, Luke 23, John 19',
    keyFigures: ['Jesus', 'Pilate'],
    connections: ['resurrection']
  },
  {
    id: 'resurrection',
    name: 'Resurrection',
    description: 'Jesus rises from the dead on the third day',
    height: 1.0,
    position: [20, 11],
    color: '#f4a261',
    year: 'c. 30 AD',
    era: 'jesus',
    scripture: 'Matthew 28, Mark 16, Luke 24, John 20',
    keyFigures: ['Jesus', 'Mary Magdalene'],
    connections: ['pentecost', 'ascension']
  },
  {
    id: 'ascension',
    name: 'Ascension',
    description: 'Jesus ascends to heaven 40 days after resurrection',
    height: 0.85,
    position: [20, 9],
    color: '#457b9d',
    year: 'c. 30 AD',
    era: 'jesus',
    scripture: 'Acts 1:1-11',
    keyFigures: ['Jesus', 'Disciples'],
    connections: ['pentecost']
  },
  {
    id: 'pentecost',
    name: 'Pentecost',
    description: 'Holy Spirit comes to the disciples',
    height: 0.85,
    position: [21, 10],
    color: '#e76f51',
    year: 'c. 30 AD',
    era: 'church',
    scripture: 'Acts 2',
    keyFigures: ['Apostles', 'Holy Spirit'],
    connections: ['church_begins', 'paul_conversion']
  },
  {
    id: 'church_begins',
    name: 'Early Church',
    description: 'The first Christian church is established',
    height: 0.8,
    position: [22, 11],
    color: '#2a9d8f',
    year: 'c. 30-35 AD',
    era: 'church',
    scripture: 'Acts 2-7',
    keyFigures: ['Peter', 'Stephen', 'Apostles'],
    connections: ['paul_conversion', 'paul_missionary']
  },
  {
    id: 'paul_conversion',
    name: "Paul's Conversion",
    description: 'Saul (Paul) meets Jesus on the road to Damascus',
    height: 0.8,
    position: [23, 10],
    color: '#f4a261',
    year: 'c. 35 AD',
    era: 'church',
    scripture: 'Acts 9',
    keyFigures: ['Paul'],
    connections: ['paul_missionary']
  },
  {
    id: 'paul_missionary',
    name: "Paul's Journeys",
    description: 'Paul spreads the gospel throughout the Roman Empire',
    height: 0.8,
    position: [24, 12],
    color: '#1d3557',
    year: 'c. 46-58 AD',
    era: 'church',
    scripture: 'Acts 13-28',
    keyFigures: ['Paul', 'Barnabas', 'Silas'],
    connections: ['revelation']
  },
  {
    id: 'revelation',
    name: 'Revelation',
    description: 'John receives visions of the end times',
    height: 0.9,
    position: [25, 11],
    color: '#e63946',
    year: 'c. 95 AD',
    era: 'church',
    scripture: 'Revelation',
    keyFigures: ['John', 'Jesus'],
    connections: []
  }
];

// Define era information
const eraInfo = {
  'all': { name: 'All Biblical History', color: '#4a9eff', position: [0, 0] },
  'early': { name: 'Early History', color: '#2a9d8f', position: [-8, -5] },
  'exodus': { name: 'Exodus & Wilderness', color: '#457b9d', position: [4, 0] },
  'kingdom': { name: 'Kingdom Period', color: '#1d3557', position: [10, 5] },
  'exile': { name: 'Exile', color: '#e63946', position: [14, 7] },
  'jesus': { name: "Jesus' Life & Ministry", color: '#f4a261', position: [18, 9] },
  'church': { name: 'Early Church', color: '#4caf50', position: [22, 11] }
};

// Main component
const BibleEvents3DSimplified = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const objectsToRaycastRef = useRef([]);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [selectedEra, setSelectedEra] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAllLabels, setShowAllLabels] = useState(false);

  // Initialize 3D scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f8ff);
    
    // Camera setup - use perspective camera for 3D view
    const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    camera.position.set(0, 20, 30); // Initial position
    cameraRef.current = camera;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Controls setup - simplified for ease of use
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5; // Slower rotation for better control
    controls.zoomSpeed = 0.7; // Moderate zoom speed
    controls.panSpeed = 0.5; // Moderate pan speed
    controls.maxPolarAngle = Math.PI / 2.2; // Prevent going below ground
    controls.minDistance = 5; // Don't zoom in too close
    controls.maxDistance = 60; // Don't zoom out too far
    controlsRef.current = controls;
    
    // Add lights
    addLights(scene);
    
    // Create the landscape
    createLandscape(scene);
    
    // Create event markers and connections
    createEventMarkers(scene);
    createConnections(scene);
    
    // Initialize raycaster for interaction
    raycasterRef.current = new THREE.Raycaster();
    mouseRef.current = new THREE.Vector2();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('click', handleClick);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update controls
      controls.update();
      
      // Update interaction
      checkIntersections();
      
      // Render scene
      renderer.render(scene, camera);
    };
    animate();
    
    // Set loading to false
    setIsLoading(false);
    
    // Store current container reference for cleanup
    const currentContainer = containerRef.current;
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Safely remove event listeners only if container still exists
      if (currentContainer) {
        currentContainer.removeEventListener('mousemove', handleMouseMove);
        currentContainer.removeEventListener('click', handleClick);
      }
      
      // Clean up renderer and DOM elements
      if (rendererRef.current) {
        rendererRef.current.dispose();
        
        // Only try to remove child if both container and renderer exist
        if (currentContainer && rendererRef.current.domElement && 
            currentContainer.contains(rendererRef.current.domElement)) {
          currentContainer.removeChild(rendererRef.current.domElement);
        }
      }
      
      if (sceneRef.current) {
        // Dispose of all geometries and materials
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
    };
  }, []);
  
  // Update when selected era changes
  useEffect(() => {
    if (selectedEra && selectedEra !== 'all') {
      navigateToEra(selectedEra);
    }
  }, [selectedEra]);
  
  // Handle window resize
  const handleResize = () => {
    if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  };
  
  // Handle mouse move for hovering
  const handleMouseMove = (event) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
  };
  
  // Handle click to select events
  const handleClick = () => {
    if (hoveredEvent) {
      setSelectedEvent(hoveredEvent === selectedEvent ? null : hoveredEvent);
    }
  };
  
  // Check for intersections with event markers
  const checkIntersections = () => {
    if (!raycasterRef.current || !cameraRef.current || !objectsToRaycastRef.current.length) return;
    
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(objectsToRaycastRef.current);
    
    if (intersects.length > 0) {
      const eventId = intersects[0].object.userData.eventId;
      if (eventId && eventId !== hoveredEvent) {
        setHoveredEvent(eventId);
        document.body.style.cursor = 'pointer';
        updateLabels(eventId);
      }
    } else if (hoveredEvent) {
      setHoveredEvent(null);
      document.body.style.cursor = 'default';
      updateLabels(null);
    }
  };
  
  // Add lights to the scene
  const addLights = (scene) => {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Main directional light (sun-like)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    
    // Improve shadow quality
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    
    // Set shadow boundaries
    const d = 30;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;
    
    scene.add(directionalLight);
    
    // Add a secondary light from another angle
    const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.3);
    secondaryLight.position.set(-5, 10, -10);
    scene.add(secondaryLight);
  };
  
  // Create the base landscape
  const createLandscape = (scene) => {
    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(80, 40, 100, 60);
    
    // Create terrain with gentle hills and valleys
    // Apply height variations based on event positions
    const vertices = groundGeometry.attributes.position.array;
    const influenceRadius = 6; // How far each event affects the terrain
    
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 2];
      
      // Base height with slight variation for visual interest
      let baseHeight = Math.sin(x * 0.1) * Math.sin(z * 0.1) * 0.2;
      
      // Calculate event influence on terrain height
      let totalHeight = baseHeight;
      let totalInfluence = 0;
      
      // Each event creates a hill or mountain
      bibleEvents.forEach(event => {
        const dx = x - event.position[0];
        const dz = z - event.position[1];
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < influenceRadius) {
          // Use inverse square for natural mountain shape
          const influence = Math.pow(1 - distance / influenceRadius, 2);
          const height = event.height * 3; // Scale height
          totalHeight += height * influence;
          totalInfluence += influence;
        }
      });
      
      // Apply height to vertex
      vertices[i + 1] = totalHeight;
    }
    
    // Update normals for proper lighting
    groundGeometry.computeVertexNormals();
    
    // Create gradient material for terrain
    const groundMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.8,
      metalness: 0.1
    });
    
    // Add colors based on position and height for beautiful terrain
    const colors = [];
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      const z = vertices[i + 2];
      
      // Base color gradient from green to sandy
      const normalizedX = (x + 40) / 80; // 0 to 1
      
      // Create a beautiful color gradient across the timeline
      let color;
      if (normalizedX < 0.2) {
        // Early history - greens
        color = new THREE.Color(0x2a9d8f).lerp(new THREE.Color(0x95d5b2), y / 3);
      } else if (normalizedX < 0.4) {
        // Exodus period - blues and tans
        color = new THREE.Color(0x457b9d).lerp(new THREE.Color(0xa8dadc), y / 3);
      } else if (normalizedX < 0.6) {
        // Kingdom period - deeper blues and purples
        color = new THREE.Color(0x1d3557).lerp(new THREE.Color(0x6c5b7b), y / 3);
      } else if (normalizedX < 0.8) {
        // Exile and return - reds and ambers
        color = new THREE.Color(0xe63946).lerp(new THREE.Color(0xf4a261), y / 3);
      } else {
        // Jesus and church - gold to white
        color = new THREE.Color(0xffb703).lerp(new THREE.Color(0xffffff), y / 3);
      }
      
      // Heighten color intensity for peaks
      if (y > 1) {
        color.multiplyScalar(1 + (y - 1) * 0.1);
      }
      
      colors.push(color.r, color.g, color.b);
    }
    
    // Add colors to geometry
    groundGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    // Create and add ground mesh
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Make it horizontal
    ground.receiveShadow = true;
    ground.castShadow = true;
    scene.add(ground);
    
    // Add water
    const waterGeometry = new THREE.PlaneGeometry(100, 60);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x219ebc,
      transparent: true,
      opacity: 0.7,
      metalness: 0.9,
      roughness: 0.1
    });
    
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.5; // Just below ground level
    scene.add(water);
    
    // Add sky gradient
    const skyGeometry = new THREE.SphereGeometry(50, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0xffffff) },
        offset: { value: 40 },
        exponent: { value: 0.8 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide
    });
    
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
    
    // Add timeline path
    addTimelinePath(scene);
  };
  
  // Add a visible timeline path connecting all events
  const addTimelinePath = (scene) => {
    // Sort events chronologically
    const sortedEvents = [...bibleEvents].sort((a, b) => {
      // First sort by x position (chronology)
      return a.position[0] - b.position[0];
    });
    
    // Create a smooth path through all events
    const timelinePoints = [];
    sortedEvents.forEach(event => {
      const height = event.height * 3 + 0.2; // Slightly above the terrain
      timelinePoints.push(new THREE.Vector3(event.position[0], height, event.position[1]));
    });
    
    // Create a smooth curve through the points
    const curve = new THREE.CatmullRomCurve3(timelinePoints);
    curve.tension = 0.3; // Adjust curve smoothness
    
    // Create a tube geometry along the curve
    const tubeGeometry = new THREE.TubeGeometry(curve, 200, 0.1, 8, false);
    
    // Use a glowing material
    const tubeMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a9eff,
      emissive: 0x4a9eff,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8
    });
    
    const timelineTube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(timelineTube);
    
    // Add era markers
    Object.entries(eraInfo).forEach(([eraId, data]) => {
      if (eraId === 'all') return; // Skip the "all" category
      
      const { position, color, name } = data;
      
      // Create a vertical beam at each era's position
      const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 8, 8);
      const beamMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.7
      });
      
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      beam.position.set(position[0], 4, position[1]);
      scene.add(beam);
      
      // Add floating era label
      addFloatingLabel(scene, name, position[0], 8.5, position[1], color, 1.5);
    });
  };
  
  // Create markers for each biblical event
  const createEventMarkers = (scene) => {
    objectsToRaycastRef.current = []; // Clear the array
    
    bibleEvents.forEach(event => {
      // Calculate height at this position
      const height = event.height * 3;
      const x = event.position[0];
      const z = event.position[1];
      
      // Create an attractive monument/pillar for each event
      const baseHeight = height;
      const baseRadius = 0.3;
      
      // Create a beacon/monument for each event
      const pillarGeometry = new THREE.CylinderGeometry(baseRadius * 0.7, baseRadius, baseHeight, 8);
      const pillarMaterial = new THREE.MeshStandardMaterial({
        color: event.color,
        metalness: 0.3,
        roughness: 0.4,
        emissive: event.color,
        emissiveIntensity: 0.2
      });
      
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.set(x, baseHeight / 2, z);
      pillar.castShadow = true;
      pillar.userData = { eventId: event.id };
      scene.add(pillar);
      
      // Add to objects for raycasting
      objectsToRaycastRef.current.push(pillar);
      
      // Add a glowing top to the pillar
      const topGeometry = new THREE.SphereGeometry(baseRadius * 0.8, 12, 12);
      const topMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: event.color,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.9
      });
      
      const top = new THREE.Mesh(topGeometry, topMaterial);
      top.position.set(x, baseHeight, z);
      top.castShadow = true;
      top.userData = { eventId: event.id };
      scene.add(top);
      
      // Add to objects for raycasting
      objectsToRaycastRef.current.push(top);
      
      // Add a base platform
      const baseGeometry = new THREE.CylinderGeometry(baseRadius * 1.5, baseRadius * 2, 0.2, 8);
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: event.color,
        metalness: 0.2,
        roughness: 0.8
      });
      
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.set(x, 0.1, z);
      base.castShadow = true;
      base.receiveShadow = true;
      base.userData = { eventId: event.id };
      scene.add(base);
      
      // Add to objects for raycasting
      objectsToRaycastRef.current.push(base);
      
      // Add floating label above the pillar
      addFloatingLabel(scene, event.name, x, baseHeight + 0.5, z, event.color, 1, event.id);
    });
  };
  
  // Add floating text labels
  const addFloatingLabel = (scene, text, x, y, z, color, scale = 1, eventId = null) => {
    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;
    
    // Fill canvas with semi-transparent background
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw border
    context.strokeStyle = color;
    context.lineWidth = 4;
    context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
    
    // Draw text
    context.font = 'bold 32px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#000000';
    
    // If text is too long, split it
    if (text.length > 20) {
      const words = text.split(' ');
      let line1 = '';
      let line2 = '';
      let currentLine = line1;
      
      for (const word of words) {
        if ((currentLine + word).length <= 20) {
          currentLine += (currentLine.length ? ' ' : '') + word;
          if (currentLine === line1) {
            line1 = currentLine;
          } else {
            line2 = currentLine;
          }
        } else {
          if (currentLine === line1) {
            currentLine = line2;
            currentLine += (currentLine.length ? ' ' : '') + word;
            line2 = currentLine;
          } else {
            break; // Can't fit more
          }
        }
      }
      
      context.font = 'bold 24px Arial';
      context.fillText(line1, canvas.width / 2, canvas.height / 3);
      context.fillText(line2, canvas.width / 2, canvas.height * 2 / 3);
    } else {
      context.fillText(text, canvas.width / 2, canvas.height / 2);
    }
    
    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    
    // Create sprite material
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    });
    
    // Create sprite
    const sprite = new THREE.Sprite(material);
    sprite.position.set(x, y, z);
    sprite.scale.set(2 * scale, 1 * scale, 1);
    
    // Store event ID for interaction
    if (eventId) {
      sprite.userData = { 
        isLabel: true,
        eventId: eventId
      };
    }
    
    // Initially hide most labels to reduce clutter
    if (eventId && !showAllLabels) {
      sprite.visible = false;
    }
    
    scene.add(sprite);
    
    return sprite;
  };
  
  // Create connections between related events
  const createConnections = (scene) => {
    bibleEvents.forEach(event => {
      if (!event.connections || event.connections.length === 0) return;
      
      // Get event position with height
      const startPos = new THREE.Vector3(
        event.position[0],
        event.height * 3, // Set to peak height
        event.position[1]
      );
      
      // Create connections to each related event
      event.connections.forEach(targetId => {
        const targetEvent = bibleEvents.find(e => e.id === targetId);
        if (!targetEvent) return;
        
        // Get target position with height
        const endPos = new THREE.Vector3(
          targetEvent.position[0],
          targetEvent.height * 3, // Set to peak height
          targetEvent.position[1]
        );
        
        // Calculate midpoint with some elevation for a nice arc
        const midPoint = new THREE.Vector3()
          .addVectors(startPos, endPos)
          .multiplyScalar(0.5);
        midPoint.y += 1.5; // Add some height for an arc
        
        // Create a quadratic curve
        const curve = new THREE.QuadraticBezierCurve3(
          startPos,
          midPoint,
          endPos
        );
        
        // Create geometry
        const points = curve.getPoints(30);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Create material
        const material = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.3,
          linewidth: 1
        });
        
        // Create the curve
        const curveObject = new THREE.Line(geometry, material);
        curveObject.userData = {
          isConnection: true,
          sourceId: event.id,
          targetId: targetId
        };
        
        scene.add(curveObject);
        
        // Add a small pulse effect along the connection
        addConnectionPulse(scene, curve, event.color);
      });
    });
  };
  
  // Add a pulse that travels along connections
  const addConnectionPulse = (scene, curve, color) => {
    // Create a small sphere that will move along the curve
    const pulseGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const pulseMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.7
    });
    
    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
    scene.add(pulse);
    
    // Start the pulse at a random position
    let t = Math.random();
    const speed = 0.001 + Math.random() * 0.001; // Random speed
    
    // Function to update pulse position
    const updatePulse = () => {
      // Update position along curve
      t = (t + speed) % 1;
      const position = curve.getPoint(t);
      pulse.position.copy(position);
      
      // Request the next update
      requestAnimationFrame(updatePulse);
    };
    
    // Start the animation
    updatePulse();
  };
  
  // Update label visibility
  const updateLabels = (hoveredEventId) => {
    if (!sceneRef.current) return;
    
    // Find all label sprites
    sceneRef.current.traverse(object => {
      if (object.userData && object.userData.isLabel) {
        const isHovered = object.userData.eventId === hoveredEventId;
        const isSelected = selectedEvent && object.userData.eventId === selectedEvent;
        
        // Show label if hovered, selected, or showAllLabels is true
        object.visible = isHovered || isSelected || showAllLabels;
      }
      
      // Highlight connections for hovered/selected event
      if (object.userData && object.userData.isConnection) {
        const isConnectedToHovered = hoveredEventId && 
          (object.userData.sourceId === hoveredEventId || object.userData.targetId === hoveredEventId);
        const isConnectedToSelected = selectedEvent && 
          (object.userData.sourceId === selectedEvent || object.userData.targetId === selectedEvent);
        
        if (isConnectedToHovered || isConnectedToSelected) {
          object.material.color.set(0xffcc00);
          object.material.opacity = 0.8;
          object.material.linewidth = 2;
        } else {
          object.material.color.set(0xffffff);
          object.material.opacity = 0.3;
          object.material.linewidth = 1;
        }
      }
      
      // Highlight event markers
      if (object.userData && object.userData.eventId && object instanceof THREE.Mesh) {
        const isHovered = object.userData.eventId === hoveredEventId;
        const isSelected = selectedEvent && object.userData.eventId === selectedEvent;
        
        if (isHovered || isSelected) {
          if (object.material.emissive) {
            object.material.emissiveIntensity = 0.8;
            object.material.emissive.set(0xffcc00);
          }
          // Make it slightly larger
          if (!object._originalScale) {
            object._originalScale = object.scale.clone();
          }
          object.scale.set(
            object._originalScale.x * 1.2,
            object._originalScale.y * 1.2,
            object._originalScale.z * 1.2
          );
        } else {
          if (object.material.emissive) {
            object.material.emissiveIntensity = 0.2;
            const eventObj = bibleEvents.find(e => e.id === object.userData.eventId);
            if (eventObj) {
              object.material.emissive.set(eventObj.color);
            }
          }
          // Reset scale
          if (object._originalScale) {
            object.scale.copy(object._originalScale);
          }
        }
      }
    });
  };
  
  // Navigate camera to focus on an event
  const navigateToEvent = (eventId) => {
    if (!controlsRef.current || !cameraRef.current) return;
    
    const event = bibleEvents.find(e => e.id === eventId);
    if (!event) return;
    
    // Set the new selected event
    setSelectedEvent(eventId);
    
    // Calculate target position
    const targetX = event.position[0];
    const targetZ = event.position[1];
    const targetY = event.height * 3;
    
    // Disable controls during animation
    controlsRef.current.enabled = false;
    
    // Save current camera position and target
    const startPosition = cameraRef.current.position.clone();
    const startTarget = controlsRef.current.target.clone();
    const endTarget = new THREE.Vector3(targetX, targetY, targetZ);
    
    // Calculate a nice viewing position
    // Position the camera at an angle to see the event
    const cameraDistance = 8;
    const cameraHeight = targetY + 3;
    
    // Look at the event from a slight angle
    const angle = Math.PI / 4; // 45 degrees
    const endPosition = new THREE.Vector3(
      targetX - Math.sin(angle) * cameraDistance,
      cameraHeight,
      targetZ - Math.cos(angle) * cameraDistance
    );
    
    // Animate the camera move
    let startTime = null;
    const duration = 1000; // 1 second
    
    const animateCamera = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease function (smooth start and end)
      const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const t = ease(progress);
      
      // Interpolate position
      const newX = startPosition.x + (endPosition.x - startPosition.x) * t;
      const newY = startPosition.y + (endPosition.y - startPosition.y) * t;
      const newZ = startPosition.z + (endPosition.z - startPosition.z) * t;
      cameraRef.current.position.set(newX, newY, newZ);
      
      // Interpolate target
      const newTargetX = startTarget.x + (endTarget.x - startTarget.x) * t;
      const newTargetY = startTarget.y + (endTarget.y - startTarget.y) * t;
      const newTargetZ = startTarget.z + (endTarget.z - startTarget.z) * t;
      controlsRef.current.target.set(newTargetX, newTargetY, newTargetZ);
      
      // Update the camera to look at the new target
      cameraRef.current.lookAt(controlsRef.current.target);
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      } else {
        // Animation complete, re-enable controls
        controlsRef.current.enabled = true;
        controlsRef.current.update();
      }
    };
    
    requestAnimationFrame(animateCamera);
  };
  
  // Navigate to an era
  const navigateToEra = (eraId) => {
    if (!controlsRef.current || !cameraRef.current) return;
    
    const era = eraInfo[eraId];
    if (!era) return;
    
    // Clear selected event
    if (selectedEvent) {
      setSelectedEvent(null);
    }
    
    // Set the era
    setSelectedEra(eraId);
    
    // Position based on era
    const targetX = era.position[0];
    const targetZ = era.position[1];
    
    // Disable controls during animation
    controlsRef.current.enabled = false;
    
    // Save current camera position and target
    const startPosition = cameraRef.current.position.clone();
    const startTarget = controlsRef.current.target.clone();
    const endTarget = new THREE.Vector3(targetX, 0, targetZ);
    
    // Calculate viewing position based on era
    let cameraDistance, cameraHeight;
    
    if (eraId === 'all') {
      // Overview position
      cameraDistance = 0;
      cameraHeight = 30;
    } else {
      // Era-specific position
      cameraDistance = 15;
      cameraHeight = 12;
    }
    
    // Look down at the area from a distance
    const angle = Math.PI / 6; // 30 degrees
    const endPosition = new THREE.Vector3(
      targetX - Math.sin(angle) * cameraDistance,
      cameraHeight,
      targetZ - Math.cos(angle) * cameraDistance
    );
    
    // Animate the camera move
    let startTime = null;
    const duration = 1500; // 1.5 seconds
    
    const animateCamera = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease function (smooth start and end)
      const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const t = ease(progress);
      
      // Interpolate position
      const newX = startPosition.x + (endPosition.x - startPosition.x) * t;
      const newY = startPosition.y + (endPosition.y - startPosition.y) * t;
      const newZ = startPosition.z + (endPosition.z - startPosition.z) * t;
      cameraRef.current.position.set(newX, newY, newZ);
      
      // Interpolate target
      const newTargetX = startTarget.x + (endTarget.x - startTarget.x) * t;
      const newTargetY = startTarget.y + (endTarget.y - startTarget.y) * t;
      const newTargetZ = startTarget.z + (endTarget.z - startTarget.z) * t;
      controlsRef.current.target.set(newTargetX, newTargetY, newTargetZ);
      
      // Update the camera to look at the new target
      cameraRef.current.lookAt(controlsRef.current.target);
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      } else {
        // Animation complete, re-enable controls
        controlsRef.current.enabled = true;
        controlsRef.current.update();
      }
    };
    
    requestAnimationFrame(animateCamera);
  };
  
  // Look at the landscape from above
  const viewFromAbove = () => {
    if (!controlsRef.current || !cameraRef.current) return;
    
    // Disable controls during animation
    controlsRef.current.enabled = false;
    
    // Save current camera position and target
    const startPosition = cameraRef.current.position.clone();
    const startTarget = controlsRef.current.target.clone();
    
    // Target the center
    const endTarget = new THREE.Vector3(0, 0, 0);
    
    // Position high above
    const endPosition = new THREE.Vector3(0, 40, 0);
    
    // Animate the camera move
    let startTime = null;
    const duration = 1000; // 1 second
    
    const animateCamera = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease function
      const t = progress;
      
      // Interpolate position
      const newX = startPosition.x + (endPosition.x - startPosition.x) * t;
      const newY = startPosition.y + (endPosition.y - startPosition.y) * t;
      const newZ = startPosition.z + (endPosition.z - startPosition.z) * t;
      cameraRef.current.position.set(newX, newY, newZ);
      
      // Interpolate target
      const newTargetX = startTarget.x + (endTarget.x - startTarget.x) * t;
      const newTargetY = startTarget.y + (endTarget.y - startTarget.y) * t;
      const newTargetZ = startTarget.z + (endTarget.z - startTarget.z) * t;
      controlsRef.current.target.set(newTargetX, newTargetY, newTargetZ);
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      } else {
        // Animation complete, re-enable controls
        controlsRef.current.enabled = true;
        controlsRef.current.update();
      }
    };
    
    requestAnimationFrame(animateCamera);
  };
  
  // Toggle showing all labels
  const toggleAllLabels = () => {
    setShowAllLabels(!showAllLabels);
    
    // Update label visibility
    if (sceneRef.current) {
      sceneRef.current.traverse(object => {
        if (object.userData && object.userData.isLabel) {
          const isHovered = object.userData.eventId === hoveredEvent;
          const isSelected = selectedEvent && object.userData.eventId === selectedEvent;
          
          // Show label if hovered, selected, or showAllLabels is true
          object.visible = isHovered || isSelected || !showAllLabels;
        }
      });
    }
  };
  
  // Reset the view
  const resetView = () => {
    setSelectedEvent(null);
    setSelectedEra('all');
    navigateToEra('all');
  };
  
  // Get the current event details
  const getEventDetails = () => {
    if (!selectedEvent) return null;
    return bibleEvents.find(e => e.id === selectedEvent);
  };
  
  // Render UI
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header with title */}
      <div className="bg-white shadow-md p-3">
        <h1 className="text-2xl font-bold text-center text-blue-800">Biblical Events Timeline</h1>
        <p className="text-center text-gray-600 text-sm">
          Explore biblical events in an interactive 3D landscape
        </p>
      </div>
      
      {/* Simple control panel */}
      <div className="bg-gray-100 p-2 flex items-center justify-between">
        {/* Era selection dropdown */}
        <div className="flex items-center">
          <label className="mr-2 text-sm font-medium">View Era:</label>
          <select 
            className="px-3 py-1 border rounded-lg bg-white"
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value)}
          >
            <option value="all">All Biblical History</option>
            <option value="early">Early History</option>
            <option value="exodus">Exodus & Wilderness</option>
            <option value="kingdom">Kingdom Period</option>
            <option value="exile">Exile</option>
            <option value="jesus">Jesus' Life & Ministry</option>
            <option value="church">Early Church</option>
          </select>
        </div>
        
        {/* Center buttons */}
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            onClick={viewFromAbove}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            View All
          </button>
          <button 
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded flex items-center"
            onClick={resetView}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <button 
            className={`px-3 py-1 ${showAllLabels ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded flex items-center`}
            onClick={toggleAllLabels}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            {showAllLabels ? 'Hide Labels' : 'Show Labels'}
          </button>
        </div>
        
        {/* Quick jump buttons */}
        <div className="flex space-x-1">
          <select 
            className="px-3 py-1 border rounded-lg bg-white text-sm"
            value={selectedEvent || ''}
            onChange={(e) => e.target.value && navigateToEvent(e.target.value)}
          >
            <option value="">Jump to Event...</option>
            <option value="creation">Creation</option>
            <option value="abraham_call">Abraham's Call</option>
            <option value="exodus">The Exodus</option>
            <option value="davidking">David's Reign</option>
            <option value="jesus_birth">Birth of Jesus</option>
            <option value="crucifixion">Crucifixion</option>
            <option value="resurrection">Resurrection</option>
            <option value="pentecost">Pentecost</option>
            <option value="revelation">Revelation</option>
          </select>
        </div>
      </div>
      
      {/* Main container */}
      <div className="relative flex-grow">
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
            <div className="text-xl font-bold">Loading Biblical Landscape...</div>
          </div>
        )}
        
        {/* 3D container */}
        <div 
          ref={containerRef} 
          className="w-full h-full"
        ></div>
        
        {/* Navigation controls */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 p-2 rounded-lg shadow-md">
          <div className="flex flex-col space-y-2">
            <div className="grid grid-cols-3 gap-1">
              <button className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => {
                  if (controlsRef.current) {
                    controlsRef.current.rotateLeft(Math.PI/8);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => {
                  if (controlsRef.current) {
                    controlsRef.current.rotateUp(Math.PI/8);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => {
                  if (controlsRef.current) {
                    controlsRef.current.rotateRight(Math.PI/8);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => {
                  if (controlsRef.current) {
                    controlsRef.current.rotateLeft(Math.PI/2);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => {
                  if (controlsRef.current) {
                    controlsRef.current.rotateDown(Math.PI/8);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => {
                  if (controlsRef.current) {
                    controlsRef.current.rotateRight(Math.PI/2);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </button>
            </div>
            <div className="flex justify-between">
              <button className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => {
                  if (controlsRef.current) {
                    controlsRef.current.dollyIn(1.2);
                    controlsRef.current.update();
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                onClick={resetView}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => {
                  if (controlsRef.current) {
                    controlsRef.current.dollyOut(1.2);
                    controlsRef.current.update();
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Display current era */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-70 px-3 py-1 rounded-full shadow text-sm">
          <span className="font-medium">Viewing: </span>
          <span>{eraInfo[selectedEra].name}</span>
        </div>
        
        {/* Event details panel (slides in when event selected) */}
        <div 
          className={`absolute top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 overflow-y-auto ${selectedEvent ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {selectedEvent && getEventDetails() && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold" style={{ color: getEventDetails().color }}>
                  {getEventDetails().name}
                </h2>
                <button 
                  className="p-1 rounded-full hover:bg-gray-200"
                  onClick={() => setSelectedEvent(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="text-sm text-gray-500 mb-4">
                {getEventDetails().year} • {getEventDetails().scripture}
              </div>
              
              <p className="mb-4">{getEventDetails().description}</p>
              
              <div className="mb-4">
                <h3 className="font-bold mb-2">Key Figures</h3>
                <div className="flex flex-wrap gap-1">
                  {getEventDetails().keyFigures.map((figure, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {figure}
                    </span>
                  ))}
                </div>
              </div>
              
              {getEventDetails().connections && getEventDetails().connections.length > 0 && (
                <div>
                  <h3 className="font-bold mb-2">Connected Events</h3>
                  <div className="flex flex-col gap-2">
                    {getEventDetails().connections.map((connId, index) => {
                      const connectedEvent = bibleEvents.find(e => e.id === connId);
                      if (!connectedEvent) return null;
                      
                      return (
                        <button 
                          key={index}
                          className="flex items-center text-left p-2 rounded-lg hover:bg-gray-100"
                          onClick={() => navigateToEvent(connId)}
                        >
                          <span 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: connectedEvent.color }}
                          ></span>
                          <span>{connectedEvent.name}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Help overlay (optional - can be toggled) */}
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 p-3 rounded-lg shadow-md max-w-xs">
          <div className="text-sm">
            <div className="font-bold mb-1">Navigation Tips:</div>
            <ul className="list-disc pl-5">
              <li>Click on any event to view details</li>
              <li>Use controls on the left to rotate and zoom</li>
              <li>Select eras from the dropdown above</li>
              <li>Use "Jump to Event" to quickly navigate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleEvents3DSimplified;