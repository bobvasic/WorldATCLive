import { useRef, useState, useCallback, useMemo } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import { motion as Motion } from 'framer-motion';
import 'maplibre-gl/dist/maplibre-gl.css';
import LiveFlightsLayer from './LiveFlightsLayer';

const WorldMapSimple = ({ onCountryClick, onCountryHover }) => {
  const mapRef = useRef();
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const initialViewState = useMemo(() => ({
    longitude: 0,
    latitude: 20,
    zoom: 1.5,
  }), []);

  // Major world cities with population data for heatmap
  const majorCitiesGeoJSON = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      // Asia
      { type: 'Feature', geometry: { type: 'Point', coordinates: [139.6917, 35.6895] }, properties: { name: 'Tokyo', population: 37400000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [77.1025, 28.7041] }, properties: { name: 'Delhi', population: 30290000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [121.4737, 31.2304] }, properties: { name: 'Shanghai', population: 27060000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [114.1095, 22.3964] }, properties: { name: 'Hong Kong', population: 7500000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [116.4074, 39.9042] }, properties: { name: 'Beijing', population: 21540000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [72.8777, 19.0760] }, properties: { name: 'Mumbai', population: 20410000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [126.9780, 37.5665] }, properties: { name: 'Seoul', population: 9770000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [135.5023, 34.6937] }, properties: { name: 'Osaka', population: 19280000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [113.2644, 23.1291] }, properties: { name: 'Guangzhou', population: 13080000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [106.8456, -6.2088] }, properties: { name: 'Jakarta', population: 10770000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [100.5018, 13.7563] }, properties: { name: 'Bangkok', population: 10540000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [103.8198, 1.3521] }, properties: { name: 'Singapore', population: 5850000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [55.2708, 25.2048] }, properties: { name: 'Dubai', population: 3400000 } },
      
      // Europe
      { type: 'Feature', geometry: { type: 'Point', coordinates: [37.6173, 55.7558] }, properties: { name: 'Moscow', population: 12540000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [28.9784, 41.0082] }, properties: { name: 'Istanbul', population: 15460000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-0.1278, 51.5074] }, properties: { name: 'London', population: 9540000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [2.3522, 48.8566] }, properties: { name: 'Paris', population: 11020000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [13.4050, 52.5200] }, properties: { name: 'Berlin', population: 3670000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [12.4964, 41.9028] }, properties: { name: 'Rome', population: 4340000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-3.7038, 40.4168] }, properties: { name: 'Madrid', population: 6640000 } },
      
      // North America
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-74.0060, 40.7128] }, properties: { name: 'New York', population: 18820000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-118.2437, 34.0522] }, properties: { name: 'Los Angeles', population: 12460000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-99.1332, 19.4326] }, properties: { name: 'Mexico City', population: 21780000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-87.6298, 41.8781] }, properties: { name: 'Chicago', population: 8900000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-79.3832, 43.6532] }, properties: { name: 'Toronto', population: 6200000 } },
      
      // South America
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-46.6333, -23.5505] }, properties: { name: 'São Paulo', population: 22040000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-58.3816, -34.6037] }, properties: { name: 'Buenos Aires', population: 15180000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-43.1729, -22.9068] }, properties: { name: 'Rio de Janeiro', population: 13460000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-77.0428, -12.0464] }, properties: { name: 'Lima', population: 10720000 } },
      
      // Africa
      { type: 'Feature', geometry: { type: 'Point', coordinates: [31.2357, 30.0444] }, properties: { name: 'Cairo', population: 20900000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [3.3792, 6.5244] }, properties: { name: 'Lagos', population: 14370000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [28.0473, -26.2041] }, properties: { name: 'Johannesburg', population: 5780000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [36.8219, -1.2921] }, properties: { name: 'Nairobi', population: 4740000 } },
      
      // Oceania
      { type: 'Feature', geometry: { type: 'Point', coordinates: [151.2093, -33.8688] }, properties: { name: 'Sydney', population: 5310000 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [144.9631, -37.8136] }, properties: { name: 'Melbourne', population: 5080000 } },
    ],
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
          <>
            {/* Main country layer with enhanced terrain visualization */}
            <Source
              id="countries"
              type="geojson"
              data="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson"
            >
              {/* Base terrain fill - dark sci-fi style */}
              <Layer
                id="countries-fill"
                type="fill"
                paint={{
                  'fill-color': 'rgba(8, 12, 18, 0.7)',
                  'fill-opacity': 0.9,
                }}
              />
              
              {/* Inner grid lines - sci-fi tech look */}
              <Layer
                id="countries-inner-accent"
                type="line"
                paint={{
                  'line-color': 'rgba(0, 180, 255, 0.2)',
                  'line-width': 0.3,
                  'line-opacity': 0.5,
                  'line-offset': -1.5,
                  'line-dasharray': [2, 3],
                }}
              />
              
              {/* Main country borders - cyan sci-fi */}
              <Layer
                id="countries-outline"
                type="line"
                paint={{
                  'line-color': '#00b4ff',
                  'line-width': 0.8,
                  'line-opacity': 0.7,
                }}
              />
              
              {/* Outer glow effect - soft cyan */}
              <Layer
                id="countries-glow"
                type="line"
                paint={{
                  'line-color': '#00b4ff',
                  'line-width': 2.5,
                  'line-blur': 3,
                  'line-opacity': 0.3,
                }}
              />
              
              {/* Highlight glow - enhanced sci-fi borders */}
              <Layer
                id="countries-highlight"
                type="line"
                paint={{
                  'line-color': '#0099ff',
                  'line-width': 5,
                  'line-blur': 6,
                  'line-opacity': 0.12,
                }}
              />
            </Source>

            {/* Metropolitan cities heat map - orange/red sci-fi */}
            <Source
              id="cities"
              type="geojson"
              data={majorCitiesGeoJSON}
            >
              {/* Large outer glow - red metropolitan heat */}
              <Layer
                id="cities-heatmap-outer"
                type="circle"
                paint={{
                  'circle-radius': [
                    'interpolate',
                    ['exponential', 2],
                    ['get', 'population'],
                    1000000, 50,
                    5000000, 70,
                    10000000, 95,
                    20000000, 120,
                    40000000, 150,
                  ],
                  'circle-color': 'rgba(255, 60, 0, 0.15)',
                  'circle-blur': 2.5,
                  'circle-opacity': [
                    'interpolate',
                    ['linear'],
                    ['get', 'population'],
                    1000000, 0.4,
                    10000000, 0.6,
                    40000000, 0.8,
                  ],
                }}
              />
              
              {/* Medium glow - orange city core */}
              <Layer
                id="cities-heatmap-mid"
                type="circle"
                paint={{
                  'circle-radius': [
                    'interpolate',
                    ['exponential', 2],
                    ['get', 'population'],
                    1000000, 25,
                    5000000, 38,
                    10000000, 50,
                    20000000, 65,
                    40000000, 80,
                  ],
                  'circle-color': 'rgba(255, 120, 0, 0.4)',
                  'circle-blur': 1.8,
                  'circle-opacity': 0.7,
                }}
              />
              
              {/* Inner glow - bright orange-yellow center */}
              <Layer
                id="cities-heatmap-inner"
                type="circle"
                paint={{
                  'circle-radius': [
                    'interpolate',
                    ['exponential', 2],
                    ['get', 'population'],
                    1000000, 12,
                    5000000, 18,
                    10000000, 24,
                    20000000, 30,
                    40000000, 36,
                  ],
                  'circle-color': 'rgba(255, 180, 40, 0.6)',
                  'circle-blur': 1.2,
                  'circle-opacity': 0.85,
                }}
              />
              
              {/* Core point - bright white-yellow hot center */}
              <Layer
                id="cities-core"
                type="circle"
                paint={{
                  'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'population'],
                    1000000, 3,
                    5000000, 4,
                    10000000, 5,
                    20000000, 6,
                    40000000, 8,
                  ],
                  'circle-color': '#ffff99',
                  'circle-opacity': 1,
                }}
              />
              
              {/* Pulsing heat effect for megacities (>15M population) */}
              <Layer
                id="cities-pulse"
                type="circle"
                filter={['>', ['get', 'population'], 15000000]}
                paint={{
                  'circle-radius': [
                    'interpolate',
                    ['exponential', 2],
                    ['zoom'],
                    1, 40,
                    3, 55,
                    5, 70,
                  ],
                  'circle-color': 'rgba(255, 80, 20, 0.15)',
                  'circle-blur': 3,
                  'circle-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    1, 0.5,
                    3, 0.3,
                    5, 0.15,
                  ],
                }}
              />
            </Source>

            {/* Terrain accent lines - topographic contours simulation */}
            <Source
              id="terrain-accents"
              type="geojson"
              data="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson"
            >
              <Layer
                id="terrain-shadow"
                type="line"
                paint={{
                  'line-color': 'rgba(0, 0, 0, 0.3)',
                  'line-width': 1.5,
                  'line-offset': 1,
                  'line-blur': 2,
                  'line-opacity': 0.5,
                }}
              />
            </Source>

            {/* Live Flight Tracking Layer */}
            <LiveFlightsLayer onFlightClick={(flight) => console.log('Flight clicked:', flight)} />
          </>
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
