import React, { useState, useMemo } from 'react';
import {
    Zap,
    Dumbbell,
    Play,
    X,
    Loader2,
    Filter,
    Activity,
    Timer,
    Flame,
    Clock,
    Target
} from 'lucide-react';
import { useWorkoutData } from '../hooks/useWorkoutData';
import { useNavigate } from 'react-router-dom';
import { getRoutineEngine } from '../services/routineEngine';

// ═══════════════════════════════════════════════════════════════
// ROUTINES BROWSER - SYSTEM PROGRAMS
// 300+ Generated Workouts from Strategy CSV
// ═══════════════════════════════════════════════════════════════

const MUSCLE_GROUPS = {
    'Pecho': ['Chest', 'Pectoralis'],
    'Espalda': ['Back', 'Latissimus', 'Trapezius', 'Lats'],
    'Piernas': ['Legs', 'Quadriceps', 'Hamstrings', 'Gluteus', 'Glutes', 'Calves'],
    'Hombros': ['Shoulders', 'Deltoid'],
    'Brazos': ['Arms', 'Biceps', 'Triceps'],
    'Core': ['Core', 'Abs', 'Abdominis']
};

const getFocusCategory = (target) => {
    if (!target) return 'Todos';
    for (const [category, keywords] of Object.entries(MUSCLE_GROUPS)) {
        if (keywords.some(k => target.includes(k))) return category;
    }
    return target; // Return original if no match (e.g. "Full Body")
};

const normalizeName = (name) => {
    if (!name) return "";
    // Remove everything inside parentheses and trim
    return name.split('(')[0].trim().toLowerCase();
};

