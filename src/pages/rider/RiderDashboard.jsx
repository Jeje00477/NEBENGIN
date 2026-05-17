import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { pollRiderRequestStatus } from '../../services/api';
import BottomNav from '../../components/common/BottomNav';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import { MapPin, Navigation } from 'lucide-react';

export default function RiderDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeRequest, setActiveRequest] = useState(null);

  const pickup = JSON.parse(sessionStorage.getItem('rider_pickup'));
  const destination = JSON.parse(sessionStorage.getItem('rider_destination')) || null;

  useEffect(() => {
    if (!sessionStorage.getItem('rider_destination')) {
      sessionStorage.setItem('rider_destination', JSON.stringify(destination));
    }

    // Check if there's an active request waiting
    async function checkStatus() {
      const { data } = await pollRiderRequestStatus();
      if (data && data.status === 'waiting') {
        setActiveRequest(data);
      } else if (data && data.status === 'matched') {
        navigate('/rider/trip/active');
      }
    }
    checkStatus();
  }, [navigate, destination]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
      <div className="bg-green-600 px-6 py-6 rounded-b-3xl shadow-md">
        <div className="flex justify-between items-center mb-2">
          <div className="text-white">
            <p className="text-green-100 text-sm">Hai,</p>
            <h1 className="text-2xl font-bold">{user?.nama?.split(' ')[0] || 'Rider'}!</h1>
          </div>
          <button onClick={() => navigate('/rider/profile')}>
            <Avatar nama={user?.nama} src={user?.avatar_url} size="md" className="border-2 border-white" />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 -mt-6 relative z-10 flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-4 text-lg">Pesan Tumpangan</h2>
          
          <div className="space-y-3 relative">
            <div className="absolute left-6 top-8 bottom-8 w-0.5 border-l-2 border-dotted border-gray-300"></div>
            
            <button
              onClick={() => navigate('/rider/set-pickup')}
              className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left border border-transparent focus:border-green-100"
            >
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 z-10">
                <MapPin className="w-3.5 h-3.5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 mb-0.5">Lokasi Jemputmu</p>
                <p className={`text-sm font-medium ${pickup ? 'text-gray-900' : 'text-gray-400'}`}>{pickup ? pickup.label : 'Ketuk untuk pilih lokasi'}</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/rider/set-destination')}
              className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left border border-transparent focus:border-green-100"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 z-10">
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 mb-0.5">Tujuan</p>
                <p className="text-sm font-medium text-gray-900">{destination ? destination.label : 'Ketuk untuk pilih lokasi'}</p>
              </div>
            </button>
          </div>

          <div className="mt-6">
            <Button 
              label="Cari Tumpangan" 
              fullWidth 
              className="bg-green-600 hover:bg-green-700" 
              disabled={!pickup || !destination}
              onClick={() => navigate('/rider/waiting')}
            />
          </div>
        </div>


      </div>

      <BottomNav role="rider" active="beranda" />
    </div>
  );
}
