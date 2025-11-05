import { useEffect, useState } from 'react';
import { Source, Layer, Marker } from 'react-map-gl/maplibre';
import { motion as Motion } from 'framer-motion';
import flightTrackingService from '../services/flightTrackingService';

/**
 * Live Flights Visualization Layer
 * Renders real-time aircraft positions, routes, and flight paths
 */
const LiveFlightsLayer = ({ onFlightClick }) => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);

  useEffect(() => {
    // Initialize flight tracking
    flightTrackingService.initialize();

    // Start live tracking with 30-second updates
    flightTrackingService.startLiveTracking((liveFlights) => {
      setFlights(liveFlights);
      console.log(`🛩️  Updated: ${liveFlights.length} flights`);
    }, 30000);

    // Cleanup on unmount
    return () => {
      flightTrackingService.stopLiveTracking();
    };
  }, []);

  const handleFlightClick = (flight) => {
    setSelectedFlight(flight);
    if (onFlightClick) {
      onFlightClick(flight);
    }
  };

  // Create flight routes GeoJSON
  const flightRoutesGeoJSON = {
    type: 'FeatureCollection',
    features: flights
      .filter(f => f.route && f.route.length >= 2)
      .map((flight) => ({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: flight.route,
        },
        properties: {
          flightNumber: flight.flightNumber,
          airline: flight.airline,
        },
      })),
  };

  return (
    <>
      {/* Flight Routes - Dashed lines */}
      {flightRoutesGeoJSON.features.length > 0 && (
        <Source id="flight-routes" type="geojson" data={flightRoutesGeoJSON}>
          <Layer
            id="flight-routes-layer"
            type="line"
            paint={{
              'line-color': 'rgba(0, 180, 255, 0.4)',
              'line-width': 1.5,
              'line-dasharray': [2, 2],
              'line-opacity': 0.6,
            }}
          />
          
          {/* Route glow effect */}
          <Layer
            id="flight-routes-glow"
            type="line"
            paint={{
              'line-color': 'rgba(0, 180, 255, 0.2)',
              'line-width': 3,
              'line-blur': 2,
              'line-opacity': 0.4,
            }}
          />
        </Source>
      )}

      {/* Aircraft Markers */}
      {flights.map((flight) => (
        <Marker
          key={flight.id}
          longitude={flight.position[0]}
          latitude={flight.position[1]}
          anchor="center"
        >
          <Motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleFlightClick(flight)}
            className="aircraft-marker"
            style={{
              transform: `rotate(${flight.heading}deg)`,
              cursor: 'pointer',
            }}
          >
            {/* Realistic Aircraft Icon */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Main fuselage */}
              <path
                d="M16 4 L18 12 L18 16 L18 20 L16 24 L14 20 L14 16 L14 12 Z"
                fill="#00b4ff"
                stroke="#ffffff"
                strokeWidth="0.5"
              />
              
              {/* Main wings */}
              <path
                d="M8 14 L14 15 L18 15 L24 14 L26 15 L18 16 L14 16 L6 15 Z"
                fill="#00b4ff"
                stroke="#ffffff"
                strokeWidth="0.5"
              />
              
              {/* Tail wings */}
              <path
                d="M12 21 L14 21 L14 23 L16 24 L18 23 L18 21 L20 21 L18 22 L14 22 Z"
                fill="#00b4ff"
                stroke="#ffffff"
                strokeWidth="0.5"
              />
              
              {/* Cockpit nose cone */}
              <ellipse
                cx="16"
                cy="6"
                rx="2.5"
                ry="3"
                fill="#66d9ff"
                opacity="0.9"
              />
              
              {/* Wing glow effect */}
              <path
                d="M8 14 L14 15 L18 15 L24 14 L26 15 L18 16 L14 16 L6 15 Z"
                fill="#66d9ff"
                opacity="0.4"
              />
              
              {/* Center line detail */}
              <line
                x1="16"
                y1="6"
                x2="16"
                y2="23"
                stroke="#ffffff"
                strokeWidth="0.5"
                opacity="0.6"
              />
              
              {/* Bright cockpit window */}
              <circle
                cx="16"
                cy="8"
                r="1.5"
                fill="#ffffff"
                opacity="0.95"
              />
            </svg>

            {/* Flight number label */}
            <Motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flight-label"
              style={{
                position: 'absolute',
                top: '32px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '700',
                color: '#00b4ff',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(0, 180, 255, 0.4)',
                pointerEvents: 'none',
                letterSpacing: '0.5px',
              }}
            >
              {flight.flightNumber}
            </Motion.div>
          </Motion.div>
        </Marker>
      ))}

      {/* Departure/Arrival Airport Markers */}
      {flights.map((flight) => (
        <div key={`airports-${flight.id}`}>
          {/* Departure airport */}
          {flight.departure.coordinates && flight.departure.coordinates[0] && (
            <Marker
              longitude={flight.departure.coordinates[0]}
              latitude={flight.departure.coordinates[1]}
              anchor="center"
            >
              <div className="airport-marker departure">
                <div className="airport-pulse" />
                <div className="airport-dot" />
              </div>
            </Marker>
          )}

          {/* Arrival airport */}
          {flight.arrival.coordinates && flight.arrival.coordinates[0] && (
            <Marker
              longitude={flight.arrival.coordinates[0]}
              latitude={flight.arrival.coordinates[1]}
              anchor="center"
            >
              <div className="airport-marker arrival">
                <div className="airport-pulse" />
                <div className="airport-dot" />
              </div>
            </Marker>
          )}
        </div>
      ))}

      {/* Flight info tooltip on hover */}
      {selectedFlight && (
        <Motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flight-tooltip"
          style={{
            position: 'fixed',
            top: '20px',
            right: '420px',
            backgroundColor: 'rgba(10, 15, 25, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid rgba(0, 180, 255, 0.3)',
            minWidth: '280px',
            zIndex: 1001,
          }}
        >
          <div style={{ color: '#00b4ff', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
            ✈️ {selectedFlight.flightNumber}
          </div>
          
          <div style={{ fontSize: '13px', color: '#ffffff', marginBottom: '8px' }}>
            <strong>{selectedFlight.airline}</strong>
          </div>

          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
            <span style={{ color: '#66ff99' }}>FROM:</span> {selectedFlight.departure.airport} ({selectedFlight.departure.city})
          </div>

          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
            <span style={{ color: '#ff9966' }}>TO:</span> {selectedFlight.arrival.airport} ({selectedFlight.arrival.city})
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>Altitude</div>
              <div style={{ color: '#00b4ff', fontWeight: '600' }}>{Math.round(selectedFlight.altitude).toLocaleString()} ft</div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>Speed</div>
              <div style={{ color: '#00b4ff', fontWeight: '600' }}>{Math.round(selectedFlight.speed)} kn</div>
            </div>
          </div>

          <button
            onClick={() => setSelectedFlight(null)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'transparent',
              border: 'none',
              color: '#00b4ff',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            ×
          </button>
        </Motion.div>
      )}

      {/* Flight counter badge */}
      <Motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flight-counter"
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          backgroundColor: 'rgba(10, 15, 25, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '12px 20px',
          borderRadius: '8px',
          border: '1px solid rgba(0, 180, 255, 0.3)',
          zIndex: 900,
        }}
      >
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
          LIVE FLIGHTS
        </div>
        <div style={{ fontSize: '24px', color: '#00b4ff', fontWeight: '700' }}>
          {flights.length}
        </div>
      </Motion.div>

      <style jsx>{`
        .aircraft-marker {
          position: relative;
          transition: transform 0.5s ease-out;
          filter: drop-shadow(0 0 8px rgba(0, 180, 255, 0.6));
        }

        .aircraft-marker:hover {
          filter: drop-shadow(0 0 12px rgba(0, 180, 255, 1));
          transform: scale(1.2);
        }

        .airport-marker {
          position: relative;
          width: 12px;
          height: 12px;
        }

        .airport-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .airport-marker.departure .airport-dot {
          background: #66ff99;
          box-shadow: 0 0 8px #66ff99;
        }

        .airport-marker.arrival .airport-dot {
          background: #ff9966;
          box-shadow: 0 0 8px #ff9966;
        }

        .airport-pulse {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s ease-out infinite;
        }

        .airport-marker.departure .airport-pulse {
          border: 2px solid #66ff99;
        }

        .airport-marker.arrival .airport-pulse {
          border: 2px solid #ff9966;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default LiveFlightsLayer;
