/**
 * Hyper-Vision View (STATE A)
 * Camera scanning with AR hotspots and equipment detection
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraFeed from '../components/camera/CameraFeed';
import AROverlay from '../components/camera/AROverlay';
import EquipmentCard from '../components/camera/EquipmentCard';
import { getVisionService } from '../services/visionService';
import { useUser } from '../context/UserContext';

export default function HyperVisionView() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [videoElement, setVideoElement] = useState(null);
    const [detections, setDetections] = useState([]);
    const [selectedDetection, setSelectedDetection] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const visionService = useRef(null);

    useEffect(() => {
        // Initialize vision service
        visionService.current = getVisionService();
        visionService.current.initialize();

        return () => {
            // Cleanup on unmount
            if (visionService.current) {
                visionService.current.stopDetection();
            }
        };
    }, []);

    function handleVideoReady(video) {
        setVideoElement(video);
        startScanning(video);
    }

    function startScanning(video) {
        if (!visionService.current || !video) return;

        setIsScanning(true);

        // Start continuous detection
        visionService.current.startDetection(
            video,
            (newDetections) => {
                setDetections(newDetections);
            },
            1500 // Scan every 1.5 seconds
        );
    }

    function stopScanning() {
        if (visionService.current) {
            visionService.current.stopDetection();
        }
        setIsScanning(false);
    }

    function handleHotspotClick(detection) {
        setSelectedDetection(detection);
        stopScanning(); // Pause scanning when card is open
    }

    function handleCloseCard() {
        setSelectedDetection(null);
        if (videoElement) {
            startScanning(videoElement); // Resume scanning
        }
    }

    function handleSelectRoutine(routine) {
        console.log('Selected routine:', routine);

        // TODO: Save routine as "Routine of the Day" in user context
        // For now, navigate to routines page
        navigate('/routines', { state: { selectedRoutine: routine } });
    }

    return (
        <div className="fixed inset-0 bg-black">
            {/* Camera Feed */}
            <CameraFeed
                onVideoReady={handleVideoReady}
                isActive={true}
            />

            {/* AR Overlay */}
            {videoElement && (
                <AROverlay
                    detections={detections}
                    onHotspotClick={handleHotspotClick}
                    videoElement={videoElement}
                />
            )}

            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top Bar */}
                <div className="absolute top-0 left-0 right-0 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-[#00D4FF] font-['Orbitron'] text-2xl mb-1">
                                HYPER-VISION
                            </div>
                            <div className="text-white/60 text-sm font-['Roboto_Mono']">
                                {isScanning ? '🔍 Scanning...' : '⏸️ Paused'}
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="pointer-events-auto bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-black/70 transition-colors border border-white/20"
                        >
                            Exit
                        </button>
                    </div>
                </div>

                {/* Detection Counter */}
                <div className="absolute top-24 right-6">
                    <div className="bg-black/70 backdrop-blur-sm px-4 py-3 rounded-lg border border-[#00D4FF]/30">
                        <div className="text-[#00D4FF] font-['Roboto_Mono'] text-xl">
                            {detections.length}
                        </div>
                        <div className="text-white/60 text-xs uppercase tracking-wider">
                            Detected
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                {detections.length === 0 && isScanning && (
                    <div className="absolute bottom-8 left-0 right-0 px-6">
                        <div className="bg-black/70 backdrop-blur-sm px-6 py-4 rounded-lg mx-auto max-w-md text-center border border-[#00D4FF]/30">
                            <div className="text-white text-sm mb-2">
                                👁️ Point camera at gym equipment
                            </div>
                            <div className="text-gray-400 text-xs">
                                Tap on detected equipment to view exercises and routines
                            </div>
                        </div>
                    </div>
                )}

                {/* Equipment List */}
                {detections.length > 0 && (
                    <div className="absolute bottom-8 left-6">
                        <div className="bg-black/70 backdrop-blur-sm px-4 py-3 rounded-lg border border-[#39FF14]/30 max-w-xs">
                            <div className="text-[#39FF14] text-xs uppercase tracking-wider mb-2">
                                Equipment Found
                            </div>
                            <div className="space-y-1">
                                {detections.map((det, i) => (
                                    <div key={i} className="text-white text-sm font-['Roboto_Mono'] flex items-center justify-between">
                                        <span>{det.label}</span>
                                        <span className="text-[#39FF14] text-xs ml-2">
                                            {Math.round(det.confidence * 100)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Equipment Card Modal */}
            {selectedDetection && (
                <EquipmentCard
                    detection={selectedDetection}
                    onSelectRoutine={handleSelectRoutine}
                    onClose={handleCloseCard}
                    userGender={user?.gender || 'female'}
                />
            )}
        </div>
    );
}
