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

    // Legacy/Main Image Fallback Logic
    const [imageUrls, setImageUrls] = useState([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // --- SPRITE LOGIC ---
    // If sprite fails to load (error 404), we fallback to the old images
    const handleSpriteError = () => {
        // console.warn('⚠️ Sprite missing, falling back to static images:', spritePath);
        setUseSprite(false);
        setSpriteError(true);
    };

    // --- IMAGE LOADING LOGIC ---
    useEffect(() => {
        if (useSprite && !spriteError) return; // Don't load legacy if sprite is working

        setLoading(true);
        setError(false);

        // 1. Try to find images from Real Exercises Adapter (yuhonas db)
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

    // Animation Loop for Slideshows
    useEffect(() => {
        if (useSprite || imageUrls.length <= 1) return;
        const interval = setInterval(() => setCurrentFrame(prev => (prev + 1) % imageUrls.length), 1000);
        return () => clearInterval(interval);
    }, [imageUrls, useSprite]);

    // Smart Image Retry Handler (Handles _ vs - mismatches)
    const handleImageError = (e, failedUrl) => {
        const img = e.target;

        // Prevent infinite loops
        if (img.dataset.retried === "true") {
            img.style.display = 'none'; // Hide broken image final
            return;
        }

        // Attempt filename mutation: swap _ to - or vice versa
        // Only applies to local paths (starting with /)
        if (failedUrl.startsWith('/') || failedUrl.includes(window.location.origin)) {
            const filename = failedUrl.split('/').pop();
            let newFilename = null;

            if (filename.includes('_')) {
                newFilename = filename.replace(/_/g, '-');
            } else if (filename.includes('-')) {
                newFilename = filename.replace(/-/g, '_');
            }

            if (newFilename) {
                const newUrl = failedUrl.replace(filename, newFilename);
                // console.log(`🔄 Retrying image: ${filename} -> ${newFilename}`);
                img.src = newUrl;
                img.dataset.retried = "true";
            } else {
                img.style.display = 'none';
            }
        } else {
            img.style.display = 'none';
        }
    };

    // RENDER

    // 1. Try Sprite Player
    if (useSprite && !spriteError && spritePath) {
        return (
            <div className={`relative w-full h-full overflow-hidden rounded-xl bg-black ${className}`}>
                <div className="absolute inset-0 bg-white">
                    <img
                        src={spritePath}
                        className="hidden"
                        onError={handleSpriteError}
                        onLoad={() => { }}
                    />

                    <SpritePlayer
                        src={spritePath}
                        frameCount={5}
                        duration={3}
                        className="w-full h-full"
                    />

                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded border border-orange-500/30 flex items-center gap-2 z-10">
                        <Zap className="w-3 h-3 text-orange-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-orange-400">ECORCHÉ ENGINE</span>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Fallback / Main Image Render
    if (error || imageUrls.length === 0) {
        return (
            <div className={`w-full h-full flex flex-col items-center justify-center bg-black/40 rounded-xl border border-white/5 ${className}`}>
                <AlertTriangle className="w-8 h-8 text-white/20 mb-2" />
                <span className="text-[10px] text-white/40 font-mono">NO SIGNAL</span>
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
                    className={`absolute inset-0 w-full h-full object-contain bg-white transition-opacity duration-300 ${index === currentFrame ? 'opacity-100' : 'opacity-0'}`}
                    onError={(e) => handleImageError(e, url)}
                />
            ))}

            {/* Only show badge if NOT using local file (likely external) or if it's a slideshow */}
            {imageUrls.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded flex items-center gap-2 z-10">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-blue-200">AI VISION</span>
                </div>
            )}
        </div>
    );
};

export default VisualAsset;
