import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapDisplay({ position, height = '400px', className = '' }) {
  const defaultPos = position || { lat: -7.9518, lng: 112.6144 };
  
  return (
    <div style={{ height, minHeight: '200px' }} className={`w-full z-0 relative ${className}`}>
      <MapContainer 
        center={defaultPos} 
        zoom={15} 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
        zoomControl={false} 
        dragging={false} 
        scrollWheelZoom={false} 
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={defaultPos}></Marker>
      </MapContainer>
    </div>
  );
}
