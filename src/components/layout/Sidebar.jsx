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
    Zap,
    TrendingUp,
    Book
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// JCA GYM - PREMIUM SIDEBAR
// Glassmorphism Navigation with Neon Accents
// ═══════════════════════════════════════════════════════════════

const navItems = [
    { to: '/', icon: LayoutGrid, label: 'Dashboard' },
    { to: '/encyclopedia', icon: BookOpen, label: 'Encyclopedia' },
    { to: '/matrix', icon: Target, label: 'The Matrix' },
    { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { to: '/journal', icon: Book, label: 'Journal' },
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
        <aside className="w-72 h-screen glass-panel border-r border-white/10 flex flex-col intro-x">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black/50 border border-primary/30 flex items-center justify-center overflow-hidden p-1 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        <img src="/jca-logo.png" alt="JCA Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">JCA GYM</h1>
                        <p className="text-xs text-white/40 tracking-widest">SYSTEM ONLINE</p>
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
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive
                                ? 'bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                : 'text-white/60 hover:text-white hover:bg-white/5 hover:border hover:border-white/10'
                            }`
                        }
                    >
                        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="font-medium tracking-wide">{label}</span>
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
                        <span className="font-medium">Logout</span>
                    </button>
                )}

                {/* Version */}
                <div className="text-center text-xs text-white/20 pt-2 font-mono">
                    JCA Systems v2.1
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
