import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRiderHistory } from '../../services/api';
import BottomNav from '../../components/common/BottomNav';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/helpers';
import { Calendar, User, Star } from 'lucide-react';

export default function RiderHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');

  useEffect(() => {
    async function loadHistory() {
      const { data } = await getRiderHistory();
      if (data) setHistory(data);
      setLoading(false);
    }
    loadHistory();
  }, []);

  const filteredHistory = history.filter(item => {
    if (filter === 'Semua') return true;
    return item.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Riwayat Tumpangan</h1>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['Semua', 'Selesai', 'Dibatalkan'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-32 animate-pulse"></div>
          ))
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Belum ada riwayat tumpangan.</p>
          </div>
        ) : (
          filteredHistory.map(item => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/rider/history/${item.id}`)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{formatDate(item.date)}</p>
                  <p className="font-semibold text-gray-900">{item.route_label}</p>
                </div>
                <Badge 
                  label={item.status.toUpperCase()} 
                  variant={item.status === 'selesai' ? 'success' : 'danger'} 
                />
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t border-gray-50 mt-2">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{item.driver_name}</span>
                </div>
                {item.rating_given && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-gray-900">{item.rating_given}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav role="rider" active="riwayat" />
    </div>
  );
}
