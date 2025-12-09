import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, Plus } from 'lucide-react';
import soundManager from '../../utils/sounds';
import { triggerHaptic } from '../../utils/haptics';

const RestTimer = ({ initialSeconds = 60, onComplete, onSkip }) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(prev => prev - 1);
            }, 1000);
        } else if (seconds === 0) {
            handleComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const handleComplete = () => {
        setIsActive(false);
        triggerHaptic('medium');
        // Play timer end sound if available, otherwise just haptic
        soundManager.play('success'); // Reusing success sound for now
        if (onComplete) onComplete();
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
        soundManager.play('click');
        triggerHaptic('light');
    };

    const addTime = () => {
        setSeconds(prev => prev + 30);
        soundManager.play('click');
        triggerHaptic('light');
    };

    const handleSkip = () => {
        if (onSkip) onSkip();
        soundManager.play('click');
        triggerHaptic('light');
    };

    // Calculate progress for circle
    const progress = ((initialSeconds - seconds) / initialSeconds) * 100;
    const circumference = 2 * Math.PI * 45; // radius 45

    return (
        <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-3xl mx-auto max-w-sm w-full">
            <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">Recovery</h3>

            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                {/* Background Circle */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="45"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        fill="transparent"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="96"
                        cy="96"
                        r="45"
                        stroke="#10b981" // Success color
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (progress / 100) * circumference}
                        strokeLinecap="round"
                        animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
                        transition={{ duration: 0.5, ease: "linear" }}
                    />
                </svg>

                <div className="text-5xl font-mono font-bold text-white tabular-nums">
                    {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <button
                    onClick={addTime}
                    className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    aria-label="+30s"
                >
                    <Plus className="w-5 h-5" />
                </button>

                <button
                    onClick={toggleTimer}
                    className="p-4 rounded-full bg-primary text-black hover:scale-105 transition-transform shadow-lg shadow-primary/25"
                >
                    {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                </button>

                <button
                    onClick={handleSkip}
                    className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                    <SkipForward className="w-5 h-5" />
                </button>
            </div>

            <p className="text-white/30 text-xs mt-4">Tip: Breathe deeply through your nose</p>
        </div>
    );
};

export default RestTimer;
