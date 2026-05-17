import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getDriverTripDetail } from '../../services/api';
import MapDisplay from '../../components/common/MapDisplay';
import Avatar from '../../components/common/Avatar';
import StarRating from '../../components/common/StarRating';
import { formatDate } from '../../utils/helpers';

export default function DriverHistoryDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      const { data } = await getDriverTripDetail({ tripId });
      if (data) setDetail(data);
      setLoading(false);
    }
    loadDetail();
  }, [tripId]);

  if (loading) return <div className="min-h-screen bg-gray-50"></div>;
  if (!detail) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Data tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-10">
      <div className="bg-white px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate('/driver/history')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold ml-2">Detail Perjalanan</h1>
      </div>

      <MapDisplay height="200px" />

      <div className="px-6 py-6 -mt-4 relative z-10 space-y-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">{formatDate(detail.date)}</p>
          <p className="font-bold text-gray-900 text-lg mb-4">{detail.route_label}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Penumpang</h2>
          <div className="space-y-4">
            {detail.riders.map((rider, idx) => (
              <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Avatar src={rider.avatar_url} nama={rider.nama} size="sm" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">{rider.nama}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Rating kamu:</span>
                      <StarRating value={rider.rating_received} size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
