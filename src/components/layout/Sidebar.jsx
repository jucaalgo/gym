import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutGrid,
    BookOpen,
    Target,
    Camera,
    Trophy,
    Settings,
    LogOut,
    Shield,
    Zap
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// ANTIGRAVITY - PREMIUM SIDEBAR
// Glassmorphism Navigation with Neon Accents
// ═══════════════════════════════════════════════════════════════

const navItems = [
    { to: '/', icon: LayoutGrid, label: 'Dashboard' },
    { to: '/encyclopedia', icon: BookOpen, label: 'Encyclopedia' },
    { to: '/matrix', icon: Target, label: 'The Matrix' },
    { to: '/nutrition', icon: Camera, label: 'Snap & Track' },
    { to: '/routines', icon: Trophy, label: 'Routines' },
    { to: '/profile', icon: Settings, label: 'Profile' },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem('antigravity_admin') === 'true';

    const handleLogout = () => {
        localStorage.removeItem('antigravity_admin');
        navigate('/');
    };

    return (
        <aside className="w-72 h-screen glass-panel border-r border-white/10 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gradient">ANTIGRAVITY</h1>
                        <p className="text-xs text-white/40">SYSTEM ONLINE</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{label}</span>
                    </NavLink>
                ))}

                {/* Admin Link (if logged in) */}
                {isAdmin && (
                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                                ? 'bg-warning/20 text-warning border border-warning/30'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <Shield className="w-5 h-5" />
                        <span className="font-medium">Admin Panel</span>
                    </NavLink>
                )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 space-y-2">
                {!isAdmin ? (
                    <NavLink
                        to="/admin-login"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Admin Login</span>
                    </NavLink>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error/60 hover:text-error hover:bg-error/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                )}

                {/* Version */}
                <div className="text-center text-xs text-white/20 pt-2">
                    Phoenix Protocol v2.0
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
