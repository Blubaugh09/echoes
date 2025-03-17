export const bibleStructure = { 
    pentateuch: {
      title: "Pentateuch",
      books: [
        {
          id: "genesis",
          title: "Genesis",
          color: "#3498db",
          passages: [
            
            {
              id: 'noahArk',
              title: "Noah's Ark",
              reference: 'Genesis 6-9',
              description: 'God sends a flood but saves Noah'
            },
            
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