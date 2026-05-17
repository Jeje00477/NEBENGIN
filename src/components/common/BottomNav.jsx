import { Home, Navigation, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BottomNav({ role, active }) {
  const navigate = useNavigate();
  const themeColor = role === 'driver' ? 'text-blue-600' : 'text-green-600';

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home, path: `/${role}/dashboard` },
    { id: 'perjalanan', label: 'Perjalanan', icon: Navigation, path: `/${role}/trip/active` },
    { id: 'riwayat', label: 'Riwayat', icon: Clock, path: `/${role}/history` },
    { id: 'profil', label: 'Profil', icon: User, path: `/${role}/profile` },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1 min-w-[64px]"
          >
            <div className={`p-1.5 rounded-xl transition-colors ${isActive ? (role === 'driver' ? 'bg-blue-50' : 'bg-green-50') : ''}`}>
              <Icon className={`w-6 h-6 ${isActive ? themeColor : 'text-gray-400'}`} />
            </div>
            <span className={`text-[10px] font-medium ${isActive ? themeColor : 'text-gray-400'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
