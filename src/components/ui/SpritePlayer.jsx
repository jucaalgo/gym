import React, { useRef, useEffect, useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// SPRITE PLAYER ENGINE
// Animates a single strip image by shifting viewing area
// ═══════════════════════════════════════════════════════════════

const SpritePlayer = ({
    src,
    frameCount = 5,
    duration = 1.5, // Seconds for full loop
    className = ""
}) => {
    const [aspectRatio, setAspectRatio] = useState(16 / 9); // Default fallback
    const [isLoaded, setIsLoaded] = useState(false);

    // Calculate the percentage shift for each frame
    // For 5 frames: 0% -> 25% -> 50% -> 75% -> 100% (of the "excess" width)
    // Actually standard CSS steps() allows us to just animate background-position from 0% to 100%

    // We use a "mask" div approach for best responsiveness

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Container defines the "Window" size (1 frame width) */}

            {/* The Long Strip Image */}
            <div
                className="h-full absolute top-0 left-0 flex"
                style={{
                    width: `${frameCount * 100}%`, // 500% width if 5 frames
                    animation: isLoaded ? `sprite-play ${duration}s steps(${frameCount}) infinite` : 'none',
                }}
            >
                {/* We repeat the image in a customized way or just use one giant IMG if source is a strip */}
                {/* Since 'src' is the full strip, we just put it here once and let CSS clip it? 
              No, simpler approach:
              The container is width W. The inner element is width 5W.
              Inner element has the image as background-image or just an img tag.
          */}
                <img
                    src={src}
                    alt="animation-strip"
                    className="w-full h-full object-fill"
                    onLoad={() => setIsLoaded(true)}
                />
            </div>

            {/* CSS for the specific keyframes needs to be injected or using Tailwind arbitrary values if possible, 
            but standard <style> is safer for dynamic keyframes */}
            <style jsx>{`
          @keyframes sprite-play {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); } /* Shift entire strip left */
          }
        `}</style>

            {/* Loading State Overlay */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-black/10 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
            )}

            {/* Debug / Info Badge (Optional) */}
            {/* <div className="absolute bottom-1 right-1 px-1 bg-black/50 text-[8px] text-white font-mono rounded">
            GIF-ENGINE
        </div> */}
        </div>
    );
};

export default SpritePlayer;
