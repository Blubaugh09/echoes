import React, { useState, useEffect } from 'react';
import BiblicalConnectionsApp from './components/BiblicalConnectionsApp';
import LoadingPage from './components/LoadingPage';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingPage onLoadingComplete={handleLoadingComplete} />}
      <div className={`app-content ${isLoading ? 'hidden' : 'visible'}`}>
        <BiblicalConnectionsApp />
      </div>
    </>
  );
}

export default App;