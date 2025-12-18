import React from 'react';
import { motion } from 'framer-motion';

const DigitalTwinAvatar = ({ level = 1, focus = 'all', archetype = {}, biometrics = {}, muscleFatigue = {} }) => {
    // Colors based on archetype
    const primaryColor = archetype.color?.includes('from-')
        ? archetype.color.split(' ')[1].replace('to-', '')
        : '#00D4FF';

    // Scale glow based on level
    const glowIntensity = Math.min(20, 5 + level / 10);
    const auraOpacity = Math.min(0.4, 0.1 + level / 200);

    // Heatmap Helper
    const getFatigueColor = (muscle) => {
        const fatigue = muscleFatigue[muscle] || 0;
        if (fatigue > 80) return '#FF0000'; // Critical Red
        if (fatigue > 50) return '#FF4500'; // High Orange
        if (fatigue > 20) return '#FFA500'; // Moderate Yellow
        return primaryColor; // Normal
    };

    const getFatigueOpacity = (muscle) => {
        const fatigue = muscleFatigue[muscle] || 0;
        return fatigue > 0 ? (fatigue / 100) * 0.8 : 0;
    };

    return (
        <div className="relative w-full aspect-[2/3] flex items-center justify-center p-4">
            {/* Background Aura */}
            <motion.div
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [auraOpacity, auraOpacity * 1.5, auraOpacity],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full blur-[80px]"
                style={{ backgroundColor: primaryColor }}
            />

            {/* Futuristic Grid Circle */}
            <svg className="absolute w-full h-full opacity-20" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-white" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" className="text-primary/30" />
            </svg>

            {/* The Avatar body (Stylized Humanoid) */}
            <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(0,212,255,0.3)]" viewBox="0 0 100 150">
                <defs>
                    <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="white" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="white" stopOpacity="0.02" />
                    </linearGradient>

                    <filter id="neonGlow">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    <filter id="heatGlow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Main Body Outline (Base) */}
                <path
                    d="M50,20 L55,25 L55,40 L65,50 L65,80 L55,100 L55,140 L45,140 L45,100 L35,80 L35,50 L45,40 L45,25 Z"
                    fill="url(#bodyGradient)"
                    stroke="white"
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
                />

                {/* --- HEATMAP LAYERS --- */}

                {/* Chest Heatmap */}
                <motion.path
                    d="M45,45 Q50,42 55,45 L55,55 Q50,58 45,55 Z"
                    fill={getFatigueColor('chest')}
                    opacity={getFatigueOpacity('chest')}
                    filter="url(#heatGlow)"
                    animate={{ opacity: [getFatigueOpacity('chest') * 0.8, getFatigueOpacity('chest'), getFatigueOpacity('chest') * 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Arms Heatmap */}
                <motion.path
                    d="M35,50 L30,65 M65,50 L70,65"
                    stroke={getFatigueColor('arms')}
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity={getFatigueOpacity('arms')}
                    filter="url(#heatGlow)"
                    animate={{ opacity: [getFatigueOpacity('arms') * 0.8, getFatigueOpacity('arms'), getFatigueOpacity('arms') * 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />

                {/* Legs Heatmap */}
                <motion.path
                    d="M45,110 L45,130 M55,110 L55,130"
                    stroke={getFatigueColor('legs')}
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity={getFatigueOpacity('legs')}
                    filter="url(#heatGlow)"
                    animate={{ opacity: [getFatigueOpacity('legs') * 0.8, getFatigueOpacity('legs'), getFatigueOpacity('legs') * 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />

                {/* Head */}
                <circle cx="50" cy="15" r="8" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
                <motion.circle
                    cx="50" cy="15" r="3"
                    fill={primaryColor}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    filter="url(#neonGlow)"
                />

                {/* Nervous System Nodes (Reactive to level) */}
                {[25, 45, 65, 85, 105, 125].map((y, i) => (
                    <motion.circle
                        key={i}
                        cx="50"
                        cy={y}
                        r={1}
                        fill={primaryColor}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: level > (i * 10) ? [0.2, 0.7, 0.2] : 0,
                            scale: level > (i * 10) ? [1, 1.5, 1] : 1
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    />
                ))}

                {/* Focus Highlights (Legacy / Overridden by Heatmap if high fatigue) */}
                {focus === 'Pecho' && (
                    <motion.path
                        d="M45,45 Q50,42 55,45 L55,55 Q50,58 45,55 Z"
                        fill="transparent"
                        stroke={primaryColor}
                        strokeWidth="0.5"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                )}
            </svg>

            {/* Neural Data HUD Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] font-['Roboto_Mono'] text-white/40">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span>SYNAPSE: {level * 12}ms</span>
                    </div>
                </div>
                <div className="text-right">
                    <span>BIO_GLOW: {Object.values(muscleFatigue).some(v => v > 0) ? 'ACTIVE' : 'STANDBY'}</span>
                </div>
            </div>
        </div>
    );
};

export default DigitalTwinAvatar;
