/**
 * Flight Tracking Service - Enterprise-Grade Live Flight Data Integration
 * Ready for real-time flight APIs (AviationStack, FlightRadar24, OpenSky Network, etc.)
 */

class FlightTrackingService {
  constructor() {
    this.apiKey = import.meta.env.VITE_FLIGHT_API_KEY;
    this.apiUrl = import.meta.env.VITE_FLIGHT_API_URL || 'https://opensky-network.org/api';
    this.cache = new Map();
    this.cacheTTL = 30000; // 30 seconds for real-time data
    this.updateInterval = null;
    this.subscribers = [];
  }

  /**
   * Initialize flight tracking service
   */
  initialize() {
    console.log('✈️  Flight Tracking Service initialized');
    return true;
  }

  /**
   * Get live flights in specific bounds (for visible map area)
   * @param {Object} bounds - Map bounds {north, south, east, west}
   * @returns {Promise<Array>} Array of flight objects
   */
  async getLiveFlights(bounds = null) {
    try {
      // Check if API key is configured
      if (!this.apiKey) {
        console.warn('⚠️  AviationStack API key not configured. Using mock data.');
        return this.generateMockFlights();
      }

      // Check cache first
      const cacheKey = 'live_flights_all';
      const cached = this.getCached(cacheKey);
      if (cached) {
        console.log('🎯 Using cached flight data');
        return cached;
      }

      // Fetch live flights from AviationStack API
      const url = `${this.apiUrl}/flights?access_key=${this.apiKey}&limit=100&flight_status=active`;
      console.log('✈️  Fetching live flights from AviationStack...');
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`AviationStack API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('AviationStack API error:', data.error);
        return this.generateMockFlights();
      }

      // Transform AviationStack data to our format
      const flights = this.transformAviationStackData(data.data || []);
      
      // Cache the results
      this.setCache(cacheKey, flights);
      
      console.log(`✅ Loaded ${flights.length} live flights`);
      return flights;
      
    } catch (error) {
      console.error('Flight tracking error:', error);
      console.log('📍 Falling back to mock data');
      return this.generateMockFlights();
    }
  }

  /**
   * Transform AviationStack API data to our format
   * @param {Array} aviationStackFlights - Raw API data
   * @returns {Array} Transformed flight objects
   */
  transformAviationStackData(aviationStackFlights) {
    return aviationStackFlights
      .filter(flight => flight.live && flight.live.latitude && flight.live.longitude)
      .map((flight, index) => {
        const departure = flight.departure || {};
        const arrival = flight.arrival || {};
        const live = flight.live || {};
        const aircraft = flight.aircraft || {};
        const airline = flight.airline || {};

        return {
          id: `flight_${flight.flight_iata || index}_${Date.now()}`,
          flightNumber: flight.flight_iata || flight.flight_icao || `FL${index}`,
          airline: airline.name || 'Unknown Airline',
          airlineIata: airline.iata || '',
          position: [live.longitude, live.latitude],
          altitude: live.altitude || 0,
          speed: live.speed_horizontal || 0,
          heading: live.direction || 0,
          aircraft: aircraft.registration || aircraft.iata || 'Unknown',
          status: flight.flight_status || 'active',
          departure: {
            airport: departure.iata || departure.icao || 'Unknown',
            city: departure.airport || 'Unknown',
            time: departure.scheduled || departure.estimated,
            coordinates: this.getAirportCoordinates(departure.iata),
          },
          arrival: {
            airport: arrival.iata || arrival.icao || 'Unknown',
            city: arrival.airport || 'Unknown',
            time: arrival.scheduled || arrival.estimated,
            coordinates: this.getAirportCoordinates(arrival.iata),
          },
          route: [
            this.getAirportCoordinates(departure.iata),
            [live.longitude, live.latitude],
            this.getAirportCoordinates(arrival.iata),
          ].filter(coord => coord && coord[0] !== null),
        };
      });
  }

  /**
   * Get airport coordinates by IATA code
   * @param {string} iataCode - Airport IATA code
   * @returns {Array} [longitude, latitude]
   */
  getAirportCoordinates(iataCode) {
    const airports = {
      'JFK': [-73.7781, 40.6413],
      'LAX': [-118.4085, 33.9416],
      'LHR': [-0.4543, 51.4700],
      'CDG': [2.5479, 49.0097],
      'NRT': [140.3929, 35.7720],
      'DXB': [55.3644, 25.2532],
      'SIN': [103.9915, 1.3644],
      'HKG': [113.9145, 22.3080],
      'FRA': [8.5706, 50.0379],
      'AMS': [4.7639, 52.3105],
      'ORD': [-87.9048, 41.9742],
      'DFW': [-97.0403, 32.8998],
      'ATL': [-84.4279, 33.6407],
      'SFO': [-122.3750, 37.6213],
      'SEA': [-122.3088, 47.4502],
      'MIA': [-80.2906, 25.7959],
      'BOS': [-71.0096, 42.3656],
      'IAD': [-77.4565, 38.9531],
      'EWR': [-74.1745, 40.6895],
      'LGA': [-73.8740, 40.7769],
      'SYD': [151.1772, -33.9461],
      'MEL': [144.8432, -37.6690],
      'PEK': [116.5974, 40.0799],
      'PVG': [121.8058, 31.1443],
      'ICN': [126.4506, 37.4602],
      'BKK': [100.7501, 13.6900],
      'DEL': [77.1025, 28.5665],
      'BOM': [72.8679, 19.0896],
    };

    return airports[iataCode] || [null, null];
  }

  /**
   * Get specific flight details by flight number
   * @param {string} flightNumber - Flight identifier (e.g., "AA123")
   * @returns {Promise<Object>} Flight details
   */
  async getFlightDetails(flightNumber) {
    try {
      if (!this.apiKey) {
        return null;
      }

      const cacheKey = `flight_${flightNumber}`;
      const cached = this.getCached(cacheKey);
      if (cached) return cached;

      const url = `${this.apiUrl}/flights?access_key=${this.apiKey}&flight_iata=${flightNumber}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`AviationStack API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const flightData = data.data[0];
        const transformed = this.transformAviationStackData([flightData])[0];
        this.setCache(cacheKey, transformed);
        return transformed;
      }

      return null;
    } catch (error) {
      console.error('Flight details error:', error);
      return null;
    }
  }

  /**
   * Generate mock flight data for demonstration
   * @returns {Array} Mock flight data
   */
  generateMockFlights() {
    const routes = [
      // Transatlantic routes
      { from: [-74.0060, 40.7128], to: [-0.1278, 51.5074], airline: 'British Airways', flight: 'BA117' },
      { from: [-0.1278, 51.5074], to: [-74.0060, 40.7128], airline: 'American Airlines', flight: 'AA100' },
      { from: [2.3522, 48.8566], to: [-74.0060, 40.7128], airline: 'Air France', flight: 'AF006' },
      
      // Transpacific routes
      { from: [-118.2437, 34.0522], to: [139.6917, 35.6895], airline: 'Japan Airlines', flight: 'JL061' },
      { from: [139.6917, 35.6895], to: [-122.3321, 47.6062], airline: 'ANA', flight: 'NH178' },
      { from: [151.2093, -33.8688], to: [-118.2437, 34.0522], airline: 'Qantas', flight: 'QF11' },
      
      // Asian routes
      { from: [103.8198, 1.3521], to: [139.6917, 35.6895], airline: 'Singapore Airlines', flight: 'SQ12' },
      { from: [121.4737, 31.2304], to: [114.1095, 22.3964], airline: 'China Eastern', flight: 'MU501' },
      { from: [77.1025, 28.7041], to: [55.2708, 25.2048], airline: 'Emirates', flight: 'EK512' },
      
      // European routes
      { from: [-3.7038, 40.4168], to: [12.4964, 41.9028], airline: 'Iberia', flight: 'IB3253' },
      { from: [13.4050, 52.5200], to: [37.6173, 55.7558], airline: 'Lufthansa', flight: 'LH1444' },
      
      // American routes
      { from: [-74.0060, 40.7128], to: [-87.6298, 41.8781], airline: 'United', flight: 'UA1234' },
      { from: [-118.2437, 34.0522], to: [-95.7129, 37.0902], airline: 'Southwest', flight: 'WN1234' },
      { from: [-99.1332, 19.4326], to: [-58.3816, -34.6037], airline: 'Aeromexico', flight: 'AM021' },
      
      // South American routes
      { from: [-46.6333, -23.5505], to: [-43.1729, -22.9068], airline: 'LATAM', flight: 'LA3001' },
      { from: [-58.3816, -34.6037], to: [-77.0428, -12.0464], airline: 'LATAM', flight: 'LA2401' },
    ];

    return routes.map((route, index) => {
      // Calculate position along route (random progress 0-100%)
      const progress = Math.random();
      const lat = route.from[1] + (route.to[1] - route.from[1]) * progress;
      const lon = route.from[0] + (route.to[0] - route.from[0]) * progress;
      
      // Calculate heading
      const heading = this.calculateHeading(route.from, route.to);

      return {
        id: `flight_${index}_${Date.now()}`,
        flightNumber: route.flight,
        airline: route.airline,
        position: [lon, lat],
        altitude: 30000 + Math.random() * 10000,
        speed: 400 + Math.random() * 150,
        heading,
        departure: {
          coordinates: route.from,
          city: this.getAirportCity(route.from),
        },
        arrival: {
          coordinates: route.to,
          city: this.getAirportCity(route.to),
        },
        route: [route.from, [lon, lat], route.to],
      };
    });
  }

  /**
   * Calculate heading between two points
   * @param {Array} from - [lon, lat]
   * @param {Array} to - [lon, lat]
   * @returns {number} Heading in degrees
   */
  calculateHeading(from, to) {
    const dLon = to[0] - from[0];
    const y = Math.sin(dLon) * Math.cos(to[1]);
    const x = Math.cos(from[1]) * Math.sin(to[1]) -
              Math.sin(from[1]) * Math.cos(to[1]) * Math.cos(dLon);
    const heading = Math.atan2(y, x) * (180 / Math.PI);
    return (heading + 360) % 360;
  }

  /**
   * Get airport city name (mock)
   * @param {Array} coordinates - [lon, lat]
   * @returns {string} City name
   */
  getAirportCity(coordinates) {
    const cities = {
      '-74.0060,40.7128': 'New York',
      '-0.1278,51.5074': 'London',
      '2.3522,48.8566': 'Paris',
      '-118.2437,34.0522': 'Los Angeles',
      '139.6917,35.6895': 'Tokyo',
      '103.8198,1.3521': 'Singapore',
      '121.4737,31.2304': 'Shanghai',
      '77.1025,28.7041': 'Delhi',
      '-99.1332,19.4326': 'Mexico City',
      '-46.6333,-23.5505': 'São Paulo',
    };
    
    const key = `${coordinates[0].toFixed(4)},${coordinates[1].toFixed(4)}`;
    return cities[key] || 'Unknown';
  }

  /**
   * Start real-time flight updates
   * @param {Function} callback - Called with updated flight data
   * @param {number} interval - Update interval in ms (default: 5000)
   */
  startLiveTracking(callback, interval = 5000) {
    if (this.updateInterval) {
      this.stopLiveTracking();
    }

    this.updateInterval = setInterval(async () => {
      const flights = await this.getLiveFlights();
      callback(flights);
    }, interval);

    // Initial data
    this.getLiveFlights().then(callback);
  }

  /**
   * Stop real-time updates
   */
  stopLiveTracking() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Cache helpers
   */
  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clearCache() {
    this.cache.clear();
  }
}

// Singleton instance
export const flightTrackingService = new FlightTrackingService();
export default flightTrackingService;
