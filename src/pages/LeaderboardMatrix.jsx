import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Shield, Zap, Target, ChevronRight } from 'lucide-react';
import { useUser } from '../context/UserContext';

const LeaderboardMatrix = () => {
    const { user, users } = useUser();

    // Mock leaderboard data if users list is empty
    const mockUsers = [
        { name: 'Juan Carlos', rank: 'System Admin', level: 99, xp: 50000, archetype: 'guerrero', rankIcon: '🛡️' },
        { name: 'Neo_Fit', rank: 'Shadow Walker', level: 45, xp: 12000, archetype: 'ninja', rankIcon: '🥷' },
        { name: 'Iron_Titan', rank: 'Warrior Class', level: 38, xp: 9500, archetype: 'guerrero', rankIcon: '⚔️' },
        { name: 'Cyber_Valkyrie', rank: 'Elite Division', level: 32, xp: 8200, archetype: 'valquiria', rankIcon: '🛡️' },
        { name: 'Ghost_Runner', rank: 'Scout unit', level: 12, xp: 2400, archetype: 'ninja', rankIcon: '🏃' },
    ];

    const displayUsers = users.length > 0 ? users.sort((a, b) => b.level - a.level) : mockUsers;

    return (
        <div className="min-h-screen p-6 space-y-6 max-w-4xl mx-auto pb-24">
            <header>
                <h1 className="text-3xl font-bold text-white font-['Orbitron'] tracking-widest text-[#00D4FF]">
                    THE <span className="text-white">MATRIX</span> LEADERBOARD
                </h1>
                <p className="text-white/40 font-['Roboto_Mono'] text-xs uppercase tracking-[0.3em]">Territory Conquest • Node Synchronization</p>
            </header>

            {/* Matrix Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel p-5 rounded-2xl bg-[#0a0a0a] border-primary/20 flex flex-col items-center">
                    <span className="text-[10px] text-white/40 font-['Roboto_Mono'] uppercase mb-2">My Rank</span>
                    <div className="text-2xl font-bold text-white font-['Orbitron'] tracking-wide">#01</div>
                    <div className="text-[10px] text-primary mt-1 font-['Roboto_Mono'] font-bold uppercase">GLOBAL_ADMIN</div>
                </div>
                <div className="glass-panel p-5 rounded-2xl bg-[#0a0a0a] border-accent/20 flex flex-col items-center">
                    <span className="text-[10px] text-white/40 font-['Roboto_Mono'] uppercase mb-2">Total Nodes</span>
                    <div className="text-2xl font-bold text-white font-['Orbitron'] tracking-wide">1,248</div>
                    <div className="text-[10px] text-accent mt-1 font-['Roboto_Mono'] font-bold uppercase">SECURED_SYSTEM</div>
                </div>
                <div className="glass-panel p-5 rounded-2xl bg-[#0a0a0a] border-secondary/20 flex flex-col items-center">
                    <span className="text-[10px] text-white/40 font-['Roboto_Mono'] uppercase mb-2">Active Units</span>
                    <div className="text-2xl font-bold text-white font-['Orbitron'] tracking-wide">312</div>
                    <div className="text-[10px] text-secondary mt-1 font-['Roboto_Mono'] font-bold uppercase">IN_TRAINING</div>
                </div>
            </div>

            {/* Leaderboard Table / Matrix Grid */}
            <div className="glass-panel rounded-3xl overflow-hidden bg-[#111] border-white/5 shadow-2xl">
                <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-['Roboto_Mono']">Synchronized_Entities</span>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-primary/40" />
                        <div className="w-2 h-2 rounded-full bg-primary/20" />
                    </div>
                </div>

                <div className="divide-y divide-white/5">
                    {displayUsers.map((item, idx) => (
                        <motion.div
                            key={item.id || idx}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-4 flex items-center justify-between hover:bg-white/5 transition-colors group ${user?.id === item.id ? 'bg-primary/5' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className={`w-8 text-center font-['Orbitron'] font-bold ${idx < 3 ? 'text-primary' : 'text-white/30'}`}>
                                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                </span>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors`}>
                                    {item.rankIcon || '👤'}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white font-['Orbitron'] tracking-wide uppercase group-hover:text-primary transition-colors">
                                        {item.name}
                                    </div>
                                    <div className="text-[10px] text-white/40 font-['Roboto_Mono'] uppercase">
                                        {item.rank} • LVL {item.level}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-xs font-bold text-white font-['Roboto_Mono']">
                                    {item.xp.toLocaleString()} <span className="text-[8px] opacity-40">XP</span>
                                </div>
                                <div className="w-20 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(Math.min(item.level, 100))}%` }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Matrix Visual Footer */}
            <div className="flex justify-center flex-wrap gap-8 text-[9px] font-['Roboto_Mono'] text-white/20 uppercase tracking-widest pt-4">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> SYSTEM_LATENCY: 12ms</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary" /> CORE_LOAD: 24.1%</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> AUTH_TOKEN: ACTIVE</div>
            </div>
        </div>
    );
};

export default LeaderboardMatrix;
