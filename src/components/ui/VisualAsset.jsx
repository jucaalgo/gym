import React, { useState, useEffect } from 'react';
import SpritePlayer from './SpritePlayer';
import { realExercisesAdapter } from '../../data/real_exercises_adapter';
import { AlertTriangle, Loader2, Zap } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// VISUAL ASSET ENGINE v2 (REAL DATA)
// Handles Slideshows from real_exercises.json
// ═══════════════════════════════════════════════════════════════

const VisualAsset = ({ exercise, type = '3d_viewer', className = '' }) => {
    // Determine the asset path for the new Ecorché Sprites
    // Format: /ecorche-sprites/slug-name.png
    const spritePath = exercise ? `/ecorche-sprites/${exercise.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.png` : null;

    // We can allow toggle between new/old, but let's prioritize the new assets
    const [useSprite, setUseSprite] = useState(true);
    const [spriteError, setSpriteError] = useState(false);

    // Legacy Fallback Logic
    const [imageUrls, setImageUrls] = useState([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // --- SPRITE LOGIC ---
    // If sprite fails to load (error 404), we fallback to the old images
    const handleSpriteError = () => {
        console.warn('⚠️ Sprite missing, falling back to legacy images:', spritePath);
        setUseSprite(false);
        setSpriteError(true);
    };

    // --- LEGACY LOGIC ---
    useEffect(() => {
        if (useSprite && !spriteError) return; // Don't load legacy if sprite is working

        setLoading(true);
        setError(false);

        // ... existing legacy load logic (simplified for brevity, assume keeps working) ...
        const foundExercise = exercise?._rawData || (exercise?.id ? realExercisesAdapter.getById(exercise.id) : null);

        if (foundExercise) {
            const urls = realExercisesAdapter.getImageUrls(foundExercise);
            if (urls.length > 0) {
                setImageUrls(urls);
            } else if (exercise?.imagePath || exercise?.videoUrl || exercise?.thumbnailUrl) {
                // Support for csvLoader.js and MuscleWiki exercises
                setImageUrls([exercise.imagePath || exercise.videoUrl || exercise.thumbnailUrl]);
            } else {
                setError(true);
            }
        } else if (exercise?.imagePath || exercise?.videoUrl || exercise?.thumbnailUrl) {
            // Support for csvLoader.js and MuscleWiki exercises even if not found in realExercisesAdapter
            setImageUrls([exercise.imagePath || exercise.videoUrl || exercise.thumbnailUrl]);
        } else {
            setError(true);
        }
        setLoading(false);
    }, [exercise, useSprite, spriteError]);

    // Animation Loop for Legacy
    useEffect(() => {
        if (useSprite || imageUrls.length <= 1) return;
        const interval = setInterval(() => setCurrentFrame(prev => (prev + 1) % imageUrls.length), 1000);
        return () => clearInterval(interval);
    }, [imageUrls, useSprite]);

    // RENDER

    // 1. Try Sprite Player
    if (useSprite && !spriteError && spritePath) {
        return (
            <div className={`relative w-full h-full overflow-hidden rounded-xl bg-black ${className}`}>
                <div className="absolute inset-0 bg-white"> {/* White background for Ecorché */}
                    {/* We use a standard IMG with onError to check existence, 
                         but for the player we just mount it. The Player internally has IMG.
                         Actually, to detect 404, we need to check first. 
                         Let's put the onError on the Player or wrap it.
                     */}

                    <img
                        src={spritePath}
                        className="hidden"
                        onError={handleSpriteError}
                        onLoad={() => console.log('✅ Sprite loaded:', spritePath)}
                    />

                    <SpritePlayer
                        src={spritePath}
                        frameCount={5}
                        duration={3} // 3 seconds loop for fluid movement
                        className="w-full h-full"
                    />

                    {/* Tech Overlay */}
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded border border-orange-500/30 flex items-center gap-2 z-10">
                        <Zap className="w-3 h-3 text-orange-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-orange-400">ECORCHÉ ENGINE</span>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Legacy Slideshow Fallback
    if (error || imageUrls.length === 0) {
        return (
            <div className={`w-full h-full flex flex-col items-center justify-center bg-black/40 rounded-xl border border-white/5 ${className}`}>
                <AlertTriangle className="w-12 h-12 text-white/20 mb-2" />
                <span className="text-xs text-white/40 font-mono">NO VISUAL SIGNAL</span>
            </div>
        );
    }

    return (
        <div className={`relative w-full h-full overflow-hidden rounded-xl bg-black ${className}`}>
            {imageUrls.map((url, index) => (
                <img
                    key={url}
                    src={url}
                    alt={exercise.name}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${index === currentFrame ? 'opacity-100' : 'opacity-0'}`}
                />
            ))}
            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded flex items-center gap-2 z-10">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono text-white/80">LEGACY FEED</span>
            </div>
        </div>
    );
};

export default VisualAsset;
