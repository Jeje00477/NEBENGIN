import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { searchRiders, confirmPickup, getDriverProfile } from '../../services/api';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import StarRating from '../../components/common/StarRating';
import Badge from '../../components/common/Badge';
import BottomSheet from '../../components/common/BottomSheet';
import { formatDistance, range } from '../../utils/helpers';

export default function DriverRiderList() {
  const navigate = useNavigate();
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRiders, setSelectedRiders] = useState([]);
  const [sheetRider, setSheetRider] = useState(null); // Rider obj for bottom sheet
  const [kapasitasKursi, setKapasitasKursi] = useState(3);

  const origin = JSON.parse(sessionStorage.getItem('driver_origin')) || {};
  const destination = JSON.parse(sessionStorage.getItem('driver_destination')) || {};

  useEffect(() => {
    async function loadRiders() {
      const [riderRes, profileRes] = await Promise.all([
        searchRiders({ 
          origin_lat: origin.lat, 
          origin_lng: origin.lng, 
          destination_lat: destination.lat, 
          destination_lng: destination.lng 
        }),
        getDriverProfile()
      ]);
      if (riderRes.data) setRiders(riderRes.data);
      if (profileRes.data?.vehicle?.kapasitas_kursi) {
        setKapasitasKursi(parseInt(profileRes.data.vehicle.kapasitas_kursi));
      }
      setLoading(false);
    }
    loadRiders();
  }, []);

  const toggleRider = (rider) => {
    if (selectedRiders.find(r => r.id === rider.id)) {
      setSelectedRiders(selectedRiders.filter(r => r.id !== rider.id));
    } else {
      if (selectedRiders.length < kapasitasKursi) {
        setSelectedRiders([...selectedRiders, rider]);
      }
    }
  };

  const handleConfirmPickup = async () => {
    await confirmPickup({ riderRequestIds: selectedRiders.map(r => r.id) });
    // Save selected riders to session for Active Trip
    sessionStorage.setItem('driver_active_riders', JSON.stringify(selectedRiders));
    navigate('/driver/trip/active');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      <div className="bg-white px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate('/driver/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold ml-2">Penumpang Searah</h1>
      </div>

      <div className="px-4 py-4">
        {loading ? (
          <>
            <div className="w-48 h-5 bg-gray-200 animate-pulse rounded mb-4"></div>
            {range(3).map(i => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 flex gap-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/3 mt-2"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </>
        ) : riders.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada penumpang</h2>
            <p className="text-gray-500 text-sm">Belum ada penumpang yang searah denganmu saat ini. Coba lagi nanti.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4 font-medium">Ditemukan {riders.length} penumpang yang searah denganmu.</p>
            {riders.map(rider => {
              const isSelected = !!selectedRiders.find(r => r.id === rider.id);
              return (
                <div key={rider.id} className={`bg-white p-4 rounded-2xl shadow-sm border transition-all mb-3 flex items-center gap-3 cursor-pointer ${isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-100'}`} onClick={() => setSheetRider(rider)}>
                  <Avatar src={rider.avatar_url} nama={rider.nama} size="md" />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{rider.nama}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      <StarRating value={rider.rating} size="sm" />
                      <span className="text-xs text-gray-500 font-medium">{rider.rating}</span>
                    </div>
                    <p className="text-xs text-gray-600 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {rider.lokasi_jemput_label}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge label={`Kecocokan ${Math.round(rider.direction_score * 100)}%`} variant="success" />
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">+{formatDistance(rider.extra_distance_m)} dari rute</span>
                    </div>
                  </div>

                  <div onClick={e => e.stopPropagation()}>
                    <Button 
                      label={isSelected ? "Dipilih ✓" : "Pilih"} 
                      variant={isSelected ? "primary" : "outlined"}
                      className={`text-sm px-3 py-1.5 h-auto ${isSelected ? 'bg-blue-600' : 'border-gray-300'}`}
                      onClick={() => toggleRider(rider)}
                      disabled={!isSelected && selectedRiders.length >= kapasitasKursi}
                    />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Floating Bottom Bar */}
      {selectedRiders.length > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 p-4 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-30 animate-in slide-in-from-bottom">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-gray-700">Kamu memilih <span className="font-bold text-blue-600">{selectedRiders.length}</span> penumpang</p>
            <p className="text-xs text-gray-500">Sisa kursi: {kapasitasKursi - selectedRiders.length}</p>
          </div>
          <Button label="Konfirmasi Penjemputan" fullWidth className="bg-blue-600" onClick={handleConfirmPickup} />
        </div>
      )}

      {/* Bottom Sheet for Rider Detail */}
      <BottomSheet isOpen={!!sheetRider} onClose={() => setSheetRider(null)} title="Detail Penumpang">
        {sheetRider && (
          <div className="flex flex-col items-center">
            <Avatar src={sheetRider.avatar_url} nama={sheetRider.nama} size="lg" className="mb-3" />
            <h2 className="text-xl font-bold text-gray-900">{sheetRider.nama}</h2>
            <div className="flex items-center gap-2 mb-6">
              <StarRating value={sheetRider.rating} size="sm" />
              <span className="text-sm font-medium">{sheetRider.rating}</span>
            </div>

            <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Kecocokan Rute</span>
                <span className="font-bold text-green-600">{Math.round(sheetRider.direction_score * 100)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tambahan Jarak</span>
                <span className="font-semibold text-gray-900">+{formatDistance(sheetRider.extra_distance_m)}</span>
              </div>
            </div>

            <div className="w-full relative pl-8 pb-4 border-l-2 border-dotted border-gray-300 ml-4 mb-6">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
              <p className="text-xs text-gray-500 font-semibold mb-1">Lokasi Jemput</p>
              <p className="text-sm font-medium">{sheetRider.lokasi_jemput_label}</p>
            </div>

            <Button 
              label={selectedRiders.find(r => r.id === sheetRider.id) ? "Batal Pilih" : "Pilih Penumpang Ini"} 
              fullWidth 
              variant={selectedRiders.find(r => r.id === sheetRider.id) ? "outlined" : "primary"}
              className={selectedRiders.find(r => r.id === sheetRider.id) ? "text-danger border-danger hover:bg-red-50" : "bg-blue-600"}
              onClick={() => { toggleRider(sheetRider); setSheetRider(null); }}
              disabled={!selectedRiders.find(r => r.id === sheetRider.id) && selectedRiders.length >= kapasitasKursi}
            />
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
