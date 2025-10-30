import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import WorldMapSimple from './components/WorldMapSimple';
import AICountryPanel from './components/AICountryPanel';
import PerformanceMonitor from './components/PerformanceMonitor';
import AIAnalyticsDashboard from './components/AIAnalyticsDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import geminiService from './services/geminiService';
import { setInitialized, addInteraction } from './store/aiSlice';
import './App.css';
import './components/AIComponents.css';

function App() {
  const dispatch = useDispatch();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoverStartTime, setHoverStartTime] = useState(null);

  // Initialize AI service on mount
  useEffect(() => {
    const isInitialized = geminiService.initialize();
    dispatch(setInitialized(isInitialized));

    if (isInitialized) {
      console.log('🤖 AI-Enhanced features activated');
    } else {
      console.warn('⚠️  Running without AI features - add VITE_GEMINI_API_KEY to .env.local');
    }
  }, [dispatch]);

  const handleCountryClick = (countryName) => {
    setSelectedCountry(countryName);
  };

  const handleCountryHover = (countryName) => {
    if (countryName) {
      setHoverStartTime(Date.now());
    } else if (hoverStartTime) {
      const duration = Date.now() - hoverStartTime;
      dispatch(addInteraction({
        country: selectedCountry || 'unknown',
        action: 'hover',
        duration,
      }));
      setHoverStartTime(null);
    }
  };

  const handleClosePanel = () => {
    setSelectedCountry(null);
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <AIAnalyticsDashboard />
        <PerformanceMonitor />
        
        <WorldMapSimple 
          onCountryClick={handleCountryClick}
          onCountryHover={handleCountryHover}
        />
        
        {selectedCountry && (
          <AICountryPanel
            countryName={selectedCountry}
            onClose={handleClosePanel}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
