/**
 * React Hook: useRoutines
 * Provides access to routine database with gender/equipment filtering
 */

import { useMemo } from 'react';
import { useWorkoutData } from './useWorkoutData';
import { filterRoutinesByGender, filterRoutinesByEquipment } from '../services/csvLoader';

export function useRoutines() {
    const { routines, exercises, loading, error } = useWorkoutData();

    const api = useMemo(() => ({
        all: routines,
        loading,
        error,

        // Filter by gender
        filterByGender: (gender) => {
            return filterRoutinesByGender(routines, gender);
        },

        // Filter by equipment
        filterByEquipment: (equipmentName) => {
            return filterRoutinesByEquipment(routines, exercises, equipmentName);
        },

        // Get gender-specific routines with equipment filter
        getSuggestedRoutines: (gender, equipmentName) => {
            let filtered = filterRoutinesByGender(routines, gender);

            if (equipmentName) {
                filtered = filterRoutinesByEquipment(filtered, exercises, equipmentName);
            }

            // Return top 3 routines
            return filtered.slice(0, 3);
        },

        // Get routine by ID
        findById: (routineId) => {
            return routines.find(r => r.id === routineId);
        },

        // Get all female routines (W-001 to W-150)
        getFemaleRoutines: () => {
            return routines.filter(r => r.gender === 'female');
        },

        // Get all male routines (M-001 to M-150)
        getMaleRoutines: () => {
            return routines.filter(r => r.gender === 'male');
        }
    }), [routines, exercises, loading, error]);

    return api;
}
