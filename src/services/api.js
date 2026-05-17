import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nebengin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-handle 401 (token expired) — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nebengin_token');
      localStorage.removeItem('nebengin_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function registerUser(data) {
  try {
    const response = await api.post('/auth/register', data);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Terjadi kesalahan saat registrasi' };
  }
}

export async function loginUser(data) {
  try {
    const response = await api.post('/auth/login', data);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Email atau password salah' };
  }
}

export async function logoutUser() {
  try {
    const response = await api.post('/auth/logout');
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal logout' };
  }
}

export async function getMe() {
  try {
    const response = await api.get('/auth/me');
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'User tidak ditemukan' };
  }
}

export async function updateProfile(data) {
  try {
    const response = await api.put('/users/profile', data);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal update profil' };
  }
}

// ─── DRIVER ──────────────────────────────────────────────────────────────────

export async function saveDriverVehicle(vehicleData) {
  try {
    const response = await api.put('/driver/vehicle', vehicleData);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal menyimpan kendaraan' };
  }
}

export async function getDriverProfile() {
  try {
    const response = await api.get('/driver/profile');
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal mengambil profil driver' };
  }
}

export async function toggleDriverAvailability() {
  try {
    const response = await api.post('/driver/toggle-availability');
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal mengubah status' };
  }
}

export async function searchRiders(params) {
  try {
    const response = await api.get('/driver/search-riders', { params });
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal mencari penumpang' };
  }
}

export async function confirmPickup({ riderRequestIds }) {
  try {
    const response = await api.post('/driver/confirm-pickup', { riderRequestIds });
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal mengonfirmasi pickup' };
  }
}

export async function markRiderPickedUp({ tripId }) {
  try {
    const response = await api.post(`/trips/${tripId}/pickup`);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal update status' };
  }
}

export async function completeTrip({ tripId }) {
  try {
    const response = await api.post(`/trips/${tripId}/complete`);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal menyelesaikan trip' };
  }
}

export async function getDriverHistory() {
  try {
    const response = await api.get('/driver/history');
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal mengambil history' };
  }
}

export async function getDriverTripDetail({ tripId }) {
  try {
    const response = await api.get(`/trips/${tripId}`);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal mengambil detail trip' };
  }
}

// ─── RIDER ───────────────────────────────────────────────────────────────────

export async function createRiderRequest(data) {
  try {
    const response = await api.post('/rider/requests', data);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal membuat permintaan' };
  }
}

export async function pollRiderRequestStatus() {
  try {
    const response = await api.get('/rider/requests/status');
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal mengecek status' };
  }
}

export async function cancelRiderRequest({ requestId }) {
  try {
    const response = await api.post(`/rider/requests/${requestId}/cancel`);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal membatalkan permintaan' };
  }
}

export async function cancelMatchByRider({ matchId }) {
  return cancelRiderRequest({ requestId: matchId });
}

export async function getRiderActiveTrip() {
  try {
    const response = await api.get('/rider/trips/active');
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal mengambil trip aktif' };
  }
}

export async function completeRiderTrip({ tripId }) {
  return completeTrip({ tripId });
}

export async function getRiderHistory() {
  try {
    const response = await api.get('/rider/history');
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal mengambil history' };
  }
}

export async function getRiderTripDetail({ tripId }) {
  try {
    const response = await api.get(`/trips/${tripId}`);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal mengambil detail trip' };
  }
}

export async function submitRating({ tripId, nilai, komentar, arah_rating }) {
  try {
    const response = await api.post(`/trips/${tripId}/rating`, { nilai, komentar, arah_rating });
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.message || 'Gagal mengirim rating' };
  }
}
