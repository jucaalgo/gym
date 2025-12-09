import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Lock, User, Shield, ArrowRight, Zap, Target } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useUser();

    const [mode, setMode] = useState('user'); // 'user' or 'admin'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 800));

        const result = login(username, password, mode);

        if (result.success) {
            if (mode === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            setError(result.error);
            setIsLoading(false);
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
                        <img src="/jca-logo.png" alt="JCA Logo" className="w-full h-full object-contain p-2" />
                    </div>
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary drop-shadow-[0_0_10px_rgba(0,242,255,0.5)] tracking-tighter">JCA GYM</h1>
                    <p className="text-primary/60 text-sm uppercase tracking-[0.3em] mt-2 font-medium">System v2.1</p>
                </div>

                {/* Login Card */}
                <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                    {/* Access Mode Toggle */}
                    <div className="flex p-1 bg-black/40 rounded-xl mb-8 relative">
                        <div
                            className={`absolute inset-y-1 w-[calc(50%-4px)] bg-primary/20 rounded-lg transition-all duration-300 ${mode === 'admin' ? 'translate-x-[100%] ml-1' : 'left-1'}`}
                        />
                        <button
                            onClick={() => { setMode('user'); setError(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors relative z-10 ${mode === 'user' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
                        >
                            <User className="w-4 h-4" />
                            Agent
                        </button>
                        <button
                            onClick={() => { setMode('admin'); setError(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors relative z-10 ${mode === 'admin' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
                        >
                            <Shield className="w-4 h-4" />
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-white/40 uppercase tracking-wider ml-1">Identifier</label>
                            <div className="relative group/input">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-primary transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                                    placeholder={mode === 'admin' ? 'admin' : 'agent-001'}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-white/40 uppercase tracking-wider ml-1">Password</label>
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 transition-all ${isLoading
                                ? 'bg-white/5 text-white/20 cursor-wait'
                                : `bg-gradient-to-r ${mode === 'admin' ? 'from-amber-600 to-orange-600 shadow-amber-900/20' : 'from-primary via-accent to-secondary shadow-[0_0_20px_rgba(59,130,246,0.3)]'} text-white hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]`
                                }`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>ACCESS SYSTEM</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer decoration */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-xs text-white/20">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                            <span>SYSTEM ONLINE</span>
                        </div>
                        <span className="font-mono">SECURE CONNECTION</span>
                    </div>
                </div>

                {/* Environment Info */}
                <div className="text-center mt-8 space-y-2">
                    <p className="text-white/20 text-xs">
                        {mode === 'admin'
                            ? '⚠ RESTRICTED ACCESS: AUTHORIZED PERSONNEL ONLY'
                            : 'By accessing you accept the JCA Training Protocol.'}
                    </p>
                </div>
            </div>
            {/* Footer */}
            <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                <p className="text-white/20 text-xs font-mono uppercase tracking-widest">
                    Created By Juan Carlos Alvarado
                </p>
            </div>
        </div>
    );
};

export default Login;
