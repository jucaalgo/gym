import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutGrid,
    BookOpen,
    Target,
    Camera,
    Trophy,
    Settings
} from 'lucide-react';

const navItems = [
    { to: '/', icon: LayoutGrid, label: 'Home' },
    { to: '/encyclopedia', icon: BookOpen, label: 'Wiki' },
    { to: '/matrix', icon: Target, label: 'Matrix' },
    { to: '/nutrition', icon: Camera, label: 'Scan' },
    { to: '/routines', icon: Trophy, label: 'Gym' },
    { to: '/profile', icon: Settings, label: 'Profile' },
];

const MobileNavbar = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-lg border-t border-white/10 z-50 md:hidden pb-safe">
            <div className="flex justify-around items-center h-full px-2">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center w-full h-full space-y-1 transition-all
                            ${isActive
                                ? 'text-primary'
                                : 'text-white/40 hover:text-white'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary/20' : 'bg-transparent'}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-medium">{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default MobileNavbar;
