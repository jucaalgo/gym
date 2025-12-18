import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutGrid,
    BookOpen,
    Target,
    Camera,
    Trophy,
    Settings,
    TrendingUp,
    Book,
    Scan,
    Shield
} from 'lucide-react';

const navItems = [
    { to: '/', icon: LayoutGrid, label: 'Inicio' },
    { to: '/matrix', icon: Target, label: 'Entrenamiento' },
    { to: '/routines', icon: Trophy, label: 'Rutinas' },
    { to: '/profile', icon: Settings, label: 'Perfil' },
];

const MobileNavbar = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-t border-white/5 z-50 md:hidden pb-safe">
            <div className="flex items-center justify-around h-full px-4">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center flex-1 h-full transition-all duration-300
                            ${isActive
                                ? 'text-primary scale-110'
                                : 'text-white/40 hover:text-white/70'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/10 shadow-[0_0_20px_rgba(0,212,255,0.2)]' : 'bg-transparent'}`}>
                                    <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                                </div>
                                <span className={`text-[10px] uppercase tracking-tighter font-bold transition-all ${isActive ? 'opacity-100 mt-1' : 'opacity-60'}`}>
                                    {label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default MobileNavbar;
