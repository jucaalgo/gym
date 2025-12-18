/**
 * Active Workout View (STATE B)
 * Exercise execution with real-time tracking, tempo metronome, and fatigue monitoring
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExercises } from '../hooks/useExercises';
import { getRoutineEngine } from '../services/routineEngine';
import { getFatigueManager } from '../services/fatigueManager';
import VisualAsset from '../components/ui/VisualAsset';
import AROverlay from '../components/camera/AROverlay';
import { Camera, Scan, X as CloseIcon, Brain, Activity } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function ActiveWorkoutView() {
    const navigate = useNavigate();
    const { user } = useUser();
    const exercises = useExercises();
    const routineEngine = useRef(getRoutineEngine());
    const fatigueManager = useRef(getFatigueManager());

    const [currentExercise, setCurrentExercise] = useState(null);
    const [currentSet, setCurrentSet] = useState(1);
    const [reps, setReps] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [restTimeRemaining, setRestTimeRemaining] = useState(0);
    const [showRPEInput, setShowRPEInput] = useState(false);
    const [fatigueStatus, setFatigueStatus] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const [showARScan, setShowARScan] = useState(false);
    const [arVideoElement, setArVideoElement] = useState(null);

    useEffect(() => {
        loadCurrentExercise();
    }, []);

    useEffect(() => {
        // Rest timer countdown
        if (isResting && restTimeRemaining > 0) {
            const timer = setTimeout(() => {
                setRestTimeRemaining(restTimeRemaining - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (isResting && restTimeRemaining === 0) {
            endRest();
        }
    }, [isResting, restTimeRemaining]);

    function loadCurrentExercise() {
        const routine = routineEngine.current.getCurrentRoutine();
        if (!routine) {
            navigate('/hyper-vision');
            return;
        }

        const next = routineEngine.current.getNextExercise();
        if (!next) {
            // Routine complete
            navigate('/'); // Go to dashboard with completion message
            return;
        }

        setCurrentExercise(next);
        setCurrentSet(1);
        setReps(next.reps); // Default to target reps
    }

    function handleFinishSetAction() {
        if (!currentExercise) return;

        // Automatically record set with a neutral RPE for now (will evaluate at end)
        const status = fatigueManager.current.recordSet(
            7, // Neutral RPE
            currentExercise.index,
            currentSet,
            currentExercise.name
        );

        setFatigueStatus(status);

        // Check if more sets remaining
        if (currentSet < currentExercise.sets) {
            // Start rest period
            let restTime = currentExercise.rest;

            // Apply fatigue adjustment if needed
            if (status.adjustment && status.adjustment.type === 'rest') {
                restTime = Math.round(restTime * (1 + status.adjustment.amount / 100));
            }

            setRestTimeRemaining(restTime);
            setIsResting(true);
            setCurrentSet(currentSet + 1);
            setReps(currentExercise.reps);
        } else {
            // Exercise complete, move to next
            routineEngine.current.completeExercise(currentExercise.index);

            // Re-load to check if routine is finished
            const routine = routineEngine.current.getCurrentRoutine();
            const next = routineEngine.current.getNextExercise();

            if (!next) {
                // ROUTINE COMPLETE - Show Final Evaluation
                setIsFinished(true);
            } else {
                loadCurrentExercise();
            }
        }
    }

    function endRest() {
        setIsResting(false);
        setReps(0);
    }

    function handleSkipRest() {
        setRestTimeRemaining(0);
        endRest();
    }

    if (isFinished) {
        return <FinalEvaluationView
            routine={routineEngine.current.getCurrentRoutine()}
            summary={fatigueManager.current.getSessionSummary()}
            onComplete={() => {
                routineEngine.current.clearRoutine();
                fatigueManager.current.resetSession();
                navigate('/');
            }}
        />;
    }

    if (isResting) {
        return <RestView
            exercise={currentExercise}
            restTimeRemaining={restTimeRemaining}
            onSkip={handleSkipRest}
            fatigueStatus={fatigueStatus}
            exercises={exercises}
        />;
    }

    if (!currentExercise) {
        return (
            <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
                <div className="text-white text-2xl">Loading...</div>
            </div>
        );
    }

    const exerciseDetail = exercises.findByName(currentExercise.name);
    const progress = routineEngine.current.getProgress();
    const fatigueSummary = fatigueManager.current.getSessionSummary();

    return (
        <div className="min-h-screen bg-[#1A1A1A] relative overflow-hidden">
            {/* Blurred Background Image */}
            {exerciseDetail?.imagePath && (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${exerciseDetail.imagePath})`,
                        filter: 'blur(20px) brightness(0.3)',
                        transform: 'scale(1.1)'
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="text-white text-2xl font-['Orbitron'] tracking-tight">
                            {currentExercise.name} <span className="text-primary ml-2 uppercase text-sm font-['Roboto_Mono']">Set {currentSet}</span>
                        </div>
                        <div className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
                            EXERCISE {progress.completed + 1} OF {progress.total}
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-black/70 transition-colors border border-white/20"
                    >
                        Exit
                    </button>
                </div>

                {/* Main Exercise Card */}
                <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
                    {/* Exercise Image */}
                    {exerciseDetail && (
                        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 border-2 border-[#00D4FF]/30">
                            <VisualAsset
                                exercise={exerciseDetail}
                                type="3d_viewer"
                                className="w-full h-full"
                            />
                        </div>
                    )}

                    {/* Reps Counter */}
                    <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-8 w-full border border-[#00D4FF]/30 mb-6">
                        <div className="text-center mb-6">
                            <div className="text-[#00D4FF] text-sm mb-2">TARGET REPS</div>
                            <div className="text-white text-6xl font-['Roboto_Mono'] font-bold">
                                {currentExercise.reps}
                            </div>
                        </div>

                        {/* Rep Counter Buttons */}
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => setReps(Math.max(0, reps - 1))}
                                className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full text-2xl font-bold hover:bg-red-500/30 transition-colors border border-red-500/50"
                            >
                                −
                            </button>

                            <div className="text-white text-5xl font-['Roboto_Mono'] w-24 text-center">
                                {reps}
                            </div>

                            <button
                                onClick={() => setReps(reps + 1)}
                                className="w-16 h-16 bg-[#39FF14]/20 text-[#39FF14] rounded-full text-2xl font-bold hover:bg-[#39FF14]/30 transition-colors border border-[#39FF14]/50"
                            >
                                +
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#00D4FF] to-[#39FF14] transition-all duration-300"
                                    style={{ width: `${Math.min((reps / currentExercise.reps) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fatigue Indicator */}
                    <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4 w-full border border-gray-700 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-gray-400 text-sm mb-1">Fatigue Level</div>
                                <div className="text-white font-semibold">{fatigueSummary.fatigueLevel}</div>
                            </div>
                            <div className="text-3xl">
                                {fatigueSummary.fatigueLevel === 'Low' && '💚'}
                                {fatigueSummary.fatigueLevel === 'Moderate' && '💛'}
                                {fatigueSummary.fatigueLevel === 'High' && '🧡'}
                                {fatigueSummary.fatigueLevel === 'Critical' && '❤️'}
                            </div>
                        </div>
                        {fatigueStatus && fatigueStatus.message && (
                            <div className="mt-2 text-sm text-[#00D4FF]">
                                {fatigueStatus.message}
                            </div>
                        )}
                    </div>

                    {/* Biomechanical Warning */}
                    {exerciseDetail && fatigueSummary.fatigueLevel !== 'Low' && (
                        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 w-full mb-6">
                            <div className="text-warning text-sm font-semibold mb-2">
                                ⚠️ Safety Reminder
                            </div>
                            <div className="text-white/80 text-sm">
                                {exerciseDetail.biomechanics || 'Maintain proper form and control throughout the movement.'}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 mt-auto">
                        <button
                            onClick={() => setShowARScan(true)}
                            className="flex-1 py-5 bg-white/5 border border-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all uppercase tracking-widest text-xs font-['Orbitron']"
                        >
                            <Scan className="w-4 h-4 text-primary" />
                            Scan Form
                        </button>
                        <button
                            onClick={handleFinishSetAction}
                            className="flex-[2] py-5 bg-primary text-black rounded-xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(0,212,255,0.3)] uppercase tracking-widest font-['Orbitron']"
                        >
                            Finish Set
                        </button>
                    </div>

                    {/* AR SCAN OVERLAY MODAL */}
                    {showARScan && (
                        <div className="fixed inset-0 z-[100] bg-black">
                            {/* Camera Layer */}
                            <CameraFeed onVideoReady={(v) => setArVideoElement(v)} />

                            {/* AR Biomechanics Layer */}
                            {arVideoElement && (
                                <AROverlay
                                    mode="biomechanics"
                                    videoElement={arVideoElement}
                                />
                            )}

                            {/* HUD Controls */}
                            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none">
                                <div className="p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-primary/30">
                                    <div className="flex items-center gap-2 text-primary mb-1">
                                        <Brain className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest font-['Orbitron']">Neural Biomechanics Scan</span>
                                    </div>
                                    <div className="text-white text-xs font-['Roboto_Mono']">ENTITY: {user?.name || 'AGENT_UNK'}<br />SCAN_MODE: SKELETAL_PRECISION_v4</div>
                                </div>
                                <button
                                    onClick={() => setShowARScan(false)}
                                    className="p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 text-white pointer-events-auto hover:bg-black/80 transition-all"
                                >
                                    <CloseIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="absolute bottom-12 left-0 right-0 p-8 text-center pointer-events-none">
                                <p className="text-primary font-bold font-['Orbitron'] text-sm tracking-[0.2em] animate-pulse">
                                    KEEP FORM STEADY • ANALYZING JOINT ANGLES
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RPE Input Modal */}
            {showRPEInput && (
                <RPEInputModal
                    onSubmit={handleFinishSet}
                    onCancel={() => setShowRPEInput(false)}
                />
            )}
        </div>
    );
}

// Final Evaluation View (NEW STATE D)
function FinalEvaluationView({ routine, summary, onComplete }) {
    const [finalRPE, setFinalRPE] = useState(7);

    return (
        <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background HUD decorative lines */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 animate-scan" />
            </div>

            <div className="max-w-md w-full glass-panel rounded-3xl p-8 border-primary/30 relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
                        <span className="text-4xl">🏆</span>
                    </div>
                    <h1 className="text-3xl font-black text-white font-['Orbitron'] tracking-tighter uppercase mb-2">
                        MISIÓN COMPLETADA
                    </h1>
                    <p className="text-white/40 text-xs font-['Roboto_Mono'] tracking-[0.4em] uppercase">
                        Protocol: {routine?.id}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                        <div className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Carga Total</div>
                        <div className="text-xl font-bold text-white uppercase">{summary.totalSets} <span className="text-primary text-xs">Series</span></div>
                    </div>
                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                        <div className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Fatiga Final</div>
                        <div className="text-xl font-bold text-white uppercase">{summary.fatigueLevel}</div>
                    </div>
                </div>

                <div className="mb-10">
                    <div className="text-center mb-6">
                        <h2 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Esfuerzo Percibido (RPE)</h2>
                        <p className="text-white/30 text-[10px]">¿Qué tan duro fue el entrenamiento hoy?</p>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {[6, 7, 8, 9, 10].map(rpe => (
                            <button
                                key={rpe}
                                onClick={() => setFinalRPE(rpe)}
                                className={`h-12 rounded-xl font-bold transition-all border ${finalRPE === rpe
                                    ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,212,255,0.4)]'
                                    : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                                    }`}
                            >
                                {rpe}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <span className="text-[10px] font-['Roboto_Mono'] text-primary uppercase">
                            {finalRPE === 10 && 'Esfuerzo Máximo / Límite'}
                            {finalRPE === 9 && 'Muy Difícil / 1 cerca del fallo'}
                            {finalRPE === 8 && 'Difícil / 2 cerca del fallo'}
                            {finalRPE === 7 && 'Óptimo / 3-4 cerca del fallo'}
                            {finalRPE === 6 && 'Moderado / Entrenamiento de base'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onComplete}
                    className="w-full py-5 bg-primary text-black rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(0,212,255,0.3)] uppercase tracking-[0.2em] font-['Orbitron']"
                >
                    Finalizar Sesión
                </button>
            </div>
        </div>
    );
}

// RPE Input Modal Component (Keep for individual sets if needed, but the user requested final evaluation)
function RPEInputModal({ onSubmit, onCancel }) {
    const [selectedRPE, setSelectedRPE] = useState(7);

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-[#2D2D2D] rounded-2xl p-6 max-w-md w-full border-2 border-[#00D4FF]/30">
                <div className="text-center mb-6">
                    <div className="text-2xl font-['Orbitron'] text-white mb-2">
                        Rate Your Effort
                    </div>
                    <div className="text-gray-400 text-sm">
                        RPE Scale (Rate of Perceived Exertion)
                    </div>
                </div>

                {/* RPE Scale */}
                <div className="space-y-2 mb-6">
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(rpe => (
                        <button
                            key={rpe}
                            onClick={() => setSelectedRPE(rpe)}
                            className={`w-full py-3 rounded-lg font-['Roboto_Mono'] transition-all ${selectedRPE === rpe
                                ? 'bg-[#00D4FF] text-black border-2 border-[#00D4FF]'
                                : 'bg-gray-700 text-white hover:bg-gray-600 border-2 border-transparent'
                                }`}
                        >
                            <div className="flex items-center justify-between px-4">
                                <span className="font-bold">{rpe}</span>
                                <span className="text-sm">
                                    {rpe === 10 && 'Maximal Effort'}
                                    {rpe === 9 && 'Extremely Hard'}
                                    {rpe === 8 && 'Very Hard'}
                                    {rpe === 7 && 'Hard'}
                                    {rpe === 6 && 'Moderate'}
                                    {rpe === 5 && 'Somewhat Hard'}
                                    {rpe <= 4 && 'Easy'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit(selectedRPE)}
                        className="flex-1 py-3 bg-[#39FF14] text-black rounded-lg font-bold hover:bg-[#39FF14]/80 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

// Rest View Component (STATE C)
function RestView({ exercise, restTimeRemaining, onSkip, fatigueStatus, exercises }) {
    const exerciseDetail = exercises.findByName(exercise.name);
    const minutes = Math.floor(restTimeRemaining / 60);
    const seconds = restTimeRemaining % 60;

    return (
        <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Rest Timer */}
                <div className="text-center mb-8">
                    <div className="text-[#00D4FF] text-sm font-['Roboto_Mono'] mb-4">
                        REST PERIOD
                    </div>
                    <div className="text-white text-8xl font-['Roboto_Mono'] font-bold mb-2">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                    <div className="text-gray-400">Remaining</div>
                </div>

                {/* Exercise Image */}
                {exerciseDetail && (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 border-2 border-[#00D4FF]/30">
                        <VisualAsset
                            exercise={exerciseDetail}
                            type="3d_viewer"
                            className="w-full h-full"
                        />
                    </div>
                )}

                {/* Biomechanical Tip */}
                {exerciseDetail && exerciseDetail.biomechanics && (
                    <div className="bg-black/70 backdrop-blur-sm rounded-xl p-6 border border-[#00D4FF]/30 mb-6">
                        <div className="text-[#00D4FF] font-semibold mb-3 flex items-center gap-2">
                            <span>💡</span>
                            <span>Biomechanical Tip</span>
                        </div>
                        <div className="text-white/80 text-sm leading-relaxed">
                            {exerciseDetail.biomechanics}
                        </div>
                    </div>
                )}

                {/* Fatigue Message */}
                {fatigueStatus && fatigueStatus.message && (
                    <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-xl p-4 mb-6">
                        <div className="text-white text-sm">
                            {fatigueStatus.message}
                        </div>
                    </div>
                )}

                {/* Next Exercise Preview */}
                <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4 border border-gray-700 mb-6">
                    <div className="text-gray-400 text-sm mb-2">Next Up</div>
                    <div className="text-white font-semibold">{exercise.name}</div>
                    <div className="text-gray-400 text-sm">
                        {exercise.sets} × {exercise.reps} @ RPE {exercise.targetRPE}
                    </div>
                </div>

                {/* Skip Button */}
                <button
                    onClick={onSkip}
                    className="w-full py-4 bg-[#00D4FF] text-white rounded-xl font-bold hover:bg-[#00D4FF]/80 transition-colors"
                >
                    Skip Rest
                </button>
            </div>
        </div>
    );
}
