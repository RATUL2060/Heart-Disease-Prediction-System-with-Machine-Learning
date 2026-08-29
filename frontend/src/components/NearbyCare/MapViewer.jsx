import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically update map center and handle resize
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(map.getContainer());
    return () => resizeObserver.disconnect();
  }, [map]);

  return null;
};

const MapViewer = ({ center, facilities, selectedFacility, onSelectFacility }) => {
  return (
    <div className="w-full h-full bg-slate-100 dark:bg-dark-900 absolute inset-0 z-0 overflow-hidden">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} zoom={13} />
        
        {/* User Location Marker */}
        <Marker position={center}>
          <Popup>Your Search Location</Popup>
        </Marker>

        {/* Facility Markers */}
        {facilities.map((facility) => (
          <Marker 
            key={facility.id} 
            position={[facility.lat, facility.lon]}
            eventHandlers={{
              click: () => onSelectFacility(facility),
            }}
          >
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-slate-800">{facility.name}</h3>
                <p className="text-sm text-slate-600 mb-2">{facility.type}</p>
                {facility.address && <p className="text-xs text-slate-500">{facility.address}</p>}
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Get Directions
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapViewer;
