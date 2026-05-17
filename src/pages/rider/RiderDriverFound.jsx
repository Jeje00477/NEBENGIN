import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cancelMatchByRider } from '../../services/api';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import StarRating from '../../components/common/StarRating';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function RiderDriverFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const driver = location.state?.driver;
  const matchId = location.state?.matchId;

  const [timeLeft, setTimeLeft] = useState(60);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (!driver) navigate('/rider/dashboard');
  }, [driver, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setTimeout(() => navigate('/rider/trip/active'), 1000);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const handleCancel = async () => {
    await cancelMatchByRider({ matchId });
    navigate('/rider/dashboard');
  };

  if (!driver) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Animated Banner */}
      <div className="bg-green-500 text-white text-center py-4 px-6 shadow-md animate-in slide-in-from-top duration-500 z-10 relative">
        <h2 className="text-xl font-bold">Driver Ditemukan!</h2>
        <p className="text-green-100 text-sm">Bersiaplah di lokasi penjemputan</p>
      </div>

      <div className="flex-1 px-6 py-8 flex flex-col items-center">
        <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8 text-center">
          <Avatar src={driver.avatar_url} nama={driver.nama} size="lg" className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{driver.nama}</h2>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <StarRating value={driver.rating} size="sm" />
            <span className="text-sm font-medium">{driver.rating}</span>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-700 font-medium">
            <p>{driver.vehicle.jenis_kendaraan} &middot; {driver.vehicle.merk_kendaraan}</p>
            <p className="mt-1">{driver.vehicle.warna_kendaraan} &middot; <span className="font-bold">{driver.vehicle.nomor_polisi}</span></p>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            <Badge label={`Kecocokan Rute ${Math.round((driver.direction_score || 0.95) * 100)}%`} variant="success" />
          </div>

          <p className="text-sm text-gray-500">Estimasi tiba: <span className="font-bold text-gray-900">~5 menit</span></p>
        </div>

        {timeLeft > 0 ? (
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-20 h-20 flex items-center justify-center mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" fill="transparent" stroke="#f3f4f6" strokeWidth="6" />
                <circle 
                  cx="40" cy="40" r="36" fill="transparent" stroke="#16a34a" strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 36}
                  strokeDashoffset={2 * Math.PI * 36 * (1 - timeLeft / 60)}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <span className="absolute text-xl font-bold text-gray-800">{timeLeft}</span>
            </div>
            <p className="text-sm text-gray-500 text-center">Kamu bisa membatalkan dalam {timeLeft} detik</p>
          </div>
        ) : (
          <div className="h-[104px] flex items-center justify-center">
            <p className="text-green-600 font-medium animate-pulse">Menghubungkan ke perjalanan...</p>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-100 pb-safe">
        <div className="flex flex-col gap-3">
          <Button 
            label="Oke, Tunggu Driver" 
            fullWidth 
            className="bg-green-600 hover:bg-green-700" 
            onClick={() => navigate('/rider/trip/active')}
          />
          {timeLeft > 0 && (
            <Button 
              label="Batalkan" 
              variant="outlined" 
              className="border-danger text-danger hover:bg-red-50"
              onClick={() => setShowCancelModal(true)}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Batalkan Tumpangan?"
        footer={
          <>
            <Button label="Kembali" variant="ghost" onClick={() => setShowCancelModal(false)} />
            <Button label="Ya, Batalkan" variant="danger" onClick={handleCancel} />
          </>
        }
      >
        <p>Apakah kamu yakin ingin membatalkan tumpangan ini? Membatalkan berulang kali dapat mempengaruhi akunmu.</p>
      </Modal>
    </div>
  );
}
