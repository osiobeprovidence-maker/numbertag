
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import HowItWorks from './pages/HowItWorks';
import IndividualTags from './pages/IndividualTags';
import BusinessAPI from './pages/BusinessAPI';
import Pricing from './pages/Pricing';
import PrivacyProtocol from './pages/PrivacyProtocol';
import TermsOfIntent from './pages/TermsOfIntent';
import Security from './pages/Security';
import Governance from './pages/Governance';
import Philosophy from './pages/Philosophy';
import CreateTag from './pages/CreateTag';
import EditTag from './pages/EditTag';
import TopUp from './pages/TopUp';
import AdminDashboard from './pages/AdminDashboard';
import TransactionHistory from './pages/TransactionHistory';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtocolLoader from './components/ProtocolLoader';
import PageWrapper from './components/PageWrapper';

// Helper component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ResponsiveFooter: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  const location = useLocation();
  const path = location.pathname;

  if (isAuthenticated) return null;

  const visibleRoutes = [
    '/',
    '/how-it-works',
    '/pricing',
    '/philosophy',
    '/individual-tags',
    '/business-api',
    '/privacy-protocol',
    '/terms-of-intent',
    '/security',
    '/governance'
  ];

  const shouldShow = visibleRoutes.includes(path);
  if (shouldShow) return <Footer />;
  return null;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem('nt_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }

    // Play global loader sequence
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('nt_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('nt_auth');
    localStorage.removeItem('nt_user_email');
    localStorage.removeItem('nt_coins');
  };

  if (isAppLoading) {
    return <ProtocolLoader />;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Header onLogout={handleLogout} isAuthenticated={isAuthenticated} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login onLogin={handleLogin} /></PageWrapper>} />
            <Route path="/forgot-password" element={<PageWrapper><ForgotPassword onLogin={handleLogin} /></PageWrapper>} />
            <Route path="/join" element={<PageWrapper><Onboarding onComplete={handleLogin} /></PageWrapper>} />

            <Route
              path="/dashboard"
              element={isAuthenticated ? <PageWrapper><Dashboard /></PageWrapper> : <Navigate to="/login" />}
            />

            <Route path="/create-tag" element={isAuthenticated ? <PageWrapper><CreateTag /></PageWrapper> : <Navigate to="/login" />} />
            <Route path="/edit-tag/:id" element={isAuthenticated ? <PageWrapper><EditTag /></PageWrapper> : <Navigate to="/login" />} />
            <Route path="/top-up" element={isAuthenticated ? <PageWrapper><TopUp /></PageWrapper> : <Navigate to="/login" />} />
            <Route path="/transaction-history" element={isAuthenticated ? <PageWrapper><TransactionHistory /></PageWrapper> : <Navigate to="/login" />} />

            <Route path="/admin-portal" element={<PageWrapper><AdminDashboard /></PageWrapper>} />

            <Route path="/how-it-works" element={<PageWrapper><HowItWorks /></PageWrapper>} />
            <Route path="/individual-tags" element={<PageWrapper><IndividualTags /></PageWrapper>} />
            <Route path="/business-api" element={<PageWrapper><BusinessAPI /></PageWrapper>} />
            <Route path="/pricing" element={<PageWrapper><Pricing /></PageWrapper>} />

            <Route path="/privacy-protocol" element={<PageWrapper><PrivacyProtocol /></PageWrapper>} />
            <Route path="/terms-of-intent" element={<PageWrapper><TermsOfIntent /></PageWrapper>} />
            <Route path="/security" element={<PageWrapper><Security /></PageWrapper>} />
            <Route path="/governance" element={<PageWrapper><Governance /></PageWrapper>} />
            <Route path="/philosophy" element={<PageWrapper><Philosophy /></PageWrapper>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <ResponsiveFooter isAuthenticated={isAuthenticated} />
      </div>
    </Router>
  );
};

export default App;
