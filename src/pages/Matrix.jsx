import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useLocation
import {
    Play,
    Pause,
    SkipForward,
    X,
    Clock,
    Zap,
    Target,
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    Dumbbell,
    Flame,
    Trophy
} from 'lucide-react';
import VisualAsset from '../components/ui/VisualAsset';
import { useUser } from '../context/UserContext';
import {
    generateRoutine,
    loadSuggestedRoutine, // Added import
    generateWarmup,
    generateCooldown,
    calculateWorkoutXP
} from '../modules/matrix/generator';

// ═══════════════════════════════════════════════════════════════
// THE MATRIX - TRAINING ENGINE
// ═══════════════════════════════════════════════════════════════

const Matrix = () => {
    const { user, completeWorkout, addXP, getCurrentArchetype } = useUser();
    const [routine, setRoutine] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timer, setTimer] = useState(0);
    const [phase, setPhase] = useState('preview'); // preview, warmup, workout, cooldown, complete
    const [completedExercises, setCompletedExercises] = useState([]);

    const location = useLocation(); // Hook to get logic
    const navigate = useNavigate();

    const archetype = getCurrentArchetype();


    // Generate routine on mount
    useEffect(() => {
        const loadRoutine = async () => {
            // Check if we have a specific routine requested via navigation state
            if (location.state && location.state.routineId) {
                // Import async function
                const { getSuggestedRoutinesAsync } = await import('../data/routines');
                // Wait for routines to load
                await getSuggestedRoutinesAsync();
                // Now load the specific routine
                const suggested = loadSuggestedRoutine(location.state.routineId, user);
                if (suggested) {
                    setRoutine(suggested);
                } else {
                    // Fallback if routine not found
                    const newRoutine = generateRoutine(user);
                    setRoutine(newRoutine);
                }
            } else {
                // Default generation
                const newRoutine = generateRoutine(user);
                setRoutine(newRoutine);
            }
        };
        loadRoutine();
    }, [user.archetype, user.stressLevel, user.timeAvailable, location.state]);

    // Timer logic
    useEffect(() => {
        let interval;
        if (isPlaying && phase === 'workout') {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, phase]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartWorkout = () => {
        setPhase('workout');
        setIsPlaying(true);
        setCurrentExerciseIndex(0);
        setTimer(0);
    };

    const handleCompleteExercise = () => {
        const currentEx = routine.exercises[currentExerciseIndex];
        setCompletedExercises(prev => [...prev, currentEx.id]);

        if (currentExerciseIndex < routine.exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        } else {
            // Workout complete!
            handleWorkoutComplete();
        }
    };

    const handleWorkoutComplete = () => {
        setIsPlaying(false);
        setPhase('complete');

        const durationMinutes = Math.round(timer / 60);
        const caloriesBurned = routine.metadata.estimatedCalories;
        const earnedXP = calculateWorkoutXP(routine, completedExercises.length, durationMinutes);

        completeWorkout(durationMinutes, caloriesBurned);
        addXP(earnedXP);
    };

    const handleCloseWorkout = () => {
        setPhase('preview');
        setIsPlaying(false);
        setCurrentExerciseIndex(0);
        setTimer(0);
        setCompletedExercises([]);
    };

    if (!routine) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Generando protocolo...</p>
                </div>
            </div>
        );
    }

    const currentExercise = routine.exercises[currentExerciseIndex];

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <Target className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase tracking-wider">The Matrix</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">
                        {phase === 'complete' ? '¡Misión Completada!' : `Protocolo ${routine.archetype?.name || 'Entrenamiento'}`}
                    </h1>
                </div>

                {routine.override && (
                    <div className="px-4 py-2 rounded-xl bg-warning/20 text-warning flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">{routine.override.action === 'SWAP_TO_RECOVERY' ? 'Modo Recuperación' : 'Modo Rápido'}</span>
                    </div>
                )}
            </header>

            {/* Override Message */}
            {routine.override && phase === 'preview' && (
                <div className="glass-panel rounded-2xl p-4 mb-6 border-l-4 border-warning">
                    <p className="text-white/80">{routine.message}</p>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
          PREVIEW PHASE
          ═══════════════════════════════════════════════════════════════ */}
            {phase === 'preview' && (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="glass-panel rounded-2xl p-4 text-center">
                            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{routine.metadata.estimatedDuration}</div>
                            <div className="text-sm text-white/50">minutos</div>
                        </div>
                        <div className="glass-panel rounded-2xl p-4 text-center">
                            <Dumbbell className="w-6 h-6 text-accent mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{routine.exercises.length}</div>
                            <div className="text-sm text-white/50">ejercicios</div>
                        </div>
                        <div className="glass-panel rounded-2xl p-4 text-center">
                            <Flame className="w-6 h-6 text-warning mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{routine.metadata.estimatedCalories}</div>
                            <div className="text-sm text-white/50">kcal</div>
                        </div>
                        <div className="glass-panel rounded-2xl p-4 text-center">
                            <Zap className="w-6 h-6 text-secondary mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{routine.metadata.difficulty}/10</div>
                            <div className="text-sm text-white/50">dificultad</div>
                        </div>
                    </div>

                    {/* Exercise List */}
                    <div className="glass-panel rounded-3xl p-6 mb-8">
                        <h2 className="text-xl font-bold text-white mb-4">Ejercicios del Día</h2>
                        <div className="space-y-3">
                            {routine.exercises.map((ex, idx) => (
                                <div
                                    key={ex.id}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${routine.archetype?.color || 'from-primary to-accent'} flex items-center justify-center text-white font-bold`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-white">{ex.name}</div>
                                        <div className="text-sm text-white/50">{ex.muscleGroup} • {ex.source}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-medium">{ex.sets} × {ex.reps}</div>
                                        <div className="text-xs text-white/40">{ex.rest}s descanso</div>
                                    </div>
                                    {/* Visual Level Badge */}
                                    <div className={`px-2 py-1 rounded-lg text-xs font-medium ${ex.visualLevel === 1 ? 'bg-amber-500/20 text-amber-400' :
                                        ex.visualLevel === 2 ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-white/10 text-white/60'
                                        }`}>
                                        {ex.visualLevel === 1 ? '3D' : ex.visualLevel === 2 ? '4K' : 'Lottie'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={handleStartWorkout}
                        className={`w-full py-5 rounded-2xl bg-gradient-to-r ${routine.archetype?.color || 'from-primary to-accent'} text-white font-bold text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-lg`}
                    >
                        <Play className="w-6 h-6" />
                        <span>INICIAR ENTRENAMIENTO</span>
                    </button>
                </>
            )}

            {/* ═══════════════════════════════════════════════════════════════
          WORKOUT PHASE (Active Player)
          ═══════════════════════════════════════════════════════════════ */}
            {phase === 'workout' && currentExercise && (
                <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex flex-col">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <button
                            onClick={handleCloseWorkout}
                            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <X className="w-6 h-6 text-white/60" />
                        </button>

                        <div className="text-center">
                            <div className="text-sm text-white/50">Ejercicio {currentExerciseIndex + 1} de {routine.exercises.length}</div>
                            <div className="text-2xl font-bold text-white font-mono">{formatTime(timer)}</div>
                        </div>

                        <div className="flex items-center gap-2">
                            {routine.exercises.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-colors ${idx < currentExerciseIndex ? 'bg-success' :
                                        idx === currentExerciseIndex ? 'bg-primary' :
                                            'bg-white/20'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        {/* Exercise Visual - INTEGRATED */}
                        <div className="w-full max-w-md aspect-video rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-2xl bg-black">
                            <VisualAsset
                                exercise={currentExercise}
                                type="3d_viewer"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Exercise Info */}
                        <h2 className="text-3xl font-bold text-white mb-2">{currentExercise.name}</h2>
                        <p className="text-white/50 mb-8">{currentExercise.muscleGroup}</p>

                        {/* Sets & Reps */}
                        <div className="flex items-center gap-8 mb-8">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-white">{currentExercise.sets}</div>
                                <div className="text-white/50">series</div>
                            </div>
                            <div className="text-4xl text-white/30">×</div>
                            <div className="text-center">
                                <div className="text-5xl font-bold text-white">{currentExercise.reps}</div>
                                <div className="text-white/50">repeticiones</div>
                            </div>
                        </div>

                        {/* Rest Indicator */}
                        <div className="text-sm text-white/40 mb-8">
                            Descanso: {currentExercise.rest} segundos
                        </div>

                        {/* Source Badge */}
                        <div className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm">
                            Fuente: {currentExercise.source}
                        </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="p-6 border-t border-white/10">
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
                            </button>

                            <button
                                onClick={handleCompleteExercise}
                                className={`flex-1 max-w-md py-5 rounded-2xl bg-gradient-to-r ${routine.archetype?.color || 'from-primary to-accent'} text-white font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform`}
                            >
                                <CheckCircle2 className="w-6 h-6" />
                                <span>COMPLETADO</span>
                                <SkipForward className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
          COMPLETE PHASE
          ═══════════════════════════════════════════════════════════════ */}
            {phase === 'complete' && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-success to-emerald-400 flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Trophy className="w-12 h-12 text-white" />
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-2">¡Misión Completada!</h2>
                    <p className="text-white/60 mb-8">Has terminado el protocolo {routine.archetype?.name}</p>

                    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
                        <div className="glass-panel rounded-2xl p-4">
                            <div className="text-3xl font-bold text-white">{formatTime(timer)}</div>
                            <div className="text-sm text-white/50">Duración</div>
                        </div>
                        <div className="glass-panel rounded-2xl p-4">
                            <div className="text-3xl font-bold text-white">{completedExercises.length}</div>
                            <div className="text-sm text-white/50">Ejercicios</div>
                        </div>
                        <div className="glass-panel rounded-2xl p-4">
                            <div className="text-3xl font-bold text-accent">+{calculateWorkoutXP(routine, completedExercises.length, Math.round(timer / 60))}</div>
                            <div className="text-sm text-white/50">XP Ganados</div>
                        </div>
                    </div>

                    <button
                        onClick={handleCloseWorkout}
                        className="px-8 py-4 rounded-2xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                    >
                        Volver al Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default Matrix;
