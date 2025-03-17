import React, { useState, useRef, useEffect } from 'react';
import { Book, ZoomIn, ZoomOut, ChevronDown, ChevronUp, Info, Layers, ArrowRight } from 'lucide-react';

const BiblicalConnectionsApp = () => {
  // Define API key and settings
  const ESV_API_KEY = 'c3be9ae20e39bd6637c709cd2e94fd42135764d1'; // Your provided ESV API key
  const ESV_API_URL = 'https://api.esv.org/v3/passage/text/';

  // State for Bible text
  const [bibleText, setBibleText] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Define Bible sections we want to fetch and display
  const bibleSections = [
    { id: "genesis-1", reference: "Genesis 1", title: "Creation" },
    { id: "genesis-2", reference: "Genesis 2", title: "Eden" },
    { id: "genesis-3", reference: "Genesis 3", title: "Fall" },
  ];
  
  // More detailed passage sections within each chapter
  const passageSectionMapping = {
    "genesis-1": [
      { id: "Genesis 1:1-2", title: "Creation Beginning" },
      { id: "Genesis 1:3-25", title: "Six Days of Creation" },
      { id: "Genesis 1:26-31", title: "Creation of Humanity" }
    ],
    "genesis-2": [
      { id: "Genesis 2:1-3", title: "Sabbath Rest" },
      { id: "Genesis 2:4-17", title: "Garden of Eden" },
      { id: "Genesis 2:18-25", title: "Creation of Woman" }
    ],
    "genesis-3": [
      { id: "Genesis 3:1-7", title: "The Temptation" },
      { id: "Genesis 3:8-19", title: "The Judgment" },
      { id: "Genesis 3:20-24", title: "Consequence and Promise" }
    ]
  };

  // Fetch ESV Bible text
  useEffect(() => {
    const fetchBibleText = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Collect all passages we need to fetch
        const allPassages = [];
        Object.values(passageSectionMapping).forEach(sections => {
          sections.forEach(section => {
            allPassages.push(section.id);
          });
        });
        
        const results = {};
        
        // Fetch each passage separately to maintain the sectional structure
        for (const passage of allPassages) {
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
        
        // Provide fallback text for development/demo
        const fallbackText = {
          "Genesis 1:1-2": "In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
          "Genesis 1:3-25": "And God said, \"Let there be light,\" and there was light. God saw that the light was good, and he separated the light from the darkness. God called the light \"day,\" and the darkness he called \"night.\" And there was evening, and there was morning—the first day.\n\nAnd God said, \"Let there be a vault between the waters to separate water from water.\" So God made the vault and separated the water under the vault from the water above it. And it was so. God called the vault \"sky.\" And there was evening, and there was morning—the second day.\n\n[...more content about days 3-5...]\n\nAnd God said, \"Let the land produce living creatures according to their kinds: the livestock, the creatures that move along the ground, and the wild animals, each according to its kind.\" And it was so. God made the wild animals according to their kinds, the livestock according to their kinds, and all the creatures that move along the ground according to their kinds. And God saw that it was good.",
          "Genesis 1:26-31": "Then God said, \"Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground.\"\n\nSo God created mankind in his own image, in the image of God he created them; male and female he created them.\n\nGod blessed them and said to them, \"Be fruitful and increase in number; fill the earth and subdue it. Rule over the fish in the sea and the birds in the sky and over every living creature that moves on the ground.\"\n\nThen God said, \"I give you every seed-bearing plant on the face of the whole earth and every tree that has fruit with seed in it. They will be yours for food. And to all the beasts of the earth and all the birds in the sky and all the creatures that move along the ground—everything that has the breath of life in it—I give every green plant for food.\" And it was so.\n\nGod saw all that he had made, and it was very good. And there was evening, and there was morning—the sixth day.",
          // Add fallback texts for Genesis 2 and 3 sections
          "Genesis 2:1-3": "Thus the heavens and the earth were completed in all their vast array. By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work. Then God blessed the seventh day and made it holy, because on it he rested from all the work of creating that he had done.",
          "Genesis 2:4-17": "This is the account of the heavens and the earth when they were created, when the LORD God made the earth and the heavens. Now no shrub had yet appeared on the earth and no plant had yet sprung up, for the LORD God had not sent rain on the earth and there was no one to work the ground, but streams came up from the earth and watered the whole surface of the ground. Then the LORD God formed a man from the dust of the ground and breathed into his nostrils the breath of life, and the man became a living being. Now the LORD God had planted a garden in the east, in Eden; and there he put the man he had formed...",
          "Genesis 2:18-25": "The LORD God said, \"It is not good for the man to be alone. I will make a helper suitable for him.\" Now the LORD God had formed out of the ground all the wild animals and all the birds in the sky. He brought them to the man to see what he would name them; and whatever the man called each living creature, that was its name. So the man gave names to all the livestock, the birds in the sky and all the wild animals. But for Adam no suitable helper was found...",
          "Genesis 3:1-7": "Now the serpent was more crafty than any of the wild animals the LORD God had made. He said to the woman, \"Did God really say, 'You must not eat from any tree in the garden'?\" The woman said to the serpent, \"We may eat fruit from the trees in the garden, but God did say, 'You must not eat fruit from the tree that is in the middle of the garden, and you must not touch it, or you will die.'\"",
          "Genesis 3:8-19": "Then the man and his wife heard the sound of the LORD God as he was walking in the garden in the cool of the day, and they hid from the LORD God among the trees of the garden. But the LORD God called to the man, \"Where are you?\" He answered, \"I heard you in the garden, and I was afraid because I was naked; so I hid.\"",
          "Genesis 3:20-24": "Adam named his wife Eve, because she would become the mother of all the living. The LORD God made garments of skin for Adam and his wife and clothed them. And the LORD God said, \"The man has now become like one of us, knowing good and evil. He must not be allowed to reach out his hand and take also from the tree of life and eat, and live forever.\""
        };
        
        setBibleText(fallbackText);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBibleText();
  }, []);
  
  // Connections visualization data structure
  // Genesis 1 connections (existing data from your original code)
  const passageSections = {
    "Genesis 1:1-2": {
      connections: [
        { 
          id: 1, 
          verse: "Genesis 1:1-2", 
          theme: "Creation Beginning", 
          label: "God's initial creation",
          x: 160, 
          y: 60, 
          size: 30,
          connections: [
            { targetId: 2, type: "direct_reference", strength: 0.9, level: 1 },
            { targetId: 3, type: "thematic", strength: 0.7, level: 1 },
          ],
          deeperConnections: [
            { id: 6, verse: "Hebrews 11:3", theme: "Faith in Creation", label: "By faith we understand the universe was formed", level: 2, x: 400, y: 200, size: 18 },
            { id: 7, verse: "Revelation 4:11", theme: "Creator Worship", label: "Worthy to receive glory as Creator", level: 3, x: 440, y: 240, size: 16 }
          ]
        },
        { 
          id: 2, 
          verse: "John 1:1-3", 
          theme: "The Word", 
          label: "In the beginning was the Word",
          x: 300, 
          y: 40, 
          size: 25,
          connections: [],
          deeperConnections: [
            { id: 8, verse: "Colossians 1:16-17", theme: "Christ's Preeminence", label: "All things created through and for Him", level: 2, x: 430, y: 30, size: 20 },
            { id: 9, verse: "Hebrews 1:2", theme: "Son as Creator", label: "Through whom He made the universe", level: 2, x: 460, y: 70, size: 18 },
            { id: 10, verse: "1 Corinthians 8:6", theme: "One Lord", label: "One Lord through whom all things came", level: 3, x: 520, y: 50, size: 16 }
          ]
        },
        { 
          id: 3, 
          verse: "Psalm 33:6", 
          theme: "Creation by Word", 
          label: "By the word of the LORD",
          x: 300, 
          y: 130, 
          size: 22,
          connections: [],
          deeperConnections: [
            { id: 11, verse: "Psalm 148:5", theme: "Command to Exist", label: "He commanded and they were created", level: 2, x: 440, y: 140, size: 18 }
          ]
        }
      ]
    },
    "Genesis 1:3-25": {
      connections: [
        { 
          id: 1, 
          verse: "Genesis 1:3-25", 
          theme: "Creation Process", 
          label: "Six days of creation",
          x: 160, 
          y: 60, 
          size: 30,
          connections: [
            { targetId: 2, type: "direct_reference", strength: 0.9, level: 1 },
            { targetId: 3, type: "thematic", strength: 0.7, level: 1 },
            { targetId: 4, type: "symbolic", strength: 0.8, level: 1 }
          ],
          deeperConnections: [
            { id: 12, verse: "Jeremiah 10:12", theme: "Wisdom in Creation", label: "God founded the world by His wisdom", level: 2, x: 100, y: 200, size: 18 },
            { id: 13, verse: "Romans 1:20", theme: "Divine Revelation", label: "God's qualities seen in creation", level: 2, x: 200, y: 200, size: 19 },
            { id: 14, verse: "2 Peter 3:5", theme: "Creation by Word", label: "Earth formed at God's command", level: 3, x: 150, y: 250, size: 16 }
          ]
        },
        { 
          id: 2, 
          verse: "Psalm 104:1-30", 
          theme: "God's Sovereignty", 
          label: "Creation's diversity",
          x: 300, 
          y: 30, 
          size: 25,
          connections: [],
          deeperConnections: [
            { id: 15, verse: "Psalm 19:1-4", theme: "Heavens Declare", label: "Heavens declare God's glory", level: 2, x: 400, y: 20, size: 18 }
          ]
        },
        { 
          id: 3, 
          verse: "Isaiah 45:7", 
          theme: "Creator of All", 
          label: "I form light and create darkness",
          x: 280, 
          y: 120, 
          size: 22,
          connections: [],
          deeperConnections: [
            { id: 16, verse: "Amos 4:13", theme: "Forms Mountains", label: "Forms mountains and creates wind", level: 2, x: 380, y: 130, size: 18 }
          ]
        },
        { 
          id: 4, 
          verse: "Job 38:4-11", 
          theme: "Divine Architecture", 
          label: "God questions Job about creation",
          x: 330, 
          y: 190, 
          size: 20,
          connections: [],
          deeperConnections: [
            { id: 17, verse: "Proverbs 8:22-31", theme: "Wisdom Present", label: "Wisdom present at creation", level: 2, x: 420, y: 190, size: 18 },
            { id: 18, verse: "Job 26:7-14", theme: "God's Power", label: "He suspends the earth over nothing", level: 3, x: 460, y: 220, size: 16 }
          ]
        }
      ]
    },
    "Genesis 1:26-31": {
      connections: [
        { 
          id: 1, 
          verse: "Genesis 1:26-31", 
          theme: "Imago Dei", 
          label: "Humanity in God's image",
          x: 160, 
          y: 60, 
          size: 30,
          connections: [
            { targetId: 2, type: "direct_reference", strength: 0.9, level: 1 },
            { targetId: 3, type: "thematic", strength: 0.7, level: 1 },
            { targetId: 4, type: "symbolic", strength: 0.8, level: 1 },
            { targetId: 5, type: "thematic", strength: 0.6, level: 1 }
          ],
          deeperConnections: [
            { id: 19, verse: "1 Corinthians 11:7", theme: "Man as Image", label: "Man is the image and glory of God", level: 2, x: 100, y: 180, size: 18 },
            { id: 20, verse: "James 3:9", theme: "Human Dignity", label: "Humans made in God's likeness", level: 2, x: 180, y: 200, size: 17 },
            { id: 21, verse: "Romans 8:29", theme: "Conforming to Image", label: "Conformed to the image of His Son", level: 3, x: 140, y: 230, size: 16 }
          ]
        },
        { 
          id: 2, 
          verse: "Colossians 1:15", 
          theme: "Image of God", 
          label: "Christ is the image of God",
          x: 320, 
          y: 30, 
          size: 25,
          connections: [],
          deeperConnections: [
            { id: 22, verse: "2 Corinthians 4:4", theme: "Christ as Image", label: "Christ, who is the image of God", level: 2, x: 410, y: 20, size: 18 },
            { id: 23, verse: "Hebrews 1:3", theme: "Exact Representation", label: "Exact representation of God's being", level: 3, x: 450, y: 50, size: 16 }
          ]
        },
        { 
          id: 3, 
          verse: "Psalm 8:3-8", 
          theme: "Human Dignity", 
          label: "Crowned with glory and honor",
          x: 290, 
          y: 120, 
          size: 22,
          connections: [],
          deeperConnections: [
            { id: 24, verse: "Hebrews 2:6-8", theme: "Fulfillment in Christ", label: "Everything under human feet", level: 2, x: 390, y: 110, size: 18 }
          ]
        },
        { 
          id: 4, 
          verse: "Matthew 28:18-20", 
          theme: "Dominion Mandate", 
          label: "Authority given to disciples",
          x: 350, 
          y: 180, 
          size: 20,
          connections: [],
          deeperConnections: [
            { id: 25, verse: "Acts 1:8", theme: "Empowered Witness", label: "Power to be witnesses", level: 2, x: 430, y: 190, size: 17 }
          ]
        },
        { 
          id: 5, 
          verse: "Ephesians 4:24", 
          theme: "New Creation", 
          label: "New self created like God",
          x: 380, 
          y: 90, 
          size: 18,
          connections: [],
          deeperConnections: [
            { id: 26, verse: "2 Corinthians 5:17", theme: "New Creation", label: "New creation in Christ", level: 2, x: 460, y: 80, size: 17 },
            { id: 27, verse: "Colossians 3:10", theme: "Renewed Knowledge", label: "Renewed in knowledge of Creator", level: 2, x: 480, y: 120, size: 16 }
          ]
        }
      ]
    },
    
    // Genesis 2 connections
    "Genesis 2:1-3": {
      connections: [
        { 
          id: 1, 
          verse: "Genesis 2:1-3", 
          theme: "Sabbath Rest", 
          label: "God rested on the seventh day",
          x: 160, 
          y: 60, 
          size: 30,
          connections: [
            { targetId: 2, type: "direct_reference", strength: 0.9, level: 1 },
            { targetId: 3, type: "thematic", strength: 0.8, level: 1 },
          ],
          deeperConnections: [
            { id: 28, verse: "Mark 2:27-28", theme: "Lord of Sabbath", label: "Son of Man is Lord of the Sabbath", level: 2, x: 400, y: 180, size: 18 },
            { id: 29, verse: "Isaiah 58:13-14", theme: "Sabbath Delight", label: "Call the Sabbath a delight", level: 3, x: 440, y: 220, size: 16 }
          ]
        },
        { 
          id: 2, 
          verse: "Exodus 20:8-11", 
          theme: "Sabbath Command", 
          label: "Remember the Sabbath day",
          x: 300, 
          y: 40, 
          size: 25,
          connections: [],
          deeperConnections: [
            { id: 30, verse: "Deuteronomy 5:12-15", theme: "Sabbath Liberation", label: "Observe the Sabbath", level: 2, x: 430, y: 30, size: 20 }
          ]
        },
        { 
          id: 3, 
          verse: "Hebrews 4:1-11", 
          theme: "Spiritual Rest", 
          label: "A Sabbath-rest for the people of God",
          x: 300, 
          y: 130, 
          size: 22,
          connections: [],
          deeperConnections: [
            { id: 31, verse: "Matthew 11:28-30", theme: "Rest for Souls", label: "I will give you rest", level: 2, x: 440, y: 140, size: 18 }
          ]
        }
      ]
    },
    "Genesis 2:4-17": {
      connections: [
        { 
          id: 1, 
          verse: "Genesis 2:4-17", 
          theme: "Garden of Eden", 
          label: "God plants a garden",
          x: 160, 
          y: 60, 
          size: 30,
          connections: [
            { targetId: 2, type: "direct_reference", strength: 0.8, level: 1 },
            { targetId: 3, type: "thematic", strength: 0.7, level: 1 },
            { targetId: 4, type: "symbolic", strength: 0.9, level: 1 }
          ],
          deeperConnections: [
            { id: 32, verse: "Ezekiel 36:35", theme: "Restored Garden", label: "Like the garden of Eden", level: 2, x: 100, y: 200, size: 18 },
            { id: 33, verse: "Isaiah 51:3", theme: "Eden Comfort", label: "Her desert like Eden", level: 2, x: 200, y: 200, size: 19 }
          ]
        },
        { 
          id: 2, 
          verse: "Ezekiel 28:13-14", 
          theme: "Eden Perfection", 
          label: "You were in Eden, the garden of God",
          x: 300, 
          y: 30, 
          size: 25,
          connections: [],
          deeperConnections: []
        },
        { 
          id: 3, 
          verse: "Joel 2:3", 
          theme: "Eden Contrast", 
          label: "Like the garden of Eden before them",
          x: 280, 
          y: 120, 
          size: 22,
          connections: [],
          deeperConnections: []
        },
        { 
          id: 4, 
          verse: "Revelation 22:1-5", 
          theme: "New Eden", 
          label: "Tree of life in paradise",
          x: 330, 
          y: 190, 
          size: 20,
          connections: [],
          deeperConnections: [
            { id: 34, verse: "Revelation 2:7", theme: "Eden Promise", label: "Right to eat from the tree of life", level: 2, x: 420, y: 190, size: 18 }
          ]
        }
      ]
    },
    "Genesis 2:18-25": {
      connections: [
        { 
          id: 1, 
          verse: "Genesis 2:18-25", 
          theme: "Marriage Origin", 
          label: "One flesh union",
          x: 160, 
          y: 60, 
          size: 30,
          connections: [
            { targetId: 2, type: "direct_reference", strength: 0.9, level: 1 },
            { targetId: 3, type: "thematic", strength: 0.7, level: 1 },
            { targetId: 4, type: "symbolic", strength: 0.8, level: 1 }
          ],
          deeperConnections: [
            { id: 35, verse: "1 Timothy 2:13", theme: "Creation Order", label: "Adam was formed first", level: 2, x: 100, y: 180, size: 18 }
          ]
        },
        { 
          id: 2, 
          verse: "Matthew 19:4-6", 
          theme: "Marriage Permanence", 
          label: "What God has joined together",
          x: 320, 
          y: 30, 
          size: 25,
          connections: [],
          deeperConnections: [
            { id: 36, verse: "Mark 10:6-9", theme: "Creation Design", label: "At the beginning of creation", level: 2, x: 410, y: 20, size: 18 }
          ]
        },
        { 
          id: 3, 
          verse: "1 Corinthians 11:8-9", 
          theme: "Creation Order", 
          label: "Woman from man, for man",
          x: 290, 
          y: 120, 
          size: 22,
          connections: [],
          deeperConnections: []
        },
        { 
          id: 4, 
          verse: "Ephesians 5:31-32", 
          theme: "Marriage Mystery", 
          label: "Christ and the church",
          x: 350, 
          y: 180, 
          size: 20,
          connections: [],
          deeperConnections: [
            { id: 37, verse: "Revelation 19:7-9", theme: "Marriage Supper", label: "Wedding of the Lamb", level: 2, x: 430, y: 190, size: 17 }
          ]
        }
      ]
    },
    
    // Genesis 3 connections
    "Genesis 3:1-7": {
      connections: [
        { 
          id: 1, 
          verse: "Genesis 3:1-7", 
          theme: "The Fall", 
          label: "First temptation and sin",
          x: 160, 
          y: 60, 
          size: 30,
          connections: [
            { targetId: 2, type: "direct_reference", strength: 0.9, level: 1 },
            { targetId: 3, type: "thematic", strength: 0.8, level: 1 },
            { targetId: 4, type: "symbolic", strength: 0.7, level: 1 }
          ],
          deeperConnections: [
            { id: 38, verse: "James 1:14-15", theme: "Sin Process", label: "Desire gives birth to sin", level: 2, x: 100, y: 200, size: 18 },
            { id: 39, verse: "1 John 2:16", theme: "Worldly Desires", label: "Lust of the flesh and eyes", level: 2, x: 200, y: 200, size: 19 }
          ]
        },
        { 
          id: 2, 
          verse: "2 Corinthians 11:3", 
          theme: "Serpent's Deception", 
          label: "Eve was deceived by the serpent",
          x: 300, 
          y: 30, 
          size: 25,
          connections: [],
          deeperConnections: [
            { id: 40, verse: "1 Timothy 2:14", theme: "Deception", label: "The woman was deceived", level: 2, x: 430, y: 30, size: 20 }
          ]
        },
        { 
          id: 3, 
          verse: "Romans 5:12", 
          theme: "Sin's Entrance", 
          label: "Sin entered through one man",
          x: 280, 
          y: 120, 
          size: 22,
          connections: [],
          deeperConnections: [
            { id: 41, verse: "1 Corinthians 15:21-22", theme: "Death Through Adam", label: "By a man came death", level: 2, x: 380, y: 130, size: 18 }
          ]
        },
        { 
          id: 4, 
          verse: "Revelation 12:9", 
          theme: "Ancient Serpent", 
          label: "That ancient serpent called the devil",
          x: 330, 
          y: 190, 
          size: 20,
          connections: [],
          deeperConnections: [
            { id: 42, verse: "John 8:44", theme: "Father of Lies", label: "He was a murderer from the beginning", level: 2, x: 420, y: 190, size: 18 }
          ]
        }
      ]
    },
    "Genesis 3:8-19": {
      connections: [
        { 
          id: 1, 
          verse: "Genesis 3:8-19", 
          theme: "Divine Judgment", 
          label: "Consequences of sin",
          x: 160, 
          y: 60, 
          size: 30,
          connections: [
            { targetId: 2, type: "direct_reference", strength: 0.9, level: 1 },
            { targetId: 3, type: "thematic", strength: 0.7, level: 1 },
            { targetId: 4, type: "symbolic", strength: 0.8, level: 1 }
          ],
          deeperConnections: [
            { id: 43, verse: "Romans 8:20-22", theme: "Creation Groans", label: "Creation subjected to frustration", level: 2, x: 100, y: 200, size: 18 },
            { id: 44, verse: "Psalm 90:7-10", theme: "Human Frailty", label: "Our days pass under God's wrath", level: 3, x: 150, y: 250, size: 16 }
          ]
        },
        { 
          id: 2, 
          verse: "Romans 8:1-4", 
          theme: "No Condemnation", 
          label: "No condemnation in Christ",
          x: 300, 
          y: 30, 
          size: 25,
          connections: [],
          deeperConnections: [
            { id: 45, verse: "Galatians 3:13", theme: "Curse Removed", label: "Christ redeemed us from the curse", level: 2, x: 400, y: 20, size: 18 }
          ]
        },
        { 
          id: 3, 
          verse: "1 Timothy 2:11-15", 
          theme: "Woman's Role", 
          label: "Childbearing connection",
          x: 280, 
          y: 120, 
          size: 22,
          connections: [],
          deeperConnections: []
        },
        { 
          id: 4, 
          verse: "Genesis 5:29", 
          theme: "Rest from Toil", 
          label: "Relief from painful toil",
          x: 330, 
          y: 190, 
          size: 20,
          connections: [],
          deeperConnections: []
        }
      ]
    },
    "Genesis 3:20-24": {
      connections: [
        { 
          id: 1, 
          verse: "Genesis 3:20-24", 
          theme: "Promise & Exile", 
          label: "First promise and exile from Eden",
          x: 160, 
          y: 60, 
          size: 30,
          connections: [
            { targetId: 2, type: "direct_reference", strength: 0.8, level: 1 },
            { targetId: 3, type: "thematic", strength: 0.9, level: 1 },
            { targetId: 4, type: "symbolic", strength: 0.7, level: 1 }
          ],
          deeperConnections: [
            { id: 46, verse: "Hebrews 10:19-22", theme: "Access Restored", label: "Enter the Most Holy Place", level: 2, x: 100, y: 180, size: 18 },
            { id: 47, verse: "1 Peter 1:3-5", theme: "Living Hope", label: "New birth into a living hope", level: 3, x: 140, y: 230, size: 16 }
          ]
        },
        { 
          id: 2, 
          verse: "Romans 16:20", 
          theme: "Serpent Crushed", 
          label: "God will crush Satan",
          x: 320, 
          y: 30, 
          size: 25,
          connections: [],
          deeperConnections: [
            { id: 48, verse: "Revelation 20:1-3", theme: "Satan Bound", label: "Bound for a thousand years", level: 2, x: 410, y: 20, size: 18 }
          ]
        },
        { 
          id: 3, 
          verse: "Hebrews 1:14", 
          theme: "Angelic Protection", 
          label: "Ministering spirits sent to serve",
          x: 290, 
          y: 120, 
          size: 22,
          connections: [],
          deeperConnections: [
            { id: 49, verse: "Psalm 91:11-12", theme: "Guardian Angels", label: "Angels to guard you", level: 2, x: 390, y: 110, size: 18 }
          ]
        },
        { 
          id: 4, 
          verse: "John 14:1-6", 
          theme: "Way Home", 
          label: "I am the way, the truth, and the life",
          x: 350, 
          y: 180, 
          size: 20,
          connections: [],
          deeperConnections: [
            { id: 50, verse: "Revelation 21:1-4", theme: "New Heaven & Earth", label: "God's dwelling place with humans", level: 2, x: 430, y: 190, size: 17 }
          ]
        }
      ]
    }
  };
  
  // State initialization
  const [activeChapter, setActiveChapter] = useState(bibleSections[0].id);
  const [activeSectionsList, setActiveSectionsList] = useState(passageSectionMapping[bibleSections[0].id].map(s => s.id));
  const [activeSection, setActiveSection] = useState(activeSectionsList[0]);
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
  
  // Refs for scroll tracking
  const textContainerRef = useRef(null);
  const sectionRefs = useRef([]);
  
  // Set up section refs dynamically based on active chapter
  useEffect(() => {
    // Create new refs for each section
    sectionRefs.current = passageSectionMapping[activeChapter].map(() => React.createRef());
  }, [activeChapter]);
  
  // Update sections list when active chapter changes
  useEffect(() => {
    const newSectionsList = passageSectionMapping[activeChapter].map(s => s.id);
    setActiveSectionsList(newSectionsList);
    setActiveSection(newSectionsList[0]);
    // Reset depth level when changing chapters
    setDepthLevel(1);
    // Reset selected node when changing chapters
    setSelectedNode(null);
    // Reset pan offset
    setPanOffset({ x: 0, y: 0 });
  }, [activeChapter]);
  
  // Max depth level available
  const maxDepthLevel = 3;
  
  // Edge type styles
  const edgeStyles = {
    direct_reference: { color: "#6366F1", dash: "none", thickness: 3, label: "Direct Reference" },
    thematic: { color: "#EC4899", dash: "5,5", thickness: 2, label: "Thematic Connection" },
    symbolic: { color: "#10B981", dash: "10,5", thickness: 2, label: "Symbolic Echo" }
  };
  
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
  
  // Handle node click
  const handleNodeClick = (nodeId) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };
  
  // Get current section index
  const currentSectionIndex = activeSectionsList.indexOf(activeSection);
  
  // Get previous and next sections if they exist
  const prevSection = currentSectionIndex > 0 ? activeSectionsList[currentSectionIndex - 1] : null;
  const nextSection = currentSectionIndex < activeSectionsList.length - 1 ? activeSectionsList[currentSectionIndex + 1] : null;
  
  // Zoom controls
  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 0.2, 0.5));
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  // Jump to a specific section
  const jumpToSection = (section) => {
    const index = activeSectionsList.indexOf(section);
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
  const getCurrentChapterTitle = () => {
    const chapter = bibleSections.find(section => section.id === activeChapter);
    return chapter ? chapter.reference : "Genesis";
  };
  
  // Change active chapter
  const handleChapterChange = (chapterId) => {
    setActiveChapter(chapterId);
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
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full hover:bg-slate-100"
          >
            <Info size={20} className="text-slate-600" />
          </button>
          <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            {getCurrentChapterTitle()}
          </div>
        </div>
      </header>
      
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
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chapter navigation */}
        <div className="bg-white border-b border-slate-200 px-8 py-2">
          <div className="max-w-2xl mx-auto flex">
            {bibleSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleChapterChange(section.id)}
                className={`py-2 px-4 font-medium ${
                  activeChapter === section.id 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-slate-600 hover:text-indigo-500'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
        
        {/* Scripture reading section */}
        <div 
          className={`px-8 py-6 bg-white ${isExpanded ? 'h-1/5' : 'h-2/5'} overflow-y-auto transition-all duration-300`}
          ref={textContainerRef}
        >
          {isLoading ? (
            <div className="max-w-2xl mx-auto flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600">Loading Bible text...</p>
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <p className="font-medium">Error loading Bible text</p>
                <p className="text-sm mt-1">{error}</p>
                <p className="text-sm mt-2">Using fallback text for demonstration purposes.</p>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-serif mb-4 text-slate-800">{getCurrentChapterTitle()}</h2>
              
              {/* Section navigation tabs */}
              <div className="flex mb-4 border-b border-slate-200">
                {activeSectionsList.map((section, index) => {
                  // Find the section title
                  const sectionInfo = passageSectionMapping[activeChapter].find(s => s.id === section);
                  
                  return (
                    <button
                      key={section}
                      onClick={() => jumpToSection(section)}
                      className={`py-2 px-4 font-medium text-sm ${
                        activeSection === section 
                          ? 'text-indigo-600 border-b-2 border-indigo-600' 
                          : 'text-slate-600 hover:text-indigo-500'
                      }`}
                    >
                      {section}
                      {sectionInfo && sectionInfo.title && <span className="ml-1 text-xs text-slate-500">({sectionInfo.title})</span>}
                    </button>
                  );
                })}
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
            </div>
          )}
        </div>
        
        {/* Divider */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        {/* Connections visualization - only show if we have data for the current section */}
        <div className={`flex-1 ${isExpanded ? 'h-4/5' : 'h-3/5'} bg-slate-50 relative overflow-hidden transition-all duration-300`}>
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
          
          {/* Current section indicator */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-full shadow-md text-sm">
            <span className="text-indigo-700 font-medium">{activeSection}</span>
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
                <p className="text-slate-600">Connection data isn't available for this passage yet.</p>
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
      </div>
    </div>
  );
};

export default BiblicalConnectionsApp;