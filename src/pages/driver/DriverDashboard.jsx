import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDriverProfile, toggleDriverAvailability } from '../../services/api';
import BottomNav from '../../components/common/BottomNav';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import { MapPin, Navigation } from 'lucide-react';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load from sessionStorage
  const origin = JSON.parse(sessionStorage.getItem('driver_origin'));
  const destination = JSON.parse(sessionStorage.getItem('driver_destination')) || null;

  useEffect(() => {
    // Write default destination if none
    if (!sessionStorage.getItem('driver_destination')) {
      sessionStorage.setItem('driver_destination', JSON.stringify(destination));
    }

    async function fetchProfile() {
      const { data } = await getDriverProfile();
      if (data) setIsActive(data.is_available);
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleToggle = async () => {
    setIsActive(!isActive);
    await toggleDriverAvailability();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
      <div className="bg-blue-600 px-6 py-6 rounded-b-3xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <p className="text-blue-100 text-sm">Selamat pagi,</p>
            <h1 className="text-2xl font-bold">{user?.nama?.split(' ')[0] || 'Driver'}</h1>
          </div>
          <button onClick={() => navigate('/driver/profile')}>
            <Avatar nama={user?.nama} src={user?.avatar_url} size="md" className="border-2 border-white" />
          </button>
        </div>

        {/* Availability Toggle */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              {isActive && <div className="absolute w-3 h-3 rounded-full bg-green-400 animate-ping opacity-75"></div>}
            </div>
            <p className="text-white font-medium">{isActive ? 'Kamu sedang aktif' : 'Kamu sedang tidak aktif'}</p>
          </div>
          <button
            onClick={handleToggle}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${isActive ? 'bg-green-500' : 'bg-gray-400/50'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>

      <div className="px-6 py-6 -mt-4 relative z-10 flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4 text-lg">Cari Penumpang Sekarang</h2>
          
          <div className="space-y-3 relative">
            {/* Dotted line connecting pins */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 border-l-2 border-dotted border-gray-300"></div>
            
            <button
              onClick={() => navigate('/driver/set-origin')}
              className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left border border-transparent focus:border-blue-100"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 z-10">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 mb-0.5">Titik Asal Kamu</p>
                <p className={`text-sm font-medium ${origin ? 'text-gray-900' : 'text-gray-400'}`}>{origin ? origin.label : 'Ketuk untuk pilih lokasi'}</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/driver/set-destination')}
              className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left border border-transparent focus:border-blue-100"
            >
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 z-10">
                <Navigation className="w-3.5 h-3.5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 mb-0.5">Tujuan</p>
                <p className="text-sm font-medium text-gray-900">{destination ? destination.label : 'Ketuk untuk pilih lokasi'}</p>
              </div>
            </button>
          </div>

          <div className="mt-6">
            <Button 
              label="Cari Penumpang" 
              fullWidth 
              className="bg-blue-600 hover:bg-blue-700" 
              disabled={!origin || !destination}
              onClick={() => navigate('/driver/riders')}
            />
          </div>
        </div>
      </div>

      <BottomNav role="driver" active="beranda" />
    </div>
  );
}
