import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, Link, Outlet } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { TrainingPage } from './pages/TrainingPage';
import { AlbumPage } from './pages/AlbumPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

// Founder Panel imports
import { AuthProvider } from './founder/context/AuthContext';
import { ProtectedRoute } from './founder/components/ProtectedRoute';
import { FounderLayout } from './founder/components/FounderLayout';
import { LoginPage } from './founder/pages/LoginPage';
import { DashboardPage } from './founder/pages/DashboardPage';
import { StudentsPage } from './founder/pages/StudentsPage';
import { AttendancePage } from './founder/pages/AttendancePage';
import { FeesPage } from './founder/pages/FeesPage';
import { EnquiriesPage } from './founder/pages/EnquiriesPage';
import { AlbumPage as AlbumPageAdmin } from './founder/pages/AlbumPage';
import { ReviewsPage as ReviewsPageAdmin } from './founder/pages/ReviewsPage';
import { WebsiteContentPage } from './founder/pages/WebsiteContentPage';
import { ReportsPage } from './founder/pages/ReportsPage';
import { SettingsPage } from './founder/pages/SettingsPage';
import { ManageContactPage } from './founder/pages/ManageContactPage';

/**
 * ScrollToTop helper: scrolls window to top on every route change
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [pathname]);

  return null;
};

/**
 * Public Layout Wrapper (with shared Navbar & Footer)
 */
const PublicLayout: React.FC = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-amber-400 selection:text-slate-950">
    <ScrollToTop />
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

/**
 * 404 Not Found Page Component
 */
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen pt-36 pb-20 flex flex-col items-center justify-center px-4 text-center bg-slate-50">
    <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 mb-6 shadow-sm">
      <ShieldAlert className="w-8 h-8" />
    </div>
    <h1 className="text-6xl font-display uppercase tracking-tight text-slate-900 mb-2">
      404 — OFF THE PITCH
    </h1>
    <p className="text-slate-600 max-w-md mx-auto mb-8 text-sm">
      The requested page could not be found. Head back to the main academy training pitch.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 text-slate-950 font-heading uppercase font-bold text-sm hover:bg-amber-400 transition-colors shadow-sm"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Return to Home</span>
    </Link>
  </div>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={
              typeof window !== 'undefined' &&
              (window.location.hostname.startsWith('founder.') || window.location.hostname.startsWith('admin.')) ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <HomePage />
              )
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/album" element={<AlbumPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />
          <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
        </Route>

        {/* Dedicated Admin & Founder Login Pages */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/founder/login" element={<LoginPage />} />

        {/* Protected Admin Panel Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <FounderLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="enquiries" element={<EnquiriesPage />} />
          <Route path="album" element={<AlbumPageAdmin />} />
          <Route path="contact" element={<ManageContactPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="fees" element={<FeesPage />} />
          <Route path="reviews" element={<ReviewsPageAdmin />} />
          <Route path="website" element={<WebsiteContentPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Founder Alias Routes (Mirroring /admin/* for full backward compatibility) */}
        <Route
          path="/founder"
          element={
            <ProtectedRoute>
              <FounderLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="enquiries" element={<EnquiriesPage />} />
          <Route path="album" element={<AlbumPageAdmin />} />
          <Route path="contact" element={<ManageContactPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="fees" element={<FeesPage />} />
          <Route path="reviews" element={<ReviewsPageAdmin />} />
          <Route path="website" element={<WebsiteContentPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
