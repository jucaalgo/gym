import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Zap,
    Target,
    Camera,
    Trophy,
    Flame,
    TrendingUp,
    Clock,
    Dumbbell,
    ChevronRight,
    Sparkles,
    Brain,
    RefreshCw,
    X,
    Scan
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { ALL_ROUTINES } from '../data/musclewiki_routines';
import CountUp from '../components/ui/CountUp';
import soundManager from '../utils/sounds';
import voiceManager from '../utils/voiceManager';
import { triggerHaptic } from '../utils/haptics';

// ═══════════════════════════════════════════════════════════════
// BENTO GRID DASHBOARD - HUD STYLE
// ═══════════════════════════════════════════════════════════════

const Dashboard = () => {
    const { user, getCurrentArchetype } = useUser();
    const navigate = useNavigate();
    const archetype = getCurrentArchetype();

    const [showRoutineSelector, setShowRoutineSelector] = useState(false);
    const [availableRoutines, setAvailableRoutines] = useState([]);
    const [selectedRoutineId, setSelectedRoutineId] = useState(null);
    const [loadingRoutines, setLoadingRoutines] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(voiceManager.isEnabled());

    const toggleVoice = () => {
        const newState = voiceManager.toggle();
        setVoiceEnabled(newState);
        if (newState) {
            voiceManager.greet();
        }
    };

    // Load routines when selector opens
    useEffect(() => {
        if (showRoutineSelector) {
            setAvailableRoutines(ALL_ROUTINES);
        }
    }, [showRoutineSelector]);



    const handleStartWorkout = () => {
        if (selectedRoutineId) {
            navigate('/matrix', { state: { routineId: selectedRoutineId } });
        } else {
            navigate('/matrix');
        }
    };

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${archetype.color} flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/10`}>
                        {archetype.icon}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white leading-tight">
                            Status: <span className="text-primary uppercase tracking-tighter">Online</span>
                        </h1>
                        <p className="text-white/40 text-xs font-['Roboto_Mono'] uppercase tracking-widest">
                            {user.name} • {user.rank}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex flex-col items-end">
                        <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">System Load</div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`w-3 h-1 rounded-full ${i <= 3 ? 'bg-primary' : 'bg-white/10'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </header >

            {/* ═══ AI CONTROL CENTER (NEW TOP ROW) ═══ */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Voice AI Toggle */}
                <button
                    onClick={toggleVoice}
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${voiceEnabled
                        ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(0,212,255,0.3)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                >
                    <div className={`p-3 rounded-full ${voiceEnabled ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/40'}`}>
                        {voiceEnabled ? <Sparkles className="w-6 h-6 animate-pulse" /> : <Sparkles className="w-6 h-6" />}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${voiceEnabled ? 'text-white' : 'text-white/40'}`}>
                        {voiceEnabled ? 'Voice AI: ACTIVO' : 'Voice AI: PAUSADO'}
                    </span>
                </button>

                {/* Hyper-Vision Camera */}
                <Link to="/scan" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-2 group">
                    <div className="p-3 rounded-full bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                        <Scan className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/60 group-hover:text-white">Hyper-Vision</span>
                </Link>

                {/* Nutrition Camera (Moved from Grid) */}
                <Link to="/nutrition" className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-2 group">
                    <div className="p-3 rounded-full bg-green-500/10 text-green-500 group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/60 group-hover:text-white">Control Dieta</span>
                </Link>
            </div>


            {/* BENTO GRID */}
            < div className="grid grid-cols-12 gap-4 auto-rows-auto md:auto-rows-[140px]" >

                {/* ═══ NEURAL READINESS (NEW) ═══ */}
                < div className="col-span-12 md:col-span-8 row-span-1 glass-panel rounded-3xl p-5 border-white/10 relative overflow-hidden bg-[#0a0a0a]" >
                    <div className="absolute top-0 right-0 p-4">
                        <motion.div
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-[8px] font-['Roboto_Mono'] text-white/20 text-right"
                        >
                            BIOMETRIC_STREAM_CONNECTED<br />
                            ENCRYPTED_V_SCAN_v1.2.4
                        </motion.div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6 h-full">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                <motion.circle
                                    cx="48" cy="48" r="40" fill="none"
                                    stroke={user.hrv > 70 ? "#00D4FF" : "#FF3B30"}
                                    strokeWidth="8"
                                    strokeDasharray="251.2"
                                    initial={{ strokeDashoffset: 251.2 }}
                                    animate={{ strokeDashoffset: 251.2 - (251.2 * (user.hrv / 100)) }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-white">{user.hrv || 75}</span>
                                <span className="text-[8px] text-white/40 uppercase">ms HRV</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4 text-primary" />
                                <h3 className="text-sm font-bold text-white font-['Orbitron'] tracking-widest uppercase">Neural Readiness</h3>
                            </div>
                            <p className="text-sm text-white font-medium">
                                {user.hrv > 80 ? "SISTEMA OPTIMIZADO: Potencial de Sobrecarga Máximo." :
                                    user.hrv > 65 ? "SISTEMA ESTABLE: Mantener volumen programado." :
                                        "FATIGA DETECTADA: Priorizar recuperación técnica."}
                            </p>
                            <div className="flex gap-4">
                                <div className="text-[10px] text-white/40 font-['Roboto_Mono']">SLEEP: <span className="text-white">{user.sleepScore || 82}%</span></div>
                                <div className="text-[10px] text-white/40 font-['Roboto_Mono']">RHR: <span className="text-white">{user.restingHR || 62} bpm</span></div>
                            </div>
                        </div>
                    </div>
                </div >

                {/* ═══ TOTAL STATS ═══ */}
                < div className="col-span-12 md:col-span-4 row-span-1 glass-panel rounded-3xl p-5 border-white/10 bg-white/5" >
                    <div className="flex items-center gap-2 text-white/40 mb-3">
                        <Dumbbell className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Resumen de Actividad</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                            <div className="text-xl font-bold text-white leading-none whitespace-nowrap">{user.totalWorkouts}</div>
                            <div className="text-[9px] text-white/30 uppercase mt-1">Sesiones</div>
                        </div>
                        <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                            <div className="text-xl font-bold text-white leading-none whitespace-nowrap">{Math.round(user.totalMinutes / 60)}h</div>
                            <div className="text-[9px] text-white/30 uppercase mt-1">Tiempo</div>
                        </div>
                        <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                            <div className="text-xl font-bold text-white leading-none whitespace-nowrap">{(user.caloriesBurned / 1000).toFixed(1)}k</div>
                            <div className="text-[9px] text-white/30 uppercase mt-1">Kcal</div>
                        </div>
                    </div>
                </div >

                {/* ═══ MAIN MISSION CARD (Large) ═══ */}
                < div className="col-span-12 md:col-span-8 row-span-2 glass-panel rounded-3xl p-6 hover:border-primary/50 transition-all duration-300 relative overflow-hidden border-primary/20 bg-primary/5" >
                    {/* HUD Scanline Effect */}
                    < div className="absolute top-0 left-0 right-0 h-[1px] bg-primary/20 animate-scan pointer-events-none" />

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <Target className="w-5 h-5 animate-pulse" />
                                    <span className="text-sm font-bold uppercase tracking-[0.2em] font-['Orbitron']">MISIÓN CRÍTICA</span>
                                </div>
                                <button
                                    onClick={() => setShowRoutineSelector(true)}
                                    className="p-2 rounded-lg bg-black/40 border border-white/5 text-white/60 hover:text-white transition-all active:scale-90"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-['Orbitron'] tracking-wide">
                                {selectedRoutineId ?
                                    availableRoutines.find(r => r.id === selectedRoutineId)?.name || `Protocol ${archetype.name}`
                                    : `Protocol ${archetype.name}`}
                            </h2>
                            <p className="text-white/50 text-sm leading-relaxed max-w-md italic">
                                "{selectedRoutineId ?
                                    availableRoutines.find(r => r.id === selectedRoutineId)?.description || archetype.description
                                    : archetype.description}"
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Tiempo</span>
                                    <span className="text-white font-['Roboto_Mono']">{user.timeAvailable}m</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Ejercicios</span>
                                    <span className="text-white font-['Roboto_Mono']">{selectedRoutineId ?
                                        availableRoutines.find(r => r.id === selectedRoutineId)?.exercises.length || 6
                                        : '6'}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleStartWorkout}
                                className="px-8 py-3 rounded-xl bg-primary text-black font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,212,255,0.4)] font-['Orbitron'] text-sm tracking-widest"
                            >
                                START <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div >

                {/* ═══ LEVEL & XP CARD ═══ */}
                < div className="col-span-6 md:col-span-4 row-span-1 glass-panel rounded-3xl p-5 flex flex-col justify-between" >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-accent">
                            <Trophy className="w-5 h-5" />
                            <span className="text-sm font-medium uppercase tracking-wider">Level</span>
                        </div>
                        <span className="text-2xl">{archetype.icon}</span>
                    </div>

                    <div>
                        <div className="text-4xl font-bold text-white">
                            <CountUp value={user.level} duration={1} />
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${archetype.color} rounded-full transition-all duration-500`}
                                style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
                            />
                        </div>
                        <div className="text-xs text-white/50 mt-1">
                            {user.xp} / {user.xpToNextLevel} XP
                        </div>
                    </div>
                </div >

                {/* ═══ STREAK CARD ═══ */}
                < div className="col-span-6 md:col-span-4 row-span-1 glass-panel rounded-3xl p-5 flex flex-col justify-between" >
                    <div className="flex items-center gap-2 text-warning">
                        <Flame className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase tracking-wider">Streak</span>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-4xl font-bold text-white">
                                <CountUp value={user.currentStreak} duration={0.8} />
                            </div>
                            <div className="text-sm text-white/50">days</div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-semibold text-warning">🔥</div>
                            <div className="text-xs text-white/40">Record: {user.longestStreak}</div>
                        </div>
                    </div>
                </div >


                {/* ═══ BIOMETRICS / ENERGY ═══ */}
                < div className="col-span-6 md:col-span-4 row-span-1 glass-panel rounded-3xl p-5" >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-success">
                            <Zap className="w-5 h-5" />
                            <span className="text-sm font-medium uppercase tracking-wider">Energy</span>
                        </div>
                        <Brain className="w-5 h-5 text-white/40" />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Energy Bar */}
                        <div className="flex-1">
                            <div className="flex justify-between text-xs text-white/50 mb-1">
                                <span>Energy Level</span>
                                <span>{user.energyLevel}/10</span>
                            </div>
                            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full transition-all"
                                    style={{ width: `${user.energyLevel * 10}%` }}
                                />
                            </div>
                        </div>

                        {/* Stress Indicator */}
                        <div className="text-center">
                            <div className={`text-2xl ${user.stressLevel > 7 ? 'text-error' : user.stressLevel > 4 ? 'text-warning' : 'text-success'}`}>
                                {user.stressLevel > 7 ? '😰' : user.stressLevel > 4 ? '😐' : '😊'}
                            </div>
                            <div className="text-xs text-white/40">Stress</div>
                        </div>
                    </div>
                </div >

                {/* ═══ TODAY'S NUTRITION ═══ */}
                < div className="col-span-12 md:col-span-8 row-span-1 glass-panel rounded-3xl p-5" >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-primary">
                            <TrendingUp className="w-5 h-5" />
                            <span className="text-sm font-medium uppercase tracking-wider">Calories Today</span>
                        </div>
                        <span className="text-sm text-white/50">{user.calorieGoal} kcal goal</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="text-3xl font-bold text-white">{user.todayCalories}</div>
                            <div className="text-sm text-white/50">kcal consumed</div>
                        </div>

                        {/* Macro Pills */}
                        <div className="flex flex-wrap gap-2">
                            <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                                P: {user.todayProtein}g
                            </div>
                            <div className="px-3 py-1 rounded-full bg-slate-700 text-slate-200 text-xs font-medium">
                                C: {user.todayCarbs}g
                            </div>
                            <div className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-medium">
                                F: {user.todayFat}g
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                            style={{ width: `${Math.min((user.todayCalories / user.calorieGoal) * 100, 100)}%` }}
                        />
                    </div>
                </div >

                {/* ═══ SLEEP ANALYSIS (NEW) ═══ */}
                <div className="col-span-12 md:col-span-4 glass-panel rounded-3xl p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider">Sueño / Recuperación</h3>
                        <div className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                            BETA
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-indigo-500" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * (user.sleepScore || 85)) / 100} />
                            </svg>
                            <span className="absolute text-sm font-bold text-white">{user.sleepScore || 85}%</span>
                        </div>
                        <div>
                            <div className="text-white font-bold text-lg">Calidad Óptima</div>
                            <div className="text-xs text-white/40">Basado en HRV y última sesión</div>
                        </div>
                    </div>
                </div>

            </div >

            {/* ═══ NAVIGATION HUB (NEW BOTTOM ROW) ═══ */}
            <div className="grid grid-cols-2 gap-4 pb-24">
                {/* 1. TRAINING (Primary) */}
                <Link to="/routines" className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center gap-3 group hover:border-[#00D4FF]/30 transition-all aspect-square sm:aspect-auto sm:py-6">
                    <div className="p-4 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] group-hover:bg-[#00D4FF]/20 group-hover:scale-110 transition-all duration-300">
                        <Dumbbell className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Entrenar</span>
                </Link>

                {/* 2. DAILY EXERCISES (Matrix) */}
                <Link to="/matrix" className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center gap-3 group hover:border-primary/30 transition-all aspect-square sm:aspect-auto sm:py-6">
                    <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <Zap className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Ejercicios</span>
                    <span className="text-[10px] text-white/40 -mt-2">del Día</span>
                </Link>

                {/* 3. ANALYTICS */}
                <Link to="/analytics" className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center gap-3 group hover:border-secondary/30 transition-all aspect-square sm:aspect-auto sm:py-6">
                    <div className="p-3 rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary/20 group-hover:scale-110 transition-all duration-300">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/60">Progreso</span>
                </Link>

                {/* 4. JOURNAL */}
                <Link to="/journal" className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center gap-3 group hover:border-white/20 transition-all aspect-square sm:aspect-auto sm:py-6">
                    <div className="p-3 rounded-full bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                        <div className="w-6 h-6">📖</div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/60">Diario</span>
                </Link>
            </div>

            {/* ═══ ROUTINE SELECTOR MODAL ═══ */}
            {
                showRoutineSelector && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="w-full max-w-4xl max-h-[80vh] glass-panel rounded-3xl overflow-hidden flex flex-col">

                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Select Routine</h2>
                                    <p className="text-white/60">Choose your mission for today</p>
                                </div>
                                <button
                                    onClick={() => setShowRoutineSelector(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {loadingRoutines ? (
                                    <div className="flex flex-col items-center justify-center h-64 text-white/50">
                                        <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                                        Loading routines...
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Default Archetype Option */}
                                        <button
                                            onClick={() => {
                                                setSelectedRoutineId(null);
                                                setShowRoutineSelector(false);
                                            }}
                                            className={`p-4 rounded-xl border text-left transition-all ${!selectedRoutineId ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">{archetype.icon}</span>
                                                <span className="font-bold text-white">Protocol {archetype.name}</span>
                                            </div>
                                            <p className="text-sm text-white/60 line-clamp-2">
                                                {archetype.description}
                                            </p>
                                        </button>

                                        {/* Available Routines */}
                                        {availableRoutines.map(routine => (
                                            <button
                                                key={routine.id}
                                                onClick={() => {
                                                    setSelectedRoutineId(routine.id);
                                                    setShowRoutineSelector(false);
                                                }}
                                                className={`p-4 rounded-xl border text-left transition-all ${selectedRoutineId === routine.id ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-bold text-white truncate pr-2">{routine.name}</h3>
                                                    <div className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                                                        {routine.difficulty}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-white/60 line-clamp-2 mb-3">
                                                    {routine.description}
                                                </p>
                                                <div className="flex gap-2 text-xs text-white/40">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {routine.duration}</span>
                                                    <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" /> {routine.exercises.length} Ex</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
};

export default Dashboard;