const Routines = () => {
    const { routines, exercises, loading, error } = useWorkoutData();
    const navigate = useNavigate();
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Filter States
    const [genderFilter, setGenderFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('all'); // all, short, medium, long
    const [intensityFilter, setIntensityFilter] = useState('all'); // all, low, medium, high
    const [focusFilter, setFocusFilter] = useState('all');

    // 1. Enrich Data (Infer metadata missing from CSV)
    const enrichedRoutines = useMemo(() => {
        return routines.map(routine => {
            const totalSets = routine.exercises.reduce((acc, ex) => acc + ex.sets, 0);
            const totalExercises = routine.exercises.length;

            // Infer Difficulty/Intensity based on count
            let difficulty = 'Intermedio';
            if (totalExercises < 5) difficulty = 'Principiante';
            if (totalExercises > 8) difficulty = 'Avanzado';

            // Infer Duration (approx 3 min per set + transition)
            const duration = Math.round(totalSets * 2.5 + totalExercises);

            // Infer Calories (approx)
            const calories = Math.round(duration * 6.5);

            return {
                ...routine,
                difficulty,
                duration,
                calories,
                intensity: Math.min(10, Math.round(totalSets / 3)) // 1-10 scale
            };
        });
    }, [routines]);

    // 2. Filter Logic
    const filteredRoutines = useMemo(() => {
        return enrichedRoutines.filter(routine => {
            // Gender
            const matchesGender = genderFilter === 'all' || routine.gender === genderFilter;

            // Time
            let matchesTime = true;
            if (timeFilter === 'short') matchesTime = routine.duration < 30;
            if (timeFilter === 'medium') matchesTime = routine.duration >= 30 && routine.duration <= 60;
            if (timeFilter === 'long') matchesTime = routine.duration > 60;

            // Intensity (Count)
            let matchesIntensity = true;
            if (intensityFilter === 'low') matchesIntensity = routine.exercises.length < 5;
            if (intensityFilter === 'medium') matchesIntensity = routine.exercises.length >= 5 && routine.exercises.length <= 8;
            if (intensityFilter === 'high') matchesIntensity = routine.exercises.length > 8;

            // Focus (Improved matching with normalization and partial checking)
            let matchesFocus = true;
            if (focusFilter !== 'all') {
                const normalizedFilter = focusFilter;

                // Check if any exercise in the routine matches the focusFilter
                matchesFocus = routine.exercises.some(ex => {
                    const normExName = normalizeName(ex.name);

                    // Try exact name match first
                    let masterEx = exercises.find(m => normalizeName(m.name) === normExName);

                    // Fallback: Try partial inclusion (fuzzy) if normalization didn't find a direct hit
                    if (!masterEx) {
                        masterEx = exercises.find(m => {
                            const masterNorm = normalizeName(m.name);
                            return masterNorm.includes(normExName) || normExName.includes(masterNorm);
                        });
                    }

                    if (!masterEx) return false;

                    const category = getFocusCategory(masterEx?.targetMuscle);
                    return category === normalizedFilter;
                });

                // Fallback: Check the routine's own target string if no exercises matched
                if (!matchesFocus) {
                    const routineCategory = getFocusCategory(routine?.target);
                    matchesFocus = routineCategory === normalizedFilter;
                }
            }

            return matchesGender && matchesTime && matchesIntensity && matchesFocus;
        });
    }, [enrichedRoutines, exercises, genderFilter, timeFilter, intensityFilter, focusFilter]);

    const focusCategories = ['all', ...Object.keys(MUSCLE_GROUPS), 'Full Body', 'Other'];

    const handleStartRoutine = (routine) => {
        const engine = getRoutineEngine();
        engine.assignRoutine(routine); // This handles localStorage correctly
        navigate('/workout');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-[#00D4FF] animate-spin mx-auto mb-6" />
                    <div className="text-white text-xl font-['Orbitron'] mb-2">LOADING PROTOCOLS</div>
                    <p className="text-[#00D4FF]/60 font-['Roboto_Mono'] text-sm">Accessing 300+ strategy files...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 pb-24">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-2 text-[#00D4FF] mb-2">
                    <Activity className="w-5 h-5" />
                    <span className="text-sm font-medium uppercase tracking-wider font-['Roboto_Mono']">Protocolos del Sistema</span>
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-white font-['Orbitron'] tracking-wide">
                        MATRIZ DE <span className="text-[#00D4FF]">ENTRENAMIENTO</span>
                    </h1>
                    <p className="text-white/60 mt-2 font-['Roboto_Mono'] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                        {filteredRoutines.length} Programas Disponibles
                    </p>
                </div>
            </header>

            {/* Filter Toggle Button */}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${showFilters
                    ? 'bg-[#00D4FF]/10 border-[#00D4FF] text-[#00D4FF]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
            >
                <Filter className="w-4 h-4" />
                <span className="font-['Roboto_Mono'] text-sm uppercase">Filtros Avanzados</span>
                {showFilters ? <X className="w-4 h-4 ml-2" /> : null}
            </button>

            {/* Expanded Filters Panel */}
            {showFilters && (
                <div className="glass-panel rounded-2xl p-6 mb-8 border border-white/5 bg-[#121212]/80 backdrop-blur-xl animate-in slide-in-from-top-4 fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Gender */}
                        <div className="space-y-2">
                            <label className="text-xs text-white/40 uppercase font-bold tracking-wider">Class (Gender)</label>
                            <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#00D4FF]/50 outline-none transition-all uppercase text-sm">
                                <option value="all">Any Class</option>
                                <option value="male">Male Protocol</option>
                                <option value="female">Female Protocol</option>
                                <option value="unisex">Universal</option>
                            </select>
                        </div>

                        {/* Time */}
                        <div className="space-y-2">
                            <label className="text-xs text-white/40 uppercase font-bold tracking-wider">Duration</label>
                            <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#00D4FF]/50 outline-none transition-all uppercase text-sm">
                                <option value="all">Any Duration</option>
                                <option value="short">Short (&lt; 30m)</option>
                                <option value="medium">Standard (30-60m)</option>
                                <option value="long">Extended (&gt; 60m)</option>
                            </select>
                        </div>

                        {/* Intensity */}
                        <div className="space-y-2">
                            <label className="text-xs text-white/40 uppercase font-bold tracking-wider">Volume (Intensity)</label>
                            <select value={intensityFilter} onChange={(e) => setIntensityFilter(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#00D4FF]/50 outline-none transition-all uppercase text-sm">
                                <option value="all">Any Volume</option>
                                <option value="low">Low Volume (&lt; 5 Ex)</option>
                                <option value="medium">Med Volume (5-8 Ex)</option>
                                <option value="high">High Volume (&gt; 8 Ex)</option>
                            </select>
                        </div>

                        {/* Focus */}
                        <div className="space-y-2">
                            <label className="text-xs text-white/40 uppercase font-bold tracking-wider">Target Focus</label>
                            <select value={focusFilter} onChange={(e) => setFocusFilter(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#00D4FF]/50 outline-none transition-all uppercase text-sm">
                                <option value="all">All Targets</option>
                                {focusCategories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRoutines.map((routine) => (
                    <div
                        key={routine.id}
                        onClick={() => setSelectedRoutine(routine)}
                        className="glass-panel rounded-2xl overflow-hidden hover:border-[#00D4FF]/50 transition-all duration-300 cursor-pointer group relative bg-[#1A1A1A] border-white/5 flex flex-col h-full"
                    >
                        {/* Header Gradient */}
                        <div className={`h-2 w-full bg-gradient-to-r ${routine.gender === 'female' ? 'from-pink-500 to-rose-500' :
                            routine.gender === 'male' ? 'from-blue-500 to-cyan-500' :
                                'from-emerald-500 to-teal-500'
                            }`} />

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-[#00D4FF]/30 transition-colors">
                                    <Dumbbell className="w-6 h-6 text-white group-hover:text-[#00D4FF] transition-colors" />
                                </div>
                                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${routine.difficulty === 'Advanced' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    routine.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                    }`}>
                                    {routine.difficulty}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#00D4FF] transition-colors font-['Orbitron'] tracking-wide">
                                {routine.id}
                            </h3>
                            <div className="text-sm text-white/40 font-['Roboto_Mono'] mb-6 uppercase">
                                Target: <span className="text-white">{routine.target}</span>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 mt-auto">
                                <div className="text-center p-2 rounded bg-black/40 border border-white/5">
                                    <Timer className="w-4 h-4 mx-auto text-white/30 mb-1" />
                                    <span className="text-xs text-white  font-['Roboto_Mono']">{routine.duration}m</span>
                                </div>
                                <div className="text-center p-2 rounded bg-black/40 border border-white/5">
                                    <Zap className="w-4 h-4 mx-auto text-white/30 mb-1" />
                                    <span className="text-xs text-white font-['Roboto_Mono']">{routine.exercises.length} Ex</span>
                                </div>
                                <div className="text-center p-2 rounded bg-black/40 border border-white/5">
                                    <Flame className="w-4 h-4 mx-auto text-white/30 mb-1" />
                                    <span className="text-xs text-white font-['Roboto_Mono']">{routine.calories}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredRoutines.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Filter className="w-10 h-10 text-white/20" />
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">No Protocols Matching Criteria</h3>
                    <p className="text-white/50">Adjust filters to broaden search range.</p>
                </div>
            )}

            {/* Detail Modal (Same as before) */}
            {selectedRoutine && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedRoutine(null)}>
                    <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#00D4FF]/20 shadow-[0_0_50px_rgba(0,212,255,0.1)] bg-[#0f0f0f]" onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="sticky top-0 z-10 p-6 border-b border-white/10 bg-[#0f0f0f]/95 backdrop-blur-xl flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`w-2 h-2 rounded-full ${selectedRoutine.gender === 'female' ? 'bg-pink-500' :
                                        selectedRoutine.gender === 'male' ? 'bg-blue-500' : 'bg-emerald-500'
                                        } animate-pulse`} />
                                    <span className="text-xs font-['Roboto_Mono'] text-white/40 uppercase tracking-widest">
                                        PROTOCOL {selectedRoutine.id}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white font-['Orbitron']">
                                    TARGET: {selectedRoutine.target.toUpperCase()}
                                </h2>
                            </div>
                            <button onClick={() => setSelectedRoutine(null)} className="p-2 rounded-xl hover:bg-white/10 text-white/50">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Stats */}
                            <div className="grid grid-cols-4 gap-4 mb-8">
                                <div className="p-4 rounded-xl bg-[#00D4FF]/5 border border-[#00D4FF]/20 text-center">
                                    <div className="text-2xl font-bold text-white font-['Orbitron']">{selectedRoutine.exercises.length}</div>
                                    <div className="text-[10px] text-[#00D4FF] uppercase tracking-wider">Exercises</div>
                                </div>
                                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center">
                                    <div className="text-2xl font-bold text-white font-['Orbitron']">{selectedRoutine.duration}</div>
                                    <div className="text-[10px] text-purple-400 uppercase tracking-wider">Minutes</div>
                                </div>
                                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-center">
                                    <div className="text-2xl font-bold text-white font-['Orbitron']">{selectedRoutine.calories}</div>
                                    <div className="text-[10px] text-orange-400 uppercase tracking-wider">Calories</div>
                                </div>
                                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-center">
                                    <div className="text-2xl font-bold text-white font-['Orbitron']">{selectedRoutine.difficulty}</div>
                                    <div className="text-[10px] text-red-400 uppercase tracking-wider">Level</div>
                                </div>
                            </div>

                            {/* Exercise List */}
                            <div className="space-y-3 mb-8">
                                {selectedRoutine.exercises.map((ex, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#00D4FF]/30 transition-colors">
                                        <div className="w-8 h-8 rounded bg-black/50 border border-white/10 flex items-center justify-center text-[#00D4FF] font-['Orbitron'] text-xs">
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium">{ex.name}</h4>
                                            <div className="text-xs text-white/40 flex gap-3 mt-1 font-['Roboto_Mono']">
                                                <span>{ex.sets} SETS</span>
                                                <span className="text-[#00D4FF]">×</span>
                                                <span>{ex.reps} REPS</span>
                                                <span className="text-[#00D4FF]">×</span>
                                                <span>{ex.rest}s REST</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => handleStartRoutine(selectedRoutine)}
                                className="w-full py-5 bg-[#00D4FF] hover:bg-[#00c4ec] text-black font-bold text-xl rounded-xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_50px_rgba(0,212,255,0.5)] transition-all font-['Orbitron'] tracking-widest"
                            >
                                <Play className="w-6 h-6 fill-current" />
                                INITIATE PROTOCOL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Routines;
