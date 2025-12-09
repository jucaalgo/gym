import React, { useState, useEffect } from 'react';
import { realExercisesAdapter } from '../../data/real_exercises_adapter';
import { AlertTriangle, Loader2, Zap } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// VISUAL ASSET ENGINE v2 (REAL DATA)
// Handles Slideshows from real_exercises.json
// ═══════════════════════════════════════════════════════════════

const VisualAsset = ({ exercise, type = '3d_viewer', className = '' }) => {
    const [imageUrls, setImageUrls] = useState([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Load images on mount or when exercise changes
    useEffect(() => {
        setLoading(true);
        setError(false);

        console.log('🎬 VisualAsset received exercise:', exercise);

        let foundExercise = null;

        // Try to resolve the exercise from the adapter
        if (exercise?._rawData) {
            foundExercise = exercise._rawData;
            console.log('🎬 Using _rawData:', foundExercise.name, 'Images:', foundExercise.images?.length);
        } else if (exercise?.id) {
            foundExercise = realExercisesAdapter.getById(exercise.id);
            console.log('🎬 Found by ID:', foundExercise?.name, 'Images:', foundExercise?.images?.length);
        }

        if (foundExercise) {
            const urls = realExercisesAdapter.getImageUrls(foundExercise);
            console.log('🎬 Generated URLs:', urls);
            if (urls.length > 0) {
                setImageUrls(urls);
                // Preload images
                urls.forEach(url => {
                    const img = new window.Image();
                    img.src = url;
                });
            } else {
                console.error('🎬 No image URLs generated');
                setError(true);
            }
        } else {
            // If no real data found, we might want to fail gracefully or show placeholder
            // For now, let's treat as error to debug "Ghost" exercises
            console.error('🎬 No exercise found!', exercise);
            setError(true);
        }
        setLoading(false);
    }, [exercise]);

    // Animation Loop (Slideshow)
    useEffect(() => {
        if (imageUrls.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentFrame(prev => (prev + 1) % imageUrls.length);
        }, 1000); // 1 second per frame (slow loop)

        return () => clearInterval(interval);
    }, [imageUrls]);

    // Error / No Content State
    if (error || imageUrls.length === 0) {
        return (
            <div className={`w-full h-full flex flex-col items-center justify-center bg-black/40 rounded-xl border border-white/5 ${className}`}>
                <AlertTriangle className="w-12 h-12 text-white/20 mb-2" />
                <span className="text-xs text-white/40 font-mono">NO VISUAL SIGNAL</span>
                <span className="text-[10px] text-white/20 mt-1">{exercise?.name || 'Unknown'}</span>
            </div>
        );
    }

    // Loading State
    if (loading) {
        return (
            <div className={`w-full h-full flex items-center justify-center bg-black/40 rounded-xl ${className}`}>
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    // Success State - Slideshow
    return (
        <div className={`relative w-full h-full overflow-hidden rounded-xl bg-black ${className}`}>
            {imageUrls.map((url, index) => (
                <img
                    key={url}
                    src={url}
                    alt={exercise.name}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${index === currentFrame ? 'opacity-100' : 'opacity-0'
                        }`}
                />
            ))}

            {/* Overlay Grid Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,100,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

            {/* Status Badge */}
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded border border-white/10 flex items-center gap-2 z-10">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono text-white/80">LIVE FEED</span>
            </div>

            {/* Fallback / Loading Optimization */}
            {/* Force browser to respect z-index for overlays on mobile */}
            <div className="absolute inset-0 bg-transparent translate-z-0"></div>
        </div>
    );
};

export default VisualAsset;
