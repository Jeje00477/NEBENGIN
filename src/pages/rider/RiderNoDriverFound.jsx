import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

export default function RiderNoDriverFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 items-center justify-center">
      <div className="w-48 h-48 mb-8 flex items-center justify-center">
        {/* Simple SVG Illustration placeholder */}
        <svg viewBox="0 0 200 200" className="w-full h-full text-gray-200">
          <path fill="currentColor" d="M100 10C50.294 10 10 50.294 10 100s40.294 90 90 90 90-40.294 90-90S149.706 10 100 10zm0 160c-38.598 0-70-31.402-70-70s31.402-70 70-70 70 31.402 70 70-31.402 70-70 70z" />
          <path fill="#9ca3af" d="M127.054 62.946a4.98 4.98 0 00-7.054 0L100 82.946l-20-20a4.98 4.98 0 00-7.054 0 5 5 0 000 7.054l20 20-20 20a5 5 0 000 7.054c.974.973 2.253 1.46 3.527 1.46s2.553-.487 3.527-1.46l20-20 20 20c.974.973 2.253 1.46 3.527 1.46s2.553-.487 3.527-1.46a5 5 0 000-7.054l-20-20 20-20a5.001 5.001 0 000-7.054z" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">Belum ada driver tersedia</h2>
      <p className="text-gray-500 text-center mb-10 leading-relaxed">
        Belum ada driver yang cocok dengan rutemu saat ini. Pertimbangkan untuk memesan ojek atau taksi online terlebih dahulu.
      </p>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <Button 
          label="Coba Lagi" 
          fullWidth 
          className="bg-green-600 hover:bg-green-700" 
          onClick={() => navigate('/rider/waiting')}
        />
        <Button 
          label="Kembali ke Beranda" 
          variant="outlined" 
          fullWidth 
          className="border-gray-300 text-gray-700" 
          onClick={() => navigate('/rider/dashboard')}
        />
      </div>
    </div>
  );
}
