import React, { useState } from 'react';
import { X } from 'lucide-react';

const VerseAIDialog = ({ isOpen, onClose, verseReference, isDarkMode }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAnswerLoading, setIsAnswerLoading] = useState(false);

  // Function to fetch verse summary
  const fetchVerseSummary = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Fetching summary for verse:', verseReference);

    try {
      const response = await fetch('/.netlify/functions/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verseReference })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching verse summary:', error);
      setError('Failed to fetch verse explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle question submission
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsAnswerLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verseReference,
          question: question.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error('Error getting answer:', error);
      setError('Failed to get answer. Please try again.');
    } finally {
      setIsAnswerLoading(false);
    }
  };

  // Fetch summary when dialog opens
  React.useEffect(() => {
    if (isOpen && verseReference) {
      fetchVerseSummary();
    }
  }, [isOpen, verseReference]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-start justify-start z-50">
      <div className={`relative w-full max-w-2xl mx-4 mt-4 p-6 rounded-lg shadow-xl ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${
            isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <X size={24} />
        </button>

        {/* Verse reference */}
        <h2 className="text-xl font-semibold mb-4">{verseReference}</h2>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 dark:border-gray-300"></div>
          </div>
        ) : (
          /* Summary section */
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Context and Significance:</h3>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{summary}</p>
          </div>
        )}

        {/* Question section */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-3">Ask a question about this verse:</h3>
          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`w-full p-2 rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              placeholder="Type your question here..."
            />
            <button
              type="submit"
              disabled={isAnswerLoading || !question.trim()}
              className={`px-4 py-2 rounded ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } disabled:opacity-50`}
            >
              {isAnswerLoading ? 'Getting Answer...' : 'Ask'}
            </button>
          </form>

          {/* Answer section */}
          {answer && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Answer:</h4>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerseAIDialog; 