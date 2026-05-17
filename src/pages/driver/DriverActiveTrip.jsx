import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin } from 'lucide-react';
import { markRiderPickedUp, completeTrip } from '../../services/api';
import BottomNav from '../../components/common/BottomNav';
import MapDisplay from '../../components/common/MapDisplay';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function DriverActiveTrip() {
  const navigate = useNavigate();
  const [riders, setRiders] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  
  // Load from session
  useEffect(() => {
    const stored = sessionStorage.getItem('driver_active_riders');
    if (stored) {
      setRiders(JSON.parse(stored).map(r => ({ ...r, status: 'Menunggu Dijemput' })));
    }
  }, []);

  const handlePickup = async (riderId) => {
    const rider = riders.find(r => r.id === riderId);
    const realTripId = rider?.trip_id || 501;
    await markRiderPickedUp({ tripId: realTripId });
    setRiders(riders.map(r => r.id === riderId ? { ...r, status: 'Sudah Dijemput' } : r));
  };

  const handleComplete = async () => {
    setLoadingComplete(true);
    // Complete all real active trips for this driver
    await Promise.all(
      riders.map(rider => {
        const realTripId = rider.trip_id || 501;
        return completeTrip({ tripId: realTripId });
      })
    );
    sessionStorage.removeItem('driver_active_riders');
    setLoadingComplete(false);
    navigate('/driver/trip/complete', { state: { riders } });
  };

  const handleCancelTrip = () => {
    sessionStorage.removeItem('driver_active_riders');
    navigate('/driver/dashboard');
  };

  const allPickedUp = riders.length > 0 && riders.every(r => r.status === 'Sudah Dijemput');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-lg font-semibold">Perjalanan Aktif</h1>
        <button onClick={() => setShowCancelModal(true)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-danger transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="relative">
        <MapDisplay height="280px" />
        {/* TODO: Replace with live map showing driver location and rider pins */}
      </div>

      <div className="flex-1 px-4 py-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Daftar Penjemputan
          </h2>
          
          <div className="space-y-4">
            {riders.map((rider, index) => (
              <div key={rider.id} className="relative">
                {index !== riders.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-[-16px] w-0.5 bg-gray-100 z-0"></div>
                )}
                <div className="flex gap-3 relative z-10">
                  <Avatar src={rider.avatar_url} nama={rider.nama} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{rider.nama}</h3>
                    <p className="text-xs text-gray-600 truncate flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" /> {rider.lokasi_jemput_label}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <Badge 
                        label={rider.status} 
                        variant={rider.status === 'Sudah Dijemput' ? 'success' : 'warning'} 
                      />
                      {rider.status === 'Menunggu Dijemput' && (
                        <Button 
                          label="Sudah Dijemput" 
                          variant="outlined" 
                          className="text-xs px-3 py-1.5 h-auto text-blue-600 border-blue-200 hover:border-blue-400"
                          onClick={() => handlePickup(rider.id)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {riders.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Belum ada penumpang.</p>
            )}
          </div>
        </div>

        {riders.length > 0 && (
          <Button 
            label="Selesaikan Perjalanan" 
            fullWidth 
            className={allPickedUp ? "bg-blue-600" : "bg-gray-800"} 
            loading={loadingComplete}
            onClick={handleComplete} 
          />
        )}
      </div>

      <BottomNav role="driver" active="perjalanan" />

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Batalkan Perjalanan?"
        footer={
          <>
            <Button label="Kembali" variant="ghost" onClick={() => setShowCancelModal(false)} />
            <Button label="Ya, Batalkan" variant="danger" onClick={handleCancelTrip} />
          </>
        }
      >
        <p>Apakah kamu yakin ingin membatalkan perjalanan ini? Penumpang yang sudah memilihmu akan diberitahu.</p>
      </Modal>
    </div>
  );
}
