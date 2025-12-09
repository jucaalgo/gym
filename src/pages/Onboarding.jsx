import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ChevronRight, Ruler, Scale, Activity, Hash, ArrowRight, User } from 'lucide-react';
import { ARCHETYPES } from '../data/archetypes';

const Onboarding = () => {
    const { user, updateUserProfile } = useUser(); // We need to export updateUserProfile from context for this
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        gender: 'female', // Default as requested (60%)
        weight: '',
        height: '',
        age: '',
        goal: 'tone',
        experience: 'beginner'
    });

    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        // Determine Archetype based on Goal and Experience
        let archetype = 'GUERRERO'; // Default

        if (formData.goal === 'strength') archetype = 'GUERRERO';
        else if (formData.goal === 'hypertrophy') archetype = 'ESCULTOR';
        else if (formData.goal === 'tone') archetype = 'FLOW';
        else if (formData.goal === 'consistency') archetype = 'SIN_EXCUSAS';

        // Find ID
        const archetypeId = Object.values(ARCHETYPES).find(a => a.name.includes(archetype))?.id || 'guerrero';

        // Update User
        updateUserProfile(user.id, {
            ...formData,
            archetype: archetypeId,
            isNew: false, // Mark onboarding as done
            // Initialize basic stats based on inputs could go here
        });

        navigate('/');
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const Progress = () => (
        <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
            <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${(step / totalSteps) * 100}%` }}
            />
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]" />

            <div className="w-full max-w-2xl relative z-10 animate-fade-in text-center md:text-left">

                <h1 className="text-4xl font-bold text-white mb-2">
                    Bienvenido, Agente {user?.name}
                </h1>
                <p className="text-white/60 mb-8">
                    Configuración inicial del protocolo Phoenix.
                </p>

                <div className="glass-panel p-8 rounded-3xl relative">
                    <Progress />

                    {/* STEP 1: GENDER (Crucial for logic) */}
                    {step === 1 && (
                        <div className="space-y-6 animate-slide-in">
                            <h2 className="text-2xl font-bold text-white mb-6">Paso 1: Perfil Biológico</h2>
                            <p className="text-white/60 mb-8">Esta información adapta las rutinas a tu fisiología para maximizar resultados.</p>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => updateField('gender', 'female')}
                                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${formData.gender === 'female'
                                        ? 'bg-pink-500/20 border-pink-500 text-white'
                                        : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="text-4xl">♀</span>
                                    <span className="font-bold">Mujer</span>
                                </button>
                                <button
                                    onClick={() => updateField('gender', 'male')}
                                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${formData.gender === 'male'
                                        ? 'bg-blue-500/20 border-blue-500 text-white'
                                        : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="text-4xl">♂</span>
                                    <span className="font-bold">Hombre</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: BIOMETRICS */}
                    {step === 2 && (
                        <div className="space-y-6 animate-slide-in">
                            <h2 className="text-2xl font-bold text-white mb-6">Paso 2: Datos Corporales</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase">
                                        <Hash className="w-4 h-4" /> Edad
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => updateField('age', e.target.value)}
                                        placeholder="25"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase">
                                        <Scale className="w-4 h-4" /> Peso (kg)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) => updateField('weight', e.target.value)}
                                        placeholder="70"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase">
                                        <Ruler className="w-4 h-4" /> Altura (cm)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.height}
                                        onChange={(e) => updateField('height', e.target.value)}
                                        placeholder="170"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-primary focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: GOALS */}
                    {step === 3 && (
                        <div className="space-y-6 animate-slide-in">
                            <h2 className="text-2xl font-bold text-white mb-6">Paso 3: Tu Misión</h2>

                            <div className="space-y-4">
                                {[
                                    { id: 'tone', label: 'Tonificar y Definir', desc: 'Perder grasa y marcar músculo' },
                                    { id: 'hypertrophy', label: 'Ganar Masa Muscular', desc: 'Aumentar volumen y fuerza' },
                                    { id: 'strength', label: 'Fuerza Funcional', desc: 'Potencia y rendimiento atlético' },
                                    { id: 'consistency', label: 'Salud y Constancia', desc: 'Mantenimiento y bienestar' }
                                ].map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => updateField('goal', option.id)}
                                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${formData.goal === option.id
                                            ? 'bg-primary/20 border-primary text-white'
                                            : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10'
                                            }`}
                                    >
                                        <div>
                                            <div className="font-bold text-lg group-hover:text-white transition-colors">{option.label}</div>
                                            <div className="text-sm opacity-60">{option.desc}</div>
                                        </div>
                                        {formData.goal === option.id && <Activity className="w-6 h-6 text-primary" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-end mt-8 pt-6 border-t border-white/10">
                        <button
                            onClick={handleNext}
                            disabled={
                                (step === 2 && (!formData.weight || !formData.height))
                            }
                            className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all ${(step === 2 && (!formData.weight || !formData.height))
                                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                : 'bg-white text-black hover:scale-105 shadow-xl shadow-white/10'
                                }`}
                        >
                            {step === totalSteps ? 'INICIAR PROTOCOLO' : 'SIGUIENTE'}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </div>

            {/* Global Footer */}
            <div className="absolute bottom-4 left-0 right-0 text-center z-20">
                <p className="text-white/20 text-xs font-mono uppercase tracking-widest">
                    Creado Por Juan Carlos Alvarado
                </p>
            </div>
        </div>
    );
};

export default Onboarding;
