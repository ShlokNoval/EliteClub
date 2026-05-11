import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import BackToTop from './components/common/BackToTop';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public
import HomePage from './pages/public/HomePage';
import ScanPage from './pages/public/ScanPage';

// Auth
import LoginPage from './pages/auth/LoginPage';
import HotelLoginPage from './pages/auth/HotelLoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import HotelRegisterPage from './pages/auth/HotelRegisterPage';

// User
import UserDashboard from './pages/user/UserDashboard';

// Admin
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminHotels from './pages/admin/AdminHotels';
import AdminCards from './pages/admin/AdminCards';
import AdminBills from './pages/admin/AdminBills';
import AdminReports from './pages/admin/AdminReports';
import AdminMessages from './pages/admin/AdminMessages';

// Hotel
import HotelOverview from './pages/hotel/HotelOverview';
import HotelScanner from './pages/hotel/HotelScanner';
import HotelScans from './pages/hotel/HotelScans';
import HotelBillUpload from './pages/hotel/HotelBillUpload';
import HotelVisits from './pages/hotel/HotelVisits';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
              </Route>

              {/* QR Scan Landing (public) */}
              <Route path="/scan/:cardId" element={<ScanPage />} />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/hotel-login" element={<HotelLoginPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/hotel-register" element={<HotelRegisterPage />} />

              {/* Member Dashboard (protected) */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['member']}>
                  <UserDashboard />
                </ProtectedRoute>
              } />

              {/* Admin Dashboard (protected) */}
              <Route element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout type="admin" />
                </ProtectedRoute>
              }>
                <Route path="/admin" element={<AdminOverview />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/hotels" element={<AdminHotels />} />
                <Route path="/admin/cards" element={<AdminCards />} />
                <Route path="/admin/bills" element={<AdminBills />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
              </Route>

              {/* Hotel Dashboard (protected) */}
              <Route element={
                <ProtectedRoute allowedRoles={['hotel']}>
                  <DashboardLayout type="hotel" />
                </ProtectedRoute>
              }>
                <Route path="/hotel" element={<HotelOverview />} />
                <Route path="/hotel/scanner" element={<HotelScanner />} />
                <Route path="/hotel/scans" element={<HotelScans />} />
                <Route path="/hotel/bills" element={<HotelBillUpload />} />
                <Route path="/hotel/visits" element={<HotelVisits />} />
              </Route>
            </Routes>
          </AnimatePresence>
          <BackToTop />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
