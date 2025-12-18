
/**
 * Equipment Card Component
 * Displays detected equipment with exercise info and routine suggestions
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExercises } from '../../hooks/useExercises';
import { useRoutines } from '../../hooks/useRoutines';
import { useEquipmentMap } from '../../hooks/useEquipmentMap';
import { getRoutineEngine } from '../../services/routineEngine';
import VisualAsset from '../ui/VisualAsset';

export default function EquipmentCard({ detection, onSelectRoutine, onClose, userGender = 'female' }) {
    const navigate = useNavigate();
    const exercises = useExercises();
    const routines = useRoutines();
    const equipmentMap = useEquipmentMap();
    const routineEngine = getRoutineEngine();

    // Map detection to equipment
    const equipment = equipmentMap.mapDetectionToEquipment(detection.label);

    // Find related exercises
    const relatedExercises = equipment
        ? exercises.filterByEquipment(equipment.technicalName).slice(0, 3)
        : [];

    // Get suggested routines
    const suggestedRoutines = equipment
        ? routines.getSuggestedRoutines(userGender, equipment.technicalName)
        : [];

    if (!equipment) {
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-[#2D2D2D] rounded-2xl p-6 max-w-md w-full">
                    <div className="text-center">
                        <div className="text-4xl mb-4">❓</div>
                        <div className="text-white text-xl mb-2">Unknown Equipment</div>
                        <div className="text-gray-400 text-sm mb-4">
                            Detected: <code className="text-[#00D4FF]">{detection.label}</code>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-[#00D4FF] text-white rounded-lg hover:bg-[#00D4FF]/80 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-[#1A1A1A] rounded-2xl max-w-2xl w-full my-8 border-2 border-[#00D4FF]/30">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#00D4FF] to-[#39FF14] p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-white/80 mb-1">DETECTED EQUIPMENT</div>
                            <div className="text-2xl font-['Orbitron'] text-white">
                                {equipment.technicalName}
                            </div>
                            <div className="text-sm text-white/60">
                                {equipment.category} • {Math.round(detection.confidence * 100)}% confidence
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Related Exercises */}
                    {relatedExercises.length > 0 && (
                        <div>
                            <div className="text-lg font-['Orbitron'] text-[#00D4FF] mb-3">
                                Related Exercises
                            </div>
                            <div className="space-y-3">
                                {relatedExercises.map((ex, i) => (
                                    <div
                                        key={i}
                                        className="bg-[#2D2D2D] rounded-lg p-4 border border-gray-700 hover:border-[#00D4FF]/50 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Exercise Image */}
                                            <div className="w-20 h-20 rounded-lg bg-black/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                <VisualAsset
                                                    exercise={ex}
                                                    type="3d_viewer"
                                                    className="w-full h-full"
                                                />
                                            </div>

                                            {/* Exercise Info */}
                                            <div className="flex-1">
                                                <div className="text-white font-semibold mb-1">{ex.name}</div>
                                                <div className="text-sm text-gray-400">
                                                    🎯 {ex.targetMuscle}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Suggested Routines */}
                    {suggestedRoutines.length > 0 && (
                        <div>
                            <div className="text-lg font-['Orbitron'] text-[#39FF14] mb-3">
                                Suggested Routines for {userGender === 'female' ? 'Women' : 'Men'}
                            </div>
                            <div className="space-y-3">
                                {suggestedRoutines.map((routine, i) => (
                                    <div
                                        key={i}
                                        className="bg-[#2D2D2D] rounded-lg p-4 border border-gray-700 hover:border-[#39FF14]/50 transition-colors cursor-pointer"
                                        onClick={() => onSelectRoutine(routine)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="text-white font-semibold">{routine.id}</div>
                                                <div className="text-xs px-2 py-1 rounded bg-[#39FF14]/20 text-[#39FF14]">
                                                    {routine.gender === 'female' ? '♀ Female' : '♂ Male'}
                                                </div>
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                {routine.exercises.length} exercises
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-400 mb-3">
                                            {routine.target}
                                        </div>

                                        {/* Exercise Preview */}
                                        <div className="space-y-1">
                                            {routine.exercises.slice(0, 3).map((ex, j) => (
                                                <div key={j} className="text-xs text-gray-500 font-['Roboto_Mono']">
                                                    {j + 1}. {ex.name} - {ex.sets}×{ex.reps}
                                                </div>
                                            ))}
                                            {routine.exercises.length > 3 && (
                                                <div className="text-xs text-gray-600">
                                                    +{routine.exercises.length - 3} more...
                                                </div>
                                            )}
                                        </div>

                                        {/* Select Button */}
                                        <button
                                            onClick={() => {
                                                // Assign routine as "Routine of the Day"
                                                routineEngine.assignRoutine(routine);

                                                // Navigate to workout view
                                                navigate('/workout');
                                            }}
                                            className="w-full mt-3 py-2 bg-[#39FF14] text-black rounded-lg font-semibold hover:bg-[#39FF14]/80 transition-colors"
                                        >
                                            Set as Today's Routine
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Routines */}
                    {suggestedRoutines.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No routines found for this equipment
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
