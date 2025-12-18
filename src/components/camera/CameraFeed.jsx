/**
 * Camera Feed Component
 * Handles camera access and video stream display
 */

import React, { useRef, useEffect, useState } from 'react';

export default function CameraFeed({ onVideoReady, isActive = true }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isActive) {
            stopCamera();
            return;
        }

        startCamera();

        return () => {
            stopCamera();
        };
    }, [isActive]);

    async function startCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError('Cámara no soportada en este entorno (se requiere HTTPS o localhost)');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera on mobile
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;

                // Wait for video to be ready
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                    setLoading(false);

                    // Notify parent that video is ready
                    if (onVideoReady) {
                        onVideoReady(videoRef.current);
                    }
                };
            }
        } catch (err) {
            console.error('Camera access error:', err);
            setError(err.message || 'Failed to access camera');
            setLoading(false);
        }
    }

    function stopCamera() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full bg-black">
                <div className="text-center p-8">
                    <div className="text-6xl mb-4">📷</div>
                    <div className="text-white text-xl mb-2">Camera Access Denied</div>
                    <div className="text-gray-400 text-sm max-w-md">
                        {error}
                    </div>
                    <button
                        onClick={startCamera}
                        className="mt-4 px-6 py-2 bg-[#00D4FF] text-white rounded-lg hover:bg-[#00D4FF]/80 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-black">
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
            />

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center">
                        <div className="text-6xl mb-4 animate-pulse">📷</div>
                        <div className="text-white text-xl">Initializing Camera...</div>
                    </div>
                </div>
            )}
        </div>
    );
}
