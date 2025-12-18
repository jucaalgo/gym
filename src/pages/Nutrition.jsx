import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Camera,
    X,
    Check,
    RefreshCw,
    Zap,
    Target,
    Plus,
    ChevronRight,
    Scan,
    AlertCircle,
    Utensils
} from 'lucide-react';
import { useUser } from '../context/UserContext';

// ═══════════════════════════════════════════════════════════════
// SNAP & TRACK - VISION AI NUTRITION MODULE
// Zero UI: Camera First, AI Detection Simulation
// ═══════════════════════════════════════════════════════════════

// Simulated YOLO Detection Database
const FOOD_DATABASE = {
    'pollo': { name: 'Pollo a la Plancha', calories: 165, protein: 31, carbs: 0, fat: 3.6, perGram: true },
    'arroz': { name: 'Arroz Blanco', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, perGram: true },
    'ensalada': { name: 'Ensalada Verde', calories: 15, protein: 1.2, carbs: 2.5, fat: 0.2, perGram: true },
    'huevo': { name: 'Huevo Cocido', calories: 155, protein: 13, carbs: 1.1, fat: 11, perGram: true },
    'platano': { name: 'Plátano', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, perGram: true },
    'pan': { name: 'Pan Integral', calories: 247, protein: 13, carbs: 41, fat: 3.4, perGram: true },
    'aguacate': { name: 'Aguacate', calories: 160, protein: 2, carbs: 9, fat: 15, perGram: true },
    'salmon': { name: 'Salmón', calories: 208, protein: 20, carbs: 0, fat: 13, perGram: true },
    'pasta': { name: 'Pasta Cocida', calories: 131, protein: 5, carbs: 25, fat: 1.1, perGram: true },
    'yogur': { name: 'Yogur Griego', calories: 59, protein: 10, carbs: 3.6, fat: 0.7, perGram: true },
};

