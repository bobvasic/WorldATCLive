import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { analyzeUserBehavior } from '../store/aiSlice';

/**
 * AI-Powered Analytics Dashboard
 * Provides real-time insights about user behavior
 */
const AIAnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { interactions, userAnalysis, loading } = useSelector((state) => state.ai);
  const [isExpanded, setIsExpanded] = useState(false);

  const uniqueCountries = new Set(interactions.map(i => i.country)).size;
  const totalInteractions = interactions.length;

  useEffect(() => {
    // Analyze every 10 interactions
    if (interactions.length > 0 && interactions.length % 10 === 0) {
      dispatch(analyzeUserBehavior(interactions));
    }
  }, [interactions, dispatch]);

  const handleAnalyze = () => {
    if (interactions.length > 0) {
      dispatch(analyzeUserBehavior(interactions));
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="ai-analytics-dashboard"
    >
      <div className="dashboard-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>🧠 AI Analytics</h3>
        <Motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="expand-icon"
        >
          ▼
        </Motion.span>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="dashboard-content"
          >
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-value">{totalInteractions}</div>
                <div className="stat-label">Total Interactions</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{uniqueCountries}</div>
                <div className="stat-label">Countries Explored</div>
              </div>
            </div>

            {userAnalysis && (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="ai-insights-section"
              >
                <h4>💡 AI Insights</h4>
                <ul className="insights-list">
                  {userAnalysis.insights?.map((insight, index) => (
                    <Motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {insight}
                    </Motion.li>
                  ))}
                </ul>

                {userAnalysis.suggestions && userAnalysis.suggestions.length > 0 && (
                  <div className="suggestions-section">
                    <h4>✨ Recommended for You</h4>
                    <div className="suggestions-list">
                      {userAnalysis.suggestions.map((country, index) => (
                        <Motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="suggestion-badge"
                        >
                          {country}
                        </Motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </Motion.div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading.analysis || totalInteractions === 0}
              className="analyze-btn"
            >
              {loading.analysis ? (
                <>
                  <Motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ⚡
                  </Motion.span>
                  Analyzing...
                </>
              ) : (
                '🔍 Analyze My Interests'
              )}
            </button>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.div>
  );
};

export default AIAnalyticsDashboard;
