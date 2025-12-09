import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Encyclopedia from './pages/Encyclopedia';
import Matrix from './pages/Matrix';
import Nutrition from './pages/Nutrition';
import Routines from './pages/Routines';
import MobileNavbar from './components/layout/MobileNavbar';

// Layout Shell with Sidebar & Mobile Nav
const Layout = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden relative bg-background">
            {/* Desktop Sidebar (Hidden on Mobile) */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <main className="flex-1 overflow-y-auto relative pb-24 md:pb-8 w-full">
                {children}
                {/* Global Footer */}
                <div className="py-6 text-center">
                    <p className="text-white/20 text-xs font-mono uppercase tracking-widest">
                        Creado Por Juan Carlos Alvarado
                    </p>
                </div>
            </main>

            {/* Mobile Bottom Nav (Hidden on Desktop) */}
            <MobileNavbar />
        </div>
    );
};

// Route Guard: Require Authentication & Onboarding Check
const RequireAuth = ({ children }) => {
    const { user } = useUser();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect new users to onboarding
    if (user.isNew && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    return children;
};

// Route Guard: Require Admin Role
const RequireAdmin = ({ children }) => {
    const { user } = useUser();
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin-login" element={<Navigate to="/login" replace />} />

                    {/* Onboarding & AI Camera - Full Screen (No Sidebar) */}
                    <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
                    <Route path="/scan" element={<RequireAuth><AICamera /></RequireAuth>} />

                    {/* Protected User Routes (Wrapped in Layout) */}
                    <Route path="/" element={<RequireAuth><Layout><Dashboard /></Layout></RequireAuth>} />
                    <Route path="/encyclopedia" element={<RequireAuth><Layout><Encyclopedia /></Layout></RequireAuth>} />
                    <Route path="/matrix" element={<RequireAuth><Layout><Matrix /></Layout></RequireAuth>} />
                    <Route path="/nutrition" element={<RequireAuth><Layout><Nutrition /></Layout></RequireAuth>} />
                    <Route path="/routines" element={<RequireAuth><Layout><Routines /></Layout></RequireAuth>} />
                    <Route path="/profile" element={<RequireAuth><Layout><Profile /></Layout></RequireAuth>} />

                    {/* Protected Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <RequireAdmin>
                                <Layout><AdminPanel /></Layout>
                            </RequireAdmin>
                        }
                    />

                    {/* Catch-all redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {/* Global Overlays */}
                <LevelUpOverlay />
            </Router>
        </UserProvider>
    );
}

export default App;
