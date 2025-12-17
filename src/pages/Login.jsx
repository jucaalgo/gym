import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Lock, Mail, User, ArrowRight, Target } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login, registerUser } = useUser();

    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState(''); // Stores email OR username
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        if (isRegistering) {
            // Registration strictly requires Email
            if (!email || !password || !name) {
                setError('Todos los campos son requeridos');
                setIsLoading(false);
                return;
            }
            if (!email.includes('@')) {
                setError('Por favor proporcione un correo válido');
                setIsLoading(false);
                return;
            }

            const result = await registerUser(email, password, name);
            if (result.success) {
                setSuccessMsg('¡Cuenta creada! Iniciando...');
                setTimeout(() => {
                    navigate('/onboarding');
                }, 1000);
            } else {
                setError(result.error);
                setIsLoading(false);
            }
        } else {
            // Login accepts Username OR Email
            if (!email || !password) {
                setError('Identidad y Contraseña requeridos');
                setIsLoading(false);
                return;
            }
            const result = await login(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error);
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05),transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

            <div className="w-full max-w-md relative z-10 perspective-1000">
                {/* Brand Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black/50 border border-primary/30 mb-4 shadow-[0_0_30px_rgba(0,242,255,0.2)]">
                        <img src={`${import.meta.env.BASE_URL}jca-logo.png`} alt="JCA Logo" className="w-full h-full object-contain p-2" />
                    </div>
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary drop-shadow-[0_0_10px_rgba(0,242,255,0.5)] tracking-tighter">JCA GYM</h1>
                    <p className="text-primary/60 text-sm uppercase tracking-[0.3em] mt-2 font-medium">Sistema Cloud v3.2 (Fix)</p>
                </div>

                {/* Login Card */}
                <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden group">

                    <div className="mb-6 text-center">
                        <h2 className="text-xl text-white font-medium tracking-wide">
                            {isRegistering ? 'Crear Perfil de Agente' : 'Acceso al Sistema'}
                        </h2>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {isRegistering && (
                            <div className="space-y-1 animate-in slide-in-from-left-4 fade-in duration-300">
                                <label className="text-xs text-white/40 uppercase tracking-wider ml-1">Nombre de Agente</label>
                                <div className="relative group/input">
                                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        placeholder="Juan Pérez"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs text-white/40 uppercase tracking-wider ml-1">
                                {isRegistering ? 'Correo Electrónico' : 'Identidad (Email o Usuario)'}
                            </label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-primary transition-colors" />
                                <input
                                    type={isRegistering ? "email" : "text"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                                    placeholder={isRegistering ? "agente@jcagym.com" : "agente@jcagym.com O usuario"}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-white/40 uppercase tracking-wider ml-1">Token de Seguridad (Contraseña)</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-primary transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-shake">
                                {error}
                            </div>
                        )}
                        {successMsg && (
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center animate-pulse">
                                {successMsg}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 transition-all ${isLoading
                                ? 'bg-white/5 text-white/20 cursor-wait'
                                : 'bg-gradient-to-r from-primary via-accent to-secondary shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]'
                                }`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{isRegistering ? 'INICIALIZAR NUEVO AGENTE' : 'AUTENTICAR'}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle Registration */}
                    <div className="mt-6 text-center">
                        {isRegistering ? (
                            <button
                                onClick={() => { setIsRegistering(false); setError(''); }}
                                className="text-sm text-white/40 hover:text-white transition-colors"
                            >
                                ¿Ya activo? <span className="text-primary underline">Iniciar Sesión</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => { setIsRegistering(true); setError(''); }}
                                className="text-sm text-white/40 hover:text-white transition-colors"
                            >
                                ¿Primer acceso? <span className="text-primary underline">Crear Perfil de Agente</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="text-center mt-8 space-y-2">
                    <p className="text-white/20 text-xs text-shadow-glow">
                        SINCRONIZACIÓN CLOUD ACTIVA • SEGURIDAD FIREBASE
                    </p>
                </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                <p className="text-white/20 text-xs font-mono uppercase tracking-widest">
                    Creado Por Juan Carlos Alvarado
                </p>
            </div>
        </div>
    );
};

export default Login;
