import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Shield, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import soundManager from '../../utils/sounds';
import { triggerHaptic } from '../../utils/haptics';


const LevelUpOverlay = () => {
    const { levelUpEvent, setLevelUpEvent } = useUser();
    const [isVisible, setIsVisible] = useState(false);

    // Confetti burst
    const fireConfetti = () => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });

        fire(0.2, {
            spread: 60,
        });

        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    };

    // Listen for level up
    useEffect(() => {
        if (levelUpEvent) {
            setIsVisible(true);
            // Fire confetti
            setTimeout(() => fireConfetti(), 200);
            // Play sound
            soundManager.play('levelUp');
            // Haptic feedback
            triggerHaptic('success');
        }
    }, [levelUpEvent]);

    const handleClose = () => {
        setIsVisible(false);
        soundManager.play('click');
        triggerHaptic('light');
        setTimeout(() => {
            setLevelUpEvent(null); // Reset global event after animation
        }, 500);
    };

    if (!isVisible || !levelUpEvent) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1
                }}
                className="relative max-w-md w-full mx-4 text-center"
            >
                {/* Glow Effect */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/30 rounded-full blur-[100px]"
                />

                {/* Badge Icon */}
                <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.3
                    }}
                    className="relative mx-auto w-32 h-32 mb-6"
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-50"
                    />
                    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-full border-4 border-primary flex items-center justify-center shadow-2xl">
                        <span className="text-6xl">{levelUpEvent.level % 5 === 0 ? '🏆' : '⭐'}</span>
                        <div className="absolute -bottom-2 bg-primary px-3 py-1 rounded-full text-black font-bold text-sm border-2 border-black">
                            LEVEL {levelUpEvent.level}
                        </div>
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white mb-2 tracking-tight"
                >
                    LEVEL UP!
                </motion.h2>
                <motion.p
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/60 mb-8 text-lg"
                >
                    You've ascended to rank <br />
                    <span className="text-accent font-bold text-xl">{levelUpEvent.rank}</span>
                </motion.p>

                {/* Rewards Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-2 gap-4 mb-8"
                >
                    <div className="glass-panel rounded-xl p-3 bg-white/5">
                        <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                        <div className="text-xs text-white/50">Defense</div>
                        <div className="font-bold text-white">+5%</div>
                    </div>
                    <div className="glass-panel rounded-xl p-3 bg-white/5">
                        <ArrowUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <div className="text-xs text-white/50">Stamina</div>
                        <div className="font-bold text-white">+10</div>
                    </div>
                </motion.div>

                {/* Action Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-black font-bold text-lg transition-transform shadow-lg shadow-primary/25"
                >
                    CONTINUE
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default LevelUpOverlay;
