import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapPicker from '../../components/common/MapPicker';
import Button from '../../components/common/Button';
import { ArrowLeft, Search } from 'lucide-react';

export default function DriverSetDestinationMap() {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ lat: -7.9518, lng: 112.6144 });

  const handleConfirm = () => {
    sessionStorage.setItem('driver_destination', JSON.stringify({
      lat: position.lat, 
      lng: position.lng,
      label: `Tujuan (${position.lat.toFixed(4)}, ${position.lng.toFixed(4)})`
    }));
    navigate('/driver/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <div className="absolute top-0 left-0 right-0 z-50 px-4 py-4 flex items-center gap-3 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={() => navigate('/driver/dashboard')} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md text-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 bg-white rounded-full shadow-md flex items-center px-4 py-2">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input type="text" placeholder="Cari lokasi..." className="flex-1 text-sm outline-none bg-transparent" readOnly />
        </div>
      </div>

      <MapPicker height="100vh" initialPosition={position} onPositionChange={setPosition} className="flex-1" />

      <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-50 pb-safe">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
        </div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">Pilih Tujuan</h3>
        <p className="text-lg font-semibold text-gray-900 mb-6 truncate">{position.lat.toFixed(4)}, {position.lng.toFixed(4)}</p>
        <Button label="Pakai Lokasi Ini" fullWidth className="bg-blue-600 hover:bg-blue-700" onClick={handleConfirm} />
      </div>
    </div>
  );
}
