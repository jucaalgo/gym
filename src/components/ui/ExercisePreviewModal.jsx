import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Info } from 'lucide-react';

const ExercisePreviewModal = ({ exercise, onClose }) => {
    if (!exercise) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-zinc-900 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative h-64 bg-black">
                        <video
                            src={exercise.videoUrl}
                            className="w-full h-full object-contain"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{exercise.name}</h3>
                                <div className="flex gap-2 text-xs">
                                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/20">
                                        {exercise.primaryMuscle}
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                                        {exercise.equipment?.join(', ')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-zinc-800/50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-primary" /> Instructions
                                </h4>
                                <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-400">
                                    {exercise.instructions?.map((inst, idx) => (
                                        <li key={idx}>{inst}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ExercisePreviewModal;
