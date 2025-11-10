import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for origin and destination
const originIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to auto-fit map bounds
function MapBounds({ bounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && bounds.length === 2) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);
  
  return null;
}

const RouteMap = ({ origin, destination, height = '400px', showRoute = true }) => {
  const [originCoords, setOriginCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Geocoding function - Convert location name to coordinates
  const geocodeLocation = async (locationName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}, Bangalore, India&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Fetch route between two points
  const fetchRoute = async (start, end) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        return coords;
      }
      return [start, end]; // Fallback to straight line
    } catch (error) {
      console.error('Route fetching error:', error);
      return [start, end];
    }
  };

  useEffect(() => {
    const loadMapData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Geocode origin and destination
        const originResult = await geocodeLocation(origin);
        const destResult = await geocodeLocation(destination);

        if (!originResult || !destResult) {
          setError('Unable to locate one or both addresses');
          setLoading(false);
          return;
        }

        setOriginCoords(originResult);
        setDestCoords(destResult);

        // Fetch route if needed
        if (showRoute) {
          const route = await fetchRoute(originResult, destResult);
          setRouteCoords(route);
        }

        setLoading(false);
      } catch (err) {
        setError('Error loading map data');
        setLoading(false);
      }
    };

    if (origin && destination) {
      loadMapData();
    }
  }, [origin, destination, showRoute]);

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error || !originCoords || !destCoords) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height }}
      >
        <div className="text-center text-gray-600">
          <p>{error || 'Unable to load map'}</p>
        </div>
      </div>
    );
  }

  const bounds = [originCoords, destCoords];

  return (
    <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200" style={{ position: 'relative', zIndex: 0 }}>
      <MapContainer
        center={originCoords}
        zoom={12}
        style={{ height, width: '100%', zIndex: 0 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds bounds={bounds} />

        {/* Origin Marker */}
        <Marker position={originCoords} icon={originIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold text-green-700">Origin</p>
              <p className="text-sm">{origin}</p>
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker position={destCoords} icon={destinationIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold text-red-700">Destination</p>
              <p className="text-sm">{destination}</p>
            </div>
          </Popup>
        </Marker>

        {/* Route Line */}
        {showRoute && routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            color="#2563eb"
            weight={4}
            opacity={0.7}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default RouteMap;