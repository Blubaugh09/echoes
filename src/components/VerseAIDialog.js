import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

const VerseAIDialog = ({ isOpen, onClose, verseReference, verseText, isDarkMode }) => {
  const [summary, setSummary] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear previous responses when verse changes
  useEffect(() => {
    setSummary('');
    setUserQuestion('');
    setAiResponse('');
    setError(null);
    if (isOpen && verseReference) {
      fetchVerseSummary();
    }
  }, [isOpen, verseReference]);

  const fetchVerseSummary = async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('Fetching summary for verse:', verseReference);
      
      const response = await fetch('http://localhost:3001/api/verse-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ verseReference })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      if (!data || !data.summary) {
        throw new Error('Invalid response format');
      }

      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching verse summary:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      console.log('Submitting question for:', verseReference);
      const response = await fetch('http://localhost:3001/api/verse-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          verseReference,
          question: userQuestion
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      if (!data || !data.response) {
        throw new Error('Invalid response format');
      }

      setAiResponse(data.response);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setError(error.message);
      setAiResponse('Unable to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-start justify-start z-50">
      <div className={`relative w-full max-w-2xl mx-4 mt-4 p-6 rounded-lg shadow-xl ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full hover:bg-opacity-10 ${
            isDarkMode ? 'hover:bg-white' : 'hover:bg-gray-800'
          }`}
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className={`text-xl font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {verseReference}
        </h2>

        {verseText && (
          <div className={`mb-4 p-3 rounded ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <p className={`italic ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {verseText}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h3 className={`text-lg font-medium mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Summary
          </h3>
          {isLoading ? (
            <div className="animate-pulse">
              <div className={`h-4 bg-gray-300 rounded w-3/4 mb-2 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}></div>
              <div className={`h-4 bg-gray-300 rounded w-1/2 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}></div>
            </div>
          ) : (
            <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {summary}
            </p>
          )}
        </div>

        <form onSubmit={handleQuestionSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Ask a question about this verse..."
              className={`flex-1 p-2 rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
              }`}
            />
            <button
              type="submit"
              disabled={isLoading || !userQuestion.trim()}
              className={`px-4 py-2 rounded ${
                isLoading || !userQuestion.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isLoading ? 'Sending...' : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>

        {aiResponse && (
          <div className="max-h-60 overflow-y-auto">
            <h3 className={`text-lg font-medium mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Answer
            </h3>
            <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {aiResponse}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerseAIDialog; 