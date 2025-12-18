/**
 * Neural Voice Manager
 * Interface for browser SpeechSynthesis API with Cyberpunk personality
 */

class VoiceManager {
    constructor() {
        this.enabled = localStorage.getItem('jca_voice_enabled') === 'true';
        this.synth = window.speechSynthesis;
        this.voice = null;
        this.pitch = 0.9; // Slightly deeper, robotic
        this.rate = 1.1; // Efficient, fast

        // Try to load voices immediately
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.setVoice();
        }
        this.setVoice();
    }

    setVoice() {
        const voices = this.synth.getVoices();
        // Priority: Google US English -> Microsoft Zira -> Default
        this.voice = voices.find(v => v.name.includes('Google US English')) ||
            voices.find(v => v.name.includes('Zira')) ||
            voices.find(v => v.lang.includes('en-US')) ||
            voices[0];
    }

    toggle(state) {
        if (state !== undefined) {
            this.enabled = state;
        } else {
            this.enabled = !this.enabled;
        }
        localStorage.setItem('jca_voice_enabled', this.enabled);
        return this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }

    speak(text, priority = false) {
        if (!this.enabled && !priority) return;

        // Cancel current speech if any to avoid queue pileup
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.pitch = this.pitch;
        utterance.rate = this.rate;
        utterance.volume = 1.0;

        this.synth.speak(utterance);
    }

    // Preset phrases
    greet() {
        this.speak("System Online. Welcome back, Agent.");
    }

    startWorkshop() {
        this.speak("Workshop Protocol Initiated. Focus on form.");
    }

    restTimer(seconds) {
        this.speak(`Recovery phase. ${seconds} seconds.`);
    }

    finishSet() {
        this.speak("Set complete. Data logged.");
    }
}

const voiceManager = new VoiceManager();
export default voiceManager;
