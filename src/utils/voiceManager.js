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
        // Priority: Google Spanish -> Microsoft Helena/Sabina -> Any Spanish -> Default
        this.voice = voices.find(v => v.name.includes('Google español')) ||
            voices.find(v => v.name.includes('Microsoft Helena')) ||
            voices.find(v => v.name.includes('Microsoft Sabina')) ||
            voices.find(v => v.lang.includes('es-ES')) ||
            voices.find(v => v.lang.includes('es')) ||
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
        this.speak("Sistema en Línea. Bienvenido de nuevo, Agente.");
    }

    startWorkshop() {
        this.speak("Protocolo de Taller Iniciado. Concéntrate en la técnica.");
    }

    restTimer(seconds) {
        this.speak(`Fase de recuperación. ${seconds} segundos.`);
    }

    finishSet() {
        this.speak("Serie completada. Datos registrados.");
    }
}

const voiceManager = new VoiceManager();
export default voiceManager;
