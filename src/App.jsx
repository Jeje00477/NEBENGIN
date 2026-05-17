import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Welcome from './pages/Welcome';
import DriverAuth from './pages/auth/DriverAuth';
import RiderAuth from './pages/auth/RiderAuth';

// Driver Pages
import DriverVehicleSetup from './pages/driver/DriverVehicleSetup';
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverSetOriginMap from './pages/driver/DriverSetOriginMap';
import DriverSetDestinationMap from './pages/driver/DriverSetDestinationMap';
import DriverRiderList from './pages/driver/DriverRiderList';
import DriverActiveTrip from './pages/driver/DriverActiveTrip';
import DriverTripComplete from './pages/driver/DriverTripComplete';
import DriverHistory from './pages/driver/DriverHistory';
import DriverHistoryDetail from './pages/driver/DriverHistoryDetail';
import DriverProfile from './pages/driver/DriverProfile';

// Rider Pages
import RiderDashboard from './pages/rider/RiderDashboard';
import RiderSetPickupMap from './pages/rider/RiderSetPickupMap';
import RiderSetDestinationMap from './pages/rider/RiderSetDestinationMap';
import RiderWaiting from './pages/rider/RiderWaiting';
import RiderDriverFound from './pages/rider/RiderDriverFound';
import RiderNoDriverFound from './pages/rider/RiderNoDriverFound';
import RiderActiveTrip from './pages/rider/RiderActiveTrip';
import RiderTripComplete from './pages/rider/RiderTripComplete';
import RiderHistory from './pages/rider/RiderHistory';
import RiderHistoryDetail from './pages/rider/RiderHistoryDetail';
import RiderProfile from './pages/rider/RiderProfile';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="mx-auto max-w-[430px] min-h-screen bg-white shadow-xl relative overflow-hidden">
      <Routes>
        <Route path="/" element={<Welcome />} />
        
        {/* Auth Routes */}
        <Route path="/auth/driver" element={<DriverAuth />} />
        <Route path="/auth/rider" element={<RiderAuth />} />

        {/* Driver Protected Routes */}
        <Route path="/driver/setup" element={<ProtectedRoute requiredRole="driver"><DriverVehicleSetup /></ProtectedRoute>} />
        <Route path="/driver/dashboard" element={<ProtectedRoute requiredRole="driver"><DriverDashboard /></ProtectedRoute>} />
        <Route path="/driver/set-origin" element={<ProtectedRoute requiredRole="driver"><DriverSetOriginMap /></ProtectedRoute>} />
        <Route path="/driver/set-destination" element={<ProtectedRoute requiredRole="driver"><DriverSetDestinationMap /></ProtectedRoute>} />
        <Route path="/driver/riders" element={<ProtectedRoute requiredRole="driver"><DriverRiderList /></ProtectedRoute>} />
        <Route path="/driver/trip/active" element={<ProtectedRoute requiredRole="driver"><DriverActiveTrip /></ProtectedRoute>} />
        <Route path="/driver/trip/complete" element={<ProtectedRoute requiredRole="driver"><DriverTripComplete /></ProtectedRoute>} />
        <Route path="/driver/history" element={<ProtectedRoute requiredRole="driver"><DriverHistory /></ProtectedRoute>} />
        <Route path="/driver/history/:tripId" element={<ProtectedRoute requiredRole="driver"><DriverHistoryDetail /></ProtectedRoute>} />
        <Route path="/driver/profile" element={<ProtectedRoute requiredRole="driver"><DriverProfile /></ProtectedRoute>} />

        {/* Rider Protected Routes */}
        <Route path="/rider/dashboard" element={<ProtectedRoute requiredRole="rider"><RiderDashboard /></ProtectedRoute>} />
        <Route path="/rider/set-pickup" element={<ProtectedRoute requiredRole="rider"><RiderSetPickupMap /></ProtectedRoute>} />
        <Route path="/rider/set-destination" element={<ProtectedRoute requiredRole="rider"><RiderSetDestinationMap /></ProtectedRoute>} />
        <Route path="/rider/waiting" element={<ProtectedRoute requiredRole="rider"><RiderWaiting /></ProtectedRoute>} />
        <Route path="/rider/driver-found" element={<ProtectedRoute requiredRole="rider"><RiderDriverFound /></ProtectedRoute>} />
        <Route path="/rider/no-driver" element={<ProtectedRoute requiredRole="rider"><RiderNoDriverFound /></ProtectedRoute>} />
        <Route path="/rider/trip/active" element={<ProtectedRoute requiredRole="rider"><RiderActiveTrip /></ProtectedRoute>} />
        <Route path="/rider/trip/complete" element={<ProtectedRoute requiredRole="rider"><RiderTripComplete /></ProtectedRoute>} />
        <Route path="/rider/history" element={<ProtectedRoute requiredRole="rider"><RiderHistory /></ProtectedRoute>} />
        <Route path="/rider/history/:tripId" element={<ProtectedRoute requiredRole="rider"><RiderHistoryDetail /></ProtectedRoute>} />
        <Route path="/rider/profile" element={<ProtectedRoute requiredRole="rider"><RiderProfile /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
