import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { submitRating } from '../../services/api';
import Avatar from '../../components/common/Avatar';
import StarRating from '../../components/common/StarRating';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function RiderTripComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const driver = location.state?.driver;
  
  const [nilai, setNilai] = useState(5);
  const [komentar, setKomentar] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await submitRating({ 
      tripId: 501, 
      nilai, 
      komentar, 
      arah_rating: 'rider_to_driver' 
    });
    setLoading(false);
    navigate('/rider/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center pt-10">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sampai di Tujuan!</h1>
        <p className="text-gray-600 text-center mb-8">
          Semoga harimu di kampus menyenangkan.
        </p>

        {driver && (
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4 text-center">Beri Rating Driver</h2>
            
            <div className="flex flex-col items-center">
              <Avatar src={driver.avatar_url} nama={driver.nama} size="lg" className="mb-3" />
              <span className="font-medium text-lg text-gray-900 mb-6">{driver.nama}</span>
              
              <div className="flex justify-center mb-6">
                <StarRating 
                  size="lg" 
                  value={nilai} 
                  onChange={setNilai} 
                />
              </div>
              
              <Input 
                placeholder="Tulis ulasan singkat (opsional)" 
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 pb-safe">
        <Button 
          label="Kirim Rating dan Selesai" 
          fullWidth 
          className="bg-green-600 hover:bg-green-700" 
          loading={loading}
          onClick={handleSubmit} 
        />
      </div>
    </div>
  );
}
