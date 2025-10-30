import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion as Motion } from 'framer-motion';
import { updatePerformance } from '../store/aiSlice';

/**
 * Real-time Performance Monitor with AI Optimization Insights
 */
const PerformanceMonitor = () => {
  const dispatch = useDispatch();
  const performance = useSelector((state) => state.ai.performance);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const fpsRef = useRef(60);

  useEffect(() => {
    let animationFrameId;

    const measureFPS = (timestamp) => {
      frameCountRef.current++;
      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);
        fpsRef.current = fps;
        
        dispatch(updatePerformance({ fps }));
        
        frameCountRef.current = 0;
        lastTimeRef.current = timestamp;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [dispatch]);

  const getFPSColor = (fps) => {
    if (fps >= 55) return '#00ffcc';
    if (fps >= 30) return '#ffaa00';
    return '#ff4444';
  };

  const cacheHitRate = performance.apiCalls > 0
    ? ((performance.cacheHits / performance.apiCalls) * 100).toFixed(1)
    : 0;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="performance-monitor"
    >
      <div className="monitor-title">⚡ Performance</div>
      
      <div className="metrics-grid">
        <div className="metric">
          <span className="metric-label">FPS</span>
          <span 
            className="metric-value"
            style={{ color: getFPSColor(performance.fps) }}
          >
            {performance.fps}
          </span>
        </div>

        <div className="metric">
          <span className="metric-label">AI Calls</span>
          <span className="metric-value">{performance.apiCalls}</span>
        </div>

        <div className="metric">
          <span className="metric-label">Cache Hit</span>
          <span className="metric-value">{cacheHitRate}%</span>
        </div>
      </div>

      {performance.fps < 55 && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="performance-warning"
        >
          ⚠️ Performance degradation detected
        </Motion.div>
      )}
    </Motion.div>
  );
};

export default PerformanceMonitor;
