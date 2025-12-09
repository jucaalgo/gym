import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Trophy, Star, Shield, ArrowUp } from 'lucide-react';
import { useUser } from '../../context/UserContext';


const LevelUpOverlay = () => {
    const { levelUpEvent, setLevelUpEvent } = useUser();
    const [isVisible, setIsVisible] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Handle window resize for confetti
    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Listen for level up
    useEffect(() => {
        if (levelUpEvent) {
            setIsVisible(true);
            // Play sound effect here ideally
        }
    }, [levelUpEvent]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            setLevelUpEvent(null); // Reset global event after animation
        }, 500);
    };

    if (!isVisible || !levelUpEvent) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                numberOfPieces={200}
                gravity={0.2}
                colors={['#10b981', '#3b82f6', '#f59e0b', '#ec4899']}
            />

            <div className="relative max-w-md w-full mx-4 text-center animate-in zoom-in-50 duration-500 delay-150">
                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/30 rounded-full blur-[100px]" />

                {/* Badge Icon */}
                <div className="relative mx-auto w-32 h-32 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full animate-pulse blur-xl opacity-50" />
                    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-full border-4 border-primary flex items-center justify-center shadow-2xl">
                        <span className="text-6xl">{levelUpEvent.level % 5 === 0 ? '🏆' : '⭐'}</span>
                        <div className="absolute -bottom-2 bg-primary px-3 py-1 rounded-full text-black font-bold text-sm border-2 border-black">
                            LEVEL {levelUpEvent.level}
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white mb-2 tracking-tight">
                    LEVEL UP!
                </h2>
                <p className="text-white/60 mb-8 text-lg">
                    Has ascendido al rango <br />
                    <span className="text-accent font-bold text-xl">{levelUpEvent.rank}</span>
                </p>

                {/* Rewards Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="glass-panel rounded-xl p-3 bg-white/5">
                        <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                        <div className="text-xs text-white/50">Defensa</div>
                        <div className="font-bold text-white">+5%</div>
                    </div>
                    <div className="glass-panel rounded-xl p-3 bg-white/5">
                        <ArrowUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <div className="text-xs text-white/50">Stamina</div>
                        <div className="font-bold text-white">+10</div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleClose}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-black font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-primary/25"
                >
                    CONTINUAR
                </button>
            </div>
        </div>
    );
};

export default LevelUpOverlay;
