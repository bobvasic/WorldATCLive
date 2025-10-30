import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { motion } from 'framer-motion';
import { setLoaded } from '../store/mapSlice';

const geoUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

const WorldMap = () => {
  const dispatch = useDispatch();
  const { zoom, center } = useSelector((state) => state.map);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  useEffect(() => {
    setTimeout(() => dispatch(setLoaded(true)), 500);
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: 'easeOut' }}
      className="map-container"
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147 * zoom,
          center: center,
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo, index) => (
              <motion.g
                key={geo.rsmKey}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 2,
                  delay: index * 0.02,
                  ease: 'easeInOut',
                }}
              >
                <Geography
                  geography={geo}
                  onMouseEnter={() => setHoveredCountry(geo.properties.name)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  style={{
                    default: {
                      fill: 'transparent',
                      stroke: hoveredCountry === geo.properties.name 
                        ? '#00ff88' 
                        : '#ffffff',
                      strokeWidth: hoveredCountry === geo.properties.name ? 1.5 : 0.7,
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    },
                    hover: {
                      fill: 'rgba(0, 255, 136, 0.1)',
                      stroke: '#00ff88',
                      strokeWidth: 1.5,
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    pressed: {
                      fill: 'rgba(0, 255, 136, 0.2)',
                      stroke: '#00ff88',
                      strokeWidth: 1.5,
                      outline: 'none',
                    },
                  }}
                />
              </motion.g>
            ))
          }
        </Geographies>
      </ComposableMap>
      
      {hoveredCountry && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="country-tooltip"
        >
          {hoveredCountry}
        </motion.div>
      )}
    </motion.div>
  );
};

export default WorldMap;
