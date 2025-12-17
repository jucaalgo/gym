/**
 * Routine Assignment Engine
 * Handles routine selection and "Routine of the Day" management
 */

export class RoutineEngine {
    constructor() {
        this.currentRoutine = null;
        this.completedExercises = [];
    }

    /**
     * Assign a routine as "Routine of the Day"
     */
    assignRoutine(routine) {
        this.currentRoutine = routine;
        this.completedExercises = [];

        // Save to localStorage for persistence
        localStorage.setItem('routineOfTheDay', JSON.stringify({
            routine,
            assignedAt: new Date().toISOString(),
            progress: {
                completed: 0,
                total: routine.exercises.length
            }
        }));

        console.log('✅ Routine assigned:', routine.id);
        return true;
    }

    /**
     * Get current routine
     */
    getCurrentRoutine() {
        if (this.currentRoutine) {
            return this.currentRoutine;
        }

        // Try to load from localStorage
        const saved = localStorage.getItem('routineOfTheDay');
        if (saved) {
            const data = JSON.parse(saved);
            this.currentRoutine = data.routine;
            return this.currentRoutine;
        }

        return null;
    }

    /**
     * Clear current routine
     */
    clearRoutine() {
        this.currentRoutine = null;
        this.completedExercises = [];
        localStorage.removeItem('routineOfTheDay');
        console.log('🗑️ Routine cleared');
    }

    /**
     * Mark exercise as completed
     */
    completeExercise(exerciseIndex) {
        if (!this.completedExercises.includes(exerciseIndex)) {
            this.completedExercises.push(exerciseIndex);

            // Update localStorage
            const saved = JSON.parse(localStorage.getItem('routineOfTheDay') || '{}');
            if (saved.routine) {
                saved.progress.completed = this.completedExercises.length;
                localStorage.setItem('routineOfTheDay', JSON.stringify(saved));
            }
        }
    }

    /**
     * Get routine progress
     */
    getProgress() {
        if (!this.currentRoutine) return { completed: 0, total: 0, percentage: 0 };

        const total = this.currentRoutine.exercises.length;
        const completed = this.completedExercises.length;

        return {
            completed,
            total,
            percentage: Math.round((completed / total) * 100)
        };
    }

    /**
     * Check if routine is complete
     */
    isComplete() {
        if (!this.currentRoutine) return false;
        return this.completedExercises.length >= this.currentRoutine.exercises.length;
    }

    /**
     * Get next exercise
     */
    getNextExercise() {
        if (!this.currentRoutine) return null;

        const nextIndex = this.completedExercises.length;
        if (nextIndex >= this.currentRoutine.exercises.length) {
            return null; // All exercises completed
        }

        return {
            ...this.currentRoutine.exercises[nextIndex],
            index: nextIndex
        };
    }

    /**
     * Get current exercise (active)
     */
    getCurrentExercise() {
        if (!this.currentRoutine || this.completedExercises.length === 0) {
            return this.getNextExercise();
        }

        const currentIndex = this.completedExercises.length - 1;
        return {
            ...this.currentRoutine.exercises[currentIndex],
            index: currentIndex
        };
    }
}

// Singleton instance
let routineEngineInstance = null;

export function getRoutineEngine() {
    if (!routineEngineInstance) {
        routineEngineInstance = new RoutineEngine();
    }
    return routineEngineInstance;
}
