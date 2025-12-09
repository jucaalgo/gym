// Haptic Feedback Utility
// Uses Vibration API for mobile devices

/**
 * Trigger haptic feedback
 * @param {string} type - 'light', 'medium', 'heavy', 'success', 'warning', 'error'
 */
export const triggerHaptic = (type = 'light') => {
    if (!('vibrate' in navigator)) return;

    const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        success: [10, 50, 10],
        warning: [20, 100, 20],
        error: [50, 100, 50, 100, 50],
        double: [10, 50, 10],
        triple: [10, 50, 10, 50, 10]
    };

    const pattern = patterns[type] || patterns.light;
    navigator.vibrate(pattern);
};

/**
 * Check if haptics are supported
 */
export const isHapticSupported = () => {
    return 'vibrate' in navigator;
};

export default triggerHaptic;
