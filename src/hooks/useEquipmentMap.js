/**
 * React Hook: useEquipmentMap
 * Provides access to Vision AI equipment mapping
 */

import { useMemo } from 'react';
import { useWorkoutData } from './useWorkoutData';

export function useEquipmentMap() {
    const { equipment, loading, error } = useWorkoutData();

    const api = useMemo(() => ({
        all: equipment,
        loading,
        error,

        // Find by vision label (from AI detection)
        findByVisionLabel: (label) => {
            return equipment.find(eq => eq.visionLabel === label);
        },

        // Find by technical name
        findByTechnicalName: (name) => {
            return equipment.find(eq =>
                eq.technicalName.toLowerCase() === name.toLowerCase()
            );
        },

        // Get by category
        filterByCategory: (category) => {
            return equipment.filter(eq =>
                eq.category.toLowerCase() === category.toLowerCase()
            );
        },

        // Get all free weights
        getFreeWeights: () => {
            return equipment.filter(eq => eq.category === 'Free Weight');
        },

        // Get all machines
        getMachines: () => {
            return equipment.filter(eq =>
                eq.category.includes('Machine') || eq.category.includes('Bench')
            );
        },

        // Map AI detection class to technical name
        mapDetectionToEquipment: (detectedClass) => {
            // Try exact match first
            let match = equipment.find(eq => eq.visionLabel === detectedClass);

            // If no match, try fuzzy match
            if (!match) {
                const normalized = detectedClass.toLowerCase();
                match = equipment.find(eq =>
                    eq.visionLabel.toLowerCase().includes(normalized) ||
                    eq.technicalName.toLowerCase().includes(normalized)
                );
            }

            return match;
        }
    }), [equipment, loading, error]);

    return api;
}
