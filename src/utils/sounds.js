// Sound Effects Utility
// Provides simple audio feedback for UI interactions

class SoundManager {
    constructor() {
        this.enabled = localStorage.getItem('jca_sounds_enabled') !== 'false';
        this.sounds = {};
        this.initSounds();
    }

    initSounds() {
        // Using data URIs for tiny sound effects to avoid external files
        // These are ultra-short beeps/clicks

        // Success sound (coin-like)
        this.sounds.success = this.createBeep(800, 0.1, 'sine');

        // Click sound
        this.sounds.click = this.createBeep(400, 0.05, 'square');

        // Error sound
        this.sounds.error = this.createBeep(200, 0.15, 'sawtooth');

        // Level up sound (ascending notes)
        this.sounds.levelUp = null; // Will be created on-demand
    }

    createBeep(frequency, duration, type = 'sine') {
        return () => {
            if (!this.enabled) return;

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    playLevelUp() {
        if (!this.enabled) return;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523, 659, 784]; // C, E, G (major chord)

        notes.forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine';

            const startTime = audioContext.currentTime + (i * 0.1);
            gainNode.gain.setValueAtTime(0.2, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    play(soundName) {
        if (!this.enabled) return;

        if (soundName === 'levelUp') {
            this.playLevelUp();
        } else if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('jca_sounds_enabled', this.enabled);
        return this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }
}

// Singleton instance
const soundManager = new SoundManager();

export default soundManager;
