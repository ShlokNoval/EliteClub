import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import BackToTop from './components/common/BackToTop';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public
import HomePage from './pages/public/HomePage';

// Auth
import LoginPage from './pages/auth/LoginPage';
import HotelLoginPage from './pages/auth/HotelLoginPage';

// User
import UserDashboard from './pages/user/UserDashboard';

// Admin
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminHotels from './pages/admin/AdminHotels';
import AdminCards from './pages/admin/AdminCards';

// Hotel
import HotelOverview from './pages/hotel/HotelOverview';
import HotelScanner from './pages/hotel/HotelScanner';
import HotelScans from './pages/hotel/HotelScans';

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/hotel-login" element={<HotelLoginPage />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Admin Dashboard */}
          <Route element={<DashboardLayout type="admin" />}>
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/hotels" element={<AdminHotels />} />
            <Route path="/admin/cards" element={<AdminCards />} />
          </Route>

          {/* Hotel Dashboard */}
          <Route element={<DashboardLayout type="hotel" />}>
            <Route path="/hotel" element={<HotelOverview />} />
            <Route path="/hotel/scanner" element={<HotelScanner />} />
            <Route path="/hotel/scans" element={<HotelScans />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <BackToTop />
    </BrowserRouter>
  );
}

export default App;
