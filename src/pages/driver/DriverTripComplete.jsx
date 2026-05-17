import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { submitRating } from '../../services/api';
import Avatar from '../../components/common/Avatar';
import StarRating from '../../components/common/StarRating';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function DriverTripComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const riders = location.state?.riders || [];
  
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);

  const handleRatingChange = (riderId, field, value) => {
    setRatings(prev => ({
      ...prev,
      [riderId]: { ...prev[riderId], [field]: value }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Submit all ratings
    for (const rider of riders) {
      const ratingData = ratings[rider.id] || { nilai: 5, komentar: '' }; // default 5 star if untouched
      await submitRating({ 
        tripId: 501, 
        nilai: ratingData.nilai || 5, 
        komentar: ratingData.komentar || '', 
        arah_rating: 'driver_to_rider' 
      });
    }
    setLoading(false);
    navigate('/driver/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center pt-10">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Perjalanan Selesai!</h1>
        <p className="text-gray-600 text-center mb-8">
          Kamu telah berhasil mengantar {riders.length} penumpang ke tujuan.
        </p>

        {riders.length > 0 && (
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">Beri Rating Penumpang</h2>
            
            <div className="space-y-6">
              {riders.map(rider => (
                <div key={rider.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar src={rider.avatar_url} nama={rider.nama} size="sm" />
                    <span className="font-medium text-sm text-gray-900">{rider.nama}</span>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <StarRating 
                      size="lg" 
                      value={ratings[rider.id]?.nilai || 0} 
                      onChange={(val) => handleRatingChange(rider.id, 'nilai', val)} 
                    />
                  </div>
                  
                  <Input 
                    placeholder="Tulis ulasan singkat (opsional)" 
                    value={ratings[rider.id]?.komentar || ''}
                    onChange={(e) => handleRatingChange(rider.id, 'komentar', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 pb-safe">
        <Button 
          label="Kirim Rating dan Selesai" 
          fullWidth 
          className="bg-blue-600 hover:bg-blue-700" 
          loading={loading}
          onClick={handleSubmit} 
        />
      </div>
    </div>
  );
}
