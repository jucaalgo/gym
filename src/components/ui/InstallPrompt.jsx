import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (isIosDevice && !isStandalone) {
            setIsIOS(true);
            // Show iOS instructions once per session
            if (!sessionStorage.getItem('ios_prompt_shown')) {
                setShowPrompt(true);
                sessionStorage.setItem('ios_prompt_shown', 'true');
            }
        }

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
        setShowPrompt(false);
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-slide-up-fade">
            <div className="bg-surface border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                {/* Close Button */}
                <button
                    onClick={() => setShowPrompt(false)}
                    className="absolute top-2 right-2 p-2 text-white/40 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                        <img src="/jca-logo.png" alt="App Icon" className="w-full h-full object-contain p-1" />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-white text-lg">Install JCA Gym</h3>
                        <p className="text-sm text-white/60 mb-3">
                            Get the full native experience. Offline access, smoother animations, and better performance.
                        </p>

                        {isIOS ? (
                            <div className="text-sm text-white/80 bg-white/5 p-3 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <Share className="w-4 h-4 text-primary" />
                                    <span>Tap the <span className="font-bold text-white">Share</span> button</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PlusSquare className="w-4 h-4 text-white" />
                                    <span>Select <span className="font-bold text-white">Add to Home Screen</span></span>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleInstallClick}
                                className="w-full py-3 bg-gradient-to-r from-primary to-accent rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
                            >
                                <Download className="w-5 h-5" />
                                Install App
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
