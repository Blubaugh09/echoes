import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Biblical events data structure with chronological positioning
const bibleEvents = [
  {
    id: 'creation',
    name: 'Creation',
    description: 'God creates the heavens and earth in six days',
    height: 0.9,
    position: [-18, -10],
    color: '#2a9d8f',
    year: 'Beginning',
    scripture: 'Genesis 1-2',
    keyFigures: ['God', 'Adam', 'Eve'],
    connections: ['fall', 'flood']
  },
  {
    id: 'fall',
    name: 'The Fall',
    description: 'Adam and Eve disobey God and sin enters the world',
    height: 0.85,
    position: [-16, -8],
    color: '#e63946',
    year: 'Beginning',
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
    scripture: 'Genesis 25-27',
    keyFigures: ['Jacob', 'Esau', 'Isaac', 'Rebekah'],
    connections: ['jacobs_ladder', 'joseph_coat']
  },
  {
    id: 'jacobs_ladder',
    name: 'Jacob\'s Ladder',
    description: 'Jacob dreams of a ladder to heaven with angels',
    height: 0.7,
    position: [-3, -4],
    color: '#219ebc',
    year: 'c. 1800 BC',
    scripture: 'Genesis 28',
    keyFigures: ['Jacob'],
    connections: ['joseph_coat']
  },
  {
    id: 'joseph_coat',
    name: 'Joseph\'s Coat',
    description: 'Joseph receives a coat of many colors and is sold into slavery',
    height: 0.8,
    position: [-2, -2],
    color: '#ffb703',
    year: 'c. 1750 BC',
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
    scripture: 'Genesis 39-47',
    keyFigures: ['Joseph', 'Pharaoh'],
    connections: ['moses_birth']
  },
  {
    id: 'moses_birth',
    name: 'Birth of Moses',
    description: 'Moses is born and saved from Pharaoh\'s decree',
    height: 0.7,
    position: [0, -1],
    color: '#8a5a44',
    year: 'c. 1525 BC',
    scripture: 'Exodus 2',
    keyFigures: ['Moses', 'Pharaoh\'s Daughter'],
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
    scripture: 'Judges',
    keyFigures: ['Deborah', 'Gideon', 'Samson'],
    connections: ['saul_king', 'davidking']
  },
  {
    id: 'saul_king',
    name: 'Saul Becomes King',
    description: 'Israel\'s first king is anointed',
    height: 0.75,
    position: [9, 4],
    color: '#6a040f',
    year: 'c. 1050 BC',
    scripture: '1 Samuel 9-10',
    keyFigures: ['Saul', 'Samuel'],
    connections: ['davidking']
  },
  {
    id: 'davidking',
    name: 'David\'s Reign',
    description: 'David becomes king and establishes Jerusalem',
    height: 0.85,
    position: [10, 5],
    color: '#1d3557',
    year: 'c. 1010-970 BC',
    scripture: '2 Samuel',
    keyFigures: ['David'],
    connections: ['solomon_temple', 'divided_kingdom']
  },
  {
    id: 'solomon_temple',
    name: 'Solomon\'s Temple',
    description: 'King Solomon builds the first temple',
    height: 0.8,
    position: [11, 6],
    color: '#e9c46a',
    year: 'c. 966 BC',
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
    scripture: '2 Kings 25',
    keyFigures: ['Nebuchadnezzar', 'Zedekiah'],
    connections: ['return_exile', 'daniel_lions']
  },
  {
    id: 'daniel_lions',
    name: 'Daniel in Lion\'s Den',
    description: 'Daniel is thrown into a den of lions but is saved',
    height: 0.7,
    position: [14, 9],
    color: '#457b9d',
    year: 'c. 539 BC',
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
    scripture: 'Matthew 3:13-17',
    keyFigures: ['Jesus', 'John the Baptist'],
    connections: ['jesus_ministry']
  },
  {
    id: 'jesus_ministry',
    name: 'Jesus\' Ministry',
    description: 'Jesus teaches, performs miracles, and calls disciples',
    height: 0.9,
    position: [18, 9],
    color: '#1d3557',
    year: 'c. 27-30 AD',
    scripture: 'Gospels',
    keyFigures: ['Jesus', 'Disciples'],
    connections: ['crucifixion']
  },
  {
    id: 'crucifixion',
    name: 'Crucifixion',
    description: 'Jesus dies on the cross for humanity\'s sins',
    height: 0.95,
    position: [19, 10],
    color: '#e63946',
    year: 'c. 30 AD',
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
    scripture: 'Acts 2-7',
    keyFigures: ['Peter', 'Stephen', 'Apostles'],
    connections: ['paul_conversion', 'paul_missionary']
  },
  {
    id: 'paul_conversion',
    name: 'Paul\'s Conversion',
    description: 'Saul (Paul) meets Jesus on the road to Damascus',
    height: 0.8,
    position: [23, 10],
    color: '#f4a261',
    year: 'c. 35 AD',
    scripture: 'Acts 9',
    keyFigures: ['Paul'],
    connections: ['paul_missionary']
  },
  {
    id: 'paul_missionary',
    name: 'Paul\'s Journeys',
    description: 'Paul spreads the gospel throughout the Roman Empire',
    height: 0.8,
    position: [24, 12],
    color: '#1d3557',
    year: 'c. 46-58 AD',
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
    scripture: 'Revelation',
    keyFigures: ['John', 'Jesus'],
    connections: []
  }
];