const Nutrition = () => {
    const { user, logFood, getCurrentArchetype } = useUser();
    const [phase, setPhase] = useState('camera'); // camera, scanning, results, confirm
    const [isScanning, setIsScanning] = useState(false);
    const [detectedItems, setDetectedItems] = useState([]);
    const [scanProgress, setScanProgress] = useState(0);
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);

    const archetype = getCurrentArchetype();

    // Start camera
    useEffect(() => {
        if (phase === 'camera') {
            startCamera();
        }
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [phase]);

    const startCamera = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.warn('Cámara no soportada en este entorno');
            return;
        }

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
        } catch (err) {
            console.log('Camera not available, using simulation mode');
        }
    };

    const simulateYOLODetection = () => {
        // Simulate AI detection with random food items
        const foodKeys = Object.keys(FOOD_DATABASE);
        const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
        const detected = [];

        for (let i = 0; i < numItems; i++) {
            const randomKey = foodKeys[Math.floor(Math.random() * foodKeys.length)];
            const food = FOOD_DATABASE[randomKey];
            const estimatedWeight = Math.floor(Math.random() * 150) + 50; // 50-200g

            detected.push({
                id: `${randomKey}-${Date.now()}-${i}`,
                ...food,
                estimatedWeight,
                totalCalories: Math.round((food.calories / 100) * estimatedWeight),
                totalProtein: Math.round((food.protein / 100) * estimatedWeight * 10) / 10,
                totalCarbs: Math.round((food.carbs / 100) * estimatedWeight * 10) / 10,
                totalFat: Math.round((food.fat / 100) * estimatedWeight * 10) / 10,
                confidence: Math.floor(Math.random() * 15) + 85, // 85-99%
            });
        }

        return detected;
    };

    const handleCapture = () => {
        setPhase('scanning');
        setIsScanning(true);
        setScanProgress(0);

        // Simulate scanning animation
        const scanInterval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(scanInterval);
                    setIsScanning(false);

                    // Simulate detection results
                    const results = simulateYOLODetection();
                    setDetectedItems(results);
                    setPhase('results');

                    return 100;
                }
                return prev + 2;
            });
        }, 40);
    };

    const handleConfirm = () => {
        // Log all detected items
        const totals = detectedItems.reduce((acc, item) => ({
            calories: acc.calories + item.totalCalories,
            protein: acc.protein + item.totalProtein,
            carbs: acc.carbs + item.totalCarbs,
            fat: acc.fat + item.totalFat,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        logFood(totals.calories, totals.protein, totals.carbs, totals.fat);

        setPhase('confirm');
        setTimeout(() => {
            setPhase('camera');
            setDetectedItems([]);
        }, 2000);
    };

    const handleRetry = () => {
        setPhase('camera');
        setDetectedItems([]);
        setScanProgress(0);
    };

    const getTotalMacros = () => {
        return detectedItems.reduce((acc, item) => ({
            calories: acc.calories + item.totalCalories,
            protein: acc.protein + item.totalProtein,
            carbs: acc.carbs + item.totalCarbs,
            fat: acc.fat + item.totalFat,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="p-6 pb-4">
                <div className="flex items-center gap-2 text-secondary mb-2">
                    <Camera className="w-5 h-5" />
                    <span className="text-sm font-medium uppercase tracking-wider">Snap & Track</span>
                </div>
                <h1 className="text-3xl font-bold text-white">
                    {phase === 'camera' && 'Escanea tu Comida'}
                    {phase === 'scanning' && 'Analizando...'}
                    {phase === 'results' && 'Análisis Completo'}
                    {phase === 'confirm' && '¡Registrado!'}
                </h1>
                <p className="text-white/60 mt-1">
                    {phase === 'camera' && 'Apunta la cámara a tu plato y presiona capturar'}
                    {phase === 'scanning' && 'La IA está identificando los alimentos'}
                    {phase === 'results' && 'Confirma los resultados del análisis'}
                </p>
            </header>

            {/* ═══════════════════════════════════════════════════════════════
          CAMERA PHASE
          ═══════════════════════════════════════════════════════════════ */}
            {phase === 'camera' && (
                <div className="px-6">
                    {/* Camera Preview */}
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-black/50 mb-6">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Grid Overlay */}
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="border border-white/10" />
                            ))}
                        </div>

                        {/* Corner Markers */}
                        <div className="absolute inset-8 pointer-events-none">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-secondary rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-secondary rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary rounded-br-lg" />
                        </div>

                        {/* Center Target */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 border-2 border-secondary/50 rounded-full flex items-center justify-center">
                                <Target className="w-6 h-6 text-secondary/50" />
                            </div>
                        </div>

                        {/* Camera placeholder if no stream */}
                        {!stream && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                                <div className="text-center">
                                    <Camera className="w-12 h-12 text-white/40 mx-auto mb-2" />
                                    <p className="text-white/50 text-sm">Modo simulación activo</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Capture Button */}
                    <button
                        onClick={handleCapture}
                        className="w-full py-5 rounded-2xl bg-gradient-to-r from-secondary to-pink-500 text-white font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-lg shadow-secondary/25"
                    >
                        <Camera className="w-6 h-6" />
                        <span>CAPTURAR</span>
                    </button>

                    {/* Today's Progress */}
                    <div className="glass-panel rounded-2xl p-4 mt-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-white/60 text-sm">Progreso de Hoy</span>
                            <span className="text-white/40 text-sm">{user?.todayCalories || 0} / {user?.calorieGoal || 2000} kcal</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-secondary to-pink-500 rounded-full transition-all"
                                style={{ width: `${Math.min(((user?.todayCalories || 0) / (user?.calorieGoal || 2000)) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
          SCANNING PHASE
          ═══════════════════════════════════════════════════════════════ */}
            {phase === 'scanning' && (
                <div className="px-6">
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-black/50 mb-6">
                        {/* Simulated image placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-surface to-black flex items-center justify-center">
                            <Utensils className="w-24 h-24 text-white/20" />
                        </div>

                        {/* Scanning Line Animation */}
                        <motion.div
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-[2px] bg-secondary shadow-[0_0_15px_var(--color-secondary)] z-10"
                        />

                        {/* Neural Bounding Boxes */}
                        {scanProgress > 20 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-[20%] left-[15%] w-[40%] h-[30%] border-2 border-primary/50 rounded-sm"
                            >
                                <div className="absolute top-0 left-0 bg-primary text-black text-[10px] font-bold px-1.5 font-['Roboto_Mono']">PROTEIN_UNIT_01</div>
                                <div className="absolute bottom-0 right-0 text-[8px] text-primary/70 p-1">CONF: 98.2%</div>
                            </motion.div>
                        )}
                        {scanProgress > 50 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute bottom-[20%] right-[15%] w-[35%] h-[25%] border-2 border-accent/50 rounded-sm"
                            >
                                <div className="absolute top-0 left-0 bg-accent text-black text-[10px] font-bold px-1.5 font-['Roboto_Mono']">CARB_UNIT_02</div>
                                <div className="absolute bottom-0 right-0 text-[8px] text-accent/70 p-1">CONF: 94.7%</div>
                            </motion.div>
                        )}

                        {/* HUD Elements */}
                        <div className="absolute top-4 left-4 text-[10px] font-['Roboto_Mono'] text-white/30 space-y-1">
                            <div>SCAN_MODE: VOLUME_METRIC</div>
                            <div>SENSOR: SONY_IMX_766</div>
                            <div>AI_CORE: NEURAL_LENS_v4</div>
                        </div>

                        {/* Progress Overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="glass-panel rounded-xl p-4 bg-black/60 backdrop-blur-md">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="w-4 h-4 text-secondary animate-spin" />
                                        <span className="text-white text-xs font-bold font-['Orbitron'] tracking-widest uppercase">Analyzing Molecular Data</span>
                                    </div>
                                    <span className="text-secondary font-['Roboto_Mono'] text-xs font-bold">{scanProgress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-secondary"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${scanProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-secondary/10 border border-secondary/20">
                            <Utensils className="w-3 h-3 text-secondary" />
                            <span className="text-[10px] text-secondary font-bold font-['Roboto_Mono'] uppercase">Identifying Food_Group_Sigma</span>
                        </div>
                        <p className="text-white/40 text-xs text-center font-['Roboto_Mono'] animate-pulse italic">
                            Aislado térmico y cálculo volumétrico en progreso...
                        </p>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
          RESULTS PHASE
          ═══════════════════════════════════════════════════════════════ */}
            {phase === 'results' && (
                <div className="px-6">
                    {/* Detected Items */}
                    <div className="space-y-3 mb-6">
                        {detectedItems.map((item, idx) => (
                            <div key={item.id} className="glass-panel rounded-2xl p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="text-lg font-semibold text-white">{item.name}</div>
                                        <div className="text-sm text-white/50">
                                            ~{item.estimatedWeight}g detectados • {item.confidence}% confianza
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">{item.totalCalories}</div>
                                        <div className="text-xs text-white/40">kcal</div>
                                    </div>
                                </div>

                                {/* Macro Pills */}
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                                        P: {item.totalProtein}g
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-slate-700 text-slate-200 text-xs font-medium">
                                        C: {item.totalCarbs}g
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-medium">
                                        G: {item.totalFat}g
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="glass-panel rounded-2xl p-5 mb-6 border border-secondary/30">
                        <div className="text-sm text-secondary uppercase tracking-wider mb-3">Total Estimado</div>
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-white">{getTotalMacros().calories}</div>
                                <div className="text-xs text-white/40">kcal</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-400">{getTotalMacros().protein.toFixed(1)}</div>
                                <div className="text-xs text-white/40">proteína</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-200">{getTotalMacros().carbs.toFixed(1)}</div>
                                <div className="text-xs text-white/40">carbos</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-rose-400">{getTotalMacros().fat.toFixed(1)}</div>
                                <div className="text-xs text-white/40">grasa</div>
                            </div>
                        </div>
                    </div>

                    {/* Post-workout adjustment hint */}
                    {archetype?.id === 'guerrero' && (
                        <div className="glass-panel rounded-xl p-3 mb-6 border-l-4 border-primary">
                            <div className="flex items-center gap-2 text-primary text-sm">
                                <Zap className="w-4 h-4" />
                                <span>Protocolo Guerrero: +15% carbohidratos recomendados post-entreno</span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleRetry}
                            className="flex-1 py-4 rounded-2xl bg-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Reintentar</span>
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-success to-emerald-500 text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                        >
                            <Check className="w-5 h-5" />
                            <span>Confirmar</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
          CONFIRM PHASE (Success Animation)
          ═══════════════════════════════════════════════════════════════ */}
            {phase === 'confirm' && (
                <div className="px-6 py-12 text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-success to-emerald-400 flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Check className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">¡Comida Registrada!</h2>
                    <p className="text-white/60">+5 XP ganados</p>
                </div>
            )}
        </div>
    );
};

export default Nutrition;
