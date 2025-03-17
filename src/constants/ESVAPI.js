export   // Fetch Bible passage from ESV API
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
        
        // Check if current reference matches any passages in our dataset
        const passageKey = `${currentBook} ${currentChapter}`;
        const passageId = referenceToPassageMap[passageKey];
        
        if (passageId) {
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
            
            // Create highlighted verses object based on current chapter
            const versesToHighlight = {};
            versesToHighlight[currentChapter] = true;
            setHighlightedVerses(versesToHighlight);
          }
        } else {
          // No specific connection for this passage
          setSelectedPassage(null);
          setConnections([]);
          setActiveConnectionsInText([]);
          setHighlightedVerses({});
        }
      } else {
        setBibleText("Passage not found");
        setBibleSections([]);
        setSelectedPassage(null);
        setConnections([]);
        setActiveConnectionsInText([]);
        setHighlightedVerses({});
      }
    } catch (error) {
      console.error('Error fetching Bible passage:', error);
      setBibleText("Error loading passage");
      setBibleSections([]);
    } finally {
      setIsLoadingBibleText(false);
    }
  };