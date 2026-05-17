import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDriverProfile, getMe, updateProfile } from '../../services/api';
import BottomNav from '../../components/common/BottomNav';
import Avatar from '../../components/common/Avatar';
import StarRating from '../../components/common/StarRating';
import BottomSheet from '../../components/common/BottomSheet';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Edit2, Lock, LogOut, Repeat, Car, ChevronRight } from 'lucide-react';

export default function DriverProfile() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showPassSheet, setShowPassSheet] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Edit form state
  const [editNama, setEditNama] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [driverRes, meRes] = await Promise.all([getDriverProfile(), getMe()]);
      if (driverRes.data) setProfile(driverRes.data);
      if (meRes.data) setUser(meRes.data);
      setEditNama(meRes.data?.nama || '');
      setLoading(false);
    }
    loadData();
  }, [setUser]);

  const handleSaveProfile = async () => {
    setSaving(true);
    const { data } = await updateProfile({ nama: editNama, avatar_url: user?.avatar_url, nomor_wa: user?.nomor_wa });
    if (data) setUser(data);
    setSaving(false);
    setShowEditSheet(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="min-h-screen bg-gray-50"></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-600 px-6 py-8 rounded-b-3xl shadow-md text-center">
        <div className="flex justify-center mb-4">
          <Avatar src={user?.avatar_url} nama={user?.nama} size="lg" className="border-4 border-white shadow-lg" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">{user?.nama}</h1>
        <p className="text-blue-100 mb-4">{user?.email}</p>
        
        <div className="flex justify-center items-center gap-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 w-max mx-auto">
          <div className="text-center">
            <div className="flex items-center gap-1 mb-1">
              <StarRating value={profile?.stats?.rating || 0} size="sm" />
            </div>
            <p className="text-xs text-white font-medium">{profile?.stats?.rating || 0} Rating</p>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <p className="text-lg font-bold text-white leading-none mb-1">{profile?.stats?.total_trips || 0}</p>
            <p className="text-xs text-white font-medium">Perjalanan</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Kendaraan Saya</h2>
            <button onClick={() => navigate('/driver/setup')} className="text-blue-600 text-sm font-semibold hover:underline">Edit</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{profile?.vehicle?.merk_kendaraan}</p>
              <p className="text-sm text-gray-500">{profile?.vehicle?.nomor_polisi} &middot; {profile?.vehicle?.warna_kendaraan}</p>
              <p className="text-xs text-gray-400 mt-0.5">Kapasitas: {profile?.vehicle?.kapasitas_kursi} kursi</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="font-semibold text-gray-900 px-5 pt-5 pb-2">Akun</h2>
          
          <button onClick={() => setShowEditSheet(true)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Edit2 className="w-4 h-4" />
              </div>
              <span className="font-medium text-gray-800">Edit Profil</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button onClick={() => setShowPassSheet(true)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <Lock className="w-4 h-4" />
              </div>
              <span className="font-medium text-gray-800">Ganti Password</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>



          <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center justify-between p-5 hover:bg-red-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-medium text-red-600">Keluar</span>
            </div>
          </button>
        </div>
      </div>

      <BottomNav role="driver" active="profil" />

      {/* Edit Profile Sheet */}
      <BottomSheet isOpen={showEditSheet} onClose={() => setShowEditSheet(false)} title="Edit Profil">
        <div className="space-y-4">
          <Input label="Nama Lengkap" value={editNama} onChange={(e) => setEditNama(e.target.value)} />
          <div className="pt-4">
            <Button label="Simpan Perubahan" fullWidth onClick={handleSaveProfile} loading={saving} className="bg-blue-600" />
          </div>
        </div>
      </BottomSheet>

      {/* Change Password Sheet (Cosmetic) */}
      <BottomSheet isOpen={showPassSheet} onClose={() => setShowPassSheet(false)} title="Ganti Password">
        <div className="space-y-4">
          <Input label="Password Lama" type="password" />
          <Input label="Password Baru" type="password" />
          <Input label="Konfirmasi Password Baru" type="password" />
          <div className="pt-4">
            <Button label="Simpan Password" fullWidth onClick={() => setShowPassSheet(false)} className="bg-blue-600" />
          </div>
        </div>
      </BottomSheet>

      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Keluar dari Akun?"
        footer={
          <>
            <Button label="Batal" variant="ghost" onClick={() => setShowLogoutModal(false)} />
            <Button label="Ya, Keluar" variant="danger" onClick={handleLogout} />
          </>
        }
      >
        <p>Apakah kamu yakin ingin keluar? Sesi aktifmu akan diakhiri.</p>
      </Modal>
    </div>
  );
}
