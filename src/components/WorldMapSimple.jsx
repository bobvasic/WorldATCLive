import { useRef, useState, useCallback, useMemo } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import { motion as Motion } from 'framer-motion';
import 'maplibre-gl/dist/maplibre-gl.css';

const WorldMapSimple = ({ onCountryClick, onCountryHover }) => {
  const mapRef = useRef();
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const initialViewState = useMemo(() => ({
    longitude: 0,
    latitude: 20,
    zoom: 1.5,
  }), []);

  const mapStyle = useMemo(() => ({
    version: 8,
    sources: {},
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#000000',
        },
      },
    ],
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  }), []);

  const onHover = useCallback((event) => {
    const feature = event.features && event.features[0];
    if (feature) {
      const countryName = feature.properties.name || feature.properties.NAME;
      setHoveredCountry(countryName);
      if (onCountryHover) onCountryHover(countryName);
    } else {
      setHoveredCountry(null);
      if (onCountryHover) onCountryHover(null);
    }
  }, [onCountryHover]);

  const onMapLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const onClick = useCallback((event) => {
    const feature = event.features && event.features[0];
    if (feature && onCountryClick) {
      const countryName = feature.properties.name || feature.properties.NAME;
      onCountryClick(countryName);
    }
  }, [onCountryClick]);

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="map-container"
    >
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        interactiveLayerIds={['countries-fill']}
        onMouseMove={onHover}
        onMouseLeave={useCallback(() => {
          setHoveredCountry(null);
          if (onCountryHover) onCountryHover(null);
        }, [onCountryHover])}
        onClick={onClick}
        onLoad={onMapLoad}
        reuseMaps
        preserveDrawingBuffer={true}
        attributionControl={false}
        antialias={true}
        cursor={hoveredCountry ? 'pointer' : 'grab'}
      >
        {isLoaded && (
          <Source
            id="countries"
            type="geojson"
            data="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson"
          >
            <Layer
              id="countries-fill"
              type="fill"
              paint={{
                'fill-color': 'rgba(15, 15, 25, 0.6)',
                'fill-opacity': 0.8,
              }}
            />
            <Layer
              id="countries-outline"
              type="line"
              paint={{
                'line-color': '#00ffcc',
                'line-width': 1.2,
                'line-opacity': 0.9,
              }}
            />
            <Layer
              id="countries-glow"
              type="line"
              paint={{
                'line-color': '#00ffcc',
                'line-width': 3,
                'line-blur': 4,
                'line-opacity': 0.4,
              }}
            />
          </Source>
        )}
      </Map>

      {hoveredCountry && (
        <Motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="country-tooltip"
        >
          {hoveredCountry}
        </Motion.div>
      )}
    </Motion.div>
  );
};

export default WorldMapSimple;
