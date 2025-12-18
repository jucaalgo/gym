import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, ChevronLeft, Scan, RefreshCw, Zap, Image as ImageIcon, X, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeGymMachine } from '../services/geminiVision';
import { useUser } from '../context/UserContext';
import { ALL_EXERCISES } from '../data/musclewiki_exercises';
import soundManager from '../utils/sounds';
import VisualAsset from '../components/ui/VisualAsset';

const AICamera = () => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const [image, setImage] = useState(null); // base64 or blob
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [cameraMode, setCameraMode] = useState(true); // true = webcam, false = upload
    const [suggestedExercises, setSuggestedExercises] = useState([]);

    const videoConstraints = {
        width: 720,
        height: 1280,
        facingMode: "environment"
    };

    const handleCapture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        soundManager.play('click');
        analyze(imageSrc);
    }, [webcamRef]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // base64
                soundManager.play('click');
                analyze(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyze = async (imageBase64) => {
        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            // Convert base64 to file object if needed, OR update service to accept base64
            // Our updated service logic below handles standard file object, we might need to adapt it 
            // OR we adapt the service call.
            // For simplicity, we'll assume the service can handle a File object, so we convert Base64 -> Blob -> File

            const res = await fetch(imageBase64);
            const blob = await res.blob();
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

            const response = await analyzeGymMachine(file, 'gym');

            if (response.success && response.data.isMachine) {
                setResult(response.data);
                soundManager.play('success');

                // Find matching exercises in our database
                if (response.data.primaryMuscle) {
                    const muscle = response.data.primaryMuscle;
                    const matches = ALL_EXERCISES.filter(ex =>
                        ex.primaryMuscle.toLowerCase() === muscle.toLowerCase() ||
                        ex.secondaryMuscles.some(m => m.toLowerCase() === muscle.toLowerCase())
                    ).slice(0, 5); // Top 5 matches
                    setSuggestedExercises(matches);
                }
            } else {
                setError(response.data?.message || "Could not identify machine.");
                soundManager.play('error');
            }
        } catch (err) {
            console.error(err);
            setError("Analysis failed. Please try again.");
            soundManager.play('error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetScan = () => {
        setImage(null);
        setResult(null);
        setError(null);
        setSuggestedExercises([]);
    };

    return (
        <div className="min-h-screen bg-black text-white pb-20 relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 z-50 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-black/40 backdrop-blur border border-white/10">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-bold tracking-wider">AI VISION</span>
                </div>
            </div>

            {/* Camera View */}
            <div className="relative h-screen w-full flex flex-col pt-20 pb-32 px-4">
                {!image ? (
                    cameraMode ? (
                        <div className="relative flex-1 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                className="w-full h-full object-cover"
                                onUserMediaError={(err) => {
                                    console.error("Camera denied/error:", err);
                                    setError("Camera access blocked. Check browser permissions or use HTTPS.");
                                    soundManager.play('error');
                                }}
                            />
                            {/* Scanning Overlay */}
                            <div className="absolute inset-0 border-2 border-secondary/50 rounded-3xl animate-pulse opacity-50 pointer-events-none"></div>
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-secondary shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-scan-line"></div>
                        </div>
                    ) : (
                        <div className="flex-1 rounded-3xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center bg-zinc-900/50">
                            <ImageIcon className="w-16 h-16 text-white/20 mb-4" />
                            <p className="text-white/50 mb-6">Upload an image to analyze</p>
                            <label className="px-6 py-3 bg-white/10 rounded-xl font-bold cursor-pointer hover:bg-white/20 transition-colors">
                                Select Image
                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </label>
                        </div>
                    )
                ) : (
                    <div className="relative flex-1 rounded-3xl overflow-hidden border border-white/10 bg-black">
                        <img src={image} alt="Captured" className="w-full h-full object-contain opacity-50 blur-sm" />

                        {/* Analysis Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/50 backdrop-blur-md">
                            {isAnalyzing ? (
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <h3 className="text-xl font-bold animate-pulse">Analyzing Neural Net...</h3>
                                    <p className="text-white/50 text-sm mt-2">Identifying equipment & biomechanics</p>
                                </div>
                            ) : result ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full max-h-full overflow-y-auto"
                                >
                                    <div className="bg-gradient-to-br from-secondary/20 to-primary/20 p-1 rounded-2xl mb-6">
                                        <div className="bg-zinc-900 rounded-xl p-6 border border-white/10 text-center relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-20"><Zap className="w-24 h-24" /></div>
                                            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary mb-2">
                                                {result.name}
                                            </h2>
                                            <p className="text-white/80 leading-relaxed mb-4">{result.description}</p>
                                            <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-secondary border border-secondary/30">
                                                Muscle Target: {result.primaryMuscle}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Matches */}
                                    {suggestedExercises.length > 0 && (
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2">JCA Gym Matches</h3>
                                            {suggestedExercises.map(ex => (
                                                <div key={ex.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                        <VisualAsset
                                                            exercise={ex}
                                                            type="3d_viewer"
                                                            className="w-full h-full"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-white text-sm">{ex.name}</div>
                                                        <div className="text-xs text-white/40">{ex.sets} sets x {ex.reps} reps</div>
                                                    </div>
                                                    <button onClick={() => navigate('/encyclopedia')} className="p-2 rounded-full bg-white/10 text-white/60">
                                                        <ChevronLeft className="w-4 h-4 rotate-180" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button onClick={resetScan} className="w-full mt-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors">
                                        Scan Another
                                    </button>
                                </motion.div>
                            ) : error ? (
                                <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <X className="w-6 h-6 text-red-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-red-400 mb-2">Scan Failed</h3>
                                    <p className="text-white/60 text-sm mb-6">{error}</p>
                                    <button onClick={resetScan} className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                                        Try Again
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            {!image && (
                <div className="fixed bottom-0 left-0 right-0 p-8 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent z-40 flex items-center justify-center gap-8">
                    <button
                        onClick={() => setCameraMode(!cameraMode)}
                        className="p-4 rounded-full bg-white/5 backdrop-blur border border-white/10 text-white/60 hover:bg-white/10 transition-colors"
                    >
                        {cameraMode ? <ImageIcon className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                    </button>

                    {cameraMode && (
                        <button
                            onClick={handleCapture}
                            className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center relative group"
                        >
                            <div className="w-16 h-16 bg-white rounded-full transition-transform group-active:scale-90"></div>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AICamera;
