import React, { useState } from 'react';
import { Camera, ChevronLeft, Info, Play, Scan, Utensils, Zap, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeGymMachine } from '../services/geminiVision';
import { useUser } from '../context/UserContext';

const AICamera = () => {
    const navigate = useNavigate();
    const { logFood } = useUser();
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [scanMode, setScanMode] = useState('gym'); // 'gym' or 'food'
    const [foodLogged, setFoodLogged] = useState(false);

    const handleCapture = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImageUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
            setFoodLogged(false);

            // Auto analyze
            await analyze(file);
        }
    };

    const analyze = async (file) => {
        setIsAnalyzing(true);
        // Pass the current mode to the vision service
        const response = await analyzeGymMachine(file, scanMode);
        setIsAnalyzing(false);

        if (response.success) {
            if (scanMode === 'gym') {
                if (response.data.isMachine) {
                    setResult(response.data);
                } else {
                    setError(response.data.message || "No known machine detected.");
                }
            } else {
                // Food Mode
                if (response.data.isFood) {
                    setResult(response.data);
                } else {
                    setError(response.data.message || "No food detected.");
                }
            }
        } else {
            setError(response.error);
        }
    };

    const handleLogFood = () => {
        if (result && result.isFood) {
            logFood(result.calories, result.protein, result.carbs, result.fat);
            setFoodLogged(true);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 p-4 flex items-center justify-between bg-black/80 backdrop-blur z-50 border-b border-white/10">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/60 hover:text-white">
                        <ChevronLeft />
                    </button>
                    <div className="ml-2 font-bold text-lg flex items-center gap-2">
                        <Scan className="text-secondary w-5 h-5" />
                        <span>Neural Scan</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-24 px-4 max-w-lg mx-auto">

                {/* Mode Toggle */}
                <div className="flex p-1 bg-white/5 rounded-2xl mb-6 border border-white/10">
                    <button
                        onClick={() => { setScanMode('gym'); setResult(null); setError(null); setImageUrl(null); }}
                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${scanMode === 'gym' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-white/40 hover:text-white'}`}
                    >
                        <Scan className="w-4 h-4" />
                        GYM EQUIPMENT
                    </button>
                    <button
                        onClick={() => { setScanMode('food'); setResult(null); setError(null); setImageUrl(null); }}
                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${scanMode === 'food' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-white/40 hover:text-white'}`}
                    >
                        <Utensils className="w-4 h-4" />
                        NUTRITION
                    </button>
                </div>

                {/* Image Preview / Placeholder */}
                <div className={`relative aspect-[3/4] bg-white/5 rounded-3xl border border-white/10 overflow-hidden mb-6 flex items-center justify-center group ${scanMode === 'food' ? 'hover:border-green-500/50' : 'hover:border-secondary/50'} transition-all`}>
                    {imageUrl ? (
                        <>
                            <img src={imageUrl} alt="Analysis Target" className="w-full h-full object-cover" />
                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center animate-in fade-in">
                                    <div className={`w-16 h-16 border-4 ${scanMode === 'food' ? 'border-green-500' : 'border-secondary'} border-t-transparent rounded-full animate-spin mb-4`} />
                                    <p className={`${scanMode === 'food' ? 'text-green-500' : 'text-secondary'} font-mono animate-pulse`}>
                                        {scanMode === 'food' ? 'ANALYZING MACROS...' : 'IDENTIFYING MACHINE...'}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center p-6">
                            <div className={`w-20 h-20 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4 border border-dashed border-white/20 transition-colors ${scanMode === 'food' ? 'group-hover:border-green-500' : 'group-hover:border-secondary'}`}>
                                <Camera className={`w-8 h-8 text-white/40 transition-colors ${scanMode === 'food' ? 'group-hover:text-green-500' : 'group-hover:text-secondary'}`} />
                            </div>
                            <h3 className="font-bold text-white mb-1">
                                {scanMode === 'food' ? 'Scan Food' : 'Scan Machine'}
                            </h3>
                            <p className="text-sm text-white/40">
                                {scanMode === 'food' ? 'Calculate calories & macros instantly' : 'Identify equipment & exercises'}
                            </p>
                        </div>
                    )}

                    {/* Hidden Input for Camera/File */}
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleCapture}
                        disabled={isAnalyzing}
                    />
                </div>

                {/* Results - MACHINE Mode */}
                {result && scanMode === 'gym' && (
                    <div className="glass-panel p-6 rounded-3xl animate-slide-in">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{result.name}</h2>
                                <p className="text-sm text-secondary font-mono mt-1">CONFIDENCE: 98%</p>
                            </div>
                            <div className="p-2 bg-white/5 rounded-xl">
                                <Info className="w-6 h-6 text-white/60" />
                            </div>
                        </div>

                        <p className="text-white/60 mb-6 text-sm leading-relaxed">
                            {result.description}
                        </p>

                        <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider opacity-80">Suggested Exercises</h3>
                        <div className="space-y-3">
                            {result.exercises.map((ex, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                                    <div>
                                        <div className="font-bold text-white">{ex.name}</div>
                                        <div className="text-xs text-white/40">{ex.difficulty}</div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/encyclopedia?search=${encodeURIComponent(ex.name)}`)}
                                        className="p-2 rounded-full bg-secondary/20 text-secondary group-hover:bg-secondary group-hover:text-white transition-all"
                                    >
                                        <Play className="w-4 h-4 fill-current" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results - FOOD Mode */}
                {result && scanMode === 'food' && (
                    <div className="glass-panel p-6 rounded-3xl animate-slide-in border-green-500/30">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{result.name}</h2>
                                <p className="text-sm text-green-500 font-mono mt-1">{result.calories} kCal</p>
                            </div>
                            <div className="p-2 bg-green-500/20 text-green-500 rounded-xl">
                                <Utensils className="w-6 h-6" />
                            </div>
                        </div>

                        <p className="text-white/60 mb-6 text-sm leading-relaxed">
                            {result.description}
                        </p>

                        {/* Macros Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="p-3 bg-white/5 rounded-2xl text-center">
                                <span className="block text-xs text-white/40 mb-1">PROTEIN</span>
                                <span className="font-bold text-lg text-white">{result.protein}g</span>
                            </div>
                            <div className="p-3 bg-white/5 rounded-2xl text-center">
                                <span className="block text-xs text-white/40 mb-1">CARBS</span>
                                <span className="font-bold text-lg text-white">{result.carbs}g</span>
                            </div>
                            <div className="p-3 bg-white/5 rounded-2xl text-center">
                                <span className="block text-xs text-white/40 mb-1">FAT</span>
                                <span className="font-bold text-lg text-white">{result.fat}g</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogFood}
                            disabled={foodLogged}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${foodLogged ? 'bg-green-500 text-white cursor-default' : 'bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white'}`}
                        >
                            {foodLogged ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    LOGGED
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    ADD TO DIARY
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center animate-shake">
                        <p className="font-bold">Scan Error</p>
                        <p className="text-sm opacity-80 mt-1">{error}</p>
                        <button
                            className="mt-3 text-xs bg-red-500/20 px-3 py-1 rounded-full hover:bg-red-500/30 transition-colors"
                            onClick={() => setError(null)}
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>

            {/* Global Footer */}
            <div className="fixed bottom-4 left-0 right-0 text-center pointer-events-none z-0">
                <p className="text-white/20 text-xs font-mono uppercase tracking-widest">
                    Created By Juan Carlos Alvarado
                </p>
            </div>
        </div>
    );
};

export default AICamera;
