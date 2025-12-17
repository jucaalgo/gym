/**
 * React Hook: useExercises
 * Provides access to exercise database with filtering capabilities
 */

import { useMemo } from 'react';
import { useWorkoutData } from './useWorkoutData';
import { findExerciseBySlug, findExerciseByName } from '../services/csvLoader';

export function useExercises() {
    const { exercises, loading, error } = useWorkoutData();

    const api = useMemo(() => ({
        all: exercises,
        loading,
        error,

        // Find by slug
        findBySlug: (slug) => findExerciseBySlug(exercises, slug),

        // Find by name
        findByName: (name) => findExerciseByName(exercises, name),

        // Filter by muscle group
        filterByMuscle: (muscle) => {
            return exercises.filter(ex =>
                ex.targetMuscle.toLowerCase().includes(muscle.toLowerCase())
            );
        },

        // Filter by equipment
        filterByEquipment: (equipment) => {
            return exercises.filter(ex =>
                ex.equipment.toLowerCase().includes(equipment.toLowerCase())
            );
        },

        // Search exercises
        search: (query) => {
            const q = query.toLowerCase();
            return exercises.filter(ex =>
                ex.name.toLowerCase().includes(q) ||
                ex.targetMuscle.toLowerCase().includes(q) ||
                ex.equipment.toLowerCase().includes(q)
            );
        }
    }), [exercises, loading, error]);

    return api;
}
