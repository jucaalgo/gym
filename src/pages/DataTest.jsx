/**
 * Test Page: Workout Data Loader
 * Verifies that all CSV data loads correctly
 */

import React from 'react';
import { useWorkoutData } from '../hooks/useWorkoutData';
import { useExercises } from '../hooks/useExercises';
import { useRoutines } from '../hooks/useRoutines';
import { useEquipmentMap } from '../hooks/useEquipmentMap';

export default function DataTest() {
    const { exercises, routines, equipment, loading, error } = useWorkoutData();
    const exerciseAPI = useExercises();
    const routineAPI = useRoutines();
    const equipmentAPI = useEquipmentMap();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔄</div>
                    <div className="text-white text-2xl font-['Orbitron']">Loading Workout OS Data...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <div className="text-red-500 text-2xl font-['Orbitron']">Error Loading Data</div>
                    <div className="text-gray-400 mt-2">{error}</div>
                </div>
            </div>
        );
    }

    const femaleRoutines = routineAPI.getFemaleRoutines();
    const maleRoutines = routineAPI.getMaleRoutines();
    const freeWeights = equipmentAPI.getFreeWeights();
    const machines = equipmentAPI.getMachines();

    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-['Orbitron'] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#39FF14]">
                        Workout OS Data Test
                    </h1>
                    <p className="text-gray-400 text-lg">Verifying CSV Data Load</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Exercises */}
                    <div className="bg-[#2D2D2D] rounded-2xl p-6 border border-[#00D4FF]/20">
                        <div className="text-[#00D4FF] text-6xl mb-2">💪</div>
                        <div className="text-4xl font-['Roboto_Mono'] mb-2">{exercises.length}</div>
                        <div className="text-gray-400">Exercises Loaded</div>
                    </div>

                    {/* Routines */}
                    <div className="bg-[#2D2D2D] rounded-2xl p-6 border border-[#39FF14]/20">
                        <div className="text-[#39FF14] text-6xl mb-2">📋</div>
                        <div className="text-4xl font-['Roboto_Mono'] mb-2">{routines.length}</div>
                        <div className="text-gray-400">Routines Loaded</div>
                        <div className="text-sm text-gray-500 mt-2">
                            {femaleRoutines.length} Female / {maleRoutines.length} Male
                        </div>
                    </div>

                    {/* Equipment */}
                    <div className="bg-[#2D2D2D] rounded-2xl p-6 border border-[#FFA500]/20">
                        <div className="text-[#FFA500] text-6xl mb-2">🏋️</div>
                        <div className="text-4xl font-['Roboto_Mono'] mb-2">{equipment.length}</div>
                        <div className="text-gray-400">Equipment Types</div>
                        <div className="text-sm text-gray-500 mt-2">
                            {freeWeights.length} Free / {machines.length} Machines
                        </div>
                    </div>
                </div>

                {/* Sample Data Sections */}
                <div className="space-y-8">
                    {/* Sample Exercises */}
                    <div className="bg-[#2D2D2D] rounded-2xl p-6">
                        <h2 className="text-2xl font-['Orbitron'] mb-4 text-[#00D4FF]">
                            Sample Exercises (First 5)
                        </h2>
                        <div className="space-y-4">
                            {exercises.slice(0, 5).map((ex, i) => (
                                <div key={i} className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-semibold text-white mb-1">{ex.name}</div>
                                            <div className="text-sm text-gray-400">
                                                <span className="text-[#00D4FF]">🎯 {ex.targetMuscle}</span>
                                                <span className="mx-2">•</span>
                                                <span className="text-[#39FF14]">🏋️ {ex.equipment}</span>
                                            </div>
                                            {ex.biomechanics && (
                                                <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                                                    {ex.biomechanics}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <code className="text-xs text-gray-600 bg-black px-2 py-1 rounded">
                                                {ex.slug}
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sample Routines */}
                    <div className="bg-[#2D2D2D] rounded-2xl p-6">
                        <h2 className="text-2xl font-['Orbitron'] mb-4 text-[#39FF14]">
                            Sample Routines (First 3)
                        </h2>
                        <div className="space-y-4">
                            {routines.slice(0, 3).map((routine, i) => (
                                <div key={i} className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <div className="font-semibold text-white">
                                                {routine.id}
                                                <span className="ml-2 text-xs px-2 py-1 rounded bg-[#39FF14]/20 text-[#39FF14]">
                                                    {routine.gender === 'female' ? '♀ Female' : '♂ Male'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-400">{routine.target}</div>
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            {routine.exercises.length} exercises
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        {routine.exercises.map((ex, j) => (
                                            <div key={j} className="text-sm text-gray-400 font-['Roboto_Mono']">
                                                {j + 1}. {ex.name} - {ex.sets}×{ex.reps} @ RPE {ex.targetRPE}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Equipment Mapping */}
                    <div className="bg-[#2D2D2D] rounded-2xl p-6">
                        <h2 className="text-2xl font-['Orbitron'] mb-4 text-[#FFA500]">
                            Vision AI Equipment Mapping
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {equipment.map((eq, i) => (
                                <div key={i} className="bg-[#1A1A1A] rounded-lg p-3 border border-gray-700 flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-medium">{eq.technicalName}</div>
                                        <div className="text-xs text-gray-500">
                                            <code className="text-[#FFA500]">{eq.visionLabel}</code>
                                        </div>
                                    </div>
                                    <div className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                                        {eq.category}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* API Test Section */}
                    <div className="bg-[#2D2D2D] rounded-2xl p-6">
                        <h2 className="text-2xl font-['Orbitron'] mb-4 text-white">
                            API Functionality Tests
                        </h2>
                        <div className="space-y-4">
                            {/* Search Test */}
                            <div className="bg-[#1A1A1A] rounded-lg p-4">
                                <div className="text-sm text-gray-400 mb-2">
                                    🔍 Search "Barbell": {exerciseAPI.search('Barbell').length} results
                                </div>
                            </div>

                            {/* Filter Test */}
                            <div className="bg-[#1A1A1A] rounded-lg p-4">
                                <div className="text-sm text-gray-400 mb-2">
                                    🎯 Filter by Muscle "Gluteus": {exerciseAPI.filterByMuscle('Gluteus').length} exercises
                                </div>
                            </div>

                            {/* Routine Filter Test */}
                            <div className="bg-[#1A1A1A] rounded-lg p-4">
                                <div className="text-sm text-gray-400 mb-2">
                                    🏋️ Female routines with Dumbbell: {routineAPI.filterByEquipment(routineAPI.getFemaleRoutines(), equipmentAPI.findByVisionLabel('dumbbell')?.technicalName || 'Dumbbell').length} routines
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <div className="mt-12 text-center">
                    <div className="inline-block bg-gradient-to-r from-[#00D4FF] to-[#39FF14] rounded-2xl p-6">
                        <div className="text-4xl mb-2">✅</div>
                        <div className="text-white font-['Orbitron'] text-xl">
                            All Data Loaded Successfully!
                        </div>
                        <div className="text-white/80 text-sm mt-2">
                            Phase 1: Data Services - COMPLETE
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
