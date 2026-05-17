// TODO: Replace this component entirely with a real Leaflet + OSM map
// Install: npm install leaflet react-leaflet
// Use: <MapContainer>, <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">
// Center default: [-7.9518, 112.6144] (Universitas Brawijaya, Malang)

import { MapPin } from 'lucide-react';

export default function MapPlaceholder({ height = '400px', showPin = false, pinLabel, showRoute = false, className = '' }) {
  // TODO: Replace with real OSM/Leaflet map component when backend is connected
  
  return (
    <div 
      className={`relative w-full bg-gray-100 overflow-hidden flex items-center justify-center ${className}`}
      style={{ height, backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-tr from-gray-200 to-transparent"></div>

      {showRoute && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <path 
            d="M 20 280 Q 150 150 350 50" 
            fill="none" 
            stroke="#2563eb" 
            strokeWidth="4" 
            strokeDasharray="6,6" 
            className="animate-pulse"
          />
          <circle cx="20" cy="280" r="6" fill="#2563eb" />
          <circle cx="350" cy="50" r="6" fill="#ef4444" />
        </svg>
      )}

      {showPin && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          {pinLabel && (
            <div className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg mb-2 shadow-lg whitespace-nowrap">
              {pinLabel}
            </div>
          )}
          <div className="relative">
            <MapPin className="w-10 h-10 text-red-500 drop-shadow-md relative z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-500/30 rounded-full animate-ping"></div>
          </div>
        </div>
      )}
    </div>
  );
}
