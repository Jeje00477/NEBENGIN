import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRiderRequest, pollRiderRequestStatus, cancelRiderRequest } from '../../services/api';
import { usePolling } from '../../hooks/usePolling';
import MapDisplay from '../../components/common/MapDisplay';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { MapPin, Navigation } from 'lucide-react';

export default function RiderWaiting() {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [requestId, setRequestId] = useState(null);

  const pickup = JSON.parse(sessionStorage.getItem('rider_pickup')) || { label: 'Lokasi Jemput' };
  const destination = JSON.parse(sessionStorage.getItem('rider_destination')) || { label: 'Tujuan' };

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => {
        if (t >= 300) {
          clearInterval(timer);
          navigate('/rider/no-driver');
          return t;
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  // Initial Request
  useEffect(() => {
  async function initRequest() {
    const { data: existing } = await pollRiderRequestStatus();
    if (existing?.status && existing.status !== 'none') {
      setRequestId(existing.requestId);
      return; 
    }
    const { data } = await createRiderRequest({
      pickup_lat: pickup.lat,
      pickup_lng: pickup.lng,
      lokasi_jemput_label: pickup.label,
      destination_lat: destination.lat,
      destination_lng: destination.lng,
      tujuan_label: destination.label
    });

    if (data) setRequestId(data.requestId);
  }

  initRequest();
}, []);

  // Polling
  const checkStatus = async () => {
    const { data } = await pollRiderRequestStatus();
    if (data?.status === 'matched') {
      navigate('/rider/trip/active');
      return true; // stop polling
    }
    if (data?.status === 'timeout' || data?.status === 'cancelled') {
      navigate('/rider/no-driver');
      return true; // stop polling
    }
    if (data?.status === 'none') {
      navigate('/rider/dashboard');
      return true; // stop polling
    }
    return false; // continue
  };

  usePolling(checkStatus, 5000, (result) => result === true);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCancel = async () => {
    try {
      setCancelError(null);
      if (requestId) {
        const { error } = await cancelRiderRequest({ requestId });
        if (error) throw new Error(error);
      }
      navigate('/rider/dashboard');
    } catch (err) {
      setCancelError(err.message || 'Gagal membatalkan pencarian');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <div className="flex-1 relative">
        <MapDisplay height="100%" position={{ lat: pickup.lat || -7.9518, lng: pickup.lng || 112.6144 }} />
        {/* Pulsing ring around pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-500/20 rounded-full animate-ping pointer-events-none"></div>
      </div>

      <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-20 pb-safe relative">
        <div className="flex justify-center mb-6">
          <div className="px-4 py-1.5 bg-gray-100 rounded-full text-xl font-mono font-bold text-gray-800 tabular-nums">
            {formatTime(time)}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Sedang mencari driver untukmu...</h2>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="mt-1"><MapPin className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">Jemput</p>
              <p className="text-sm font-medium text-gray-900 truncate">{pickup.label}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1"><Navigation className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">Tujuan</p>
              <p className="text-sm font-medium text-gray-900 truncate">{destination.label}</p>
            </div>
          </div>
        </div>

        <Button 
          label="Batalkan Pencarian" 
          variant="outlined" 
          className="border-danger text-danger hover:bg-red-50 w-full"
          onClick={() => setShowCancelModal(true)} 
        />
      </div>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Batalkan Pencarian?"
        footer={
          <>
            <Button label="Kembali" variant="ghost" onClick={() => setShowCancelModal(false)} />
            <Button label="Ya, Batalkan" variant="danger" onClick={handleCancel} />
          </>
        }
      >
        <p>Apakah kamu yakin ingin membatalkan pencarian driver saat ini?</p>
        {cancelError && <p className="text-red-500 text-sm mt-2">{cancelError}</p>}
      </Modal>
    </div>
  );
}
