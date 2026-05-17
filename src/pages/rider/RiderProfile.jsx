import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMe, updateProfile } from '../../services/api';
import BottomNav from '../../components/common/BottomNav';
import Avatar from '../../components/common/Avatar';
import BottomSheet from '../../components/common/BottomSheet';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Edit2, Lock, LogOut, Repeat, ChevronRight } from 'lucide-react';

export default function RiderProfile() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showPassSheet, setShowPassSheet] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Edit form state
  const [editNama, setEditNama] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data } = await getMe();
      if (data) {
        setUser(data);
        setEditNama(data.nama);
      }
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
      <div className="bg-green-600 px-6 py-8 rounded-b-3xl shadow-md text-center">
        <div className="flex justify-center mb-4">
          <Avatar src={user?.avatar_url} nama={user?.nama} size="lg" className="border-4 border-white shadow-lg" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">{user?.nama}</h1>
        <p className="text-green-100">{user?.email}</p>
      </div>

      <div className="px-6 mt-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="font-semibold text-gray-900 px-5 pt-5 pb-2">Akun</h2>
          
          <button onClick={() => setShowEditSheet(true)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
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

      <BottomNav role="rider" active="profil" />

      {/* Edit Profile Sheet */}
      <BottomSheet isOpen={showEditSheet} onClose={() => setShowEditSheet(false)} title="Edit Profil">
        <div className="space-y-4">
          <Input label="Nama Lengkap" value={editNama} onChange={(e) => setEditNama(e.target.value)} />
          <div className="pt-4">
            <Button label="Simpan Perubahan" fullWidth onClick={handleSaveProfile} loading={saving} className="bg-green-600" />
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
            <Button label="Simpan Password" fullWidth onClick={() => setShowPassSheet(false)} className="bg-green-600" />
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
