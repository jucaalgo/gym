import React from 'react';
import { motion } from 'framer-motion';

const DigitalTwinAvatar = ({ level = 1, focus = 'all', archetype = {}, biometrics = {} }) => {
    // Colors based on archetype
    const primaryColor = archetype.color?.includes('from-')
        ? archetype.color.split(' ')[1].replace('to-', '')
        : '#00D4FF';

    // Scale glow based on level
    const glowIntensity = Math.min(20, 5 + level / 10);
    const auraOpacity = Math.min(0.4, 0.1 + level / 200);

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
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Main Body Outline */}
                <path
                    d="M50,20 L55,25 L55,40 L65,50 L65,80 L55,100 L55,140 L45,140 L45,100 L35,80 L35,50 L45,40 L45,25 Z"
                    fill="url(#bodyGradient)"
                    stroke="white"
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
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

                {/* Focus Highlights */}
                {/* Chest Focus */}
                <motion.path
                    d="M45,45 Q50,42 55,45 L55,55 Q50,58 45,55 Z"
                    fill={focus === 'Pecho' ? primaryColor : 'transparent'}
                    opacity={focus === 'Pecho' ? 0.6 : 0}
                    stroke={primaryColor}
                    strokeWidth={focus === 'Pecho' ? 0.5 : 0}
                    animate={focus === 'Pecho' ? { opacity: [0.3, 0.6, 0.3] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Arms Focus */}
                <motion.path
                    d="M35,50 L30,65 M65,50 L70,65"
                    stroke={primaryColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity={focus === 'Brazos' ? 0.8 : 0}
                    animate={focus === 'Brazos' ? { opacity: [0.4, 0.8, 0.4] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Legs Focus */}
                <motion.path
                    d="M45,110 L45,140 M55,110 L55,140"
                    stroke={primaryColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity={focus === 'Piernas' ? 0.8 : 0}
                    animate={focus === 'Piernas' ? { opacity: [0.4, 0.8, 0.4] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Core Overlay (Data lines) */}
                <motion.path
                    d="M40,70 L60,70 M40,75 L60,75"
                    stroke="white"
                    strokeWidth="0.2"
                    strokeDasharray="2 1"
                    opacity="0.3"
                />
            </svg>

            {/* Neural Data HUD Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] font-['Roboto_Mono'] text-white/40">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span>SYNAPSE: {level * 12}ms</span>
                    </div>
                    <span>READINESS: {biometrics.hrv ? Math.round(biometrics.hrv * 1.2) : 85}%</span>
                </div>
                <div className="text-right">
                    <span>UNIT_ID: JCA_{level > 9 ? level : '0' + level}</span>
                    <br />
                    <span>STATUS: ACTIVE</span>
                </div>
            </div>
        </div>
    );
};

export default DigitalTwinAvatar;
