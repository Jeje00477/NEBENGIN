import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginUser, registerUser } from '../../services/api';
import { sanitizeInput, checkRateLimit } from '../../utils/helpers';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function DriverAuth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('masuk'); // 'masuk' or 'daftar'
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [nomorWa, setNomorWa] = useState('');

  const clearError = (field) => {
    setFieldErrors(prev => ({ ...prev, [field]: null }));
    setGeneralError('');
  };

  const validateLogin = () => {
    const errors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Email tidak valid";
    if (!password || password.length < 8) errors.password = "Password minimal 8 karakter";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    const rateLimit = checkRateLimit('login');
    if (!rateLimit.allowed) {
      setGeneralError(`Terlalu banyak percobaan. Coba lagi dalam ${rateLimit.waitSeconds} detik.`);
      return;
    }

    setLoading(true);
    setGeneralError('');
    
    const { data, error: apiError } = await loginUser({ 
      email: sanitizeInput(email), 
      password: sanitizeInput(password), 
      role: 'driver' 
    });
    
    setLoading(false);
    
    if (apiError) {
      setGeneralError(apiError);
    } else {
      login(data.user, data.token);
      navigate('/driver/dashboard');
    }
  };

  const validateRegister = () => {
    const errors = {};
    if (!nama || nama.length < 2 || nama.length > 100 || !/^[a-zA-Z\s.]+$/.test(nama)) {
      errors.nama = "Nama 2-100 karakter, hanya huruf, spasi, titik";
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Email tidak valid";
    }
    if (!nomorWa || !/^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(nomorWa)) {
      errors.nomorWa = "Nomor WhatsApp tidak valid";
    }
    if (!password || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      errors.password = "Min 8 karakter, ada huruf besar, kecil, dan angka";
    }
    if (password !== konfirmasiPassword) {
      errors.konfirmasiPassword = "Password tidak cocok";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    const rateLimit = checkRateLimit('register');
    if (!rateLimit.allowed) {
      setGeneralError(`Terlalu banyak percobaan. Coba lagi dalam ${rateLimit.waitSeconds} detik.`);
      return;
    }

    setLoading(true);
    setGeneralError('');

    const { data, error: apiError } = await registerUser({ 
      nama: sanitizeInput(nama), 
      email: sanitizeInput(email), 
      password: sanitizeInput(password), 
      role: 'driver', 
      nomor_wa: sanitizeInput(nomorWa) 
    });
    
    setLoading(false);

    if (apiError) {
      setGeneralError(apiError);
    } else {
      login(data.user, data.token);
      navigate('/driver/setup');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 py-4 flex items-center border-b border-gray-100">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold ml-2">Driver &mdash; Masuk atau Daftar</h1>
      </div>

      <div className="px-6 py-6 flex-1 flex flex-col">
        <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'masuk' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('masuk'); setGeneralError(''); setFieldErrors({}); }}
          >
            Masuk
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'daftar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('daftar'); setGeneralError(''); setFieldErrors({}); }}
          >
            Daftar
          </button>
        </div>

        {generalError && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-6 border border-red-100">{generalError}</div>}

        {activeTab === 'masuk' ? (
          <form onSubmit={handleLogin} className="space-y-4 flex-1">
            <Input label="Email" type="email" placeholder="contoh@student.ub.ac.id" value={email} onChange={e => {setEmail(e.target.value); clearError('email');}} error={fieldErrors.email} />
            <Input label="Password" type="password" placeholder="Masukkan password" value={password} onChange={e => {setPassword(e.target.value); clearError('password');}} error={fieldErrors.password} />
            
            <div className="pt-6">
              <Button label="Masuk sebagai Driver" type="submit" fullWidth loading={loading} className="bg-blue-600 hover:bg-blue-700" />
            </div>
            
            <div className="text-center mt-6">
              <button type="button" onClick={() => { setActiveTab('daftar'); setGeneralError(''); setFieldErrors({}); }} className="text-sm text-blue-600 font-semibold hover:underline">
                Belum punya akun? Daftar
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 flex-1">
            <Input label="Nama Lengkap" placeholder="Masukkan nama" value={nama} onChange={e => {setNama(e.target.value); clearError('nama');}} error={fieldErrors.nama} />
            <Input label="Email" type="email" placeholder="contoh@student.ub.ac.id" value={email} onChange={e => {setEmail(e.target.value); clearError('email');}} error={fieldErrors.email} />
            <Input label="Nomor WhatsApp" type="tel" placeholder="081234567890" value={nomorWa} onChange={e => {setNomorWa(e.target.value); clearError('nomorWa');}} hint="Nomor ini akan digunakan rider untuk menghubungi kamu" error={fieldErrors.nomorWa} />
            <Input label="Password" type="password" placeholder="Buat password" value={password} onChange={e => {setPassword(e.target.value); clearError('password');}} error={fieldErrors.password} />
            <Input label="Konfirmasi Password" type="password" placeholder="Ulangi password" value={konfirmasiPassword} onChange={e => {setKonfirmasiPassword(e.target.value); clearError('konfirmasiPassword');}} error={fieldErrors.konfirmasiPassword} />
            
            <div className="pt-6 pb-6">
              <Button label="Daftar sebagai Driver" type="submit" fullWidth loading={loading} className="bg-blue-600 hover:bg-blue-700" />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
