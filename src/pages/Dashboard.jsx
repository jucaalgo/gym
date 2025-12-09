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
import { getSuggestedRoutinesAsync } from '../data/routines';
import CountUp from '../components/ui/CountUp';
import soundManager from '../utils/sounds';
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

    // Load routines when selector opens
    useEffect(() => {
        if (showRoutineSelector) {
            loadRoutines();
        }
    }, [showRoutineSelector]);

    const loadRoutines = async () => {
        setLoadingRoutines(true);
        const routines = await getSuggestedRoutinesAsync();
        // Filter by current archetype's goal if possible
        const filtered = routines.filter(r =>
            r.targetGender === 'unisex' ||
            r.targetGender === (user.gender || 'unisex')
        );
        setAvailableRoutines(filtered.slice(0, 12)); // Show top 12
        setLoadingRoutines(false);
    };

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
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Welcome, <span className="text-gradient">{user.name}</span>
                    </h1>
                    <p className="text-white/60 mt-1">
                        System Online • Daily Protocol Ready
                    </p>
                </div>
                <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${archetype.color} text-white font-semibold flex items-center gap-2`}>
                    <span className="text-xl">{archetype.icon}</span>
                    <span>{user.rank}</span>
                </div>
            </header>

            {/* BENTO GRID */}
            <div className="grid grid-cols-12 gap-4 auto-rows-[140px]">

                {/* ═══ MAIN MISSION CARD (Large) ═══ */}
                <div className="col-span-12 md:col-span-8 row-span-2 glass-panel rounded-3xl p-6 hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
                    {/* Animated Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${archetype.color} opacity-10 transition-opacity`} />

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-primary">
                                    <Target className="w-5 h-5" />
                                    <span className="text-sm font-medium uppercase tracking-wider">Daily Mission</span>
                                </div>
                                <button
                                    onClick={() => setShowRoutineSelector(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span className="text-sm">Change Routine</span>
                                </button>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                {selectedRoutineId ?
                                    availableRoutines.find(r => r.id === selectedRoutineId)?.name || `Protocol ${archetype.name}`
                                    : `Protocol ${archetype.name}`}
                            </h2>
                            <p className="text-white/60 max-w-md">
                                {selectedRoutineId ?
                                    availableRoutines.find(r => r.id === selectedRoutineId)?.description || archetype.description
                                    : archetype.description}
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-white/80">
                                    <Clock className="w-4 h-4" />
                                    <span>{user.timeAvailable} min</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/80">
                                    <Dumbbell className="w-4 h-4" />
                                    <span>{selectedRoutineId ?
                                        `${availableRoutines.find(r => r.id === selectedRoutineId)?.exercises.length || 6} exercises`
                                        : '6 exercises'}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleStartWorkout}
                                className={`px-6 py-3 rounded-xl bg-gradient-to-r ${archetype.color} text-white font-semibold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg`}
                            >
                                <span>START</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ═══ LEVEL & XP CARD ═══ */}
                <div className="col-span-6 md:col-span-4 row-span-1 glass-panel rounded-3xl p-5 flex flex-col justify-between">
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
                </div>

                {/* ═══ STREAK CARD ═══ */}
                <div className="col-span-6 md:col-span-4 row-span-1 glass-panel rounded-3xl p-5 flex flex-col justify-between">
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
                </div>

                {/* ═══ NEURAL SCAN (AI Machine ID) ═══ */}
                <Link
                    to="/scan"
                    className="col-span-6 md:col-span-4 row-span-2 glass-panel rounded-3xl p-5 hover:border-secondary/50 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-secondary mb-3">
                                <Scan className="w-5 h-5" />
                                <span className="text-sm font-medium uppercase tracking-wider">Neural Scan</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Scan Everything</h3>
                            <p className="text-white/50 text-sm">
                                Identify Equipment & Food (Calories) with AI Vision
                            </p>
                        </div>

                        {/* Camera Preview Placeholder */}
                        <div className="flex-1 my-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="border border-white/5" />
                                ))}
                            </div>
                            <Camera className="w-10 h-10 text-white/30 group-hover:text-secondary group-hover:scale-110 transition-all" />
                        </div>

                        <button className="w-full py-3 rounded-xl bg-secondary/20 text-secondary font-semibold group-hover:bg-secondary group-hover:text-white transition-all">
                            Start Scanner
                        </button>
                    </div>
                </Link>

                {/* ═══ BIOMETRICS / ENERGY ═══ */}
                <div className="col-span-6 md:col-span-4 row-span-1 glass-panel rounded-3xl p-5">
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
                </div>

                {/* ═══ TODAY'S NUTRITION ═══ */}
                <div className="col-span-12 md:col-span-4 row-span-1 glass-panel rounded-3xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-primary">
                            <TrendingUp className="w-5 h-5" />
                            <span className="text-sm font-medium uppercase tracking-wider">Calories Today</span>
                        </div>
                        <span className="text-sm text-white/50">{user.calorieGoal} kcal goal</span>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-3xl font-bold text-white">{user.todayCalories}</div>
                            <div className="text-sm text-white/50">kcal consumed</div>
                        </div>

                        {/* Macro Pills */}
                        <div className="flex gap-2">
                            <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                                P: {user.todayProtein}g
                            </div>
                            <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
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
                </div>

                {/* ═══ ENCYCLOPEDIA SHORTCUT ═══ */}
                <Link
                    to="/encyclopedia"
                    className="col-span-6 md:col-span-4 row-span-1 glass-panel rounded-3xl p-5 hover:border-accent/50 transition-all duration-300 group cursor-pointer"
                >
                    <div className="flex items-center justify-between h-full">
                        <div>
                            <div className="flex items-center gap-2 text-accent mb-2">
                                <Sparkles className="w-5 h-5" />
                                <span className="text-sm font-medium uppercase tracking-wider">Encyclopedia</span>
                            </div>
                            <div className="text-2xl font-bold text-white">5000+</div>
                            <div className="text-sm text-white/50">Atoms of Movement</div>
                        </div>
                        <ChevronRight className="w-8 h-8 text-white/30 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>

                {/* ═══ TOTAL STATS ═══ */}
                <div className="col-span-6 md:col-span-4 row-span-1 glass-panel rounded-3xl p-5">
                    <div className="flex items-center gap-2 text-white/60 mb-3">
                        <Dumbbell className="w-4 h-4" />
                        <span className="text-sm font-medium uppercase tracking-wider">Stats</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <div className="text-xl font-bold text-white">{user.totalWorkouts}</div>
                            <div className="text-xs text-white/40">Workouts</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-white">{Math.round(user.totalMinutes / 60)}h</div>
                            <div className="text-xs text-white/40">Trained</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-white">{(user.caloriesBurned / 1000).toFixed(1)}k</div>
                            <div className="text-xs text-white/40">kcal burned</div>
                        </div>
                    </div>
                </div>

            </div>

            {/* ═══ ROUTINE SELECTOR MODAL ═══ */}
            {showRoutineSelector && (
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
            )}

        </div>
    );
};

export default Dashboard;
