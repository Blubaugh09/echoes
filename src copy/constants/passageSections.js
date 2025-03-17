export   const passageSections = {
    "Genesis 1:1-2": {
      connections: [
        { 
          id: 1, 
          verse: "Genesis 1:1-2", 
          theme: "Creation Beginning", 
          label: "God's initial creation",
          x: 160, 
          y: 60, 
          size: 60,
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
    },
"Exodus 1:1-7": {
    connections: [
      { 
        id: 1, 
        verse: "Exodus 1:1-7", 
        theme: "Israel's Growth", 
        label: "Fruitful and multiplied greatly",
        x: 160, 
        y: 60, 
        size: 30,
        connections: [
          { targetId: 2, type: "direct_reference", strength: 0.9, level: 1 },
          { targetId: 3, type: "thematic", strength: 0.8, level: 1 },
        ],
        deeperConnections: [
          { id: 51, verse: "Genesis 12:2-3", theme: "Abrahamic Promise", label: "I will make you into a great nation", level: 2, x: 100, y: 200, size: 18 },
          { id: 52, verse: "Genesis 46:1-27", theme: "Jacob's Family", label: "Seventy in all went to Egypt", level: 2, x: 200, y: 200, size: 19 },
          { id: 53, verse: "Acts 7:17-18", theme: "Growth Before Exodus", label: "Our people grew and multiplied in Egypt", level: 3, x: 150, y: 250, size: 16 }
        ]
      },
      { 
        id: 2, 
        verse: "Genesis 35:10-12", 
        theme: "Jacob's Blessing", 
        label: "Be fruitful and increase in number",
        x: 300, 
        y: 30, 
        size: 25,
        connections: [],
        deeperConnections: [
          { id: 54, verse: "Genesis 28:13-15", theme: "Promise Remembered", label: "Your descendants will be like dust", level: 2, x: 400, y: 20, size: 18 }
        ]
      },
      { 
        id: 3, 
        verse: "Deuteronomy 26:5", 
        theme: "Few Became Many", 
        label: "Became a great nation, powerful and numerous",
        x: 280, 
        y: 120, 
        size: 22,
        connections: [],
        deeperConnections: [
          { id: 55, verse: "Psalm 105:23-24", theme: "Divine Increase", label: "God made his people very fruitful", level: 2, x: 380, y: 130, size: 18 }
        ]
      }
    ]
  },
  "Exodus 1:8-14": {
    connections: [
      { 
        id: 1, 
        verse: "Exodus 1:8-14", 
        theme: "Oppression Begins", 
        label: "New king who did not know Joseph",
        x: 160, 
        y: 60, 
        size: 30,
        connections: [
          { targetId: 2, type: "thematic", strength: 0.8, level: 1 },
          { targetId: 3, type: "prophetic", strength: 0.7, level: 1 },
          { targetId: 4, type: "symbolic", strength: 0.9, level: 1 }
        ],
        deeperConnections: [
          { id: 56, verse: "Genesis 15:13", theme: "Foretold Suffering", label: "Your descendants will be strangers... and enslaved", level: 2, x: 100, y: 200, size: 18 },
          { id: 57, verse: "Acts 7:18-19", theme: "Historical Recall", label: "Dealt treacherously with our people", level: 2, x: 200, y: 200, size: 19 }
        ]
      },
      { 
        id: 2, 
        verse: "Psalm 105:25", 
        theme: "Divine Permission", 
        label: "He turned their hearts to hate His people",
        x: 300, 
        y: 30, 
        size: 25,
        connections: [],
        deeperConnections: [
          { id: 58, verse: "Proverbs 21:1", theme: "Sovereign Control", label: "King's heart is in the hand of the LORD", level: 2, x: 430, y: 30, size: 20 }
        ]
      },
      { 
        id: 3, 
        verse: "Isaiah 52:4", 
        theme: "Remember Oppression", 
        label: "Oppressed without cause",
        x: 280, 
        y: 120, 
        size: 22,
        connections: [],
        deeperConnections: []
      },
      { 
        id: 4, 
        verse: "1 Peter 2:18-25", 
        theme: "Unjust Suffering", 
        label: "Suffering unjustly is commendable",
        x: 330, 
        y: 190, 
        size: 20,
        connections: [],
        deeperConnections: [
          { id: 59, verse: "Romans 8:18", theme: "Present Suffering", label: "Present sufferings not worth comparing", level: 2, x: 420, y: 190, size: 18 }
        ]
      }
    ]
  },
  "Exodus 1:15-22": {
    connections: [
      { 
        id: 1, 
        verse: "Exodus 1:15-22", 
        theme: "Genocide Attempt", 
        label: "Hebrew midwives fear God",
        x: 160, 
        y: 60, 
        size: 30,
        connections: [
          { targetId: 2, type: "direct_reference", strength: 0.9, level: 1 },
          { targetId: 3, type: "thematic", strength: 0.7, level: 1 },
          { targetId: 4, type: "symbolic", strength: 0.8, level: 1 }
        ],
        deeperConnections: [
          { id: 60, verse: "Proverbs 16:6", theme: "Fear of the Lord", label: "Through fear of the LORD evil is avoided", level: 2, x: 100, y: 180, size: 18 },
          { id: 61, verse: "Daniel 3:16-18", theme: "Civil Disobedience", label: "We will not serve your gods", level: 2, x: 180, y: 200, size: 17 }
        ]
      },
      { 
        id: 2, 
        verse: "Hebrews 11:23", 
        theme: "Faith Over Fear", 
        label: "By faith Moses' parents hid him",
        x: 320, 
        y: 30, 
        size: 25,
        connections: [],
        deeperConnections: [
          { id: 62, verse: "Acts 5:29", theme: "God Above Rulers", label: "We must obey God rather than men", level: 2, x: 410, y: 20, size: 18 }
        ]
      },
      { 
        id: 3, 
        verse: "Matthew 2:16-18", 
        theme: "Parallels in History", 
        label: "Herod kills all male children",
        x: 290, 
        y: 120, 
        size: 22,
        connections: [],
        deeperConnections: [
          { id: 63, verse: "Revelation 12:4-5", theme: "Dragon's Attempt", label: "Dragon waited to devour the child", level: 2, x: 390, y: 110, size: 18 }
        ]
      },
      { 
        id: 4, 
        verse: "Psalm 127:3-5", 
        theme: "Children as Blessing", 
        label: "Children are a heritage from the LORD",
        x: 350, 
        y: 180, 
        size: 20,
        connections: [],
        deeperConnections: []
      }
    ]
  },

  // Exodus 2 connections
  "Exodus 2:1-10": {
    connections: [
      { 
        id: 1, 
        verse: "Exodus 2:1-10", 
        theme: "Moses' Birth", 
        label: "Preservation of the deliverer",
        x: 160, 
        y: 60, 
        size: 30,
        connections: [
          { targetId: 2, type: "direct_reference", strength: 0.9, level: 1 },
          { targetId: 3, type: "thematic", strength: 0.8, level: 1 },
          { targetId: 4, type: "symbolic", strength: 0.7, level: 1 }
        ],
        deeperConnections: [
          { id: 64, verse: "Acts 7:20-22", theme: "Moses' Upbringing", label: "Moses was educated in all the wisdom of the Egyptians", level: 2, x: 100, y: 200, size: 18 },
          { id: 65, verse: "Isaiah 49:1-2", theme: "Called Before Birth", label: "Called me before I was born", level: 3, x: 150, y: 250, size: 16 }
        ]
      },
      { 
        id: 2, 
        verse: "Hebrews 11:23-26", 
        theme: "Faith's Vision", 
        label: "Moses chose to suffer with God's people",
        x: 300, 
        y: 30, 
        size: 25,
        connections: [],
        deeperConnections: [
          { id: 66, verse: "2 Corinthians 4:17-18", theme: "Eternal Perspective", label: "What is seen is temporary", level: 2, x: 400, y: 20, size: 18 }
        ]
      },
      { 
        id: 3, 
        verse: "Isaiah 44:28", 
        theme: "Named Deliverer", 
        label: "Cyrus, 'My shepherd'",
        x: 280, 
        y: 120, 
        size: 22,
        connections: [],
        deeperConnections: [
          { id: 67, verse: "1 Corinthians 1:27-29", theme: "God's Chosen Instruments", label: "God chose the weak things", level: 2, x: 380, y: 130, size: 18 }
        ]
      },
      { 
        id: 4, 
        verse: "Matthew 2:13-15", 
        theme: "Exodus Parallel", 
        label: "Out of Egypt I called my son",
        x: 330, 
        y: 190, 
        size: 20,
        connections: [],
        deeperConnections: [
          { id: 68, verse: "Hosea 11:1", theme: "Son Called from Egypt", label: "Out of Egypt I called my son", level: 2, x: 420, y: 190, size: 18 }
        ]
      }
    ]
  },
  "Exodus 2:11-15": {
    connections: [
      { 
        id: 1, 
        verse: "Exodus 2:11-15", 
        theme: "Failed Deliverance", 
        label: "Moses kills an Egyptian",
        x: 160, 
        y: 60, 
        size: 30,
        connections: [
          { targetId: 2, type: "direct_reference", strength: 0.9, level: 1 },
          { targetId: 3, type: "thematic", strength: 0.7, level: 1 },
          { targetId: 4, type: "symbolic", strength: 0.8, level: 1 }
        ],
        deeperConnections: [
          { id: 69, verse: "Acts 7:23-29", theme: "Moses' Failed Attempt", label: "Supposed his own people would understand", level: 2, x: 100, y: 200, size: 18 },
          { id: 70, verse: "Galatians 4:29", theme: "Flesh vs Spirit", label: "Born according to the flesh vs Spirit", level: 3, x: 150, y: 250, size: 16 }
        ]
      },
      { 
        id: 2, 
        verse: "Hebrews 11:24-27", 
        theme: "Faith's Choice", 
        label: "Refusing royal identity",
        x: 300, 
        y: 30, 
        size: 25,
        connections: [],
        deeperConnections: [
          { id: 71, verse: "Philippians 3:7-8", theme: "Loss for Christ", label: "I consider everything a loss", level: 2, x: 400, y: 20, size: 18 }
        ]
      },
      { 
        id: 3, 
        verse: "2 Timothy 3:12", 
        theme: "Persecution Promise", 
        label: "All who desire to live godly will be persecuted",
        x: 280, 
        y: 120, 
        size: 22,
        connections: [],
        deeperConnections: []
      },
      { 
        id: 4, 
        verse: "Isaiah 59:15-16", 
        theme: "No Justice", 
        label: "Truth is nowhere to be found",
        x: 330, 
        y: 190, 
        size: 20,
        connections: [],
        deeperConnections: []
      }
    ]
  },
  "Exodus 2:16-25": {
    connections: [
      { 
        id: 1, 
        verse: "Exodus 2:16-25", 
        theme: "Exile & Remembrance", 
        label: "Moses in Midian, God remembers",
        x: 160, 
        y: 60, 
        size: 30,
        connections: [
          { targetId: 2, type: "direct_reference", strength: 0.8, level: 1 },
          { targetId: 3, type: "thematic", strength: 0.9, level: 1 },
          { targetId: 4, type: "symbolic", strength: 0.7, level: 1 }
        ],
        deeperConnections: [
          { id: 72, verse: "Genesis 29:1-12", theme: "Well Encounter", label: "Jacob meets Rachel at well", level: 2, x: 100, y: 180, size: 18 },
          { id: 73, verse: "Psalm 106:44-45", theme: "Covenant Remembrance", label: "Remembered his covenant", level: 2, x: 200, y: 200, size: 19 }
        ]
      },
      { 
        id: 2, 
        verse: "John 4:5-26", 
        theme: "Well Revelation", 
        label: "Jesus reveals himself at well",
        x: 320, 
        y: 30, 
        size: 25,
        connections: [],
        deeperConnections: [
          { id: 74, verse: "Genesis 24:10-27", theme: "Divine Appointment", label: "Rebekah at the well", level: 2, x: 410, y: 20, size: 18 }
        ]
      },
      { 
        id: 3, 
        verse: "Luke 1:72-73", 
        theme: "Covenant Mercy", 
        label: "To show mercy and remember his covenant",
        x: 290, 
        y: 120, 
        size: 22,
        connections: [],
        deeperConnections: []
      },
      { 
        id: 4, 
        verse: "Romans 8:26-28", 
        theme: "Groaning & Intercession", 
        label: "Spirit intercedes through our groans",
        x: 350, 
        y: 180, 
        size: 20,
        connections: [],
        deeperConnections: [
          { id: 75, verse: "Exodus 3:7-8", theme: "God Hears", label: "I have heard them crying out", level: 2, x: 430, y: 190, size: 17 }
        ]
      }
    ]
  },

  // Exodus 3 connections
  "Exodus 3:1-6": {
    connections: [
      { 
        id: 1, 
        verse: "Exodus 3:1-6", 
        theme: "Burning Bush", 
        label: "Holy ground revelation",
        x: 160, 
        y: 60, 
        size: 30,
        connections: [
          { targetId: 2, type: "direct_reference", strength: 0.9, level: 1 },
          { targetId: 3, type: "thematic", strength: 0.8, level: 1 },
          { targetId: 4, type: "symbolic", strength: 0.7, level: 1 }
        ],
        deeperConnections: [
          { id: 76, verse: "Acts 7:30-34", theme: "Stephen's Recall", label: "Angel appeared to him in flames", level: 2, x: 100, y: 200, size: 18 },
          { id: 77, verse: "Isaiah 6:1-5", theme: "Holy Encounter", label: "Woe to me, I am ruined", level: 2, x: 200, y: 200, size: 19 },
          { id: 78, verse: "Joshua 5:13-15", theme: "Holy Ground", label: "Take off your sandals", level: 3, x: 150, y: 250, size: 16 }
        ]
      },
      { 
        id: 2, 
        verse: "Matthew 17:1-8", 
        theme: "Divine Revelation", 
        label: "Transfiguration of Jesus",
        x: 300, 
        y: 30, 
        size: 25,
        connections: [],
        deeperConnections: [
          { id: 79, verse: "2 Peter 1:16-18", theme: "Eyewitness Majesty", label: "We were eyewitnesses of his majesty", level: 2, x: 400, y: 20, size: 18 }
        ]
      },
      { 
        id: 3, 
        verse: "Deuteronomy 33:16", 
        theme: "Burning Bush Blessing", 
        label: "Favor of him who dwelt in the burning bush",
        x: 280, 
        y: 120, 
        size: 22,
        connections: [],
        deeperConnections: []
      },
      { 
        id: 4, 
        verse: "Hebrews 12:28-29", 
        theme: "Consuming Fire", 
        label: "Our God is a consuming fire",
        x: 330, 
        y: 190, 
        size: 20,
        connections: [],
        deeperConnections: [
          { id: 80, verse: "Isaiah 33:14-15", theme: "Righteous Before Fire", label: "Who can dwell with everlasting burning?", level: 2, x: 420, y: 190, size: 18 }
        ]
      }
    ]
  },
  "Exodus 3:7-12": {
    connections: [
      { 
        id: 1, 
        verse: "Exodus 3:7-12", 
        theme: "Divine Commission", 
        label: "I am sending you to Pharaoh",
        x: 160, 
        y: 60, 
        size: 30,
        connections: [
          { targetId: 2, type: "thematic", strength: 0.9, level: 1 },
          { targetId: 3, type: "prophetic", strength: 0.7, level: 1 },
          { targetId: 4, type: "symbolic", strength: 0.8, level: 1 }
        ],
        deeperConnections: [
          { id: 81, verse: "Jeremiah 1:4-10", theme: "Prophet's Commission", label: "I appointed you as a prophet", level: 2, x: 100, y: 200, size: 18 },
          { id: 82, verse: "Isaiah 6:8", theme: "Sending Response", label: "Here am I. Send me!", level: 3, x: 150, y: 250, size: 16 }
        ]
      },
      { 
        id: 2, 
        verse: "Psalm 106:43-46", 
        theme: "Compassionate Hearing", 
        label: "He heard their cry",
        x: 300, 
        y: 30, 
        size: 25,
        connections: [],
        deeperConnections: [
          { id: 83, verse: "Psalm 34:15-18", theme: "God Hears Righteous", label: "The righteous cry out, and the LORD hears", level: 2, x: 400, y: 20, size: 18 }
        ]
      },
      { 
        id: 3, 
        verse: "Matthew 28:18-20", 
        theme: "Great Commission", 
        label: "I am with you always",
        x: 280, 
        y: 120, 
        size: 22,
        connections: [],
        deeperConnections: [
          { id: 84, verse: "Acts 1:8", theme: "Spirit Empowerment", label: "You will receive power", level: 2, x: 380, y: 130, size: 18 }
        ]
      },
      { 
        id: 4, 
        verse: "2 Corinthians 3:5-6", 
        theme: "Divine Sufficiency", 
        label: "Our competence comes from God",
        x: 330, 
        y: 190, 
        size: 20,
        connections: [],
        deeperConnections: []
      }
    ]
  },
  "Exodus 3:13-22": {
    connections: [
      { 
        id: 1, 
        verse: "Exodus 3:13-22", 
        theme: "Divine Name", 
        label: "I AM WHO I AM",
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
          { id: 85, verse: "John 8:58", theme: "Christ's Divinity", label: "Before Abraham was born, I am!", level: 2, x: 100, y: 180, size: 18 },
          { id: 86, verse: "Revelation 1:8", theme: "Alpha & Omega", label: "Who is, and who was, and who is to come", level: 2, x: 180, y: 200, size: 17 },
          { id: 87, verse: "Psalm 135:13", theme: "Eternal Name", label: "Your name, LORD, endures forever", level: 3, x: 140, y: 230, size: 16 }
        ]
      },
      { 
        id: 2, 
        verse: "John 8:56-59", 
        theme: "Jesus as I AM", 
        label: "Before Abraham was born, I am!",
        x: 320, 
        y: 30, 
        size: 25,
        connections: [],
        deeperConnections: [
          { id: 88, verse: "John 18:4-6", theme: "Power of the Name", label: "When Jesus said 'I am he,' they drew back", level: 2, x: 410, y: 20, size: 18 }
        ]
      },
      { 
        id: 3, 
        verse: "Isaiah 43:10-13", 
        theme: "Only God", 
        label: "I, even I, am the LORD",
        x: 290, 
        y: 120, 
        size: 22,
        connections: [],
        deeperConnections: [
          { id: 89, verse: "Isaiah 44:6", theme: "First and Last", label: "I am the first and the last", level: 2, x: 390, y: 110, size: 18 }
        ]
      },
      { 
        id: 4, 
        verse: "Matthew 1:21", 
        theme: "Salvation Name", 
        label: "You are to give him the name Jesus",
        x: 350, 
        y: 180, 
        size: 20,
        connections: [],
        deeperConnections: [
          { id: 90, verse: "Acts 4:12", theme: "Exclusive Salvation", label: "No other name", level: 2, x: 430, y: 190, size: 17 }
        ]
      },
      { 
        id: 5, 
        verse: "Romans 9:17-18", 
        theme: "Divine Hardening", 
        label: "I raised you up for this purpose",
        x: 380, 
        y: 90, 
        size: 18,
        connections: [],
        deeperConnections: [
          { id: 91, verse: "Exodus 9:16", theme: "Pharaoh's Purpose", label: "Raised you up to display my power", level: 2, x: 460, y: 80, size: 17 }
        ]
      }
    ]
  }
};