import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
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
    Book,
    Scan
} from 'lucide-react';

const navItems = [
    { to: '/', icon: LayoutGrid, label: 'Tablero' },
    { to: '/encyclopedia', icon: BookOpen, label: 'Enciclopedia' },
    { to: '/matrix', icon: Target, label: 'La Matrix' },
    { to: '/analytics', icon: TrendingUp, label: 'Analíticas' },
    { to: '/journal', icon: Book, label: 'Diario' },
    { to: '/nutrition', icon: Camera, label: 'Nutrición' },
    { to: '/scan', icon: Scan, label: 'Híper-Visión' },
    { to: '/routines', icon: Trophy, label: 'Rutinas' },
    { to: '/profile', icon: Settings, label: 'Perfil' },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const { user, logout } = useUser();

    // Check role directly from context source of truth
    const isAdmin = user?.role === 'admin';

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="w-72 h-screen glass-panel border-r border-white/10 flex flex-col intro-x">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black/50 border border-primary/30 flex items-center justify-center overflow-hidden p-1 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        <img src={`${import.meta.env.BASE_URL}jca-logo.png`} alt="JCA Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">JCA GYM</h1>
                        <p className="text-xs text-white/40 tracking-widest">SISTEMA EN LÍNEA</p>
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

                {/* Admin Link (Dynamic) */}
                {isAdmin && (
                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mt-4
              ${isActive
                                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                : 'text-amber-500/60 hover:text-amber-500 hover:bg-amber-500/10 border border-transparent'
                            }`
                        }
                    >
                        <Shield className="w-5 h-5" />
                        <span className="font-medium tracking-wide">PANEL DE ADMIN</span>
                    </NavLink>
                )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 space-y-2">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all group"
                >
                    <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>

                {/* Version */}
                <div className="text-center text-[10px] text-white/20 pt-2 font-mono uppercase tracking-widest">
                    JCA Systems v3.2 (Fix)
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
