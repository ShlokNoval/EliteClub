import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/common/Toast';
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/common/ProtectedRoute';
import BackToTop from './components/common/BackToTop';
import { Analytics } from '@vercel/analytics/react';

// Layouts (Lazy)
const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));

// Public (Lazy)
const HomePage = lazy(() => import('./pages/public/HomePage'));
const ScanPage = lazy(() => import('./pages/public/ScanPage'));

// Auth (Lazy)
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const HotelLoginPage = lazy(() => import('./pages/auth/HotelLoginPage'));
const AdminLoginPage = lazy(() => import('./pages/auth/AdminLoginPage'));
const HotelRegisterPage = lazy(() => import('./pages/auth/HotelRegisterPage'));

// User (Lazy)
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));

// Admin (Lazy)
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminHotels = lazy(() => import('./pages/admin/AdminHotels'));
const AdminCards = lazy(() => import('./pages/admin/AdminCards'));
const AdminBills = lazy(() => import('./pages/admin/AdminBills'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminApprovals = lazy(() => import('./pages/admin/AdminApprovals'));

// Hotel (Lazy)
const HotelOverview = lazy(() => import('./pages/hotel/HotelOverview'));
const HotelScanner = lazy(() => import('./pages/hotel/HotelScanner'));
const HotelScans = lazy(() => import('./pages/hotel/HotelScans'));
const HotelBillUpload = lazy(() => import('./pages/hotel/HotelBillUpload'));
const HotelVisits = lazy(() => import('./pages/hotel/HotelVisits'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<LoadingScreen />}>
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
                  <Route path="/admin/approvals" element={<AdminApprovals />} />
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
          </Suspense>
          <BackToTop />
          <Analytics />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
