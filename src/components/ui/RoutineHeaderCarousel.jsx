import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RoutineHeaderCarousel = ({ exercises }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter exercises with valid video URLs
    const validExercises = exercises.filter(ex => ex.videoUrl);

    useEffect(() => {
        if (validExercises.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % validExercises.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [validExercises.length]);

    if (!validExercises.length) return null;

    const currentExercise = validExercises[currentIndex];

    return (
        <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-xl bg-black mb-6 group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentExercise.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full"
                >
                    <video
                        src={currentExercise.videoUrl}
                        className="w-full h-full object-cover opacity-80"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="flex gap-1 mb-1">
                    {validExercises.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1 rounded-full flex-1 transition-colors ${idx === currentIndex ? 'bg-primary' : 'bg-white/20'}`}
                        />
                    ))}
                </div>
                <motion.h3
                    key={`text-${currentExercise.id}`}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-white font-bold text-lg truncate"
                >
                    {currentExercise.name}
                </motion.h3>
                <p className="text-white/60 text-xs uppercase tracking-wider">
                    {currentExercise.primaryMuscle} • {currentExercise.equipment[0]}
                </p>
            </div>
        </div>
    );
};

export default RoutineHeaderCarousel;
