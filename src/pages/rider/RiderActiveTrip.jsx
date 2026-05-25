import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRiderActiveTrip, completeRiderTrip } from '../../services/api';
import BottomNav from '../../components/common/BottomNav';
import MapDisplay from '../../components/common/MapDisplay';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import { MessageCircle, Loader2 } from 'lucide-react';

export default function RiderActiveTrip() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadTrip() {
      try {
        const { data } = await getRiderActiveTrip();
        if (!isMounted) return;

        const isNullOrEmpty = !data || (data.data === null) || (Object.keys(data).length === 0);
        const status = data?.status || data?.data?.status;
        const isFinished = status === 'selesai' || status === 'cancelled';

        if (isNullOrEmpty || isFinished) {
          navigate('/rider/dashboard', { replace: true });
          return;
        }

        if (status === 'on_the_way' || status === 'picked_up') {
          setTrip(data);
          setLoading(false);
        } else {
          navigate('/rider/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error loading active trip:', error);
        if (isMounted) {
          navigate('/rider/dashboard', { replace: true });
        }
      }
    }
    loadTrip();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleContactDriver = () => {
    if (trip?.driver?.nomor_wa) {
      // TODO: driver.nomor_wa comes from backend — format 628xxxxxxxxxx
      window.open(`https://wa.me/${trip.driver.nomor_wa}`, '_blank');
    }
  };

  const handleComplete = async () => {
    setLoadingComplete(true);
    await completeRiderTrip({ tripId: trip.id });
    setLoadingComplete(false);
    navigate('/rider/trip/complete', { state: { driver: trip.driver, tripId: trip.id } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
        <div className="bg-white px-4 py-4 flex items-center justify-center border-b border-gray-100 sticky top-0 z-10">
          <h1 className="text-lg font-semibold">Perjalanan Aktif</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin mb-4" />
          <p className="text-gray-500 text-sm">Memuat perjalanan...</p>
        </div>
        <BottomNav role="rider" active="perjalanan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      <div className="bg-white px-4 py-4 flex items-center justify-center border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-lg font-semibold">Perjalanan Aktif</h1>
      </div>

      <div className="relative">
        <MapDisplay height="260px" />
        {/* TODO: Show live driver location moving toward rider pickup */}
      </div>

      <div className="flex-1 px-4 py-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-50">
            <Avatar src={trip.driver?.avatar_url} nama={trip.driver?.nama} size="md" />
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 truncate">{trip.driver?.nama}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {trip.driver?.vehicle?.merk_kendaraan || 'Kendaraan'} &middot; {trip.driver?.vehicle?.warna_kendaraan || 'Warna'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{trip.driver?.vehicle?.nomor_polisi || '-'}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1 text-center">
              {trip.status === 'on_the_way' 
                ? 'Driver sedang dalam perjalanan ke lokasi jemputmu' 
                : 'Kamu sedang dalam perjalanan ke kampus'}
            </h3>
            {trip.status === 'on_the_way' && (
              <p className="text-sm text-gray-500 text-center">Estimasi tiba: <span className="font-semibold text-gray-900">~3 menit</span></p>
            )}
          </div>

          <Button 
            label="Hubungi Driver" 
            variant="outlined" 
            fullWidth 
            className="border-green-600 text-green-700 hover:bg-green-50 flex justify-center items-center gap-2 mb-4"
            onClick={handleContactDriver}
          >
            <MessageCircle className="w-5 h-5" /> Hubungi Driver
          </Button>

          {/* For prototype demo purposes, rider can manually complete trip */}
          <Button 
            label="Sampai di Tujuan (Demo)" 
            fullWidth 
            className="bg-green-600 hover:bg-green-700 mt-2" 
            loading={loadingComplete}
            onClick={handleComplete} 
          />
        </div>
      </div>

      <BottomNav role="rider" active="perjalanan" />
    </div>
  );
}
