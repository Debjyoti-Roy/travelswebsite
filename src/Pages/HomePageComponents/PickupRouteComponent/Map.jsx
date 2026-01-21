import { GoogleMap, Polyline, Marker, useJsApiLoader } from "@react-google-maps/api";
import polyline from "@mapbox/polyline";
import { useEffect, useMemo } from "react";

const containerStyle = {
  width: "100%",
  height: "250px",
};

const GoogleRouteMap = ({ route, distance }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_KEY,
  });

  

  // Decode polyline and calculate center/zoom
  const mapData = useMemo(() => {
    if (!route) return null;

    try {
      // Decode the polyline
      const decoded = polyline.decode(route);
      
      // Convert to Google Maps format
      const path = decoded.map(([lat, lng]) => ({ lat, lng }));

      if (path.length === 0) return null;

      // Calculate center point (middle of the route)
      const center = path[Math.floor(path.length / 2)];

      // Get start and end points for markers
      const startPoint = path[0];
      const endPoint = path[path.length - 1];

      return { path, center, startPoint, endPoint };
    } catch (error) {
      console.error("Error decoding polyline:", error);
      return null;
    }
  }, [route]);

  // Create marker icons when Google Maps is loaded
  const markerIcons = useMemo(() => {
    if (!isLoaded || !window.google?.maps) return null;

    const { Size, Point } = window.google.maps;

    const startIcon = {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="#10b981" stroke="#ffffff" stroke-width="3"/>
          <circle cx="16" cy="16" r="6" fill="#ffffff"/>
        </svg>
      `),
      scaledSize: new Size(32, 32),
      anchor: new Point(16, 16),
    };

    const endIcon = {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="#ffffff" stroke-width="3"/>
          <circle cx="16" cy="16" r="6" fill="#ffffff"/>
        </svg>
      `),
      scaledSize: new Size(32, 32),
      anchor: new Point(16, 16),
    };

    return { startIcon, endIcon };
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="w-full h-[250px] bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  if (!route || !mapData) {
    return (
      <div className="w-full h-[250px] bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">No route data available</p>
      </div>
    );
  }

  // Format distance for display
  const formatDistance = (dist) => {
    if (!dist) return null;
    // If distance is in meters, convert to km if > 1000
    const numDist = typeof dist === 'string' ? parseFloat(dist) : dist;
    return `${numDist.toFixed(1)} km`;
  };

  return (
    <div className="w-full h-[250px] rounded-xl overflow-hidden border border-gray-200 relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapData.startPoint}
        zoom={13}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        <Polyline
          path={mapData.path}
          options={{
            strokeColor: "#1a73e8",
            strokeWeight: 5,
            strokeOpacity: 0.8,
          }}
        />
        
        {/* Start Point Marker (Green - Pickup) */}
        {markerIcons && (
          <Marker
            position={mapData.startPoint}
            icon={markerIcons.startIcon}
            title="Pickup Location"
          />
        )}
        
        {/* End Point Marker (Red - Drop) */}
        {markerIcons && (
          <Marker
            position={mapData.endPoint}
            icon={markerIcons.endIcon}
            title="Drop Location"
          />
        )}
      </GoogleMap>
      
      {/* Distance Overlay */}
      {distance && (
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 border border-gray-200 z-10">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <span className="text-sm font-semibold text-gray-800">
              {formatDistance(distance)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleRouteMap;
