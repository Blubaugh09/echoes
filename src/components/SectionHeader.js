import React, { useState, useEffect } from 'react';

const SectionHeader = ({ sectionsContainerRef, sections, getBookFromReference }) => {
  const [currentBook, setCurrentBook] = useState(null);
  
  useEffect(() => {
    const sectionsContainer = sectionsContainerRef.current;
    if (!sectionsContainer) return;
    
    const updateCurrentBook = () => {
      const containerRect = sectionsContainer.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;
      
      // Find the section closest to the center
      let closestSection = null;
      let closestDistance = Infinity;
      
      Array.from(sectionsContainer.children).forEach(child => {
        const childRect = child.getBoundingClientRect();
        const childCenter = childRect.left + childRect.width / 2;
        const distance = Math.abs(childCenter - centerX);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = child;
        }
      });
      
      if (closestSection) {
        const sectionId = closestSection.getAttribute('data-section-id');
        const section = sections.find(s => s.id === sectionId);
        
        if (section) {
          const book = section.book || (section.reference ? getBookFromReference(section.reference) : null);
          if (book && book !== currentBook) {
            setCurrentBook(book);
          }
        }
      }
    };
    
    sectionsContainer.addEventListener('scroll', updateCurrentBook);
    
    // Run once to initialize
    updateCurrentBook();
    
    return () => {
      sectionsContainer.removeEventListener('scroll', updateCurrentBook);
    };
  }, [sectionsContainerRef, sections, getBookFromReference, currentBook]);
  
  return (
    <div className="px-4 py-1 border-b border-gray-100">
      <h3 className="text-sm font-semibold text-indigo-700">
        {currentBook || 'All Books'}
      </h3>
    </div>
  );
};

export default SectionHeader; 