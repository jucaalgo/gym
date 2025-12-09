import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton loader for cards
 * Provides a shimmer loading effect
 */
const SkeletonCard = ({ className = '', rows = 3 }) => {
    return (
        <div className={`glass-panel rounded-2xl p-6 ${className}`}>
            <motion.div
                animate={{
                    backgroundPosition: ['200% 0', '-200% 0'],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className="space-y-4"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                    backgroundSize: '200% 100%',
                }}
            >
                <div className="h-4 bg-white/10 rounded-lg w-3/4" />
                {Array.from({ length: rows }).map((_, i) => (
                    <div
                        key={i}
                        className="h-3 bg-white/5 rounded-lg"
                        style={{ width: `${Math.random() * 30 + 50}%` }}
                    />
                ))}
            </motion.div>
        </div>
    );
};

/**
 * Skeleton for grid items
 */
export const SkeletonGrid = ({ count = 6, cols = 3 }) => {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-4`}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
};

export default SkeletonCard;
