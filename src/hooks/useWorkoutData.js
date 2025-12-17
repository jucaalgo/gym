/**
 * React Hook: useWorkoutData
 * Loads and manages all Workout OS data (exercises, routines, equipment)
 */

import { useState, useEffect } from 'react';
import { loadAllData } from '../services/csvLoader';

export function useWorkoutData() {
    const [data, setData] = useState({
        exercises: [],
        routines: [],
        equipment: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const allData = await loadAllData();
                setData(allData);
                setError(null);
            } catch (err) {
                console.error('Error loading workout data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return { ...data, loading, error };
}
