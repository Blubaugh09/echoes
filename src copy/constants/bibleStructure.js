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
              id: 'word',
              title: 'The Word',
              reference: 'Genesis 1',
              description: 'GWord at the beginning'
            },{

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
           
          ]
        },
        {
          id: "exodus",
          title: "Exodus",
          color: "#2980b9",
          passages: [
            
            {
              id: 'redSea',
              title: 'Red Sea Crossing',
              reference: 'Exodus 14',
              description: 'Israel passes through parted sea'
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
           
          ]
        },
        {
          id: "daniel",
          title: "Daniel",
          color: "#c0392b",
          passages: [
           
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
              id: 'baptism',
              title: 'Baptism of Jesus',
              reference: 'Matthew 3',
              description: 'Jesus baptized by John'
            },
          
          ]
        },
        {
          id: "john",
          title: "John",
          color: "#27ae60",
          passages: [
            {
              id: 'jesusword',
              title: 'Jesus is Word',
              reference: 'John 1',
              description: 'Jesus is the Word made flesh'
            },
          ]
        },
        {
          id: "acts",
          title: "Acts",
          color: "#16a085",
          passages: [
          
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
            
          ]
        },
        {
          id: "hebrews",
          title: "Hebrews",
          color: "#8e44ad",
          passages: [
           
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