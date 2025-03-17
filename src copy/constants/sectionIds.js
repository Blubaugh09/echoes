import { bibleStructure } from '../constants/bibleStructure';

export const generateSectionIds = (book, chapter) => {
  // Special handling for Genesis 1-3 and Exodus 1-3
  const sectionMapping = {
    genesis: {
      1: [
        { id: "Genesis 1:1-2", title: "Creation Beginning" },
        { id: "Genesis 1:3-25", title: "Six Days of Creation" },
        { id: "Genesis 1:26-31", title: "Creation of Humanity" }
      ],
      2: [
        { id: "Genesis 2:1-3", title: "Sabbath Rest" },
        { id: "Genesis 2:4-17", title: "Garden of Eden" },
        { id: "Genesis 2:18-25", title: "Creation of Woman" }
      ],
      3: [
        { id: "Genesis 3:1-7", title: "The Temptation" },
        { id: "Genesis 3:8-19", title: "The Judgment" },
        { id: "Genesis 3:20-22", title: "Consequence and Promise" },
        { id: "Genesis 3:23-24", title: "2 extra Consequence and Promise" }
      ]
    },
    exodus: {
      1: [
        { id: "Exodus 1:1-7", title: "Israel Multiplies in Egypt" },
        { id: "Exodus 1:8-14", title: "Oppression in Egypt" },
        { id: "Exodus 1:15-22", title: "Command to Kill Hebrew Boys" }
      ],
      2: [
        { id: "Exodus 2:1-10", title: "Birth and Adoption of Moses" },
        { id: "Exodus 2:11-15", title: "Moses Flees to Midian" },
        { id: "Exodus 2:16-25", title: "God Hears Israel's Groaning" }
      ],
      3: [
        { id: "Exodus 3:1-6", title: "Burning Bush" },
        { id: "Exodus 3:7-12", title: "God Commissions Moses" },
        { id: "Exodus 3:13-22", title: "God Reveals His Name" }
      ]
    }
  };

  if (sectionMapping[book] && sectionMapping[book][chapter]) {
    return sectionMapping[book][chapter];
  }

  // Default case for other books/chapters
  const book_obj = bibleStructure.find(b => b.id === book);
  if (book_obj) {
    return [{ id: `${book_obj.name} ${chapter}`, title: "Full Chapter" }];
  }

  return []; // Return empty array for undefined sections
};