const BibleEventsLandscape = () => {
  const containerRef = useRef();
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAllLabels, setShowAllLabels] = useState(false);
  const [miniMapActive, setMiniMapActive] = useState(true);
  const [currentEra, setCurrentEra] = useState('overview');
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const miniMapRendererRef = useRef(null);
  const miniMapCameraRef = useRef(null);
  const controlsRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const terrainRef = useRef(null);
  const labelGroupRef = useRef(null);
  const connectionsRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f8ff);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light (sun-like)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Camera setup
    const aspectRatio = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
    camera.position.set(0, 25, 30);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }
    rendererRef.current = renderer;

    // Mini-map setup (top-down view)
    if (containerRef.current) {
      const miniMapSize = Math.min(200, containerRef.current.clientWidth * 0.2);
      const miniMapCamera = new THREE.OrthographicCamera(
        -30, 30, 20, -20, 1, 1000
      );
      miniMapCamera.position.set(0, 50, 0);
      miniMapCamera.lookAt(0, 0, 0);
      miniMapCamera.up.set(0, 0, -1); // Adjust the up direction for proper orientation
      miniMapCameraRef.current = miniMapCamera;
      
      const miniMapRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      miniMapRenderer.setSize(miniMapSize, miniMapSize);
      miniMapRenderer.domElement.style.position = 'absolute';
      miniMapRenderer.domElement.style.bottom = '20px';
      miniMapRenderer.domElement.style.right = '20px';
      miniMapRenderer.domElement.style.border = '2px solid rgba(255, 255, 255, 0.7)';
      miniMapRenderer.domElement.style.borderRadius = '5px';
      miniMapRenderer.domElement.style.zIndex = '100';
      miniMapRenderer.domElement.style.backgroundColor = 'rgba(240, 248, 255, 0.7)';
      containerRef.current.appendChild(miniMapRenderer.domElement);
      miniMapRendererRef.current = miniMapRenderer;
    }

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.2; // Prevent going below the ground
    controls.minDistance = 8;
    controls.maxDistance = 60;
    
    // Add helpful constraints and improvements
    controls.enablePan = true;     // Allow panning
    controls.panSpeed = 0.5;       // Slower panning for more control
    controls.rotateSpeed = 0.5;    // Slower rotation for more control
    controls.zoomSpeed = 0.8;      // Adjusted zoom speed
    controls.autoRotate = false;   // No auto-rotation, but user can enable it if desired
    
    controlsRef.current = controls;

    // Create terrain
    createTerrain(scene);
    
    // Create event connections
    createConnections(scene);

    // Create event labels
    createLabels(scene);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Mouse event listeners
    const handleMouseMove = (event) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleClick = () => {
      if (hoveredEvent) {
        setSelectedEvent(hoveredEvent === selectedEvent ? null : hoveredEvent);
      } else {
        setSelectedEvent(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Add visual navigation aids
    addNavigationAids(scene);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // Raycasting for hover effects
      checkIntersections();

      // Main view rendering
      renderer.render(scene, camera);
      
      // Mini-map rendering
      if (miniMapActive && miniMapRendererRef.current && miniMapCameraRef.current) {
        miniMapRendererRef.current.render(scene, miniMapCameraRef.current);
        
        // Update user position indicator on mini-map
        if (cameraRef.current) {
          // Calculate user position as a marker on the mini-map
          // This would be a more advanced feature to implement
        }
      }
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      
      // Safely dispose main renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      // Safely remove main renderer DOM element if it exists and is still attached
      if (containerRef.current && rendererRef.current && rendererRef.current.domElement && 
          containerRef.current.contains(rendererRef.current.domElement)) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Safely dispose mini-map renderer
      if (miniMapRendererRef.current) {
        miniMapRendererRef.current.dispose();
      }
      
      // Safely remove mini-map renderer DOM element if it exists and is still attached
      if (containerRef.current && miniMapRendererRef.current && miniMapRendererRef.current.domElement && 
          containerRef.current.contains(miniMapRendererRef.current.domElement)) {
        containerRef.current.removeChild(miniMapRendererRef.current.domElement);
      }
    };
  }, []);

  // Create the 3D terrain
  const createTerrain = (scene) => {
    const terrainSize = 60;
    const resolution = 120;
    const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, resolution, resolution);
    
    // Define how large the influence of each event should be
    const influenceRadius = 6;
    
    // Map vertices to create mountains and valleys
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 2];
      
      // Calculate height based on distance to event "mountains"
      let totalHeight = 0;
      let totalInfluence = 0;
      
      // Add base terrain with some randomness
      const baseNoise = Math.sin(x * 0.1) * Math.sin(z * 0.1) * 0.05;
      
      bibleEvents.forEach(event => {
        const dx = x - event.position[0];
        const dz = z - event.position[1];
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < influenceRadius) {
          // Use inverse square for more natural mountain shape
          const influence = Math.pow(1 - distance / influenceRadius, 2);
          const height = event.height * 8; // Scale height
          totalHeight += height * influence;
          totalInfluence += influence;
        }
      });
      
      // Apply height to vertex
      if (totalInfluence > 0) {
        vertices[i + 1] = totalHeight / totalInfluence + baseNoise;
      } else {
        vertices[i + 1] = baseNoise;
      }
    }
    
    // Update normals for proper lighting
    geometry.computeVertexNormals();
    
    // Create terrain material with color gradient based on height
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: false,
      side: THREE.DoubleSide
    });
    
    // Add colors based on height and chronology
    const colors = [];
    for (let i = 0; i < vertices.length; i += 3) {
      const height = vertices[i + 1];
      const x = vertices[i];
      
      // Base color based on chronology (position along x-axis)
      // Transition from green (early) to blue (middle) to purple (late)
      let baseColor;
      const normalizedX = (x + terrainSize/2) / terrainSize; // 0 to 1
      
      if (normalizedX < 0.33) {
        // Early biblical history - green to teal
        baseColor = new THREE.Color(0x2a9d8f).lerp(new THREE.Color(0x457b9d), normalizedX * 3);
      } else if (normalizedX < 0.66) {
        // Middle biblical history - teal to blue
        baseColor = new THREE.Color(0x457b9d).lerp(new THREE.Color(0x1d3557), (normalizedX - 0.33) * 3);
      } else {
        // Later biblical history - blue to purple
        baseColor = new THREE.Color(0x1d3557).lerp(new THREE.Color(0x7209b7), (normalizedX - 0.66) * 3);
      }
      
      // Find closest event for coloring
      let closestEvent = null;
      let closestDistance = Infinity;
      
      bibleEvents.forEach(event => {
        const dx = vertices[i] - event.position[0];
        const dz = vertices[i + 2] - event.position[1];
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEvent = event;
        }
      });
      
      let color;
      if (closestEvent && closestDistance < influenceRadius) {
        // Use event color with intensity based on height
        const eventColor = new THREE.Color(closestEvent.color);
        const intensity = Math.min(1, Math.max(0.4, height / 4 + 0.5));
        color = eventColor.clone().multiplyScalar(intensity);
      } else {
        // Default terrain color
        const intensity = Math.min(1, Math.max(0.4, height / 8 + 0.5));
        color = baseColor.clone().multiplyScalar(intensity);
      }
      
      colors.push(color.r, color.g, color.b);
    }
    
    // Add colors to geometry
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    // Create mesh and add to scene
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    terrain.receiveShadow = true;
    terrain.castShadow = true;
    terrain.userData.isInteractive = true;
    
    scene.add(terrain);
    terrainRef.current = terrain;
    
    // Add event markers on the terrain
    const markerGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 8);
    
    bibleEvents.forEach(event => {
      const markerMaterial = new THREE.MeshStandardMaterial({ 
        color: event.color,
        emissive: event.color,
        emissiveIntensity: 0.3
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      
      // Calculate position on the terrain
      const x = event.position[0];
      const z = event.position[1];
      
      // Find height at this position
      let height = 0;
      let influence = 0;
      
      bibleEvents.forEach(e => {
        const dx = x - e.position[0];
        const dz = z - e.position[1];
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < influenceRadius) {
          const i = Math.pow(1 - distance / influenceRadius, 2);
          height += e.height * 8 * i;
          influence += i;
        }
      });
      
      if (influence > 0) {
        height = height / influence;
      }
      
      marker.position.set(x, height + 0.2, z);
      marker.userData = { 
        eventId: event.id,
        isMarker: true
      };
      
      scene.add(marker);
    });
  };

  // Add visual navigation aids to the scene
  const addNavigationAids = (scene) => {
    // Add a compass
    const compassGroup = new THREE.Group();
    
    // Compass circle
    const compassRingGeometry = new THREE.RingGeometry(1.8, 2, 32);
    const compassRingMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x333333, 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const compassRing = new THREE.Mesh(compassRingGeometry, compassRingMaterial);
    compassRing.rotation.x = -Math.PI / 2;
    compassGroup.add(compassRing);
    
    // Direction markers
    const markerGeometry = new THREE.ConeGeometry(0.3, 0.8, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xe63946 });
    
    // North marker
    const northMarker = new THREE.Mesh(markerGeometry, markerMaterial);
    northMarker.position.set(0, 0, -2.5);
    northMarker.rotation.x = Math.PI;
    compassGroup.add(northMarker);
    
    // Add N label
    const northCanvas = document.createElement('canvas');
    northCanvas.width = 64;
    northCanvas.height = 64;
    const northCtx = northCanvas.getContext('2d');
    northCtx.fillStyle = 'white';
    northCtx.font = 'bold 40px Arial';
    northCtx.textAlign = 'center';
    northCtx.textBaseline = 'middle';
    northCtx.fillText('N', 32, 32);
    
    const northTexture = new THREE.CanvasTexture(northCanvas);
    const northLabelMaterial = new THREE.SpriteMaterial({ map: northTexture });
    const northLabel = new THREE.Sprite(northLabelMaterial);
    northLabel.position.set(0, 0.5, -3);
    northLabel.scale.set(1.5, 1.5, 1);
    compassGroup.add(northLabel);
    
    // Position compass in corner of scene
    compassGroup.position.set(-25, 0.2, -15);
    scene.add(compassGroup);
    
    // Add a path highlighting the biblical timeline
    const timelinePath = new THREE.CurvePath();
    
    // Create a smooth curve through all events in chronological order
    const sortedEvents = [...bibleEvents].sort((a, b) => a.position[0] - b.position[0]);
    
    // Generate control points for a smooth path
    const controlPoints = [];
    sortedEvents.forEach(event => {
      controlPoints.push(new THREE.Vector3(
        event.position[0],
        event.height * 8 * 0.2, // Keep it low to the ground
        event.position[1]
      ));
    });
    
    // Create a smooth spline through the points
    for (let i = 0; i < controlPoints.length - 1; i++) {
      const startPoint = controlPoints[i];
      const endPoint = controlPoints[i + 1];
      
      // Calculate a control point for a curved path
      const midPoint = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
      midPoint.y += 0.3; // Slight elevation
      
      // Create a quadratic curve
      const curve = new THREE.QuadraticBezierCurve3(startPoint, midPoint, endPoint);
      timelinePath.add(curve);
    }
    
    // Create the timeline visual
    const timelineGeometry = new THREE.TubeGeometry(
      timelinePath, 
      150,  // tubular segments
      0.15, // radius
      8,    // radial segments
      false // closed
    );
    
    // Create a glowing material for the timeline
    const timelineMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a9eff,
      emissive: 0x4a9eff,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.7
    });
    
    const timelineMesh = new THREE.Mesh(timelineGeometry, timelineMaterial);
    scene.add(timelineMesh);
    
    // Add era markers (vertical columns of light)
    const eraMarkers = [
      { position: [-14, -8], label: 'Early History', color: 0x2a9d8f },
      { position: [3, 0], label: 'Exodus & Wilderness', color: 0x457b9d },
      { position: [10, 5], label: 'Kingdom Period', color: 0x1d3557 },
      { position: [14, 7], label: 'Exile', color: 0x6a040f },
      { position: [18, 9], label: "Jesus' Ministry", color: 0xf4a261 },
      { position: [23, 11], label: 'Early Church', color: 0x2a9d8f }
    ];
    
    eraMarkers.forEach(marker => {
      // Create a cylindrical light beam
      const beamGeometry = new THREE.CylinderGeometry(0.15, 0.15, 15, 8);
      const beamMaterial = new THREE.MeshBasicMaterial({
        color: marker.color,
        transparent: true,
        opacity: 0.3
      });
      
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      beam.position.set(marker.position[0], 7.5, marker.position[1]);
      scene.add(beam);
      
      // Add label above the beam
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 256;
      labelCanvas.height = 64;
      const labelCtx = labelCanvas.getContext('2d');
      
      labelCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      labelCtx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
      
      labelCtx.strokeStyle = new THREE.Color(marker.color).getStyle();
      labelCtx.lineWidth = 4;
      labelCtx.strokeRect(2, 2, labelCanvas.width - 4, labelCanvas.height - 4);
      
      labelCtx.font = 'bold 20px Arial';
      labelCtx.fillStyle = '#000000';
      labelCtx.textAlign = 'center';
      labelCtx.textBaseline = 'middle';
      labelCtx.fillText(marker.label, labelCanvas.width / 2, labelCanvas.height / 2);
      
      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      const labelMaterial = new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
        side: THREE.DoubleSide
      });
      
      const labelGeometry = new THREE.PlaneGeometry(4, 1);
      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      label.position.set(marker.position[0], 18, marker.position[1]);
      label.rotation.x = -Math.PI / 4; // Angle for better visibility
      scene.add(label);
    });
  };

  // Create connections between related events
  const createConnections = (scene) => {
    const connectionsGroup = new THREE.Group();
    scene.add(connectionsGroup);
    connectionsRef.current = connectionsGroup;
    
    // Create paths between connected events
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x888888,
      opacity: 0.7,
      transparent: true,
      linewidth: 2
    });
    
    bibleEvents.forEach(event => {
      if (event.connections && event.connections.length > 0) {
        event.connections.forEach(connectedId => {
          const connectedEvent = bibleEvents.find(e => e.id === connectedId);
          if (connectedEvent) {
            // Calculate positions including heights
            const startX = event.position[0];
            const startZ = event.position[1];
            const endX = connectedEvent.position[0];
            const endZ = connectedEvent.position[1];
            
            // Find heights at these positions
            let startHeight = event.height * 8;
            let endHeight = connectedEvent.height * 8;
            
            // Create a curved path for better visualization
            const midX = (startX + endX) / 2;
            const midZ = (startZ + endZ) / 2;
            const midHeight = (startHeight + endHeight) / 2 + 0.5; // Slightly elevated midpoint
            
            // Add points for the curve
            const lineGeometry = new THREE.BufferGeometry();
            
            // Create a curve with multiple points
            const curve = new THREE.QuadraticBezierCurve3(
              new THREE.Vector3(startX, startHeight + 0.2, startZ),
              new THREE.Vector3(midX, midHeight, midZ),
              new THREE.Vector3(endX, endHeight + 0.2, endZ)
            );
            
            const points = curve.getPoints(20);
            lineGeometry.setFromPoints(points);
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            connectionsGroup.add(line);
            
            // Add direction indicators (small spheres along the path)
            const arrowMaterial = new THREE.MeshBasicMaterial({ 
              color: 0xffffff, 
              transparent: true,
              opacity: 0.8
            });
            
            // Add multiple small spheres along the path
            for (let i = 0.3; i < 0.9; i += 0.2) {
              const point = curve.getPoint(i);
              const arrowGeometry = new THREE.SphereGeometry(0.1, 8, 8);
              const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
              arrow.position.copy(point);
              connectionsGroup.add(arrow);
            }
          }
        });
      }
    });
  };

  // Create event labels that float above the terrain
  const createLabels = (scene) => {
    // Create a group to hold all labels
    const labelGroup = new THREE.Group();
    scene.add(labelGroup);
    labelGroupRef.current = labelGroup;
    
    // For each event, create a floating text label
    bibleEvents.forEach(event => {
      // Create canvas for text rendering
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 128;
      
      // Fill background
      context.fillStyle = 'rgba(255, 255, 255, 0.8)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw border
      context.strokeStyle = event.color;
      context.lineWidth = 4;
      context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
      
      // Write event name
      context.font = 'bold 24px Arial';
      context.fillStyle = '#000000';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(event.name, canvas.width / 2, 30);
      
      // Write year
      context.font = '16px Arial';
      context.fillText(event.year, canvas.width / 2, 60);
      
      // Write scripture reference
      context.font = '14px Arial';
      context.fillText(event.scripture, canvas.width / 2, 85);
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      
      // Create label material and geometry
      const labelMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
      });
      
      const labelGeometry = new THREE.PlaneGeometry(2, 1);
      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      
      // Set label position above the event peak
      const x = event.position[0];
      const z = event.position[1];
      
      // Calculate height at this position
      let height = event.height * 8 + 1.5; // Position above the peak
      
      label.position.set(x, height, z);
      label.userData = { 
        eventId: event.id,
        isLabel: true
      };
      
      // Make label always face camera
      label.lookAt(cameraRef.current.position);
      
      // Initially hide detailed labels
      label.visible = false;
      
      // Add to label group
      labelGroup.add(label);
    });
  };

  // Check for ray intersections with interactive objects
  const checkIntersections = () => {
    if (!sceneRef.current || !cameraRef.current) return;
    
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    
    // Get all objects in the scene that could be intersected
    const intersectableObjects = [];
    sceneRef.current.traverse(object => {
      if (object.userData && (object.userData.isMarker || object.userData.isLabel)) {
        intersectableObjects.push(object);
      }
    });
    
    const intersects = raycasterRef.current.intersectObjects(intersectableObjects);
    
    if (intersects.length > 0) {
      const eventId = intersects[0].object.userData.eventId;
      if (eventId && eventId !== hoveredEvent) {
        setHoveredEvent(eventId);
        updateLabelVisibility(eventId);
      }
    } else if (hoveredEvent) {
      setHoveredEvent(null);
      updateLabelVisibility(null);
    }
  };

  // Navigation functions
  const navigateToEvent = (eventId) => {
    const event = getEventById(eventId);
    if (!event || !cameraRef.current || !controlsRef.current) return;
    
    // Set as selected event to show details
    setSelectedEvent(eventId);
    
    // Calculate target position for camera
    const targetX = event.position[0];
    const targetZ = event.position[1];
    let targetHeight = event.height * 8 + 3; // Position above the peak
    
    // Animate camera movement to the event
    const startPosition = cameraRef.current.position.clone();
    const targetPosition = new THREE.Vector3(targetX, targetHeight + 5, targetZ + 8);
    
    // Disable controls during animation
    controlsRef.current.enabled = false;
    
    // Simple animation
    let startTime = null;
    const duration = 1000; // 1 second
    
    const animateCamera = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate position
      const newX = startPosition.x + (targetPosition.x - startPosition.x) * easeProgress;
      const newY = startPosition.y + (targetPosition.y - startPosition.y) * easeProgress;
      const newZ = startPosition.z + (targetPosition.z - startPosition.z) * easeProgress;
      
      cameraRef.current.position.set(newX, newY, newZ);
      
      // Update look at target
      cameraRef.current.lookAt(targetX, targetHeight, targetZ);
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      } else {
        // Animation complete, re-enable controls
        controlsRef.current.target.set(targetX, targetHeight, targetZ);
        controlsRef.current.enabled = true;
        controlsRef.current.update();
      }
    };
    
    requestAnimationFrame(animateCamera);
  };
  
  const navigateToEra = (era) => {
    setCurrentEra(era);
    
    // Define camera positions for different eras
    const eraPositions = {
      'overview': { position: [0, 25, 30], target: [0, 0, 0] },
      'early': { position: [-14, 15, 0], target: [-14, 0, -8] },
      'exodus': { position: [3, 15, 5], target: [3, 0, 0] },
      'kingdom': { position: [10, 15, 8], target: [10, 0, 5] },
      'exile': { position: [14, 15, 10], target: [14, 0, 7] },
      'jesus': { position: [18, 15, 12], target: [18, 0, 9] },
      'church': { position: [23, 15, 12], target: [23, 0, 11] }
    };
    
    const settings = eraPositions[era] || eraPositions.overview;
    
    // Animate camera movement
    const startPosition = cameraRef.current.position.clone();
    const targetPosition = new THREE.Vector3(...settings.position);
    const startTarget = controlsRef.current.target.clone();
    const endTarget = new THREE.Vector3(...settings.target);
    
    // Disable controls during animation
    controlsRef.current.enabled = false;
    
    // Simple animation
    let startTime = null;
    const duration = 1200; // 1.2 seconds
    
    const animateCamera = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate position
      const newX = startPosition.x + (targetPosition.x - startPosition.x) * easeProgress;
      const newY = startPosition.y + (targetPosition.y - startPosition.y) * easeProgress;
      const newZ = startPosition.z + (targetPosition.z - startPosition.z) * easeProgress;
      
      // Interpolate target
      const newTargetX = startTarget.x + (endTarget.x - startTarget.x) * easeProgress;
      const newTargetY = startTarget.y + (endTarget.y - startTarget.y) * easeProgress;
      const newTargetZ = startTarget.z + (endTarget.z - startTarget.z) * easeProgress;
      
      cameraRef.current.position.set(newX, newY, newZ);
      cameraRef.current.lookAt(newTargetX, newTargetY, newTargetZ);
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      } else {
        // Animation complete, re-enable controls
        controlsRef.current.target.copy(endTarget);
        controlsRef.current.enabled = true;
        controlsRef.current.update();
      }
    };
    
    requestAnimationFrame(animateCamera);
  };
  
  const resetCamera = () => {
    navigateToEra('overview');
    setSelectedEvent(null);
  };
  
  const toggleLabels = () => {
    setShowAllLabels(!showAllLabels);
    updateLabelVisibility(hoveredEvent);
  };

  // Update which event labels are visible
  const updateLabelVisibility = (hoveredEventId) => {
    if (!labelGroupRef.current) return;
    
    labelGroupRef.current.children.forEach(label => {
      // Make labels face the camera
      label.lookAt(cameraRef.current.position);
      
      // Show label if it's the hovered event, a selected event, or showAllLabels is true
      const isHovered = label.userData.eventId === hoveredEventId;
      const isSelected = selectedEvent && label.userData.eventId === selectedEvent;
      
      label.visible = isHovered || isSelected || showAllLabels;
      
      // Scale labels based on distance to camera for better readability
      if (label.visible) {
        const distance = label.position.distanceTo(cameraRef.current.position);
        const scale = Math.max(0.8, Math.min(1.5, 20 / distance));
        label.scale.set(scale, scale, 1);
        
        // Adjust opacity based on distance
        const opacity = Math.min(1, Math.max(0.5, 30 / distance));
        label.material.opacity = opacity;
      }
    });
  };

  // Find event details by ID
  const getEventById = (id) => {
    return bibleEvents.find(event => event.id === id);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* Info panel */}
      <div className="bg-white p-3 shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-800">Biblical Events Landscape</h1>
        <p className="text-center text-gray-600">
          Explore biblical history visualized as a 3D topographical map.
          Major events form peaks, with connections between related narratives.
        </p>
        <div className="flex justify-center space-x-4 mt-2 text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
            <span>Mountains = Major Events</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-gray-400 mr-1"></span>
            <span>Paths = Narrative Connections</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
            <span>Blue Line = Biblical Timeline</span>
          </div>
        </div>
        <div className="text-center text-gray-600 mt-1 flex items-center justify-center">
          <span className="font-semibold mr-1">Navigation:</span>
          <span className="mx-1">Left-click+drag to rotate</span>•
          <span className="mx-1">Right-click+drag to pan</span>•
          <span className="mx-1">Scroll to zoom</span>•
          <span className="ml-1">Click on events for details</span>
        </div>
      </div>
      
      {/* Interactive Timeline Navigation */}
      <div className="bg-white px-4 py-3 shadow-md">
        <div className="flex items-center mb-2">
          <span className="text-sm text-gray-700 mr-2 w-20">Genesis</span>
          <div className="h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 flex-grow rounded-full relative">
            {bibleEvents.map((event, index) => (
              <button 
                key={index}
                className="absolute w-3 h-3 rounded-full bg-white border-2 hover:w-4 hover:h-4 hover:mt-0 transition-all"
                style={{ 
                  borderColor: event.color,
                  left: `${((event.position[0] + 18) / 43) * 100}%`,
                  top: '-3px',
                  transform: 'translateX(-50%)'
                }}
                title={`${event.name} (${event.year})`}
                onClick={() => navigateToEvent(event.id)}
              />
            ))}
          </div>
          <span className="text-sm text-gray-700 ml-2 w-20 text-right">Revelation</span>
        </div>
        
        <div className="flex justify-between">
          <div className="flex space-x-1">
            <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm"
              onClick={() => navigateToEra('early')}>
              Early History
            </button>
            <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm"
              onClick={() => navigateToEra('exodus')}>
              Exodus
            </button>
            <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm"
              onClick={() => navigateToEra('kingdom')}>
              Kingdom
            </button>
            <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm"
              onClick={() => navigateToEra('exile')}>
              Exile
            </button>
            <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm"
              onClick={() => navigateToEra('jesus')}>
              Jesus
            </button>
            <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm"
              onClick={() => navigateToEra('church')}>
              Early Church
            </button>
          </div>
          
          <div className="flex space-x-1">
            <button className="px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm"
              onClick={() => resetCamera()}>
              Reset View
            </button>
            <button className="px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm"
              onClick={() => toggleLabels()}>
              {showAllLabels ? 'Hide Labels' : 'Show All Labels'}
            </button>
          </div>
        </div>
      </div>
      
      {/* 3D Visualization */}
      <div ref={containerRef} className="flex-grow relative">
        {/* Navigation help overlay */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md max-w-xs bg-opacity-90 z-10">
          <div className="text-sm text-gray-800">
            <div className="font-bold mb-1">Quick Navigation:</div>
            <div className="grid grid-cols-2 gap-1">
              <button 
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm flex items-center"
                onClick={() => navigateToEra('overview')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Overview
              </button>
              <button 
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm flex items-center"
                onClick={() => navigateToEra('exodus')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                Exodus
              </button>
              <button 
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm flex items-center"
                onClick={() => navigateToEra('kingdom')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Kingdom
              </button>
              <button 
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm flex items-center"
                onClick={() => navigateToEra('jesus')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Jesus
              </button>
            </div>
            <div className="mt-2 flex justify-between">
              <button 
                className="px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm flex items-center"
                onClick={() => toggleLabels()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {showAllLabels ? 'Hide Labels' : 'Show All Labels'}
              </button>
              <button 
                className="px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm flex items-center"
                onClick={() => setMiniMapActive(!miniMapActive)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {miniMapActive ? 'Hide Mini-Map' : 'Show Mini-Map'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Event details panel when an event is selected */}
        {selectedEvent && (
          <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-xl font-bold" style={{color: getEventById(selectedEvent).color}}>
              {getEventById(selectedEvent).name}
            </h2>
            
            <div className="mt-1 text-sm text-gray-500">
              {getEventById(selectedEvent).year} • {getEventById(selectedEvent).scripture}
            </div>
            
            <p className="my-2">{getEventById(selectedEvent).description}</p>
            
            <h3 className="font-bold mt-3">Key Figures:</h3>
            <div className="flex flex-wrap mt-1 gap-1">
              {getEventById(selectedEvent).keyFigures.map((figure, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {figure}
                </span>
              ))}
            </div>
            
            {getEventById(selectedEvent).connections && getEventById(selectedEvent).connections.length > 0 && (
              <>
                <h3 className="font-bold mt-3">Connected Events:</h3>
                <div className="flex flex-wrap mt-1 gap-1">
                  {getEventById(selectedEvent).connections.map((conn, index) => {
                    const connectedEvent = getEventById(conn);
                    return (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                        onClick={() => navigateToEvent(conn)}
                        style={{borderLeft: `3px solid ${connectedEvent.color}`}}
                      >
                        {connectedEvent.name}
                      </span>
                    );
                  })}
                </div>
              </>
            )}
            
            <div className="mt-4 flex space-x-2">
              <button 
                className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center"
                onClick={() => navigateToEvent(selectedEvent)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Focus
              </button>
              <button 
                className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center"
                onClick={() => setSelectedEvent(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>
          </div>
        )}
        
        {/* Current view indicator */}
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md text-sm text-gray-700 flex items-center">
          <span className="font-semibold mr-1">Current View:</span>
          <span>{
            currentEra === 'overview' ? 'Full Timeline' :
            currentEra === 'early' ? 'Early History' :
            currentEra === 'exodus' ? 'Exodus & Wilderness' :
            currentEra === 'kingdom' ? 'Kingdom Period' :
            currentEra === 'exile' ? 'Exile' :
            currentEra === 'jesus' ? "Jesus' Ministry" :
            currentEra === 'church' ? 'Early Church' : 'Custom View'
          }</span>
        </div>
      </div>
    </div>
  );
};

export default BibleEventsLandscape;