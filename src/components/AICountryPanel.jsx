import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { fetchCountryInfo, fetchTravelRecommendations, addInteraction } from '../store/aiSlice';

/**
 * AI-Enhanced Country Information Panel
 * Displays Gemini-powered insights and recommendations
 */
const AICountryPanel = ({ countryName, onClose }) => {
  const dispatch = useDispatch();
  const { countryInfo, travelRecommendations, loading } = useSelector((state) => state.ai);

  const info = countryInfo[countryName];
  const recommendations = travelRecommendations[countryName];

  useEffect(() => {
    if (countryName && !info) {
      dispatch(fetchCountryInfo(countryName));
    }
    if (countryName && !recommendations) {
      dispatch(fetchTravelRecommendations(countryName));
    }

    // Track interaction
    dispatch(addInteraction({
      country: countryName,
      action: 'view_details',
      duration: 0,
    }));

    const startTime = Date.now();
    return () => {
      const duration = Date.now() - startTime;
      dispatch(addInteraction({
        country: countryName,
        action: 'close_details',
        duration,
      }));
    };
  }, [countryName, dispatch, info, recommendations]);

  if (!countryName) return null;

  return (
    <AnimatePresence>
      <Motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: 'spring', damping: 25 }}
        className="ai-country-panel"
      >
        <div className="panel-header">
          <h2>{countryName}</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close panel">
            ✕
          </button>
        </div>

        <div className="panel-content">
          {/* AI-Generated Country Info */}
          <section className="info-section">
            <div className="section-header">
              <span className="ai-badge">🤖 AI Insights</span>
            </div>
            
            {loading.countryInfo && !info ? (
              <div className="loading-state">
                <Motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="spinner"
                >
                  ⚡
                </Motion.div>
                <p>Generating insights...</p>
              </div>
            ) : info ? (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="info-grid"
              >
                <div className="info-item">
                  <span className="label">Capital</span>
                  <span className="value">{info.capital}</span>
                </div>
                <div className="info-item">
                  <span className="label">Population</span>
                  <span className="value">{info.population}</span>
                </div>
                <div className="info-item full-width">
                  <span className="label">Cultural Insight</span>
                  <p className="value">{info.culturalFact}</p>
                </div>
                <div className="info-item full-width">
                  <span className="label">Geography</span>
                  <p className="value">{info.geography}</p>
                </div>
              </Motion.div>
            ) : (
              <p className="error-state">Unable to load country information</p>
            )}
          </section>

          {/* AI Travel Recommendations */}
          <section className="recommendations-section">
            <div className="section-header">
              <span className="ai-badge">✈️ TOP 10 Must-Visit Places</span>
            </div>

            {loading.recommendations && !recommendations ? (
              <div className="loading-state">
                <Motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="spinner"
                >
                  ⚡
                </Motion.div>
                <p>Finding amazing destinations...</p>
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="recommendations-list"
              >
                {recommendations.map((place, index) => (
                  <Motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="recommendation-card"
                  >
                    <div className="card-header">
                      <h4>{place.name}</h4>
                      <span className="place-type">{place.type}</span>
                    </div>
                    <p className="card-description">{place.description}</p>
                  </Motion.div>
                ))}
              </Motion.div>
            ) : null}
          </section>
        </div>
      </Motion.div>
    </AnimatePresence>
  );
};

export default AICountryPanel;
