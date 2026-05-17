import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function LocationFetcher({ setPosition }) {
  const map = useMap();
  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map, setPosition]);
  return null;
}

export default function MapPicker({ initialPosition, onPositionChange, height = '400px', className = '' }) {
  const defaultPos = { lat: -7.9518, lng: 112.6144 }; // UB Center
  const [position, setPosition] = useState(initialPosition || defaultPos);

  useEffect(() => {
    if (position && onPositionChange) {
      onPositionChange(position);
    }
  }, [position]);

  return (
    <div style={{ height, minHeight: '400px' }} className={`w-full z-0 relative ${className}`}>
      <MapContainer center={position} zoom={15} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} zoomControl={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationFetcher setPosition={setPosition} />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      <div className="absolute top-20 right-4 z-[400] bg-white px-3 py-1.5 rounded-full shadow-md text-xs font-semibold text-gray-700 border border-gray-100">
        Ketuk Peta untuk Pilih
      </div>
    </div>
  );
}
