import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { Car, User as UserIcon } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'driver') navigate('/driver/dashboard');
      if (user.role === 'rider') navigate('/rider/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-50 to-white -z-10"></div>
      
      <div className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">NEBENGIN</h1>
        <p className="text-gray-500 text-lg">Bareng ke kampus, lebih mudah.</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={() => navigate("/auth/driver")}
          className="w-full bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all active:scale-95 flex items-center justify-center group"
        >
          <h2 className="text-xl font-semibold text-gray-900">Driver</h2>
        </button>

        <button
          onClick={() => navigate("/auth/rider")}
          className="w-full bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-green-200 transition-all active:scale-95 flex items-center justify-center group"
        >
          <h2 className="text-xl font-semibold text-gray-900">Rider</h2>
        </button>
      </div>
    </div>
  );
}
