import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Eye, Shield, Activity, Brain } from 'lucide-react';

const AUGMENTATIONS = [
    { id: 'optics', name: 'Neural Optics v1', level: 5, icon: Eye, desc: 'Enhanced form calculation accuracy.', color: '#00D4FF' },
    { id: 'core', name: 'Nano-Core Reactor', level: 12, icon: Zap, desc: 'Increased recovery speed between sets.', color: '#39FF14' },
    { id: 'muscles', name: 'Synthetic Fibers', level: 25, icon: Activity, desc: 'Boosted strength output simulation.', color: '#FF0055' },
    { id: 'neural', name: 'Deep Brain Link', level: 40, icon: Brain, desc: 'Predictive biomechanical adjustments.', color: '#9D00FF' },
    { id: 'armor', name: 'Sub-Dermal Plating', level: 60, icon: Shield, desc: 'Maximized injury prevention protocols.', color: '#FFD700' },
    { id: 'system', name: 'Quantum OS', level: 99, icon: Cpu, desc: 'The ultimate fitness consciousness.', color: '#FFFFFF' },
];

const Augmentations = ({ userLevel = 1 }) => {
    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white font-['Orbitron'] tracking-wider">AUGMENTATIONS</h3>
                    <p className="text-white/40 font-['Roboto_Mono'] text-[10px] uppercase">Cybernetic Evolution Status</p>
                </div>
                <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold font-['Roboto_Mono'] text-white/60">
                    SYNC_RATE: {Math.min(100, (userLevel / 99) * 100).toFixed(1)}%
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AUGMENTATIONS.map((aug, idx) => {
                    const isUnlocked = userLevel >= aug.level;
                    const Icon = aug.icon;

                    return (
                        <motion.div
                            key={aug.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`glass-panel p-4 rounded-2xl relative overflow-hidden transition-all duration-300 ${isUnlocked
                                    ? 'bg-[#1a1a1a] border-white/10'
                                    : 'bg-black/40 border-white/5 opacity-40 grayscale'
                                }`}
                        >
                            {/* Glow Effect if unlocked */}
                            {isUnlocked && (
                                <div
                                    className="absolute -top-10 -right-10 w-20 h-20 blur-[30px] opacity-20"
                                    style={{ backgroundColor: aug.color }}
                                />
                            )}

                            <div className="relative z-10 flex gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUnlocked ? 'text-white' : 'text-white/20'}`} style={{ backgroundColor: isUnlocked ? `${aug.color}33` : 'rgba(255,255,255,0.05)' }}>
                                    <Icon className="w-6 h-6" style={{ color: isUnlocked ? aug.color : 'inherit' }} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`font-bold font-['Orbitron'] text-sm tracking-wide ${isUnlocked ? 'text-white' : 'text-white/30'}`}>
                                            {aug.name}
                                        </h4>
                                        <span className={`text-[9px] font-bold font-['Roboto_Mono'] ${isUnlocked ? 'text-primary' : 'text-white/20'}`}>
                                            LVL {aug.level}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-white/40 mt-1 leading-snug">
                                        {isUnlocked ? aug.desc : 'RESTRICTED_ACCESS: Complete protocols to unlock.'}
                                    </p>
                                </div>
                            </div>

                            {/* Unlock Progress Bar if locked */}
                            {!isUnlocked && (
                                <div className="mt-3 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white/10"
                                        style={{ width: `${(userLevel / aug.level) * 100}%` }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Augmentations;
