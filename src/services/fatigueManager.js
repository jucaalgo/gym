/**
 * Fatigue Management System
 * Tracks RPE, manages fatigue scoring, and adjusts workout intensity
 */

export class FatigueManager {
    constructor() {
        this.sessionRPE = []; // Array of {exerciseIndex, setNumber, rpe, timestamp}
        this.movementPatterns = { push: 0, pull: 0, legs: 0 };
        this.userLevel = 'intermediate'; // beginner, intermediate, advanced
    }

    /**
     * Fatigue thresholds by user level
     */
    static THRESHOLDS = {
        beginner: 60,
        intermediate: 80,
        advanced: 100
    };

    /**
     * Record RPE for a set
     */
    recordSet(rpe, exerciseIndex, setNumber, exerciseName = '') {
        const entry = {
            exerciseIndex,
            setNumber,
            rpe,
            timestamp: new Date().toISOString(),
            exerciseName
        };

        this.sessionRPE.push(entry);
        this.updateMovementPattern(exerciseName);

        // Save to localStorage for session persistence
        this.saveToStorage();

        // Check for adjustments needed
        return this.checkFatigueStatus(rpe, setNumber);
    }

    /**
     * Check fatigue status and determine adjustments
     */
    checkFatigueStatus(currentRPE, setNumber) {
        const result = {
            action: 'continue',
            message: '',
            adjustment: null
        };

        // Rule 1: Early Fatigue Detection (RPE 10 in first 2 sets)
        if (setNumber <= 2 && currentRPE === 10) {
            result.action = 'reduce_load';
            result.adjustment = {
                type: 'weight',
                amount: -10, // Reduce 10%
                reason: 'Early fatigue detected'
            };
            result.message = '⚠️ Fatiga temprana detectada. Reduciendo carga en 10%.';
            return result;
        }

        // Rule 2: Accumulated Session Fatigue
        const fatigueScore = this.calculateFatigueScore();
        const threshold = FatigueManager.THRESHOLDS[this.userLevel];

        if (fatigueScore > threshold) {
            result.action = 'extend_rest';
            result.adjustment = {
                type: 'rest',
                amount: 20, // Extend 20%
                reason: 'High accumulated fatigue'
            };
            result.message = '🛡️ Modo Recuperación activado. +20% tiempo de descanso.';
            return result;
        }

        // Rule 3: Movement Pattern Imbalance
        const imbalance = this.checkPatternImbalance();
        if (imbalance && currentRPE >= 8) {
            result.action = 'suggest_switch';
            result.adjustment = {
                type: 'pattern',
                suggest: imbalance.suggest,
                reason: `Too many ${imbalance.excessive} exercises`
            };
            result.message = `💡 Considera cambiar a ejercicios de ${imbalance.suggest} para balancear.`;
            return result;
        }

        // No adjustments needed
        if (currentRPE >= 7 && currentRPE <= 8) {
            result.message = '✅ RPE óptimo. Continúa así.';
        } else if (currentRPE < 5) {
            result.message = '📈 Puedes aumentar la intensidad si lo deseas.';
        }

        return result;
    }

    /**
     * Calculate accumulated fatigue score
     * Formula: Σ(RPE × Set Weight) where weight increases with each set
     */
    calculateFatigueScore() {
        return this.sessionRPE.reduce((sum, entry, index) => {
            const setWeight = index + 1; // Later sets count more
            return sum + (entry.rpe * setWeight);
        }, 0);
    }

    /**
     * Update movement pattern tracking
     */
    updateMovementPattern(exerciseName) {
        const name = exerciseName.toLowerCase();

        // Categorize exercise by movement pattern
        if (name.includes('press') || name.includes('push') || name.includes('chest')) {
            this.movementPatterns.push++;
        } else if (name.includes('row') || name.includes('pull') || name.includes('back')) {
            this.movementPatterns.pull++;
        } else if (name.includes('squat') || name.includes('leg') || name.includes('glute')) {
            this.movementPatterns.legs++;
        }
    }

    /**
     * Check for movement pattern imbalance
     */
    checkPatternImbalance() {
        const { push, pull, legs } = this.movementPatterns;

        // Check if any pattern is excessively high compared to others
        if (push >= 3 && pull === 0) {
            return { excessive: 'empuje', suggest: 'tracción' };
        }
        if (pull >= 3 && push === 0) {
            return { excessive: 'tracción', suggest: 'empuje' };
        }

        return null;
    }

    /**
     * Get average RPE for current session
     */
    getAverageRPE() {
        if (this.sessionRPE.length === 0) return 0;

        const sum = this.sessionRPE.reduce((acc, entry) => acc + entry.rpe, 0);
        return Math.round(sum / this.sessionRPE.length);
    }

    /**
     * Get fatigue level (Low, Moderate, High, Critical)
     */
    getFatigueLevel() {
        const score = this.calculateFatigueScore();
        const threshold = FatigueManager.THRESHOLDS[this.userLevel];

        if (score < threshold * 0.5) return 'Low';
        if (score < threshold * 0.75) return 'Moderate';
        if (score < threshold) return 'High';
        return 'Critical';
    }

    /**
     * Reset session data
     */
    resetSession() {
        this.sessionRPE = [];
        this.movementPatterns = { push: 0, pull: 0, legs: 0 };
        localStorage.removeItem('fatigueSession');
        console.log('🔄 Fatigue session reset');
    }

    /**
     * Set user fitness level
     */
    setUserLevel(level) {
        if (['beginner', 'intermediate', 'advanced'].includes(level)) {
            this.userLevel = level;
            this.saveToStorage();
        }
    }

    /**
     * Save to localStorage
     */
    saveToStorage() {
        localStorage.setItem('fatigueSession', JSON.stringify({
            sessionRPE: this.sessionRPE,
            movementPatterns: this.movementPatterns,
            userLevel: this.userLevel
        }));
    }

    /**
     * Load from localStorage
     */
    loadFromStorage() {
        const saved = localStorage.getItem('fatigueSession');
        if (saved) {
            const data = JSON.parse(saved);
            this.sessionRPE = data.sessionRPE || [];
            this.movementPatterns = data.movementPatterns || { push: 0, pull: 0, legs: 0 };
            this.userLevel = data.userLevel || 'intermediate';
            console.log('📂 Fatigue session loaded');
        }
    }

    /**
     * Get session summary
     */
    getSessionSummary() {
        return {
            totalSets: this.sessionRPE.length,
            averageRPE: this.getAverageRPE(),
            fatigueScore: this.calculateFatigueScore(),
            fatigueLevel: this.getFatigueLevel(),
            movementPatterns: { ...this.movementPatterns },
            threshold: FatigueManager.THRESHOLDS[this.userLevel]
        };
    }
}

// Singleton instance
let fatigueManagerInstance = null;

export function getFatigueManager() {
    if (!fatigueManagerInstance) {
        fatigueManagerInstance = new FatigueManager();
        fatigueManagerInstance.loadFromStorage();
    }
    return fatigueManagerInstance;
}
