# Interactive World Map Application

🌍 A premium, commercial-grade interactive world map built with modern web technologies for the hackathon project.

## Overview

This application features a fully responsive, interactive world map with neon teal styling and smooth animations. The map displays accurate continental boundaries with real-time hover interactions and country tooltips.

## Tech Stack

### Core Framework
- **React 19** - Modern UI library with latest features
- **Vite** - Next-generation frontend build tool with lightning-fast HMR

### Map Rendering
- **MapLibre GL** - High-performance vector map rendering engine
- **react-map-gl** - React wrapper for MapLibre GL providing declarative map components

### State Management
- **Redux Toolkit** - Modern Redux with simplified API for state management
- **React-Redux** - Official React bindings for Redux

### Animations
- **Framer Motion** - Production-ready motion library for React

## Architecture

### Component Structure
```
src/
├── components/
│   ├── WorldMap.jsx          # Full-featured map with Redux integration
│   └── WorldMapSimple.jsx    # Optimized map component (active)
├── store/
│   ├── store.js              # Redux store configuration
│   └── mapSlice.js           # Map state slice with zoom/center controls
├── App.jsx                    # Main application component
├── main.jsx                   # Application entry point with Redux Provider
└── App.css                    # Styling with performance optimizations
```

### Key Features

#### 1. **Premium Visual Design**
- Pure black background (#000000)
- Neon teal continent outlines (#00ffcc)
- Subtle gradient overlays for depth
- Glow effects on country borders
- Smooth fade-in animations

#### 2. **Performance Optimizations**
- `useMemo` hooks for style objects to prevent unnecessary re-renders
- `useCallback` for event handlers to maintain referential equality
- Deferred layer rendering after map load
- GPU-accelerated CSS transforms (`translateZ(0)`, `backface-visibility`)
- Map instance reuse with `reuseMaps` prop
- Antialiasing enabled for crisp rendering

#### 3. **Interactive Elements**
- Real-time country hover detection
- Animated tooltips with country names
- Smooth zoom and pan controls
- Responsive design for all screen sizes

#### 4. **Data Source**
- GeoJSON data from Natural Earth (110m resolution)
- CDN-hosted for fast loading
- Accurate Mercator projection

## Installation

```bash
# Clone the repository
git clone https://github.com/jelenastricak/1stHackaton10-30-2025.git
cd 1stHackaton10-30-2025

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development

### Available Scripts

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Map Configuration

The map can be customized in `src/components/WorldMapSimple.jsx`:

```javascript
const initialViewState = {
  longitude: 0,      // Center longitude
  latitude: 20,      // Center latitude
  zoom: 1.5,         // Initial zoom level
};
```

### Styling Customization

Colors and visual effects are defined in `src/App.css`:
- Continent outline color: `#00ffcc`
- Background color: `#000000`
- Continent fill: `rgba(15, 15, 25, 0.6)`

## Redux State Management

The application uses Redux Toolkit for centralized state management:

```javascript
// Map state structure
{
  map: {
    zoom: 1,
    center: [0, 20],
    isLoaded: false
  }
}
```

**Available Actions:**
- `setZoom(level)` - Update map zoom level
- `setCenter([lng, lat])` - Update map center coordinates
- `setLoaded(boolean)` - Track map load status

## Performance Considerations

1. **Lazy Loading**: Map layers load after the map initializes to prevent flickering
2. **Memoization**: All style objects and callbacks are memoized
3. **Hardware Acceleration**: CSS transforms leverage GPU
4. **Debounced Interactions**: Hover events are optimized for smooth performance

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

Requires WebGL support for MapLibre GL rendering.

## Contributing

This is a hackathon project. Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Authors

- Bob Vasic
- Jelena Stricak

---

**Built with ❤️ for the Hackathon 2025**
