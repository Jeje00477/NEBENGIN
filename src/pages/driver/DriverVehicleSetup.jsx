import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveDriverVehicle } from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Minus, Plus } from 'lucide-react';

export default function DriverVehicleSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [jenisKendaraan, setJenisKendaraan] = useState('Motor');
  const [merkKendaraan, setMerkKendaraan] = useState('');
  const [warnaKendaraan, setWarnaKendaraan] = useState('');
  const [nomorPolisi, setNomorPolisi] = useState('');
  const [kapasitasKursi, setKapasitasKursi] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      jenis_kendaraan: jenisKendaraan,
      merk_kendaraan: merkKendaraan,
      warna_kendaraan: warnaKendaraan,
      nomor_polisi: nomorPolisi.toUpperCase(),
      kapasitas_kursi: kapasitasKursi
    };

    await saveDriverVehicle(payload);
    setLoading(false);
    navigate('/driver/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-900">Data Kendaraan</h1>
        <p className="text-sm text-gray-500 mt-1">Lengkapi data kendaraan sebelum mulai mencari penumpang.</p>
      </div>

      <div className="flex-1 px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Jenis Kendaraan</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setJenisKendaraan('Motor')}
                className={`py-3 rounded-xl border-2 font-medium transition-colors ${jenisKendaraan === 'Motor' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600'}`}
              >
                Motor
              </button>
              <button
                type="button"
                onClick={() => setJenisKendaraan('Mobil')}
                className={`py-3 rounded-xl border-2 font-medium transition-colors ${jenisKendaraan === 'Mobil' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600'}`}
              >
                Mobil
              </button>
            </div>
          </div>

          <Input label="Merk Kendaraan" placeholder="Ketik merk kendaraan..." value={merkKendaraan} onChange={e => setMerkKendaraan(e.target.value)} required />
          <Input label="Warna Kendaraan" placeholder="Ketik warna kendaraan..." value={warnaKendaraan} onChange={e => setWarnaKendaraan(e.target.value)} required />
          <Input label="Nomor Polisi" placeholder="cth. N 1234 AB" value={nomorPolisi} onChange={e => setNomorPolisi(e.target.value.toUpperCase())} className="uppercase" required />

          <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
            <div>
              <p className="font-medium text-gray-900">Kapasitas Penumpang</p>
              <p className="text-xs text-gray-500">Selain kamu sebagai driver</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setKapasitasKursi(Math.max(1, kapasitasKursi - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 disabled:opacity-50"
                disabled={kapasitasKursi <= 1}
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-lg font-semibold w-4 text-center">{kapasitasKursi}</span>
              <button
                type="button"
                onClick={() => setKapasitasKursi(Math.min(6, kapasitasKursi + 1))}
                className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 disabled:opacity-50"
                disabled={kapasitasKursi >= 6}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="pt-4 pb-8">
            <Button label="Simpan dan Mulai" type="submit" fullWidth loading={loading} className="bg-blue-600 hover:bg-blue-700" />
          </div>
        </form>
      </div>
    </div>
  );
}
